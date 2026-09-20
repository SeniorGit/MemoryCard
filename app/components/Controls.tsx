import { DIFFICULTIES, type Difficulty } from "~/game/types";

interface ControlsProps {
  difficulty: Difficulty;
  onStart: (difficulty: Difficulty) => void;
}

export function Controls({ difficulty, onStart }: ControlsProps) {
  return (
    <div className="controls">
      <div className="segmented" role="group" aria-label="Difficulty">
        {(Object.keys(DIFFICULTIES) as Difficulty[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={key === difficulty}
            title={`${DIFFICULTIES[key].pairs} pairs`}
            onClick={() => key !== difficulty && onStart(key)}
          >
            {DIFFICULTIES[key].label}
          </button>
        ))}
      </div>
      <button type="button" className="button button--primary" onClick={() => onStart(difficulty)}>
        New Game
      </button>
    </div>
  );
}
