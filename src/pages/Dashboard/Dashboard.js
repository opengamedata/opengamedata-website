
import { useState, useEffect } from 'react';
import Settings from './Settings';
import VisForm from './VisForm';
import { API_PATH } from '../../constants';
import TableView from './views/JobGraph/PlayersList';
import JobGraph from './views/JobGraph/JobGraph';
import PlayerTimeline from './views/PlayerTimeline';


export default function Dashboard() {

    // whether initial form completed
    const [initialized, setInitialized] = useState(false); // in production: defalt to false 

    // vis metrics
    const [metrics, setMetrics] = useState({
        game: '',
        version: '',
        startDate: '',
        endDate: '',
        minPlaytime: 0,
        maxPlaytime: 0
    })
    const [viewMetrics, setViewMetrics] = useState()
    const [currentView, setCurrentView] = useState('JobGraph')


    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);




    const updateGlobalMetrics = () => {
        let queryStr = ''


    }

    const updateViewMetrics = (view, viewMetrics) => {
        let queryStr = ''

        switch (view) {
            case 'JobGraph':

                break;
            case 'PlayerTimeline':

                break;

            default:
                break;
        }

        if (view !== currentView) setCurrentView(view)
    }

    /**
     * bundles input states and post to server then receives corresponding dataset
     * 
     * the function constructs a query string which is used in to ways:
     * 1. if data was previously fetched from the backend, it serves as the storage key for quick data retrieval from the browser's localStorage
     * 2. as the query parameter for fetching data from the backend
     * 
     * @param {*} metrics user-input metrics are passed in from VisForm or Settings
     * 
     * 
     */
    const propagateData = (metrics, query) => {
        // start loading animation
        setLoading(true)

        // setup query params
        const queryStr = query ? query : `${metrics.game}/metrics?start_datetime=${encodeURIComponent(metrics.startDate)}T00:00&end_datetime=${encodeURIComponent(metrics.endDate)}T23:59` +
            `&metrics=[TopJobCompletionDestinations,TopJobSwitchDestinations,ActiveJobs,JobsAttempted]`

        // localStorage.clear()

        // if query found in storage, retreive JSON
        const localData = localStorage.getItem(queryStr)
        // console.log(localData)
        if (localData) {
            setMetrics(metrics)
            setData(JSON.parse(localData)) 

            // stop loading animation
            setLoading(false)
            // store response to parent component state
            setInitialized(true)
        }
        // if not found in storage, request dataset
        else {
            const url = API_PATH + queryStr
            console.log('fetching:', url)

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.status !== 'SUCCESS') throw data.msg

                    setMetrics(metrics)

                    console.log(data)

                    // store data locally
                    localStorage.setItem(queryStr, JSON.stringify(data.val))

                    // set data state
                    setData(data.val)

                    // stop loading animation
                    setLoading(false)
                    // store response to parent component state
                    setInitialized(true)
                })
                .catch(error => {
                    console.error(error)
                    setLoading(false)

                    alert(error)
                })
        }
    }

    return (
        <div className='w-screen'>
            {!initialized ?
                <VisForm
                    loading={loading}
                    propagateData={propagateData}
                    updateGlobalMetrics={updateGlobalMetrics}
                />
                :
                <>
                    <Settings
                        metrics={metrics}
                        loading={loading}
                        propagateData={propagateData}
                        updateGlobalMetrics={updateGlobalMetrics}
                    />
                    {
                        {
                            'JobGraph':
                                <JobGraph
                                    rawData={data}
                                    updateViewMetrics={updateViewMetrics}

                                    loading={loading} />,
                            'PlayerTimeline':
                                <PlayerTimeline
                                    rawData={data} />
                        }[currentView]
                    }
                </>
            }


        </div>



    )

}