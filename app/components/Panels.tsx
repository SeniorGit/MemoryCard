import type { LoadErrorKind } from "~/game/types";
import { formatTime } from "./Stats";

const ERROR_MESSAGES: Record<LoadErrorKind, string> = {
  network: "Check your internet connection and try again.",
  timeout: "The image service took too long to respond.",
  rateLimit: "Too many requests right now. Wait a moment and try again.",
  server: "The image service is having trouble right now.",
  empty: "The image service didn't return any characters.",
  images: "Some character images couldn't be loaded.",
};

export function LoadingPanel() {
  return (
    <div className="notice" role="status">
      <div className="notice__ball" />
      <p>Preparing your game…</p>
    </div>
  );
}

export function ErrorPanel({ error, onRetry }: { error: LoadErrorKind; onRetry: () => void }) {
  return (
    <div className="notice" role="alert">
      <h2>Unable to prepare the game.</h2>
      <p>{ERROR_MESSAGES[error]}</p>
      <button type="button" className="button button--primary" onClick={onRetry} autoFocus>
        Try Again
      </button>
    </div>
  );
}

interface CompletePanelProps {
  moves: number;
  elapsedMs: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export function CompletePanel({ moves, elapsedMs, isNewBest, onPlayAgain }: CompletePanelProps) {
  return (
    <div className="notice">
      <div className="notice__panel">
        <h2>Game complete</h2>
        <dl className="summary">
          <div>
            <dt>Moves</dt>
            <dd>{moves}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{formatTime(elapsedMs)}</dd>
          </div>
        </dl>
        {isNewBest && <p className="summary__record">New best!</p>}
        <button type="button" className="button button--primary" onClick={onPlayAgain} autoFocus>
          Play Again
        </button>
      </div>
    </div>
  );
}
