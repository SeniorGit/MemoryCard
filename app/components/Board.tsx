import { useCallback, useRef, useState, type KeyboardEvent } from "react";
import type { Card } from "~/game/types";
import { CardView } from "./CardView";

interface BoardProps {
  cards: Card[];
  flippedIds: string[];
  matchedPairIds: number[];
  isLocked: boolean;
  onFlip: (id: string) => void;
}

export function Board({ cards, flippedIds, matchedPairIds, isLocked, onFlip }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const tabStop = Math.min(activeIndex, cards.length - 1);
  const isMismatch = flippedIds.length === 2;

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const board = boardRef.current;
    if (!board) return;

    const buttons = Array.from(board.querySelectorAll<HTMLButtonElement>(".card"));
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;

    const columns = getComputedStyle(board).gridTemplateColumns.split(" ").length;
    const moves: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      ArrowDown: current + columns,
      ArrowUp: current - columns,
      Home: 0,
      End: buttons.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;

    event.preventDefault();
    buttons[Math.max(0, Math.min(next, buttons.length - 1))].focus();
  }, []);

  return (
    <div
      ref={boardRef}
      className="board"
      role="group"
      aria-label="Memory cards"
      data-locked={isLocked || undefined}
      onKeyDown={handleKeyDown}
    >
      {cards.map((card, index) => {
        const isMatched = matchedPairIds.includes(card.pairId);
        const isFlipped = flippedIds.includes(card.id);
        return (
          <CardView
            key={card.id}
            card={card}
            index={index}
            total={cards.length}
            isFaceUp={isMatched || isFlipped}
            isMatched={isMatched}
            isMismatch={isMismatch && isFlipped}
            tabIndex={index === tabStop ? 0 : -1}
            onFlip={onFlip}
            onFocusCard={setActiveIndex}
          />
        );
      })}
    </div>
  );
}
