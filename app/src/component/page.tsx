import { useEffect, useState } from "react"
import "./../compenentCss/page.css"
import { Cards } from "./cards"
export default function MemoryCard(){
    const [dragonball, setdragonball] = useState("")
    useEffect(()=>{

    })
    return(
        <div className="container">
            <div className="header">
                <h1>Memory Card</h1>
            </div>
            <div>
                <Cards/>
            </div>
        </div>
    )
}