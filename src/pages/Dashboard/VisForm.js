import { useState, useEffect } from 'react';
import LargeButton from '../../components/buttons/LargeButton';

const requestTemplate = 'start_datetime=2022-01-01T12%3A02%3A15&end_datetime=2022-01-26T13%3A02%3A15&metrics=[JobName,JobStartCount,JobCompleteCount,JobTasksCompleted,JobCompletionTime,SessionCount]'

export default function VisForm({ setInitialized }) {
    const [game, setGame] = useState(null);
    const [version, setVersion] = useState(null);
    const [startDate, setstartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [minPlaytime, setMinPlaytime] = useState(0);
    const [maxPlaytime, setMaxPlaytime] = useState(0);

    const [fileList, setFileList] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);


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


    const gameList = () => {
        const games = []
        Object.keys(fileList).forEach((k) => {
            games.push(
                <option key={k} value={k}>{k}</option>
            )
        })
        return games
    }

    /* checks if form is properly filled */
    const formValidation = () => {
        // if empty fields, prompt user to fill in the blanks & return
        if (!(game && version && startDate && endDate && minPlaytime >= 0 && maxPlaytime)) {
            // prompt user


            return
        }

        // if start date later than end date, raise warnings & return

        // if min playtime small than max playtime, raise warnings & return

        // else, post request - propagateData()
        propagateData()
    }

    /* bundles input states and post to server to receive corresponding dataset*/
    const propagateData = () => {
        // request dataset

        // store response to parent component state
        setInitialized(true)
    }





    return (
        <div className="container border p-10">
            <p className='text-3xl mb-7'>designer dashboard</p>


            <div className="container">
                <div className="columns-2 mb-3">

                    {/* game selection */}
                    <div className="col">
                        <div className="input-group">
                            <div className="mb-1">
                                <span className='text-xl font-bold' >game</span>
                            </div>
                            <select className="form-select block w-full">
                                <option selected>Choose...</option>
                                {fileList ? gameList() : <></>}
                            </select>
                        </div>
                    </div>

                    {/* version selection */}
                    <div className="col">
                        <div className="input-group">
                            <div className="mb-1">
                                <h3 className='text-xl font-bold' >version</h3>
                            </div>
                            <select className="form-select block w-full">
                                <option selected>Choose...</option>

                            </select>
                        </div>
                    </div>
                </div>

                <div className="row"><h3 className='text-xl font-bold'>date</h3></div>
                <div className="columns-2  mb-5">
                    {/* date-from selection */}
                    <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >From</h4>
                        </div>
                        <input type='date' className='block w-full'></input>
                    </div>

                    {/* date-to selection */}
                    <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >To</h4>
                        </div>
                        <input type='date' className='block w-full'></input>
                    </div>
                </div>

                <div className="row"><h3 className='text-xl font-bold'>total playtime (minutes)</h3></div>
                <div className="row columns-2 mb-5">
                    {/* min playtime selection */}
                    <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >From</h4>
                        </div>
                        <input type='number' className='block w-full'></input>
                    </div>

                    {/* max playtime selection */}
                    <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >To</h4>
                        </div>
                        <input type='number' className='block w-full'></input>
                        {/* <Datetime /> */}
                    </div>
                </div>


                {/* <button className="button black filled" onClick={formValidation}>
                    Visualize
                </button> */}

                <LargeButton
                    onClick={formValidation}
                    label='Visualize'
                />

            </div>
        </div>
    )
}