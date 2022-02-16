
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

    // manipulate raw data to a format to be used by the vis views
    const reducer = (rawData) => {

    }

    /* bundles input states and post to server to receive corresponding dataset*/
    const propagateData = (metrics) => {
        // start loading animation
        setLoading(true)

        // request dataset
        const url = API_PATH +
            `${metrics.game}/metrics?start_datetime=${encodeURIComponent(metrics.startDate)}&end_datetime=${encodeURIComponent(metrics.endDate)}` +
            `&metrics=[JobName,JobStartCount,JobCompleteCount,JobTasksCompleted,JobCompletionTime,SessionCount]`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setMetrics(metrics)

                console.log(data)
                setData(data.val)

                // stop loading animation
                setLoading(false)
                // store response to parent component state
                setInitialized(true)
            })
            .catch(error => console.error(error))

    }

    return (
        <div className='w-screen h-full p-3'>
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