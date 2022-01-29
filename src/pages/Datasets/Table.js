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
        <div>
            <div className="px-2 rounded-t-md bg-slate-800 grid grid-cols-4 gap-4">
                <div className='p-2 font-bold text-white' scope="col">start</div>
                <div className='p-2 font-bold text-white' scope="col">end</div>
                <div className='p-2 font-bold text-white' scope="col">uploaded</div>
                {/* <div className='p-1 font-bold text-white' scope="col">version</div> */}
                <div className='p-2 font-bold text-white' scope="col">sessions</div>
            </div>
            {insertRows()}

        </div>
    )
}