
import { useState } from 'react';
import Settings from './Settings';
import VisForm from './VisForm';
import { API_ORIGIN, timelineUrlPath, urlSearchMetrics } from '../../constants';
import JobGraph from './views/JobGraph/JobGraph';
import PlayerTimeline from './views/Timeline/PlayerTimeline';
import LoadingBlur from '../../components/LoadingBlur';
import LargeButton from '../../components/buttons/LargeButton';


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
        // console.log(newMetrics)

        let searchParams, urlPath
        switch (currentView) {
            case 'JobGraph':
                // construct url path and params
                searchParams = new URLSearchParams({
                    start_datetime: encodeURIComponent(newMetrics.startDate) + 'T00:00',
                    end_datetime: encodeURIComponent(newMetrics.endDate) + 'T23:59',
                    metrics: `[${urlSearchMetrics[newMetrics.game].toString()}]`
                })

                urlPath = `game/${newMetrics.game}/metrics`

                break;
            case 'PlayerTimeline':
                // construct url path and params
                searchParams = new URLSearchParams({
                    metrics: 'EventList'
                })

                urlPath = `game/${newMetrics.game}/${timelineUrlPath[newMetrics.game]}/${viewMetrics.player}/metrics`


                break;

            default:
                break;
        }


        const url = new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)

        // fetch by url
        propagateData(url.toString(), () => {

            setMetrics(newMetrics)
        })

    }

    const updateViewMetrics = (view, newViewMetrics) => {
        // console.log(newViewMetrics)

        let searchParams, urlPath
        switch (view) {
            case 'JobGraph':
                // construct url path and params
                searchParams = new URLSearchParams({
                    start_datetime: encodeURIComponent(metrics.startDate) + 'T00:00',
                    end_datetime: encodeURIComponent(metrics.endDate) + 'T23:59',
                    metrics: `[${urlSearchMetrics[metrics.game].toString()}]`
                })

                urlPath = `game/${metrics.game}/metrics`

                break;
            case 'PlayerTimeline':
                // construct url path and params
                searchParams = new URLSearchParams({
                    metrics: '[EventList]'
                })

                urlPath = `game/${metrics.game}/${timelineUrlPath[metrics.game]}/${newViewMetrics.player}/metrics`

                break;

            default:
                break;
        }


        const url = new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)

        // fetch by url
        propagateData(url.toString(), () => {
            setViewMetrics(newViewMetrics)
            // console.log('newViewMetrics', newViewMetrics)

            if (view !== currentView) setCurrentView(view)
        })


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
    const propagateData = (url, fetchCallback) => {
        // flush current dataset
        setData(null)

        // localStorage.clear() // DEBUG

        // start loading animation
        setLoading(true)

        // console.log(url)

        // if query found in storage, retreive JSON
        const localData = localStorage.getItem(url)
        // console.log(localData)
        if (localData) {



            fetchCallback()

            setData(JSON.parse(localData)) 

            // console.log(localData)


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

                    fetchCallback()

                    // set data state
                    setData(data.val)

                    // store response to parent component state
                    setInitialized(true)

                    // stop loading animation
                    setLoading(false)
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

            {/* For DEBUG purpose, remove in production */}
            <div className='fixed top-0 right-1/2 z-10'>
                <LargeButton
                    label='clear cache'
                    onClick={() => {
                        localStorage.clear()
                        alert('localStorage reset')
                    }}
                />
            </div>


            {!initialized ?
                <VisForm
                    loading={loading}
                    updateGlobalMetrics={updateGlobalMetrics}
                />
                :
                <>
                    {currentView === 'JobGraph' &&
                    <Settings
                        metrics={metrics}
                        loading={loading}
                        updateGlobalMetrics={updateGlobalMetrics}
                    />
                    }
                    <LoadingBlur loading={loading} />
                    {data &&
                        {
                            'JobGraph':
                                <JobGraph
                                    rawData={data}
                                    metrics={metrics}
                                updateViewMetrics={updateViewMetrics} />,
                            'PlayerTimeline':
                                <PlayerTimeline
                                    rawData={data}
                                    metrics={metrics}
                                    updateViewMetrics={updateViewMetrics} />
                        }[currentView]
                    }
                </>
            }
        </div>
    )
}