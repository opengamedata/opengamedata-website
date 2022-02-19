import { useState } from "react"

import ExpandableRow from "./ExpandableRow";

export default function Table(props) {

    const [focused, setFocused] = useState(null)

    const insertRows = () => {
        const rows = []
        Object.entries(props.datasets).forEach(([key, value]) => {
            rows.push(<ExpandableRow key={key} identifier={key} entry={value} expand={focused === key} setFocused={setFocused} />)
        })
        return rows
    }

    return (
        <div className="shadow-md">
            <div className="px-2 rounded-t-md bg-stone-800 grid grid-cols-4 gap-4">
                <div className='p-2 font-bold text-white'>Start</div>
                <div className='p-2 font-bold text-white'>End</div>
                <div className='p-2 font-bold text-white'>Uploaded</div>
                {/* <div className='p-1 font-bold text-white'>version</div> */}
                <div className='p-2 font-bold text-white'>Sessions</div>
            </div>
            {insertRows()}

        </div>
    )
}