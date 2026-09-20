import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { loadPlayableCharacters, toLoadError } from "./api";
import { createDeck, gameReducer, initialState } from "./logic";
import { readBest, writeBest } from "./storage";
import { DEFAULT_DIFFICULTY, DIFFICULTIES, type Difficulty } from "./types";

const MISMATCH_DELAY_MS = 1000;

export function useMemoryGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [best, setBest] = useState<number | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  const requestId = useRef(0);

  const startGame = useCallback(async (next: Difficulty) => {
    const id = ++requestId.current;
    setDifficulty(next);
    setBest(readBest(next));
    setIsNewBest(false);
    dispatch({ type: "loading" });

    try {
      const characters = await loadPlayableCharacters(DIFFICULTIES[next].pairs);
      if (id === requestId.current) dispatch({ type: "ready", cards: createDeck(characters) });
    } catch (error) {
      if (id === requestId.current) dispatch({ type: "failed", error: toLoadError(error) });
    }
  }, []);

  useEffect(() => {
    void startGame(DEFAULT_DIFFICULTY);
    return () => {
      requestId.current++;
    };
  }, [startGame]);

  useEffect(() => {
    if (state.flippedIds.length !== 2) return;
    const timer = setTimeout(() => dispatch({ type: "clearMismatch" }), MISMATCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state.flippedIds]);

  useEffect(() => {
    if (state.status !== "complete") return;
    if (best === null || state.moves < best) {
      writeBest(difficulty, state.moves);
      setIsNewBest(best !== null);
      setBest(state.moves);
    }
  }, [state.status]);

  const flip = useCallback((id: string) => dispatch({ type: "flip", id, now: Date.now() }), []);

  return {
    state,
    difficulty,
    best,
    isNewBest,
    totalPairs: DIFFICULTIES[difficulty].pairs,
    isLocked: state.status !== "playing" || state.flippedIds.length === 2,
    startGame,
    flip,
  };
}
