
import { useState } from 'react';
import Settings from './Settings';
import VisForm from './VisForm';
import { API_ORIGIN, timeline_url_path, requested_extractors } from '../../constants';
import JobGraph from './views/JobGraph/JobGraph';
import PlayerTimeline from './views/Timeline/PlayerTimeline';
import LoadingBlur from '../../components/LoadingBlur';
import LargeButton from '../../components/buttons/LargeButton';


export default function Dashboard() {

    // whether initial form completed
    const [initialized, setInitialized] = useState(false); // in production: defalt to false 

    // vis metrics
    const [metrics, setMetrics] = useState({
        game: null,
        version: '',
        startDate: null,
        endDate: null,
        minPlaytime: 0,
        maxPlaytime: 0
    })
    const [viewMetrics, setViewMetrics] = useState()
    const [currentView, setCurrentView] = useState('JobGraph')

    const [is_loading, setLoadingState] = useState(false);
    const [data, setData] = useState(null);

    const getURLPath = (view, newMetrics) => {
        let searchParams, urlPath
        const startDate = metrics.startDate ?? newMetrics.startDate;
        const endDate = metrics.endDate ?? newMetrics.endDate;
        const gameName = metrics.game ?? newMetrics.game;
        switch (view) {
            case 'JobGraph':
                // construct url path and params
                searchParams = new URLSearchParams({
                    start_datetime: encodeURIComponent(startDate) + 'T00:00',
                    end_datetime: encodeURIComponent(endDate) + 'T23:59',
                    metrics: `[${requested_extractors[gameName].toString()}]`
                });
                urlPath = `game/${gameName}/metrics`;
                break;
            case 'PlayerTimeline':
                // construct url path and params
                searchParams = new URLSearchParams({
                    metrics: '[EventList]'
                });
                urlPath = `game/${gameName}/${timeline_url_path[gameName]}/${viewMetrics.player}/metrics`;
                break;
            default:
                break;
        };

        // fetch by url
        return new URL(`${urlPath}?${searchParams.toString()}`, API_ORIGIN)
    }

    /**
     * updates global metrics as seen in the metrics state above
     * @param {*} newMetrics 
     */
    const updateGlobalMetrics = (newMetrics) => {
        // console.log(newMetrics)
        const url = getURLPath(currentView, newMetrics);
        const callback = () => {
            setMetrics(newMetrics);
        };
        retrieveData(url.toString(), callback);
    }

    /**
     * Update view-specific metrics
     * for job graph: {}
     * for player timeline: {player}
     * @param {*} view 
     * @param {*} newViewMetrics 
     */
    const updateViewMetrics = (view, newViewMetrics) => {
        // console.log(newViewMetrics)

        // fetch by url
        const url = getURLPath(view, newViewMetrics);
        const callback = () => {
            setViewMetrics(newViewMetrics)
            if (view !== currentView) setCurrentView(view)
        };
        retrieveData(url.toString(), callback);
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
    const retrieveData = (url, fetchCallback) => {
        // flush current dataset
        setData(null)
        // localStorage.clear() // DEBUG

        // start loading animation
        setLoadingState(true)
        // console.log(url)
        // if query found in storage, retreive JSON
        const localData = localStorage.getItem(url)
        if (localData) {
            fetchCallback()
            setData(JSON.parse(localData))
            // console.log(localData)
            // store response to parent component state
            setInitialized(true)
            // stop loading animation
            setLoadingState(false)
        }
        // if not found in storage, request dataset
        else {
            console.log('fetching:', url)

            fetch(url).then(result => result.json()).then(data => {
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
                    setLoadingState(false)
                })
                .catch(error => {
                    console.error(error)
                    setLoadingState(false)
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
                    loading={is_loading}
                    updateGlobalMetrics={updateGlobalMetrics}
                />
                :
                <>
                    {currentView === 'JobGraph' &&
                        <Settings
                            metrics={metrics}
                            loading={is_loading}
                            updateGlobalMetrics={updateGlobalMetrics}
                        />
                    }
                    <LoadingBlur loading={is_loading} />
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
                                    viewMetrics={viewMetrics}
                                    updateViewMetrics={updateViewMetrics} />
                        }[currentView]
                    }
                </>
            }
        </div>
    )
}