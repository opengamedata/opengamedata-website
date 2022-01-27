
import { useState } from 'react';
import Datetime from 'react-datetime';
import VisForm from '../components/VisForm';

const dummyData = {

}

export default function Dashboard() {

    const [fileList, setFileList] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [initialized, setInitialized] = useState(false);

    return (

        <VisForm />

    )

    // const [game, setGame] = useState(null);
    // const [version, setVersion] = useState(null);
    // const [startDate, setstartDate] = useState(null);
    // const [endDate, setEndDate] = useState(null);
    // const [minPlaytime, setMinPlaytime] = useState(0);
    // const [maxPlaytime, setMaxPlaytime] = useState(0);

    // return (
    //     <div className="ogd dashboard">
    //         <p>designer dashboard</p>


    //         <div className="container">
    //             <div className="row">
    //                 <div className="col">
    //                     {/* game selection */}
    //                     <div className="input-group mb-3">
    //                         <div className="input-group-prepend">
    //                             <h3 className="input-group-text" >Game</h3>
    //                         </div>
    //                         <select className="custom-select" id="inputGroupSelect01">
    //                             <option selected>Choose...</option>
    //                             <option value="1">One</option>
    //                             <option value="2">Two</option>
    //                             <option value="3">Three</option>
    //                         </select>
    //                     </div>
    //                 </div>
    //                 <div className="col">
    //                     {/* version selection */}
    //                     <div className="input-group mb-3">
    //                         <div className="input-group-prepend">
    //                             <h3 className="input-group-text" >Version</h3>
    //                         </div>
    //                         <select className="custom-select" id="inputGroupSelect01">
    //                             <option selected>Choose...</option>
    //                             <option value="1">One</option>
    //                             <option value="2">Two</option>
    //                             <option value="3">Three</option>
    //                         </select>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="row">
    //                 <div className="col">
    //                     {/* game selection */}
    //                     <div className="input-group mb-3">
    //                         <div className="input-group-prepend">
    //                             <h3 className="input-group-text" >From</h3>
    //                         </div>
    //                         <Datetime/>
    //                     </div>
    //                 </div>
    //                 <div className="col">
    //                     {/* version selection */}
    //                     <div className="input-group mb-3">
    //                         <div className="input-group-prepend">
    //                             <h3 className="input-group-text" >To</h3>
    //                         </div>
    //                         <Datetime/>
    //                     </div>
    //                 </div>
    //             </div>


    //             <button className="button black filled small ">Visualize</button>
    //         </div>
    //     </div>
    // )
}