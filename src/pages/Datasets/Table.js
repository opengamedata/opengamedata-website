import { useState } from "react"

import ExpandableRow from "./ExpandableRow";

export default function Table(props) {

    const [focused, setFocused] = useState(null)

    const insertRows = () => {
        const rows = []
        Object.entries(props.datasets).forEach(([key, value]) => {
            // console.log("aqualab", key)
            // console.log(value)

            rows.push(<ExpandableRow key={key} identifier={key} entry={value} expand={focused === key} setFocused={setFocused} />)
        })
        return rows
    }

    return (
        <table>
            <thead>
                <tr>
                    <th scope="col">start</th>
                    <th scope="col">end</th>
                    <th scope="col">uploaded</th>
                    {/* <th scope="col">version</th> */}
                    <th scope="col">sessions</th>
                </tr>
            </thead>
            <tbody>
                {insertRows()}
            </tbody>
        </table>
    )
}