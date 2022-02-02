import { useState, useEffect } from 'react';
import LargeButton from '../../components/buttons/LargeButton';
import { API_PATH } from '../../constants';
import { RefreshIcon } from '@heroicons/react/solid'


export default function VisForm({ setInitialized, setData, fileList }) {
    const [game, setGame] = useState('');
    const [version, setVersion] = useState('');
    const [startDate, setstartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minPlaytime, setMinPlaytime] = useState(0);
    const [maxPlaytime, setMaxPlaytime] = useState(0);

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [loading, setLoading] = useState(false)


    const gameList = () => {
        const games = []
        Object.keys(fileList).forEach((k) => {
            games.push(
                <option key={k} value={k}>{k}</option>
            )
        })
        return games
    }

    const versionList = () => {

    }

    /* checks if form is properly filled */
    const formValidation = () => {
        // console.log(game, version, startDate, endDate, minPlaytime, maxPlaytime)

        // if empty fields, prompt user to fill in the blanks & return
        // if (!(game && version && startDate && endDate && minPlaytime >= 0 && maxPlaytime)) {
        if (!(game && startDate && endDate)) {
            // prompt user
            alert('make sure each field has a valid value')
            return
        }

        // if start date later than end date, raise warnings & return
        if (startDate > endDate) {
            alert('invalid data range')
            return
        }

        // if min playtime small than max playtime, raise warnings & return
        /* 
        if (minPlaytime >= maxPlaytime) {
            alert('invalid total playtime')
            return
        }
        */

        // else, post request - propagateData()
        propagateData()
    }

    /* bundles input states and post to server to receive corresponding dataset*/
    const propagateData = () => {
        // start loading animation
        setLoading(true)

        // request dataset
        const url = API_PATH + `${game}/metrics?start_datetime=${encodeURIComponent(startDate)}&end_datetime=${encodeURIComponent(endDate)}&metrics=[JobName,JobStartCount,JobCompleteCount,JobTasksCompleted,JobCompletionTime,SessionCount]`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setData(data)

                // stop loading animation
                setLoading(false)
                // store response to parent component state
                setInitialized(true)
            })
            .catch(error => console.error(error))

    }





    return (
        <div className="container border p-10 max-w-xl">
            <p className='text-3xl mb-7'>designer dashboard</p>


            <div className="container">
                <div className=" mb-3">

                    {/* game selection */}
                    <div className="col">
                        <div className="input-group">
                            <div className="mb-1">
                                <span className='text-xl font-bold' >game</span>
                            </div>
                            <select className="form-select block w-full"
                                value={game} onChange={(e) => setGame(e.target.value)}
                            >
                                <option>Choose...</option>
                                {fileList ? gameList() : <></>}
                            </select>
                        </div>
                    </div>

                    {/* version selection */}
                    {/* <div className="col">
                        <div className="input-group">
                            <div className="mb-1">
                                <h3 className='text-xl font-bold' >version</h3>
                            </div>
                            <select className="form-select block w-full"
                                value={version} onChange={(e) => setVersion(e.target.value)}
                            >
                                <option>Choose...</option>
                                <option value={'v0.0.1'}>v0.0.1</option>
                            </select>
                        </div>
                    </div> */}
                </div>

                <div className="row"><h3 className='text-xl font-bold'>date</h3></div>
                <div className="columns-2  mb-5">
                    {/* date-from selection */}
                    <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >From</h4>
                        </div>
                        <input type='datetime-local' className='block w-full' value={startDate} onChange={(e) => setstartDate(e.target.value)}></input>
                    </div>

                    {/* date-to selection */}
                    <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >To</h4>
                        </div>
                        <input type='datetime-local' className='block w-full' value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                    </div>
                </div>

                {/* <div className="row"><h3 className='text-xl font-bold'>total playtime (minutes)</h3></div> */}
                <div className="row columns-2 mb-5">
                    {/* min playtime selection */}
                    {/* <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >From</h4>
                        </div>
                        <input type='number' className='block w-full'
                            value={minPlaytime} onChange={(e) => setMinPlaytime(e.target.value >= 0 ? e.target.value : 0)}></input>
                    </div> */}

                    {/* max playtime selection */}
                    {/* <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >To</h4>
                        </div>
                        <input type='number' className='block w-full'
                            value={maxPlaytime} onChange={(e) => setMaxPlaytime(e.target.value >= 0 ? e.target.value : 0)}></input>
                    </div> */}
                </div>

                <div className='flex space-x-2 items-center'>
                    <LargeButton
                        className='cursor-progress'
                        onClick={formValidation}
                        label='Visualize'
                    />
                    {loading ?
                        <RefreshIcon className='animate-spin h-8 w-8' />
                        : <></>
                    }
                </div>




            </div>
        </div>
    )
}