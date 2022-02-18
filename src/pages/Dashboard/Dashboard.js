
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

        }

        // nodes { id: 'start', avgTime: -.1 }
        let nodeBuckets = {
            "job-1": { id: 'job-1', JobName: 'unknown origin' },
            "jobNone": { id: 'start', JobName: 'start' }
        }
        for (const [key, value] of Object.entries(rawData)) {
            if (key === 'TopJobDestinations' || key === 'SessionCount') continue

            const [k, metric] = key.split('_')
            // console.log(`${k}'s ${metric}: ${value}`);

            if (!nodeBuckets.hasOwnProperty(k)) nodeBuckets[k] = { id: k }

            if (metric === 'TopJobDestinations') {

            }
            else {
                nodeBuckets[k][metric] = value
            }
        }

        // {'0': [(1, 18), (3, 1), (5, 1), (2, 1)], '1': [(14, 13), (9, 2), (10, 1), (11, 1)], '2': [(4, 27), (14, 19), (5, 10), (0, 2), (9, 2)], '3': [(6, 3), (2, 2), (12, 1), (15, 1), (10, 1)], '4': [(7, 67), (18, 40), (0, 27), (12, 3), (14, 1)], '5': [(2, 65), (6, 4), (9, 4), (10, 1), (0, 1)], '6': [(5, 10), (3, 9), (0, 9), (2, 6), (9, 2)], '7': [(18, 56), (6, 5), (12, 4), (5, 2), (2, 2)], '8': [(4, 124)], '9': [(10, 3), (13, 1), (11, 1)], '10': [(13, 7), (16, 1), (5, 1)], '11': [(10, 4)], '12': [(7, 11), (6, 6), (5, 4), (2, 3), (11, 1)], '13': [(12, 2), (16, 1)], '14': [(9, 13), (10, 5), (4, 2), (11, 2), (3, 1)], '-1': [(12, 16), (6, 16), (1, 14), (0, 10), (7, 10)], 'None': [(7, 7), (3, 4), (18, 4), (14, 2), (12, 2)], '15': [(11, 1)], '16': [(10, 1)], '17': [(11, 1)], '18': [(12, 74), (7, 3)]}


        // links { source: 'start', target: 'job 1', value: 110 }
        let l = [] 
        const rawLinks = JSON.parse(rawData.TopJobDestinations.replaceAll('\'', '\"').replaceAll('(', '[').replaceAll(')', ']'))
        for (const [key, value] of Object.entries(rawLinks)) {
            console.log('link', key, value)

            value.forEach(target => {
                l.push({
                    source: key === 'None' ? 'start' : `job${key}`,
                    target: target[0] === 'None' ? 'start' : `job${target[0]}`,
                    value: target[1]
                })
            });
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