import { useState } from 'react';
import Datetime from 'react-datetime';

export default function VisForm(props) {
    const [game, setGame] = useState(null);
    const [version, setVersion] = useState(null);
    const [startDate, setstartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [minPlaytime, setMinPlaytime] = useState(0);
    const [maxPlaytime, setMaxPlaytime] = useState(0);

    /* checks if form is properly filled */
    const formValidation = () => {
        // if empty fields, prompt user to fill in the blanks & return

        // if start date later than end date, raise warnings & return

        // if min playtime small than max playtime, raise warnings & return

        // else, post request - propagateData()
    }

    /* bundles input states and post to server to receive corresponding dataset*/
    const propagateData = () => {
        // request dataset

        // store response to parent component state

    }





    return (
        <div className="ogd dashboard">
            <p>designer dashboard</p>


            <div className="container">
                <div className="row">

                    {/* game selection */}
                    <div className="col">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <h3 className="input-group-text" >Game</h3>
                            </div>
                            <select className="custom-select" id="inputGroupSelect01">
                                <option selected>Choose...</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                    </div>

                    {/* version selection */}
                    <div className="col">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <h3 className="input-group-text" >Version</h3>
                            </div>
                            <select className="custom-select" id="inputGroupSelect01">
                                <option selected>Choose...</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row"><h3>date</h3></div>
                <div className="row">
                    {/* date-from selection */}
                    <div className="col">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <h4 className="input-group-text" >From</h4>
                            </div>
                            <input></input>
                            {/* <Datetime /> */}
                        </div>
                    </div>

                    {/* date-to selection */}
                    <div className="col">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <h4 className="input-group-text" >To</h4>
                            </div>
                            <input></input>
                            {/* <Datetime /> */}
                        </div>
                    </div>
                </div>

                <div className="row"><h3>total playtime</h3></div>
                <div className="row">
                    {/* min playtime selection */}
                    <div className="col">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <h4 className="input-group-text" >From</h4>
                            </div>
                            <input></input>
                            {/* <Datetime /> */}
                        </div>
                    </div>

                    {/* max playtime selection */}
                    <div className="col">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <h4 className="input-group-text" >To</h4>
                            </div>
                            <input></input>
                            {/* <Datetime /> */}
                        </div>
                    </div>
                </div>


                <button className="button black filled" onClick={formValidation}>
                    Visualize
                </button>
                
            </div>
        </div>
    )
}