import { useState, useEffect } from 'react';
import LargeButton from '../../components/buttons/LargeButton';
import { CogIcon } from '@heroicons/react/solid'
import { vis_games } from '../../constants';


export default function VisForm({ loading, updateGlobalMetrics }) {
    const [game, setGame] = useState('');
    const [version, setVersion] = useState('');
    const [startDate, setstartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minPlaytime, setMinPlaytime] = useState(0);
    const [maxPlaytime, setMaxPlaytime] = useState(0);


    const gameList = () => {
        const games = []
        vis_games.forEach((k) => {
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
            alert('invalid date range')
            return
        }

        // if end date later than yesterday, raise warnings & return
        const today = new Date();
        const queryEnd = new Date(endDate)
        console.log(today, queryEnd)
        if (today.getUTCDate() - queryEnd.getUTCDate() <= 1) {
            alert('select an end date that\'s prior to yesterday')
            return
        }

        // if min playtime small than max playtime, raise warnings & return
        /* 
        if (minPlaytime >= maxPlaytime) {
            alert('invalid total playtime')
            return
        }
        */

        const metrics = {
            game: game,
            version: version,
            startDate: startDate,
            endDate: endDate,
            minPlaytime: minPlaytime,
            maxPlaytime: maxPlaytime
        }

        // else, post request - propagateData()
        // propagateData(metrics)
        updateGlobalMetrics(metrics)

    }


    return (
        <div className='container flex flex-wrap mt-16'>

            <div className='max-w-xl mb-10 mx-5'>
                <p className='mb-3 text-4xl font-light'>Designer Dashboard</p>
                <p>
                    A visualization tool for you to intuitively interpret data collected from gameplays.
                    Pick a game and a time range to begin.
                </p>
            </div>

            <div className="bg-white mb-10 mx-5 shadow-sm px-7 py-7 max-w-xl">
                <div className=" mb-3">

                    {/* game selection */}
                    <div className="col">
                        <div className="input-group">
                            <div className="mb-2">
                                <span className='text-xl font-light' >Game</span>
                            </div>
                            <select className="form-select block w-full"
                                value={game} onChange={(e) => setGame(e.target.value)}
                            >
                                <option> </option>
                                {gameList()}
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

                <div className="row"><h3 className='text-xl font-light mb-2'>Date</h3></div>
                <div className="columns-2  mb-5">
                    {/* date-from selection */}
                    <div className="col">
                        <input type='date' className='block w-full' value={startDate} onChange={(e) => setstartDate(e.target.value)}></input>
                        <h4 className="text-sm" >From</h4>

                    </div>

                    {/* date-to selection */}
                    <div className="col">
                        <input type='date' className='block w-full' value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                        <h4 className="text-sm" >To</h4>


                    </div>
                </div>

                {/* <div className="row"><h3 className='text-xl font-bold'>total playtime (minutes)</h3></div> */}
                <div className="row columns-2 mb-3">
                    {/* min playtime selection */}
                    {/* <div className="col">
                        <div className="">
                            <h4 className="text-sm" >From</h4>
                        </div>
                        <input type='number' className='block w-full'
                            value={minPlaytime} onChange={(e) => setMinPlaytime(e.target.value >= 0 ? e.target.value : 0)}></input>
                    </div> */}

                    {/* max playtime selection */}
                    {/* <div className="col">
                        <div className="">
                            <h4 className="text-sm" >To</h4>
                        </div>
                        <input type='number' className='block w-full'
                            value={maxPlaytime} onChange={(e) => setMaxPlaytime(e.target.value >= 0 ? e.target.value : 0)}></input>
                    </div> */}
                </div>

                <div className='flex space-x-2 items-center'>

                    {loading ?
                        <><CogIcon className='animate-spin h-8 w-8' /> &nbsp;This might take a while...</>
                        : 
                        <LargeButton
                        className='cursor-progress'
                        onClick={formValidation}
                        label='Visualize'
                        />
                    }
                </div>

            </div>

        </div>

    )
}