import * as d3 from 'd3';

export default function timeline(svg, data, eventOnClick, timelineZoom, timelinePan, setZoom, setPan) {

    var width = window.innerWidth;
    var height = window.innerHeight;
    var dotSize = 20;
    var durationLabelOffset = 0;

    // scale according to shortest duration (so that its length stays at 100)
    var sacleFactorX = 5 / data.meta.minDuration;
    var zoomInnerLimit = sacleFactorX * 3;
    var zoomOuterLimit = 0;
    var textFadeThreshold = sacleFactorX / 4;

    // const color = d3.scaleOrdinal(data.meta.types, d3.schemeTableau10)

    svg.attr('viewBox', [-width / 20, -height / 2.5, width, height]);
    svg.selectAll('*').remove();

    // baseline
    svg.append('line').attr('x1', 0).attr('x2', data.meta.totalTime * sacleFactorX).attr('stroke', 'grey').attr('stroke-width', dotSize / 5).attr('transform', 'translate(' + timelinePan + ') scale(' + timelineZoom + ' 1)');

    // wrapper for event representations
    var sequence = svg.append('g').classed('wrapper', true).attr('transform', 'translate(' + timelinePan + ')');

    // event representation
    var event = sequence.selectAll('g').data(data.events).join('g').classed('event', true).attr('transform', function (_ref, i) {
        var timestamp = _ref.timestamp,
            duration = _ref.duration;
        return 'translate(' + sacleFactorX * timestamp * timelineZoom + ',' + (duration === 0 ? -dotSize * 1.5 : 0) + ')';
    }).on('mouseover', function handleHover(e, d) {
        d3.select(this).select('circle').attr('stroke', 'black').attr('stroke-width', 2);

        // attach event details
        d3.select(this).selectAll('.details').data(function (d) {
            return d.extra;
        }).join('text').classed('details', true).text(function (d) {
            return d;
        }).attr('dy', function (d, i) {
            return i * 1.3 + 'em';
        }).attr('transform', 'translate(' + -dotSize + ',' + 2 * dotSize + ')').attr('font-size', dotSize / 1.5);
    }).on('mouseout', function handleUnhover(e, d) {
        d3.select(this).select('circle')
        // .transition()
        .attr('stroke', 'white').attr('stroke-width', 1);

        d3.select(this).selectAll('.details').remove();
    }).on('click', function handleClick(e, d) {

        eventOnClick(d);
    });

    // draw node
    event.append('circle').attr('r', dotSize).attr('stroke', 'white').attr('stroke-width', 1).attr('fill', function (_ref2) {
        var type = _ref2.type;
        return data.meta.types[type];
    });

    // event name
    event.append('text').classed('title', true).text(function (_ref3) {
        var detail = _ref3.detail,
            type = _ref3.type;
        return type + ' @ ' + detail;
    }) // replace with dynamic data
    .attr('transform', 'rotate(-30) translate(' + dotSize * 1.2 + ')').attr('font-size', dotSize).attr('fill', timelineZoom >= textFadeThreshold ? '#000' : '#0000');

    // event duration
    event.append('text').classed('duration', true).text(function (_ref4) {
        var duration = _ref4.duration;
        return duration === 0 ? '' : duration + 's';
    }) // replace with dynamic data
    .attr('transform', function (_ref5) {
        var duration = _ref5.duration;
        return 'translate(' + ((duration * sacleFactorX / 2 + durationLabelOffset) * timelineZoom - dotSize / 2) + ',' + dotSize * 1.5 + ')';
    }).attr('font-size', dotSize).attr('fill', timelineZoom >= textFadeThreshold ? '#000' : '#0000');

    // zoom behavior
    var zoomLv = void 0,
        panLv = void 0;
    function handleZoom(e) {
        zoomLv = e.transform.k;
        panLv = e.transform.x;

        // pan behavior
        d3.select('.wrapper').attr('transform', 'translate(' + panLv + ')');

        // zoom behavior
        d3.selectAll('.event')
        // .filter(function () { return !this.classList.contains('duration') })
        .attr('transform', function (_ref6) {
            var timestamp = _ref6.timestamp,
                duration = _ref6.duration;
            return 'translate(' + sacleFactorX * timestamp * zoomLv + ',' + (duration === 0 ? -dotSize * 1.5 : 0) + ')';
        });
        d3.selectAll('.duration').attr('transform', function (_ref7) {
            var duration = _ref7.duration;
            return 'translate(' + ((duration * sacleFactorX / 2 + durationLabelOffset) * zoomLv - dotSize / 2) + ',' + dotSize * 1.5 + ')';
        }).transition().duration(200).attr('fill', zoomLv >= textFadeThreshold ? '#000' : '#0000');
        d3.selectAll('.title').transition().duration(200).attr('fill', zoomLv >= textFadeThreshold ? '#000' : '#0000');
        d3.select('svg line').attr('transform', 'translate(' + panLv + ') scale(' + zoomLv + ' 1)');
    }

    function recordZoom(e) {
        // console.log(zoomLv, panLv)
        setZoom(zoomLv);
        setPan(panLv);
    }

    var zoom = d3.zoom().on('zoom', handleZoom).scaleExtent([zoomOuterLimit, zoomInnerLimit]).on('end', recordZoom);
    svg.call(zoom);
}