import { useEffect, useState } from "react";

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function Clock({ startedAt, finishedAt }: { startedAt: number | null; finishedAt: number | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (startedAt === null || finishedAt !== null) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [startedAt, finishedAt]);

  return <>{formatTime(startedAt === null ? 0 : (finishedAt ?? now) - startedAt)}</>;
}

interface StatsProps {
  startedAt: number | null;
  finishedAt: number | null;
  moves: number;
  matched: number;
  totalPairs: number;
  best: number | null;
}

export function Stats({ startedAt, finishedAt, moves, matched, totalPairs, best }: StatsProps) {
  return (
    <dl className="stats">
      <div>
        <dt>Time</dt>
        <dd>
          <Clock startedAt={startedAt} finishedAt={finishedAt} />
        </dd>
      </div>
      <div>
        <dt>Moves</dt>
        <dd>{moves}</dd>
      </div>
      <div>
        <dt>Pairs</dt>
        <dd>
          {matched}/{totalPairs}
        </dd>
      </div>
      <div>
        <dt>Best</dt>
        <dd>{best ?? "–"}</dd>
      </div>
    </dl>
  );
}
