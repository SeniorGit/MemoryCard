import { useEffect, useState } from "react"
import "./../compenentCss/page.css"
import { Cards } from "./cards"
export default function MemoryCard(){
    const [dragonball, setdragonball] = useState("")
    const [score, setScore] = useState(0);
    useEffect(()=>{

    })
    return(
        <div className="container">
            <div className="header">
                <h1>Memory Card</h1>
                <h1>Score: {score}</h1>
            </div>
            <div>
                <Cards score={score} setScore={setScore}/>
            </div>
        </div>
    )
}