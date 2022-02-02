
import { useState, useEffect } from 'react';
import Template from '../../components/views/Template';
// import Settings from './Settings';
import VisForm from './VisForm';
import { FILE_SERVER } from '../../constants';

const dummyData = {

}

export default function Dashboard() {

    const [fileList, setFileList] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [initialized, setInitialized] = useState(false); // in production: defalt to false 

    const [data, setData] = useState(null)

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

    return (
        <div className=' w-screen p-3 '>
            {!initialized ?
                <VisForm setInitialized={setInitialized} setData={setData} fileList={fileList} /> : <></>
            }

            {initialized ?
                <Template data={data}  setData={setData}/> : <></>
            }


        </div>



    )

}