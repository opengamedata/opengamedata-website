import * as d3 from "d3";
import { reducedDummy } from "../../../constants";
import { useD3 } from "../../../hooks/useD3";
import ForceGraph from "./forceGraph";
import { useEffect } from "react";


export default function JobGraph({ data }) {

    // useEffect(() => {
    //     console.log('reload')
    // }, [])

    const ref = useD3((svg) => {
        // const circle = svg.selectAll('circle')
        //     .data([1, 2, 3,4])
        //     .enter()
        //     .insert('circle')
        //     .attr('cx', d => 30 * d)
        //     .attr('cy', 250) // position encoding on job number
        //     .attr('r', 10) // ? size encoding on job complete ratio
        //     .attr('fill', 'pink') // color encoding on playtime


        const chart = ForceGraph(reducedDummy, {
            nodeId: d => d.id,
            nodeGroup: d => d.avgTime,
            nodeTitle: d => `name: ${d.id}\navg. playtime: ${d.avgTime}`,
            linkStrokeWidth: l => Math.sqrt(l.value),
            linkTitle: l => l.value,
            // width: 500,
            // height: 300,
            // invalidation // a promise to stop the simulation when the cell is re-run
            parent: svg
        })

        // const json = circle.append('p').text(JSON.stringify(data))

    }, [data])

    return (
        <>
            <svg
                ref={ref}
                className="w-full h-full mx-0"
            >
            </svg>
        </>


    )
}