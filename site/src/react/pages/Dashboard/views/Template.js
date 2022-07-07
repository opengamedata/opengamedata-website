import { Fragment } from 'react'
import * as d3 from "d3";
import { useD3 } from "../../../hooks/useD3";


export default function Template({ data }) {
    const diagram = useD3((svg) => {
        const circle = svg.insert('circle')
            .attr('cx', 10)
            .attr('cy', 10)
            .attr('r', 10)

        // const json = circle.append('p').text(JSON.stringify(data))

    }, [data])

    return (
        <Fragment>
            <svg
                ref={diagram}
                className="h-96 w-full mx-0"
            >
            </svg>
        </Fragment>


    )
}