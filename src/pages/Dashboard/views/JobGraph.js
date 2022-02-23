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
            nodeDetails: d => `${d.JobCompleteCount} of ${d.JobStartCount} (${(100 * d.JobCompleteCount / (d.JobStartCount === '0' ? 1 : d.JobStartCount)).toFixed(2)}%) players completed this job`,
            // nodeRadius: d=> d.time,
            linkStrokeWidth: l => Math.sqrt(l.value),
            linkTitle: l => `${l.value} players moved from ${l.sourceName} to ${l.targetName}`,
            // linkStrength: .1,
            linkDistance: 50,
            nodeStrength: -5,
            // invalidation // a promise to stop the simulation when the cell is re-run
            parent: svg
        })

        // const json = circle.append('p').text(JSON.stringify(data))

    }, [data])

    return (
        <>
            <svg
                ref={ref}
                className="w-full mx-0"
            >
            </svg>
        </>


    )
}