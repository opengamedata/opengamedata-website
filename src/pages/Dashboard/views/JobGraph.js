import * as d3 from "d3";
import { useEffect, useState } from "react";
import { reducedDummy } from "../../../dummies";
import { useD3 } from "../../../hooks/useD3";

/**
 * force directed graph component for Aqualab job-level data
 * @param {Object} data parsed data object 
 * @returns 
 */
export default function JobGraph({ rawData, loading, updateViewMetrics }) {

    const data = reducedDummy
    // const data = convert(rawData)

    const [linkMode, setLinkMode] = useState(1)

    const toTaskGraph = (viewMetrics) => {
        console.log(viewMetrics)

    }

    const toPlayerTimeLine = (viewMetrics) => {
        console.log(viewMetrics)
    }

    /**
     * function that maps average complete time to radius
     */
    const projectRadius = d3.scaleLinear()
        .domain([data.meta.minAvgTime, data.meta.maxAvgTime])
        .range([3, 20])

    /**
     * draws the force directed graph on aqualab jobs
     */
    const ref = useD3((svg) => {

        const chart = ForceGraph(data, {
            nodeId: d => d.id,
            nodeGroup: d => d['JobsAttempted-num-completes'] / (d['JobsAttempted-num-starts'] === '0' ? 1 : d['JobsAttempted-num-starts']),
            nodeTitle: d => d['JobsAttempted-job-name'],
            nodeDetail: d => `${d['JobsAttempted-num-completes']} of ${d['JobsAttempted-num-starts']} (${parseFloat(d['JobsAttempted-percent-complete']).toFixed(2)}%) players completed this job
 average time to complete: ${parseFloat(d['JobsAttempted-avg-time-complete']).toFixed()}s
 standard deviation: ${parseFloat(d['JobsAttempted-std-dev-complete']).toFixed(2)}`,
            nodeRadius: d => projectRadius(d['JobsAttempted-avg-time-complete']),
            linkStrokeWidth: l => Math.sqrt(l.value),
            linkDetail: l => `${l.value} players moved from ${l.sourceName} to ${l.targetName}`,
            linkStrength: 1,
            linkDistance: 100,
            nodeStrength: -1000,
            parent: svg,
            nodeClick: ''
        })
    }, [data])






    /* manipulate raw data to a format to be used by the vis views */
    const convert = (rawData) => {

        // metadata
        const meta = {
            SessionCount: rawData.SessionCount,
            maxAvgTime: 0,
            minAvgTime: Infinity
        }

        // nodes
        let nodeBuckets = {}
        for (const [key, value] of Object.entries(rawData)) {
            if (key === 'TopJobDestinations' || key === 'SessionCount') continue

            const [k, metric] = key.split('_')
            console.log(`${k}'s ${metric}: ${value}`);

            if (!nodeBuckets.hasOwnProperty(k)) nodeBuckets[k] = { id: k }

            if (metric === 'JobsAttempted-avg-time-complete') {
                if (parseFloat(value) > meta.maxAvgTime) meta.maxAvgTime = parseFloat(value)
                if (parseFloat(value) < meta.minAvgTime) meta.minAvgTime = parseFloat(value)
            }

            nodeBuckets[k][metric] = value
        }

        // links
        let l = []
        const rawLinks = JSON.parse(rawData.TopJobDestinations.replaceAll('\'', '\"').replaceAll('(', '[').replaceAll(')', ']'))
        for (const [key, value] of Object.entries(rawLinks)) {
            // console.log('link', key, value)

            value.forEach(target => {
                l.push({
                    source: key === 'None' ? 'start' : `job${key}`,
                    sourceName: nodeBuckets[`job${key}`]['JobsAttempted-job-name'],
                    target: target[0] === 'None' ? 'start' : `job${target[0]}`,
                    targetName: nodeBuckets[`job${target[0]}`]['JobsAttempted-job-name'],
                    value: target[1]
                })
            });
        }
        // console.log(nodeBuckets)

        return { nodes: Object.values(nodeBuckets), links: l, meta: meta }

    }


    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // modified from https://observablehq.com/@d3/force-directed-graph
    function ForceGraph({
        nodes, // an iterable of node objects (typically [{id}, …])
        links // an iterable of link objects (typically [{source, target}, …])
    }, {
        nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup, // given d in nodes, returns an (ordinal) value for color
        nodeGroups, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeDetail, // text displayed when hover over node d
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 2, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 5, // node radius, in pixels
        nodeStrength, // force (charge) among nodes
        linkSource = ({ source }) => source, // given d in links, returns a node identifier string
        linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
        linkDetail, // text displayed when hover over link d
        linkStroke = "#999", // link stroke color
        linkStrokeOpacity = 0.6, // link stroke opacity
        linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength,
        linkDistance,
        colors = d3.interpolateRdYlGn, // an array of color values, for the node groups
        width = 1600, // outer width, in pixels
        height = 900, // outer height, in pixels
        invalidation, // when this promise resolves, stop the simulation
        parent,

        } = {}) {
        // Compute values.
        const N = d3.map(nodes, nodeId).map(intern);
        const LS = d3.map(links, linkSource).map(intern);
        const LT = d3.map(links, linkTarget).map(intern);
        if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
        const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
        if (nodeDetail === undefined) nodeDetail = (_, i) => N[i];
        const D = nodeDetail == null ? null : d3.map(nodes, nodeDetail);
        const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
        if (!nodeRadius) nodeRadius = (_, i) => N[i]
        const R = nodeRadius == null ? null : d3.map(nodes, nodeRadius)

        const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
        const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
        if (linkDetail === undefined) linkDetail = (_, i) => LS[i];
        const TP = linkDetail == null ? null : d3.map(links, linkDetail) // tooltips


        // Replace the input nodes and links with mutable objects for the simulation.
        nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
        links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

        // Compute default domains.
        if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

        // Construct the scales.
        const color = nodeGroup == null ? null : d3.scaleSequential(colors);

        // Construct the forces.
        const forceNode = d3.forceManyBody();
        const forceLink = d3.forceLink(links).id(({ index: i }) => N[i]);
        if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
        if (linkStrength !== undefined) forceLink.strength(linkStrength);
        if (linkDistance !== undefined) forceLink.distance(linkDistance);


        const svg = parent
            .attr("viewBox", [-width / 2, -height / 2, width, height])

        svg.selectAll('*').remove();

        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 30)
            .attr('refY', -1.5)
            .attr('orient', 'auto')
            .attr('markerUnits', 'userSpaceOnUse')
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('xoverflow', 'visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#888')
            .style('stroke', 'none');

        // links - visual representation of player progression
        const link = svg.append("g")
            .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
            .attr("stroke-opacity", linkStrokeOpacity)
            .attr("stroke-linecap", linkStrokeLinecap)
            .attr("fill", 'transparent')
            .selectAll("path")
            .data(links)
            .join("path")
            .attr('marker-end', 'url(#arrowhead)')
            .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
            .on('click', handleLinkClick)
            .on('mouseover', handleNodeHover)
            .on('mouseout', handleNodeUnhover);

        function handleLinkClick(e, d) {
            toPlayerTimeLine(d)

            // list of sessions associated with the link
        }


        const simulation = d3.forceSimulation(nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("center", d3.forceCenter())
            .on("tick", ticked);

        // nodes - visual representation of jobs 
        const node = svg.append("g")
            .attr("fill", nodeFill)
            .attr("stroke", nodeStroke)
            .attr("stroke-opacity", nodeStrokeOpacity)
            .attr("stroke-width", nodeStrokeWidth)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", 5)
            .call(drag(simulation))
            .on('click', handleNodeClick)
            .on('mouseover', handleNodeHover)
            .on('mouseout', handleNodeUnhover);


        function handleNodeClick(e, d) {
            toTaskGraph(d.id)
        };

        function handleNodeHover(e, d) {
            d3.select(this)
                .classed('cursor-pointer', true)

            // display node details
        }
        function handleNodeUnhover(e, d) {
            d3.select(this)
                .classed('cursor-pointer', false)
        }

        // node names
        const text = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .join('text')
            .text(({ index: i }) => T[i])
            .attr('font-size', 8)
            .attr('stroke', 'white')
            .attr('stroke-width', .2)
            .attr('fill', 'black')


        if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
        if (L) link.attr("stroke", ({ index: i }) => L[i]);
        if (TP) link.append('title').text(({ index: i }) => TP[i]);
        if (G) node.attr("fill", ({ index: i }) => color(G[i]));
        if (R) node.attr('r', ({ index: i }) => R[i]);
        if (T) node.append("title").text(({ index: i }) => D[i]);
        if (invalidation != null) invalidation.then(() => simulation.stop());

        function intern(value) {
            return value !== null && typeof value === "object" ? value.valueOf() : value;
        }

        function positionLink(d) {
            const offset = 10;

            const midpoint_x = (d.source.x + d.target.x) / 2;
            const midpoint_y = (d.source.y + d.target.y) / 2;

            const dx = (d.target.x - d.source.x);
            const dy = (d.target.y - d.source.y);

            const normalise = Math.sqrt((dx * dx) + (dy * dy));

            const offSetX = midpoint_x + offset * (dy / normalise);
            const offSetY = midpoint_y - offset * (dx / normalise);

            return "M" + d.source.x + "," + d.source.y +
                "S" + offSetX + "," + offSetY +
                " " + d.target.x + "," + d.target.y;
        }

        function ticked() {
            link.attr("d", positionLink)

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            text
                .attr("x", ({ index: i, x: x }) => x + R[i] + 3)
                .attr("y", d => d.y);
        }

        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        function handleZoom(e) {
            // apply transform to the chart
            text.attr('transform', e.transform);
            node.attr('transform', e.transform);
            link.attr('transform', e.transform);
        }

        const zoom = d3.zoom()
            .on('zoom', handleZoom);

        svg.call(zoom);

        return Object.assign(svg.node(), { scales: { color } });
    }

    return (
        <>
            <svg ref={ref} className="w-full border-b" ></svg>
            <div className="fixed bottom-3 left-3 font-light text-sm">
                <fieldset className="block">
                    <legend >Show paths of players who</legend>
                    <div className="mt-2">
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    className="form-radio"
                                    type="radio"
                                    name="radio-direct"
                                    checked={linkMode === '1'}
                                    onChange={(e) => { setLinkMode(e.currentTarget.value) }}
                                    value="1" />
                                <span className="ml-2">finished the Job</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    className="form-radio"
                                    type="radio"
                                    name="radio-direct"
                                    checked={linkMode === '2'}
                                    onChange={(e) => { setLinkMode(e.currentTarget.value) }}
                                    value="2" />
                                <span className="ml-2">left a job</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    className="form-radio"
                                    type="radio"
                                    name="radio-direct"
                                    checked={linkMode === '3'}
                                    onChange={(e) => { setLinkMode(e.currentTarget.value) }}
                                    value="3" />
                                <span className="ml-2">still in progress</span>
                            </label>
                        </div>
                    </div>
                </fieldset>
                <p className="mt-2">Session Count: {data.meta.SessionCount} </p>
            </div>
            {loading ?
                <div className="w-screen h-screen z-1 backdrop-blur-md"></div>
                :
                <></>
            }
        </>


    )

}