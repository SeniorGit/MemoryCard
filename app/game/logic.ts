import type { Card, Character, GameState, LoadErrorKind } from "./types";

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createDeck(characters: readonly Character[]): Card[] {
  const cards = characters.flatMap(({ id, name, image }) => [
    { id: `${id}-a`, pairId: id, name, image },
    { id: `${id}-b`, pairId: id, name, image },
  ]);
  return shuffle(cards);
}

export const initialState: GameState = {
  status: "loading",
  cards: [],
  flippedIds: [],
  matchedPairIds: [],
  moves: 0,
  startedAt: null,
  finishedAt: null,
  error: null,
  announcement: "",
};

export type GameAction =
  | { type: "loading" }
  | { type: "failed"; error: LoadErrorKind }
  | { type: "ready"; cards: Card[] }
  | { type: "flip"; id: string; now: number }
  | { type: "clearMismatch" };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "loading":
      return { ...initialState, status: "loading" };

    case "failed":
      return { ...initialState, status: "error", error: action.error };

    case "ready":
      return {
        ...initialState,
        status: "playing",
        cards: action.cards,
        announcement: `New game. ${action.cards.length} cards, face down.`,
      };

    case "flip": {
      if (state.status !== "playing" || state.flippedIds.length >= 2) return state;
      if (state.flippedIds.includes(action.id)) return state;

      const card = state.cards.find((c) => c.id === action.id);
      if (!card || state.matchedPairIds.includes(card.pairId)) return state;

      const startedAt = state.startedAt ?? action.now;

      if (state.flippedIds.length === 0) {
        return {
          ...state,
          startedAt,
          flippedIds: [card.id],
          announcement: card.name,
        };
      }

      const first = state.cards.find((c) => c.id === state.flippedIds[0])!;
      const moves = state.moves + 1;

      if (first.pairId !== card.pairId) {
        return {
          ...state,
          startedAt,
          moves,
          flippedIds: [first.id, card.id],
          announcement: `${card.name}. No match.`,
        };
      }

      const matchedPairIds = [...state.matchedPairIds, card.pairId];
      const isComplete = matchedPairIds.length * 2 === state.cards.length;
      return {
        ...state,
        startedAt,
        moves,
        matchedPairIds,
        flippedIds: [],
        status: isComplete ? "complete" : "playing",
        finishedAt: isComplete ? action.now : null,
        announcement: isComplete
          ? `${card.name}. Match. Game complete in ${moves} moves.`
          : `${card.name}. Match. ${matchedPairIds.length} of ${state.cards.length / 2} pairs found.`,
      };
    }

    case "clearMismatch":
      return state.flippedIds.length === 2 ? { ...state, flippedIds: [] } : state;
  }
}
