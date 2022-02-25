import * as d3 from "d3";
import { reducedDummy } from "../../../constants";
import { useD3 } from "../../../hooks/useD3";
import ForceGraph from "./forceGraph";
import { useEffect } from "react";


export default function JobGraph({ data }) {

    const projectRadius = d3.scaleLinear()
        .domain([data.meta.minAvgTime, data.meta.maxAvgTime])
        .range([3, 10])

    const ref = useD3((svg) => {

        const chart = ForceGraph(data, {
            nodeId: d => d.id,
            nodeGroup: d => d.JobCompleteCount / (d.JobStartCount === '0' ? 1 : d.JobStartCount),
            nodeTitle: d => d.JobName,
            nodeDetails: d => `${d.JobCompleteCount} of ${d.JobStartCount} (${(100 * d.JobCompleteCount / (d.JobStartCount === '0' ? 1 : d.JobStartCount)).toFixed(2)}%) players completed this job
average time to complete: ${parseFloat(d['JobsAttempted-avg-time-complete']).toFixed(2)}
standard deviation: ${parseFloat(d['JobsAttempted-std-dev-complete']).toFixed(2)}`,
            nodeRadius: d => projectRadius(d['JobsAttempted-avg-time-complete']),
            // nodeRadius: d => 7,
            // nodeRadius: d => {
            //     console.log(d['JobsAttempted-avg-time-complete'])
            //     return d['JobsAttempted-avg-time-complete']
            // },
            linkStrokeWidth: l => Math.sqrt(l.value),
            linkTitle: l => `${l.value} players moved from ${l.sourceName} to ${l.targetName}`,
            linkStrength: 1,
            linkDistance: 100,
            nodeStrength: -1000,
            // invalidation // a promise to stop the simulation when the cell is re-run
            parent: svg
        })
    }, [data])



    return (
        <>
            <svg ref={ref} className="w-full" ></svg>
            <div className="fixed bottom-3 left-3 font-light text-sm">
                <p className="">Session Count: {data.meta.SessionCount} </p>
            </div>
        </>


    )
}