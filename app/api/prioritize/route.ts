import { NextResponse } from "next/server";
import { getEngine } from "@/lib/ai";
import { localEngine } from "@/lib/ai/local";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tasks = Array.isArray(body?.tasks) ? body.tasks : [];

  try {
    const engine = getEngine();
    const result = await engine.prioritize(tasks);
    return NextResponse.json(result);
  } catch (e: any) {
    const fallback = await localEngine.prioritize(tasks);
    return NextResponse.json({
      ...fallback,
      engine: "local (fallback)",
      warning: String(e?.message ?? e),
    });
  }
}