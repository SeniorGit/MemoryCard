import { memo } from "react";
import type { Card } from "~/game/types";

interface CardViewProps {
  card: Card;
  index: number;
  total: number;
  isFaceUp: boolean;
  isMatched: boolean;
  isMismatch: boolean;
  tabIndex: 0 | -1;
  onFlip: (id: string) => void;
  onFocusCard: (index: number) => void;
}

export const CardView = memo(function CardView({
  card,
  index,
  total,
  isFaceUp,
  isMatched,
  isMismatch,
  tabIndex,
  onFlip,
  onFocusCard,
}: CardViewProps) {
  const label = isMatched
    ? `${card.name}, matched`
    : isFaceUp
      ? card.name
      : `Card ${index + 1} of ${total}, face down`;

  return (
    <button
      type="button"
      className="card"
      data-face={isFaceUp ? "up" : "down"}
      data-result={isMatched ? "matched" : isMismatch ? "mismatch" : undefined}
      aria-label={label}
      aria-disabled={isMatched || undefined}
      tabIndex={tabIndex}
      onClick={() => onFlip(card.id)}
      onFocus={() => onFocusCard(index)}
    >
      <span className="card__inner">
        <span className="card__face card__cover" />
        <span className="card__face card__front">
          <img src={card.image} alt="" decoding="async" draggable={false} />
          <span className="card__name">
            <span>{card.name}</span>
          </span>
        </span>
      </span>
    </button>
  );
});
