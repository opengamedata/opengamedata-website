import * as d3 from "d3";
import { reducedDummy } from "../../../constants";
import { useD3 } from "../../../hooks/useD3";
import ForceGraph from "./forceGraph";
import { useEffect } from "react";

/**
 * force directed graph component for Aqualab job-level data
 * @param {Object} data parsed data object 
 * @returns 
 */
export default function JobGraph({ data }) {

    /**
     * function that maps average complete time to radius
     */
    const projectRadius = d3.scaleLinear()
        .domain([data.meta.minAvgTime, data.meta.maxAvgTime])
        .range([3, 20])

    const ref = useD3((svg) => {

        const chart = ForceGraph(data, {
            nodeId: d => d.id,
            nodeGroup: d => d['JobsAttempted-num-completes'] / (d['JobsAttempted-num-starts'] === '0' ? 1 : d['JobsAttempted-num-starts']),
            nodeTitle: d => d['JobsAttempted-job-name'],
            nodeDetail: d => `${d['JobsAttempted-num-completes']} of ${d['JobsAttempted-num-starts']} (${parseFloat(d['JobsAttempted-percent-complete']).toFixed(2)}%) players completed this job
average time to complete: ${parseFloat(d['JobsAttempted-avg-time-complete']).toFixed()}s
standard deviation: ${parseFloat(d['JobsAttempted-std-dev-complete']).toFixed(2)}`,
            nodeRadius: d => projectRadius(d['JobsAttempted-avg-time-complete']),
            // nodeRadius: d => 7,
            // nodeRadius: d => {
            //     console.log(d['JobsAttempted-avg-time-complete'])
            //     return d['JobsAttempted-avg-time-complete']
            // },
            linkStrokeWidth: l => Math.sqrt(l.value),
            linkDetail: l => `${l.value} players moved from ${l.sourceName} to ${l.targetName}`,
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