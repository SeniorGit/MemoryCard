import { useState, useEffect } from "react"
import "./../compenentCss/page.css"
import "./../compenentCss/card.css"
export function Cards(){
    const [firstClick, setFirstClick] = useState('');
    const [secondClick, setSecondClick] = useState('');
    const [score, setScore] = useState(0);

    const card = ['a', 'a', 'b', 'b',
        'c', 'c', 'd', 'd', 'e', 'e',
        
    ]
    // For shuffle the card every time refresh no every user win 
    // it should be shulled when user win 
    const shuffledCard = [...card].sort(()=> Math.random()-0.5)

    const handleClick = (currentValue:string) => {
        if(firstClick === '') {
            setFirstClick(currentValue)
        } else if (secondClick === ''){
            setSecondClick(currentValue)

            if(firstClick === currentValue){
                setScore(prevScore => prevScore + 1);
                
            }

            setTimeout(()=> {
                setFirstClick('');
                setSecondClick('');
            }, 10);
            
        }
    };
    useEffect(() => {
        console.log("Score updated:", score);
    }, [score]);

    useEffect(() => {
        console.log("FirstClick updated:", firstClick);
    }, [firstClick]);

    useEffect(() => {
        console.log("SecondClick updated:", secondClick);
    }, [secondClick]);

    return(
        <div className="cardHolder">
            {card.map((c, index) => (
                <div onClick={()=> handleClick(c)}  >
                    <div 
                        key={index}
                        onClick={(e) => e.currentTarget.classList.toggle("flipped")}
                        className={`card`}
                    >
                        <div className="card-inner" >
                            <div className="card-front" >
                                <p>blank</p>
                            </div>
                            <div className="card-back">
                                {c}
                            </div>
                        </div>
                    </div>
                </div>
            ))}                
        </div>
    )
}

