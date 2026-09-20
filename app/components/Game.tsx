import { useMemoryGame } from "~/game/useMemoryGame";
import { Board } from "./Board";
import { Controls } from "./Controls";
import { CompletePanel, ErrorPanel, LoadingPanel } from "./Panels";
import { Stats } from "./Stats";

export function Game() {
  const { state, difficulty, best, isNewBest, totalPairs, isLocked, startGame, flip } =
    useMemoryGame();
  const { status } = state;

  return (
    <main className="game">
      <div className="play" data-pairs={totalPairs}>
        <header className="masthead">
          <h1 className="title">
            Dragon Ball <span>Memory</span>
          </h1>
          <Stats
            startedAt={state.startedAt}
            finishedAt={state.finishedAt}
            moves={state.moves}
            matched={state.matchedPairIds.length}
            totalPairs={totalPairs}
            best={best}
          />
        </header>

        <div className="table" data-status={status} aria-busy={status === "loading"}>
          {(status === "playing" || status === "complete") && (
            <Board
              cards={state.cards}
              flippedIds={state.flippedIds}
              matchedPairIds={state.matchedPairIds}
              isLocked={isLocked}
              onFlip={flip}
            />
          )}
          {status === "loading" && <LoadingPanel />}
          {status === "error" && state.error && (
            <ErrorPanel error={state.error} onRetry={() => startGame(difficulty)} />
          )}
          {status === "complete" && (
            <CompletePanel
              moves={state.moves}
              elapsedMs={(state.finishedAt ?? 0) - (state.startedAt ?? 0)}
              isNewBest={isNewBest}
              onPlayAgain={() => startGame(difficulty)}
            />
          )}
        </div>
        <Controls difficulty={difficulty} onStart={startGame} />
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {state.announcement}
      </p>

      <footer className="credits">
        Unofficial fan project. Characters and images from{" "}
        <a href="https://dragonball-api.com" target="_blank" rel="noreferrer">
          dragonball-api.com
        </a>
        . Title font Saiyan Sans by Ben Palmer.
      </footer>
    </main>
  );
}
