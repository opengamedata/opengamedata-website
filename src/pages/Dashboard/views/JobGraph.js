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

        const chart = ForceGraph(data, {
            nodeId: d => d.id,
            nodeGroup: d => d.JobCompleteCount / (d.JobStartCount === '0' ? 1 : d.JobStartCount),
            nodeTitle: d => d.JobName,
            // linkStrokeWidth: l => l.value,
            linkStrokeWidth: l => Math.sqrt(l.value),
            linkTitle: l => `${l.value} players moved from ${l.source} to ${l.target}`,
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