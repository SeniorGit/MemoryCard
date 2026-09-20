export interface Character {
  id: number;
  name: string;
  image: string;
}

export interface Card {
  id: string;
  pairId: number;
  name: string;
  image: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTIES: Record<Difficulty, { label: string; pairs: number }> = {
  easy: { label: "Easy", pairs: 6 },
  medium: { label: "Medium", pairs: 8 },
  hard: { label: "Hard", pairs: 10 },
};

export const DEFAULT_DIFFICULTY: Difficulty = "easy";

export type LoadErrorKind =
  | "network"
  | "timeout"
  | "rateLimit"
  | "server"
  | "empty"
  | "images";

export type GameStatus = "loading" | "error" | "playing" | "complete";

export interface GameState {
  status: GameStatus;
  cards: Card[];
  flippedIds: string[];
  matchedPairIds: number[];
  moves: number;
  startedAt: number | null;
  finishedAt: number | null;
  error: LoadErrorKind | null;
  announcement: string;
}
