import type { AIEngine, TaskInput, PrioritizeResult } from "./types";

const URGENT = ["urgent", "asap", "today", "now", "deadline",
  "فوری", "امروز", "ددلاین", "سریع"];
const IMPORTANT = ["important", "critical", "must", "call", "pay",
  "مهم", "پرداخت", "تماس", "جلسه"];
const SOMEDAY = ["maybe", "someday", "later", "idea",
  "شاید", "بعدا", "ایده"];

function score(t: TaskInput): { s: number; why: string[] } {
  const text = t.title.toLowerCase();
  let s = 50;
  const why: string[] = [];

  if (URGENT.some((k) => text.includes(k))) { s += 30; why.push("urgency keyword"); }
  if (IMPORTANT.some((k) => text.includes(k))) { s += 20; why.push("high-impact keyword"); }
  if (SOMEDAY.some((k) => text.includes(k))) { s -= 25; why.push("low-commitment phrasing"); }

  // وظایف قدیمی‌تر امتیاز می‌گیرند (معطل ماندن = هزینه)
  if (t.created_at) {
    const days = (Date.now() - new Date(t.created_at).getTime()) / 86400000;
    if (days > 3) { s += 15; why.push("aging task"); }
  }

  if (t.title.length < 25) { s += 5; why.push("quick win"); }

  return { s, why };
}

export const localEngine: AIEngine = {
  name: "local",

  async prioritize(tasks: TaskInput[]): Promise<PrioritizeResult> {
    const open = tasks.filter((t) => !t.done);

    const scored = open
      .map((t) => ({ t, ...score(t) }))
      .sort((a, b) => b.s - a.s);

    const items = scored.map((x, i) => ({
      id: x.t.id,
      rank: i + 1,
      reason: x.why.length ? x.why.join(", ") : "standard priority",
    }));

    const top = scored.slice(0, 3).map((x) => x.t.title);
    const summary = top.length
      ? `Start with: ${top.join(" -> ")}`
      : "No open tasks.";

    return { items, summary, engine: "local (rule-based)" };
  },
};