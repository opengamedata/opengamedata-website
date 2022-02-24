
import { useState, useEffect } from 'react';
import Template from './views/Template';
import Settings from './Settings';
import VisForm from './VisForm';
import { FILE_SERVER, API_PATH } from '../../constants';
import TableView from './views/TableView';
import JobGraph from './views/JobGraph';


export default function Dashboard() {
    // for file list fetching
    const [fileList, setFileList] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

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

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const [currentViews, setCurrentViews] = useState([
        <JobGraph />,
        <TableView />
    ])

    // fetch json metadata of the list of files
    useEffect(() => {
        fetch(FILE_SERVER + '/data/file_list.json')
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

    /* manipulate raw data to a format to be used by the vis views */
    const convert = (rawData) => {
        const meta = {
            SessionCount: rawData.SessionCount
        }

        // job0_JobName: "kelp-urchin-barren-predict"
        // job0_JobStartCount: "37"

        // job0_JobsAttempted: "0"
        // job0_JobsAttempted__avg_time_complete: "267.2608695652174"
        // job0_JobsAttempted__job_name: "kelp-urchin-barren-predict"
        // job0_JobsAttempted__num_completes: "23"
        // job0_JobsAttempted__num_starts: "37"
        // job0_JobsAttempted__percent_complete: "38.333333333333336"
        // job0_JobsAttempted__std_dev_complete: "154.25487096811986"

        // nodes { id: 'start', avgTime: -.1 }
        let nodeBuckets = {}
        for (const [key, value] of Object.entries(rawData)) {
            if (key === 'TopJobDestinations' || key === 'SessionCount') continue

            const [k, metric] = key.split('_')
            // console.log(`${k}'s ${metric}: ${value}`);

            if (!nodeBuckets.hasOwnProperty(k)) nodeBuckets[k] = { id: k }

            if (key === 'JobsAttempted') {
                console.log('attempted:', key, value)
            }

            nodeBuckets[k][metric] = value
        }

        // links { source: 'start', target: 'job 1', value: 110 }
        let l = []
        const rawLinks = JSON.parse(rawData.TopJobDestinations.replaceAll('\'', '\"').replaceAll('(', '[').replaceAll(')', ']'))
        for (const [key, value] of Object.entries(rawLinks)) {
            // console.log('link', key, value)

            value.forEach(target => {
                l.push({
                    source: key === 'None' ? 'start' : `job${key}`,
                    sourceName: nodeBuckets[`job${key}`].JobName,
                    target: target[0] === 'None' ? 'start' : `job${target[0]}`,
                    targetName: nodeBuckets[`job${target[0]}`].JobName,
                    value: target[1]
                })
            });
        }

        console.log(nodeBuckets)

        return { nodes: Object.values(nodeBuckets), links: l, meta: meta }

    }

    /* bundles input states and post to server then receives corresponding dataset*/
    const propagateData = (metrics) => {
        // start loading animation
        setLoading(true)

        // request dataset
        const url = API_PATH +
            `${metrics.game}/metrics?start_datetime=${encodeURIComponent(metrics.startDate)}&end_datetime=${encodeURIComponent(metrics.endDate)}` +
            `&metrics=[JobName,JobStartCount,JobCompleteCount,JobsAttempted,TopJobDestinations]`

        console.log('fetching:', url)

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.status !== 'SUCCESS') throw data.msg

                setMetrics(metrics)

                console.log(data)
                setData(convert(data.val))

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

    return (
        <div className='w-screen'>
            {!initialized ?
                <VisForm
                    fileList={fileList}
                    loading={loading}
                    propagateData={propagateData}
                />
                :
                <>
                    <Settings
                        metrics={metrics}
                        loading={loading}
                        propagateData={propagateData}
                    />
                    <JobGraph data={data} setData={setData} />
                    {/* <TableView data={dummyData} /> */}
                </>
            }


        </div>



    )

}