
import { useState, useEffect } from 'react';
import Template from './views/Template';
import Settings from './Settings';
import VisForm from './VisForm';
import { FILE_SERVER, API_PATH, dummyData } from '../../constants';
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

        // job0_JobCompleteCount: "20"
        // job0_JobName: "kelp-welcome"
        // job0_JobStartCount: "37"
        // job1_JobCompleteCount: "22"
        // job1_JobName: "kelp-urchin-barren"
        // job1_JobStartCount: "28"
        // job2_JobCompleteCount: "47"
        // job2_JobName: "kelp-save-urchin-barren"
        // job2_JobStartCount: "53"
        // job3_JobCompleteCount: "1"
        // job3_JobName: "kelp-bull-kelp-forest"
        // job3_JobStartCount: "1"

        const n = [] // { id: 'start', avgTime: -.1 },
        const l = [] // { source: 'start', target: 'job 1', value: 110 },

        const meta = {

        }

        let nodeBuckets = {}

        for (const [key, value] of Object.entries(rawData)) {
            if (key === 'TopJobDestinations') continue

            const [k, metric] = key.split('_')
            // console.log(`${k}'s ${metric}: ${value}`);

            if (!nodeBuckets.hasOwnProperty(k)) nodeBuckets[k] = { id: k }

            if (metric === 'TopJobDestinations') {

            }
            else {
                nodeBuckets[k][metric] = value
            }

        }

        console.log(nodeBuckets)

        return { nodes: Object.values(nodeBuckets), links: l, meta: '' }

    }

    /* bundles input states and post to server then receives corresponding dataset*/
    const propagateData = (metrics) => {
        // start loading animation
        setLoading(true)

        // request dataset
        const url = API_PATH +
            `${metrics.game}/metrics?start_datetime=${encodeURIComponent(metrics.startDate)}&end_datetime=${encodeURIComponent(metrics.endDate)}` +
            `&metrics=[JobName,JobStartCount,JobCompleteCount,TopJobDestinations]`
        fetch(url)
            .then(res =>  res.json())
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
        <div className='w-screen h-full'>
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