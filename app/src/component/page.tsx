import { useState } from "react"
import "./../compenentCss/page.css"
import { Cards } from "./cards"
export default function MemoryCard(){
    
    const [score, setScore] = useState(0);
    
    


    return(
        <div className="container">
            <div className="header">
                <div className="title">
                    <h1>DragonBalls Memory Card</h1>
                </div>
                <div className="interactive">
                    <h1>Score: {score}</h1>
                </div>
            </div>
            <div>
                <Cards score={score} setScore={setScore}/>
            </div>
        </div>
    )
}