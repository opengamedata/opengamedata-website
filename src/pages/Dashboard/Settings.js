
import { AdjustmentsIcon, XIcon, CogIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import LargeButton from '../../components/buttons/LargeButton'

export default function Settings({ propagateData, loading, metrics }) {

    // vis metrics
    const [game, setGame] = useState('');
    const [version, setVersion] = useState('');
    const [startDate, setstartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minPlaytime, setMinPlaytime] = useState(0);
    const [maxPlaytime, setMaxPlaytime] = useState(0);

    const [adjustMode, setAdejustMode] = useState(false)


    const adjust = () => {
        // validation
        if (startDate > endDate) {
            alert('The start date has to be no later than the end date')
            return
        }

        // refresh vis
        const metrics = {
            game: game,
            version: version,
            startDate: startDate,
            endDate: endDate,
            minPlaytime: minPlaytime,
            maxPlaytime: maxPlaytime
        }

        propagateData(metrics)

        // switch back to brief
        // setAdejustMode(false)
    }

    useEffect(() => {
        setGame(metrics.game)
        setVersion(metrics.version)
        setstartDate(metrics.startDate)
        setEndDate(metrics.endDate)
        setMinPlaytime(metrics.minPlaytime)
        setMaxPlaytime(metrics.maxPlaytime)
    }, [adjustMode])

    useEffect(()=>{
        if(!loading) setAdejustMode(false)
    },[loading])

    return (
        <div className=" bg-white fixed top-14 left-3 p-3 w-content border shadow-sm">
            <div className='flex justify-between mb-2'>
                <div>
                    <span className='font-medium '>{game}&nbsp;</span>
                    {/* <span>version</span> */}
                </div>
                {adjustMode ?
                    !loading ? <XIcon className="cursor-pointer h-5 w-5" onClick={() => setAdejustMode(false)} />:<></>
                    :
                    <AdjustmentsIcon className="cursor-pointer h-5 w-5" onClick={() => setAdejustMode(true)} />
                }
            </div>

            {adjustMode ?
                <div>
                    <div>
                        {/* <div className="row"><h3 className='text-md font-bold'>date</h3></div> */}
                        <div className="mb-5">
                            {/* date-from selection */}
                            <div className="col mb-2">
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
                    </div>


                    <div className='flex space-x-2 items-center'>
                        <LargeButton
                            // action={adjust}
                            onClick={adjust}
                            label='visualize'
                        />
                        {loading ?
                            <><CogIcon className='animate-spin h-8 w-8' /> &nbsp;Please wait...</>
                            : <></>
                        }
                    </div>
                </div>
                :
                <div>
                    <div className='text-sm'>{startDate.replace('T', ' ')}</div>
                    <div className='text-sm'>to</div>
                    <div className='text-sm'>{endDate.replace('T', ' ')}</div>
                </div>
            }

        </div>
    )
}