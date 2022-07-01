import * as d3 from 'd3'
import { select } from 'd3';

    // Definition of directed force diagram used in our visualization

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// modified from https://observablehq.com/@d3/force-directed-graph
function ForceGraph({
    nodes, // an iterable of node objects (typically [{id}, …])
    links, // an iterable of link objects (typically [{source, target}, …])
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
    linkStroke, // link stroke color, no color when showing jobs in progress
    outLinks,
    outLinkWidth,
    outLinkDetail,
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    linkDistance,
    colors = d3.interpolateRdYlGn, // an array of color values, for the node groups
    width = window.innerWidth, // outer width, in pixels
    height = window.innerHeight, // outer height, in pixels
    invalidation, // when this promise resolves, stop the simulation
    parent,

    } = {},
    showPlayersList
) {

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    // Compute values.
    const N = d3.map(nodes, nodeId).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    if (nodeDetail === undefined) nodeDetail = (_, i) => N[i];
    const ND = nodeDetail == null ? null : d3.map(nodes, nodeDetail);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    if (!nodeRadius) nodeRadius = (_, i) => N[i]
    const R = nodeRadius == null ? null : d3.map(nodes, nodeRadius)

    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
    if (linkDetail === undefined) linkDetail = (_, i) => LS[i];
    const LD = linkDetail == null ? null : d3.map(links, linkDetail) // tooltips

    const OW = typeof outLinkWidth !== "function" ? null : d3.map(nodes, outLinkWidth);     // outLink width
    if (outLinkDetail === undefined) outLinkDetail = (_, i) => N[i];
    const OD = outLinkDetail == null ? null : d3.map(nodes, outLinkDetail);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
    links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i] }));

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

    // Construct color scales.
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

    // definition of arrowheads that marks the direction of a link
    const arrow = svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', outLinks ? 8 : 30)
        .attr('refY', outLinks ? 0 : -1)
        .attr('orient', 'auto')
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', typeof linkStroke !== "function" ? linkStroke : '#999')
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
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)

    // attach arrowheads to end of paths
    // when linkMode is set to activeJobs, attach to outEdges 
    let outEdge
    if (outLinks) {
        outEdge = svg.append('g')
            .selectAll('line')
            .data(nodes)
            .join('line')
            // .attr('pathLength', 50)
            .attr('stroke', '#999')
            .attr('stroke-width', 5)
            .attr("stroke-opacity", linkStrokeOpacity)
            .attr('marker-end', 'url(#arrowhead)')
            .on('click', handleLinkClick)
            .on('mouseover', handleNodeHover)
            .on('mouseout', handleNodeUnhover);
    }

    else {
        link.attr('marker-end', 'url(#arrowhead)')
            .on('click', handleLinkClick)
            .on('mouseover', handleNodeHover)
            .on('mouseout', handleNodeUnhover);
    }
    function handleLinkClick(e, d) {
        showPlayersList(d)
    }

        // simulates attraction and repulsion among nodes and links
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
        // .on('click', handleNodeClick)
        .on('mouseover', handleNodeHover)
        .on('mouseout', handleNodeUnhover);

        // function handleNodeClick(e, d) {
        //     toTaskGraph(d.id)
        // };

    function handleNodeHover(e, d) {
        d3.select(this)
            .classed('cursor-pointer', true)

        // display node details
    }
    function handleNodeUnhover(e, d) {
        d3.select(this)
            .classed('cursor-pointer', false)
    }

        // node name labels
    const text = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(({ index: i }) => T[i])
        .attr('font-size', 8)
        // .attr('stroke', 'white')
        // .attr('stroke-width', .2)
        .attr('fill', 'black')




    if (W) link.attr("stroke-width", ({ index: i }) => W[i]);
    if (L) link.attr("stroke", ({ index: i }) => L[i]);
    if (LD) link.append('title').text(({ index: i }) => LD[i]);
    if (G) node.attr("fill", ({ index: i }) => color(G[i]));
    if (R) node.attr('r', ({ index: i }) => R[i]);
    if (T) node.append("title").text(({ index: i }) => ND[i]);
    if (OW) outEdge.attr("stroke-width", ({ index: i }) => OW[i]);
    if (OW) outEdge.append("title").text(({ index: i }) => OD[i]);

    if (invalidation != null) invalidation.then(() => simulation.stop());


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

        // update the coordinates of each graphical element
    function ticked() {
        link.attr("d", positionLink)

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text
            .attr("x", ({ index: i, x: x }) => x + R[i] + 3)
            .attr("y", d => d.y);

        if (outLinks)
            outEdge
                .attr("x1", ({ x }) => x)
                .attr("y1", d => d.y)
                .attr("x2", ({ x }) => x + 25)
                .attr("y2", d => d.y + 25)
    }

        // drag behavior for nodes
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

        // pan and zoom
    function handleZoom(e) {
        // apply transform to chart
        text.attr('transform', e.transform);
        node.attr('transform', e.transform);
        link.attr('transform', e.transform);
        if (outLinks) outEdge.attr('transform', e.transform);
    }
    const zoom = d3.zoom()
        .on('zoom', handleZoom);

    svg.call(zoom);

    return Object.assign(svg.node(), { scales: { color } });
}

export default ForceGraph