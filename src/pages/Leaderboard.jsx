import { useEffect, useState } from "react"
import clientPromise from "../../api/lib/mongodb"

function Leaderboard({ isConnected }) {
    const [scores, setScores] = useState();

    useEffect(() => {
        (async () => {
            const results = await fetch("/api/getScores");
            const resultsJson = await results.json();
            setScores(resultsJson);
        })
    }, []);


    return (
        <div>
            <h1>{scores}</h1>
        </div>

    )
}

export default Leaderboard