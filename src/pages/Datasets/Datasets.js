import { useEffect, useState } from "react"
import Table from "./Table";
import GameList from "./GameList";

export default function Datasets() {

    const [fileList, setFileList] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [game, setGame] = useState(null);

    // fetch json metadata of the list of files
    useEffect(() => {
        fetch('https://opengamedata.fielddaylab.wisc.edu/data/file_list.json')
            .then(res => res.json())
            .then(
                (result) => {
                    setFileList(result)
                    setIsLoaded(true);
                    // console.log(result)
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                    console.log(error)
                }
            )
    }, [])



    return (
        <div className="container">

            <h2>choose a game</h2>
            {fileList ?
                <GameList fileList={fileList} setGame={setGame} /> : <></>
            }


            {game ?
                <>
                    
                    <h2>datasets</h2>
                    <Table datasets={fileList[game]} />
                </> : <></>
            }
        </div>
    )
}








