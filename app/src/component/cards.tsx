import React, { useState, useEffect } from "react"
import "./../compenentCss/page.css"
import "./../compenentCss/card.css"

interface Card{
    value:string;
    isFlipped: boolean;
    isMatched: boolean;
    id:number;
    
}

interface CardProps{
    score:number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
}

export function Cards({score, setScore}:CardProps){
    const [cards, setCard] = useState<Card[]>([]);
    const [canFlip, setCanFlip] = useState(true);
    useEffect(()=> {
        const initialCard = ['a', 'a', 'b', 'b',
            'c', 'c', 'd', 'd', 'e', 'e',
        ]
        const shuffle = [...initialCard].sort(()=> Math.random()-0.5)
        .map((value, index)=> ({
            value, 
            isFlipped: false,
            isMatched: false,
            id: index,
        }));
        setCard(shuffle);
    }, [])

   const handleCardClick = (clickedIndex: number) => {
        //checking if the card already flipped or card already matched
        if (!canFlip || cards[clickedIndex].isFlipped || cards[clickedIndex].isMatched) {
            return;
        }

        // Flip the clicked card
        const newCards = cards.map((card, index) => 
            index === clickedIndex ? {...card, isFlipped: true} : card
        );
        setCard(newCards);

        // Find the other flipped card (if any)
        const otherFlippedCard = newCards.findIndex((card, index) => 
            index !== clickedIndex && card.isFlipped && !card.isMatched
        );

        if (otherFlippedCard !== -1) {
            // We have two cards flipped - check for match
            setCanFlip(false);
            if (newCards[clickedIndex].value === newCards[otherFlippedCard].value) {
            // Cards match
                setScore(prev => prev + 1);
                const matchedCards = newCards.map((card, index) =>
                    (index === clickedIndex || index === otherFlippedCard) 
                    ? {...card, isMatched: true} 
                    : card
                );
                setCard(matchedCards);
                setCanFlip(true);
            } else {
                // Cards don't match - flip back after delay
                setTimeout(() => {
                    const resetCards = newCards.map((card, index) =>
                    (index === clickedIndex || index === otherFlippedCard)
                        ? {...card, isFlipped: false}
                        : card
                    );
                    setCard(resetCards);
                    setCanFlip(true);
                }, 1000);
            }
        }
    };
    
    return(
        <div className="cardHolder">
            {cards.map((card, index) => (
                <div onClick={()=> handleCardClick(index)} 
                    key={card.id} 
                    className={`card ${card.isFlipped ? 'flipped' : ''}`}
                >
                    <div className="card-inner" >
                        <div className="card-front" >
                            
                        </div>
                        <div className="card-back">
                            {card.value}
                        </div>
                    </div>
                </div>
            ))}                
        </div>
    )
}

