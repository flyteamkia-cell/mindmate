import { spawn } from "child_process";
import type { AIEngine, TaskInput, PrioritizeResult } from "./types";

function buildPrompt(tasks: TaskInput[]): string {
  return [
    "You are a task prioritization assistant.",
    "Given this JSON list of open tasks, rank them by what the user",
    "should do FIRST today. Consider urgency, impact, and effort.",
    "",
    "Tasks:",
    JSON.stringify(tasks, null, 2),
    "",
    "Respond with ONLY valid JSON, no markdown fences, no explanation:",
    '{"items":[{"id":"...","rank":1,"reason":"short reason"}],' +
      '"summary":"one sentence advice"}',
  ].join("\n");
}

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // از stdin استفاده می‌کنیم تا مشکل کوتیشن در ویندوز پیش نیاید
    const child = spawn(
      "claude",
      ["-p", "--output-format", "json", "--max-turns", "1"],
      { shell: true }
    );

    let out = "";
    let err = "";

    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(err || `claude exited with code ${code}`));
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}

export const claudeCodeEngine: AIEngine = {
  name: "claude-code",

  async prioritize(tasks: TaskInput[]): Promise<PrioritizeResult> {
    const open = tasks.filter((t) => !t.done);
    if (open.length === 0) {
      return { items: [], summary: "No open tasks.", engine: "claude-code" };
    }

    const raw = await runClaude(buildPrompt(open));

    // خروجی json یک «پاکت» است که جواب واقعی در فیلد result است
    const envelope = JSON.parse(raw);
    const inner = envelope.result ?? raw;

    // اگر مدل بک‌تیک گذاشته باشد، پاک کن
    const cleaned = String(inner).replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      items: parsed.items ?? [],
      summary: parsed.summary ?? "",
      engine: "claude-code (headless)",
    };
  },
};