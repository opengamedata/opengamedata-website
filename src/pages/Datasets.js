import { useEffect, useState } from "react"

const FILE_ENDPOINT = 'https://opengamedata.fielddaylab.wisc.edu/'

export default function Datasets() {

    const [fileList, setFileList] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [game, setGame] = useState(null)

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

    const getGames = () => {
        const games = []
        Object.keys(fileList).forEach(key => {
            // console.log("aqualab", key)
            // console.log(value)

            games.push(
                <button
                    key={key}
                    className="button xsmall"
                    onClick={() => setGame(key)}
                >
                    {key}
                </button>)
        })
        return games
    }

    return (
        <div className="container">
            {/* <h1>datasets download</h1> */}
            <h2>choose a game</h2>
            {fileList ? getGames() : <></>}
            <h2>datasets</h2>
            {
                game ? <Table datasets={fileList[game]} /> : <></> // swap with actual user selection
            }
        </div>
    )
}

function Table(props) {

    const [focused, setFocused] = useState(null)

    const insertRows = () => {
        let rows = []
        Object.entries(props.datasets).forEach(([key, value]) => {
            // console.log("aqualab", key)
            // console.log(value)

            rows.push(<ExpandableRow key={key} identifier={key} entry={value} expand={focused === key} setFocused={setFocused} />)
        })
        return rows
    }

    return (
        <table>
            <thead>
                <tr>
                    <th scope="col">start</th>
                    <th scope="col">end</th>
                    <th scope="col">uploaded</th>
                    <th scope="col">version</th>
                    <th scope="col">sessions</th>
                </tr>
            </thead>
            <tbody>
                {insertRows()}
            </tbody>
        </table>
    )
}

function ExpandableRow(props) {
    const toggleRow = () => {
        if (props.expand) {
            props.setFocused(null)
        }
        else {
            props.setFocused(props.identifier)
        }
    }

    return (
        <>
            <tr onClick={toggleRow}>
                <td>{props.entry.start_date ? props.entry.start_date : '-'}</td>
                <td>{props.entry.end_date ? props.entry.end_date : '-'}</td>
                <td>{props.entry.date_modified ? props.entry.date_modified : '-'}</td>
                <td>{props.entry.ogd_revision ? props.entry.ogd_revision : '-'}</td>
                <td>{props.entry.sessions ? props.entry.sessions : '-'}</td>
            </tr>
            {props.expand ?
                <div>
                    <a className="button" role="button" href={FILE_ENDPOINT + props.entry.events_file} download="blob">
                        events
                    </a>
                    <a className="button" role="button" href={FILE_ENDPOINT + props.entry.sessions_file} download="blob">
                        sessions
                    </a>
                    <a className="button" role="button" href={FILE_ENDPOINT + props.entry.population_file} download="blob">
                        population
                    </a>
                </div>
                : <></>
            }
        </>
    )
}