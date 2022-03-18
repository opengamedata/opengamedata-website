
import { useState, useEffect } from 'react';
import Settings from './Settings';
import VisForm from './VisForm';
import { API_ORIGIN } from '../../constants';
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




    const updateGlobalMetrics = (newMetrics) => {
        let searchParams, urlPath
        switch (currentView) {
            case 'JobGraph':
                // construct url path and params
                searchParams = new URLSearchParams({
                    start_datetime: encodeURIComponent(newMetrics.startDate) + 'T00:00',
                    end_datetime: encodeURIComponent(newMetrics.endDate) + 'T23:59',
                    metrics: '[TopJobCompletionDestinations,TopJobSwitchDestinations,ActiveJobs,JobsAttempted]'
                })

                urlPath = `game/${newMetrics.game}/metrics`

                break;
            case 'PlayerTimeline':
                // construct url path and params
                searchParams = new URLSearchParams({
                    metrics: 'EventList'
                })

                urlPath = `game/${newMetrics.game}/player/${viewMetrics.player}/metrics`

                break;

            case 'TaskGraph':
                // construct url path and params

                // searchParams = new URLSearchParams({
                //     start_datetime: encodeURIComponent(newMetrics.startDate) + 'T00:00',
                //     end_datetime: encodeURIComponent(newMetrics.endDate) + 'T23:59',
                //     metrics: '[TopJobCompletionDestinations,TopJobSwitchDestinations,ActiveJobs,JobsAttempted]'
                // })

                // urlPath = `game/${newMetrics.game}/metrics`

                break;
            default:
                break;
        }


        const url = new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)

        // fetch by url
        propagateData(url.toString())

        setMetrics(newMetrics)
    }

    const updateViewMetrics = (view, newViewMetrics) => {
        console.log(newViewMetrics)

        let searchParams, urlPath
        switch (view) {
            case 'JobGraph':
                // construct url path and params
                searchParams = new URLSearchParams({
                    start_datetime: encodeURIComponent(metrics.startDate) + 'T00:00',
                    end_datetime: encodeURIComponent(metrics.endDate) + 'T23:59',
                    metrics: '[TopJobCompletionDestinations,TopJobSwitchDestinations,ActiveJobs,JobsAttempted]'
                })

                urlPath = `game/${metrics.game}/metrics`

                break;
            case 'PlayerTimeline':
                // construct url path and params
                searchParams = new URLSearchParams({
                    metrics: 'EventList'
                })

                urlPath = `game/${metrics.game}/player/${newViewMetrics.player}/metrics`

                break;

            default:
                break;
        }


        const url = new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)

        // fetch by url
        propagateData(url.toString())

        setViewMetrics(newViewMetrics)
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
    const propagateData = (url) => {

        // localStorage.clear() // DEBUG

        // start loading animation
        setLoading(true)


        // if query found in storage, retreive JSON
        const localData = localStorage.getItem(url)
        // console.log(localData)
        if (localData) {
            setData(JSON.parse(localData)) 

            // store response to parent component state
            setInitialized(true)
            // stop loading animation
            setLoading(false)
        }
        // if not found in storage, request dataset
        else {
            console.log('fetching:', url)

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.status !== 'SUCCESS') throw data.msg

                    console.log(data)

                    // store data locally
                    localStorage.setItem(url, JSON.stringify(data.val))

                    // set data state
                    setData(data.val)

                    // store response to parent component state
                    setInitialized(true)

                    // stop loading animation
                    setLoading(false)
                })
                .catch(error => {
                    console.error(error)

                    alert(error)
                })
        }
    }

    return (
        <div className='w-screen'>
            {!initialized ?
                <VisForm
                    loading={loading}
                    updateGlobalMetrics={updateGlobalMetrics}
                />
                :
                <>
                    <Settings
                        metrics={metrics}
                        loading={loading}
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