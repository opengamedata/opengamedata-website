import * as d3 from "d3";

export default function timeline(svg, data) {

    const width = window.innerWidth
    const height = window.innerHeight
    const dotSize = 20
    const durationLabelOffset = 0

    // scale according to shortest duration (so that its length stays at 100)
    const sacleFactorX = 5 / (data.meta.minDuration)

    const color = d3.scaleOrdinal(data.meta.types, d3.schemeTableau10)

    svg.attr("viewBox", [-width / 20, -height / 2, width, height])
    svg.selectAll('*').remove();

    // baseline
    svg.append('line')
        .attr('x1', 0)
        .attr('x2', (data.meta.totalTime) * sacleFactorX)
        .attr('stroke', 'grey')
        .attr('stroke-width', dotSize / 5)

    // wrapper for event representations
    const sequence = svg
        .append('g')
        .classed('wrapper', true)

    // event representation
    const event = sequence
        .selectAll('g')
        .data(data.events)
        .join('g')
        .classed('event', true)
        .attr('transform', ({ timestamp }, i) => `translate(${sacleFactorX * timestamp})`)
        .on('mouseover', function handleHover(e, d) {
            d3.select(this).select('circle')
                // .transition()
                .attr('stroke', 'black')
                .attr('stroke-width', 2)

            // attach event details
            d3.select(this)
                .selectAll('.details')
                .data(d => d.extra) // replace with dynamic data
                .join('text')
                .classed('details', true)
                .text(d => d)
                .attr('dy', (d, i) => `${i * 1.3}em`)
                .attr('transform', `translate(${-dotSize},${3 * dotSize})`)
                .attr('font-size', dotSize)
        })
        .on('mouseout', function handleUnhover(e, d) {
            d3.select(this).select('circle')
                // .transition()
                .attr('stroke', 'white')
                .attr('stroke-width', 1)

            d3.select(this).selectAll('.details').remove()
        })

    // draw node
    event.append('circle')
        .attr('r', dotSize)
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('fill', ({ type }) => color(type))

    // event name
    event.append('text')
        .classed('title', true)
        .text(({ name, type }) => `${type} @ ${name}`) // replace with dynamic data
        .attr('transform', `rotate(-45) translate(${dotSize * 1.5})`)
        .attr('font-size', dotSize)

    // event duration
    event.append('text')
        .classed('duration', true)
        .text(({ duration }) => `${duration}s`) // replace with dynamic data
        .attr('transform', ({ duration }) => `translate(${duration * sacleFactorX / 2 - dotSize / 2 + durationLabelOffset} ${dotSize * 1.5})`)
        .attr('font-size', dotSize)

    // zoom behavior
    function handleZoom(e) {
        // pan behavior
        d3.select('.wrapper')
            // .attr('transform', `translate(${e.transform.x}) scale(${e.transform.k})`);
            .attr('transform', `translate(${e.transform.x})`)

        // zoom
        d3.selectAll('.event')
            // .filter(function () { return !this.classList.contains('duration') })
            .attr('transform', ({ timestamp }) => `translate(${sacleFactorX * timestamp * e.transform.k})`)
        d3.selectAll('.duration')
            .attr('transform', ({ duration }) => `translate(${(duration * sacleFactorX / 2 + durationLabelOffset) * e.transform.k - dotSize / 2},${dotSize * 1.5})`)
        d3.select('svg line')
            .attr('transform', `translate(${e.transform.x}) scale(${e.transform.k} 1)`);
    }
    let zoom = d3.zoom()
        .on('zoom', handleZoom);
    svg
        .call(zoom);

}