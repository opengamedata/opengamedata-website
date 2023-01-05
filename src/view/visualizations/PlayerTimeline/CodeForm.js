import { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/solid'
import LongButton from '../../../../components/buttons/LongButton'
import { API_ORIGIN } from '../../../../constants';

export default function CodeForm({ metrics, viewMetrics, event, setFormVisible }) {
    const [codeTypes, setCodeTypes] = useState([])

    const [codeInput, setCodeInput] = useState('')
    const [coderInput, setCoderInput] = useState('')
    const [notesInput, setNotesInput] = useState('')
    const [saving, setSaving] = useState(false)

    const [newCodeToggle, setNewCodeToggle] = useState(false)
    const [newCodeInput, setNewCodeInput] = useState('')

    useEffect(() => {
        fetchCodeTypes()

        console.log(event)
    }, [])

    const fetchCodeTypes = () => {
        fetch(`${API_ORIGIN}/coding/game/${metrics.game}/codes`)
            .then(res => res.json())
            .then(data => {
                console.log(data.val)
                setCodeTypes(data.val)
            })
    }

    const formValidation = () => {
        // check for valid err code


        // check for non-empty coder name


        return true
    }

    const submit = () => {
        console.log(codeInput)

        // fetch(`${API_ORIGIN}/coding/game/${metrics.game}/player/${viewMetrics.player}/session/${event.sessionID}/index/<index>/code/${codeInput}`,
        //     {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             code: newCodeToggle ? newCodeInput : codeInput,
        //             coder: coderInput,
        //             note: notesInput
        //         })
        //     })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log(data)

        // update list of error codes
        // fetchCodeTypes()

        //         // if POST succeeds
        //         setNotesInput('')

        //     })
        //     .catch(err => {
        //         alert(err)

        //     })

        setTimeout(() => {
            setFormVisible(false)
        }, 1000);
    }


    return (
        <div className=" bg-white fixed top-14 right-3 p-3 w-content border shadow-sm">

            <div className="flex justify-between">
                <h3 className='text-md'>Detector Tagging</h3>
                <XIcon className="cursor-pointer h-5 w-5" onClick={() => setFormVisible(false)} />
            </div>

            <div>
                <h3 className='text-lg font-bold'>{event.type}</h3>
                <h3 className='text-lg font-bold'>@{event.name}</h3>
            </div>

            <div className="row">
                <div className="mb-5">
                    {/* code entry */}
                    <div className="col mb-2">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >Code</h4>
                        </div>

                        {!newCodeToggle ?
                            <div >
                                <select className='form-select block w-full mt-1' value={codeInput} onChange={(e) => setCodeInput(e.target.value)}>
                                    {codeTypes && codeTypes.map((type, i) =>
                                        <option key={i} value={type}>
                                            {type}
                                        </option>)}
                                </select>
                                <LongButton
                                    label='+ new'
                                    action={() => { setNewCodeToggle(true) }}
                                />
                            </div>
                            :
                            <input
                                type='text'
                                className='block w-full'
                                value={newCodeInput}
                                onChange={(e) => setNewCodeInput(e.target.value)}
                            />
                        }
                    </div>

                    {/* coder entry */}
                    <div className="col mb-2">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >Coder</h4>
                        </div>
                        <input type='text' className='block w-full' value={coderInput} onChange={(e) => setCoderInput(e.target.value)}></input>
                    </div>

                    {/* notes entry */}
                    <div className="col">
                        <div className="input-group-prepend">
                            <h4 className="text-sm" >Notes</h4>
                        </div>
                        <textarea className='block w-full' value={notesInput} onChange={(e) => setNotesInput(e.target.value)}></textarea>
                    </div>
                </div>
            </div>

            <div className='flex'>
                <LongButton
                    label='Save'
                    action={submit}
                    selected
                />
                {saving && <h4 className="text-sm" >Saving</h4>}
            </div>
        </div>
    )
}