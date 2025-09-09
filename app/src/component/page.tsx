import { useEffect, useState } from "react"
import "./../compenentCss/page.css"
import { Cards } from "./cards"

export default function MemoryCard(){

    const [score, setScore] = useState(0);
    const [key, setKey] = useState(0);
    const [resetTrigger, setResetTrigger] = useState(false);
    
    const resetGame = () => {
        setScore(0);
        setKey(prev => prev + 1);
    }
    

    return(
        <div className="container">
            <div className="header">
                <div className="title">
                    <h1>DragonBalls Memory Card</h1>
                </div>
                <div className="interactive">
                    <button onClick={resetGame}>
                        Reset
                    </button>
                    <h1>Score: {score}</h1>
                </div>
            </div>
            <div>
                <Cards key={key} score={score} setScore={setScore}/>
            </div>
        </div>
    )
}