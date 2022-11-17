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
        <div className="shadow-sm">
            <div className="px-2  bg-stone-200 grid grid-cols-4 gap-4">
                <div className='p-2 font-bold text-black'>Start</div>
                <div className='p-2 font-bold text-black'>End</div>
                <div className='p-2 font-bold text-black'>Uploaded</div>
                {/* <div className='p-1 font-bold text-black'>version</div> */}
                <div className='p-2 font-bold text-black'>Sessions</div>
            </div>
            <div className="overflow-auto max-h-64">
                {insertRows()}
            </div>

        </div>
    )
}