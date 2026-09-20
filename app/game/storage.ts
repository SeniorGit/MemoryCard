import type { Difficulty } from "./types";

const key = (difficulty: Difficulty) => `memory-card:best:${difficulty}`;

export function readBest(difficulty: Difficulty): number | null {
  try {
    const value = Number(localStorage.getItem(key(difficulty)));
    return Number.isInteger(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

export function writeBest(difficulty: Difficulty, moves: number): void {
  try {
    localStorage.setItem(key(difficulty), String(moves));
  } catch {}
}
