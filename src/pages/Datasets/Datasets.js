import { useEffect, useState } from "react"
import Table from "./Table";
import GameList from "./GameList";
import InfoCard from "./InfoCard";

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
        <div className="max-w-xl px-5 pb-10 container">

            <h2 className="pt-5 pb-2 text-3xl font-medium">choose a game</h2>
            {fileList ?
                <GameList fileList={fileList} game={game} setGame={setGame} /> : <></>
            }


            {game ?
                <>
                    <InfoCard game={game}/>

                    <h2 className="pt-7 pb-2 text-3xl font-medium">datasets</h2>
                    <Table datasets={fileList[game]} />
                </> : <></>
            }
        </div>
    )
}








