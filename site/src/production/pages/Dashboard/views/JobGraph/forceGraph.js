var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import * as d3 from 'd3';
import { select } from 'd3';

// Definition of directed force diagram used in our visualization

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// modified from https://observablehq.com/@d3/force-directed-graph
function ForceGraph(_ref) {
    var nodes = _ref.nodes,
        links = _ref.links;

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$nodeId = _ref2.nodeId,
        nodeId = _ref2$nodeId === undefined ? function (d) {
        return d.id;
    } : _ref2$nodeId,
        nodeGroup = _ref2.nodeGroup,
        nodeGroups = _ref2.nodeGroups,
        nodeTitle = _ref2.nodeTitle,
        nodeDetail = _ref2.nodeDetail,
        _ref2$nodeFill = _ref2.nodeFill,
        nodeFill = _ref2$nodeFill === undefined ? "currentColor" : _ref2$nodeFill,
        _ref2$nodeStroke = _ref2.nodeStroke,
        nodeStroke = _ref2$nodeStroke === undefined ? "#fff" : _ref2$nodeStroke,
        _ref2$nodeStrokeWidth = _ref2.nodeStrokeWidth,
        nodeStrokeWidth = _ref2$nodeStrokeWidth === undefined ? 2 : _ref2$nodeStrokeWidth,
        _ref2$nodeStrokeOpaci = _ref2.nodeStrokeOpacity,
        nodeStrokeOpacity = _ref2$nodeStrokeOpaci === undefined ? 1 : _ref2$nodeStrokeOpaci,
        _ref2$nodeRadius = _ref2.nodeRadius,
        nodeRadius = _ref2$nodeRadius === undefined ? 5 : _ref2$nodeRadius,
        nodeStrength = _ref2.nodeStrength,
        _ref2$linkSource = _ref2.linkSource,
        linkSource = _ref2$linkSource === undefined ? function (_ref3) {
        var source = _ref3.source;
        return source;
    } : _ref2$linkSource,
        _ref2$linkTarget = _ref2.linkTarget,
        linkTarget = _ref2$linkTarget === undefined ? function (_ref4) {
        var target = _ref4.target;
        return target;
    } : _ref2$linkTarget,
        linkDetail = _ref2.linkDetail,
        linkStroke = _ref2.linkStroke,
        outLinks = _ref2.outLinks,
        outLinkWidth = _ref2.outLinkWidth,
        outLinkDetail = _ref2.outLinkDetail,
        _ref2$linkStrokeOpaci = _ref2.linkStrokeOpacity,
        linkStrokeOpacity = _ref2$linkStrokeOpaci === undefined ? 0.6 : _ref2$linkStrokeOpaci,
        _ref2$linkStrokeWidth = _ref2.linkStrokeWidth,
        linkStrokeWidth = _ref2$linkStrokeWidth === undefined ? 1.5 : _ref2$linkStrokeWidth,
        _ref2$linkStrokeLinec = _ref2.linkStrokeLinecap,
        linkStrokeLinecap = _ref2$linkStrokeLinec === undefined ? "round" : _ref2$linkStrokeLinec,
        linkStrength = _ref2.linkStrength,
        linkDistance = _ref2.linkDistance,
        _ref2$colors = _ref2.colors,
        colors = _ref2$colors === undefined ? d3.interpolateRdYlGn : _ref2$colors,
        _ref2$width = _ref2.width,
        width = _ref2$width === undefined ? window.innerWidth : _ref2$width,
        _ref2$height = _ref2.height,
        height = _ref2$height === undefined ? window.innerHeight : _ref2$height,
        invalidation = _ref2.invalidation,
        parent = _ref2.parent;

    var showPlayersList = arguments[2];


    function intern(value) {
        return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object" ? value.valueOf() : value;
    }

    // Compute values.
    var N = d3.map(nodes, nodeId).map(intern);
    var LS = d3.map(links, linkSource).map(intern);
    var LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = function nodeTitle(_, i) {
        return N[i];
    };
    var T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    if (nodeDetail === undefined) nodeDetail = function nodeDetail(_, i) {
        return N[i];
    };
    var ND = nodeDetail == null ? null : d3.map(nodes, nodeDetail);
    var G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    if (!nodeRadius) nodeRadius = function nodeRadius(_, i) {
        return N[i];
    };
    var R = nodeRadius == null ? null : d3.map(nodes, nodeRadius);

    var W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    var L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
    if (linkDetail === undefined) linkDetail = function linkDetail(_, i) {
        return LS[i];
    };
    var LD = linkDetail == null ? null : d3.map(links, linkDetail); // tooltips

    var OW = typeof outLinkWidth !== "function" ? null : d3.map(nodes, outLinkWidth); // outLink width
    if (outLinkDetail === undefined) outLinkDetail = function outLinkDetail(_, i) {
        return N[i];
    };
    var OD = outLinkDetail == null ? null : d3.map(nodes, outLinkDetail);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, function (_, i) {
        return { id: N[i] };
    });
    links = d3.map(links, function (_, i) {
        return { source: LS[i], target: LT[i] };
    });

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

    // Construct color scales.
    var color = nodeGroup == null ? null : d3.scaleSequential(colors);

    // Construct the forces.
    var forceNode = d3.forceManyBody();
    var forceLink = d3.forceLink(links).id(function (_ref5) {
        var i = _ref5.index;
        return N[i];
    });
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);
    if (linkDistance !== undefined) forceLink.distance(linkDistance);

    var svg = parent.attr("viewBox", [-width / 2, -height / 2, width, height]);

    svg.selectAll('*').remove();

    // definition of arrowheads that marks the direction of a link
    var arrow = svg.append('defs').append('marker').attr('id', 'arrowhead').attr('viewBox', '-0 -5 10 10').attr('refX', outLinks ? 8 : 30).attr('refY', outLinks ? 0 : -1).attr('orient', 'auto').attr('markerUnits', 'userSpaceOnUse').attr('markerWidth', 10).attr('markerHeight', 10).attr('xoverflow', 'visible').append('svg:path').attr('d', 'M 0,-5 L 10 ,0 L 0,5').attr('fill', typeof linkStroke !== "function" ? linkStroke : '#999').style('stroke', 'none');

    // links - visual representation of player progression
    var link = svg.append("g").attr("stroke", typeof linkStroke !== "function" ? linkStroke : null).attr("stroke-opacity", linkStrokeOpacity).attr("stroke-linecap", linkStrokeLinecap).attr("fill", 'transparent').selectAll("path").data(links).join("path").attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null);

    // attach arrowheads to end of paths
    // when linkMode is set to activeJobs, attach to outEdges 
    var outEdge = void 0;
    if (outLinks) {
        outEdge = svg.append('g').selectAll('line').data(nodes).join('line')
        // .attr('pathLength', 50)
        .attr('stroke', '#999').attr('stroke-width', 5).attr("stroke-opacity", linkStrokeOpacity).attr('marker-end', 'url(#arrowhead)').on('click', handleLinkClick).on('mouseover', handleNodeHover).on('mouseout', handleNodeUnhover);
    } else {
        link.attr('marker-end', 'url(#arrowhead)').on('click', handleLinkClick).on('mouseover', handleNodeHover).on('mouseout', handleNodeUnhover);
    }
    function handleLinkClick(e, d) {
        showPlayersList(d);
    }

    // simulates attraction and repulsion among nodes and links
    var simulation = d3.forceSimulation(nodes).force("link", forceLink).force("charge", forceNode).force("center", d3.forceCenter()).on("tick", ticked);

    // nodes - visual representation of jobs 
    var node = svg.append("g").attr("fill", nodeFill).attr("stroke", nodeStroke).attr("stroke-opacity", nodeStrokeOpacity).attr("stroke-width", nodeStrokeWidth).selectAll("circle").data(nodes).join("circle").attr("r", 5).call(drag(simulation))
    // .on('click', handleNodeClick)
    .on('mouseover', handleNodeHover).on('mouseout', handleNodeUnhover);

    // function handleNodeClick(e, d) {
    //     toTaskGraph(d.id)
    // };

    function handleNodeHover(e, d) {
        d3.select(this).classed('cursor-pointer', true);

        // display node details
    }
    function handleNodeUnhover(e, d) {
        d3.select(this).classed('cursor-pointer', false);
    }

    // node name labels
    var text = svg.append('g').selectAll('text').data(nodes).join('text').text(function (_ref6) {
        var i = _ref6.index;
        return T[i];
    }).attr('font-size', 8)
    // .attr('stroke', 'white')
    // .attr('stroke-width', .2)
    .attr('fill', 'black');

    if (W) link.attr("stroke-width", function (_ref7) {
        var i = _ref7.index;
        return W[i];
    });
    if (L) link.attr("stroke", function (_ref8) {
        var i = _ref8.index;
        return L[i];
    });
    if (LD) link.append('title').text(function (_ref9) {
        var i = _ref9.index;
        return LD[i];
    });
    if (G) node.attr("fill", function (_ref10) {
        var i = _ref10.index;
        return color(G[i]);
    });
    if (R) node.attr('r', function (_ref11) {
        var i = _ref11.index;
        return R[i];
    });
    if (T) node.append("title").text(function (_ref12) {
        var i = _ref12.index;
        return ND[i];
    });
    if (OW) outEdge.attr("stroke-width", function (_ref13) {
        var i = _ref13.index;
        return OW[i];
    });
    if (OW) outEdge.append("title").text(function (_ref14) {
        var i = _ref14.index;
        return OD[i];
    });

    if (invalidation != null) invalidation.then(function () {
        return simulation.stop();
    });

    function positionLink(d) {
        var offset = 10;

        var midpoint_x = (d.source.x + d.target.x) / 2;
        var midpoint_y = (d.source.y + d.target.y) / 2;

        var dx = d.target.x - d.source.x;
        var dy = d.target.y - d.source.y;

        var normalise = Math.sqrt(dx * dx + dy * dy);

        var offSetX = midpoint_x + offset * (dy / normalise);
        var offSetY = midpoint_y - offset * (dx / normalise);

        return "M" + d.source.x + "," + d.source.y + "S" + offSetX + "," + offSetY + " " + d.target.x + "," + d.target.y;
    }

    // update the coordinates of each graphical element
    function ticked() {
        link.attr("d", positionLink);

        node.attr("cx", function (d) {
            return d.x;
        }).attr("cy", function (d) {
            return d.y;
        });

        text.attr("x", function (_ref15) {
            var i = _ref15.index,
                x = _ref15.x;
            return x + R[i] + 3;
        }).attr("y", function (d) {
            return d.y;
        });

        if (outLinks) outEdge.attr("x1", function (_ref16) {
            var x = _ref16.x;
            return x;
        }).attr("y1", function (d) {
            return d.y;
        }).attr("x2", function (_ref17) {
            var x = _ref17.x;
            return x + 25;
        }).attr("y2", function (d) {
            return d.y + 25;
        });
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

        return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
    }

    // pan and zoom
    function handleZoom(e) {
        // apply transform to chart
        text.attr('transform', e.transform);
        node.attr('transform', e.transform);
        link.attr('transform', e.transform);
        if (outLinks) outEdge.attr('transform', e.transform);
    }
    var zoom = d3.zoom().on('zoom', handleZoom);

    svg.call(zoom);

    return Object.assign(svg.node(), { scales: { color: color } });
}

export default ForceGraph;