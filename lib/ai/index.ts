import type { AIEngine } from "./types";
import { localEngine } from "./local";
import { claudeCodeEngine } from "./claudeCode";

export function getEngine(): AIEngine {
  const provider = process.env.AI_PROVIDER ?? "local";

  switch (provider) {
    case "claude-code":
      return claudeCodeEngine;
    default:
      return localEngine;
  }
}