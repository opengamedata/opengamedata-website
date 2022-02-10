import * as d3 from "d3";
import { reducedDummy } from "../../../constants";
import { useD3 } from "../../../hooks/useD3";
import ForceGraph from "./forceGraph";


export default function JobGraph({ data }) {

    // console.log(data)
    

    const ref = useD3((svg) => {
        // const circle = svg.selectAll('circle')
        //     .data([1, 2, 3])
        //     .enter()
        //     .insert('circle')
        //     .attr('cx', d => 30 * d)
        //     .attr('cy', 250) // position encoding on job number
        //     .attr('r', 10) // ? size encoding on job complete ratio
        //     .attr('fill', 'pink') // color encoding on playtime


        const chart = ForceGraph(reducedDummy, {
            nodeId: d => d.id,
            nodeGroup: d => d.group,
            nodeTitle: d => `${d.id}\n${d.group}`,
            linkStrokeWidth: l => Math.sqrt(l.value),
            width: 1000,
            height: 600,
            // invalidation // a promise to stop the simulation when the cell is re-run
            parent: svg
        })

        // const json = circle.append('p').text(JSON.stringify(data))

    }, [data, reducedDummy])

    return (
        <>
            <svg
                ref={ref}
                className="h-96 w-full mx-0"
            >
            </svg>
        </>


    )
}