import * as d3 from "d3";
import { useD3 } from "../../../hooks/useD3";



export default function PlayerTimeline({ rawData }) {

    // const data = convert(rawData)
    // const data = convert(mockData)
    const data = [
        { name: 'jump', timeStamp: '0', duration: 10, extra: ['jobID', '7ft', 'sessionID'] },
        { name: 'dive', timeStamp: '10', duration: 4, extra: ['jobID', '300m', 'sessionID'] },
        { name: 'swim', timeStamp: '14', duration: 4, extra: ['jobID', 'freestyle', 'sessionID'] },
        { name: 'run', timeStamp: '18', duration: 10, extra: ['jobID', '100m', 'sessionID'] },
        { name: 'run', timeStamp: '28', duration: 15, extra: ['jobID', '100m', 'sessionID'] },
        { name: 'run', timeStamp: '43', duration: 35, extra: ['jobID', '100m', 'sessionID'] },
        { name: 'run', timeStamp: '78', duration: 0, extra: ['jobID', '100m', 'sessionID'] },
    ]

    const diagram = useD3((svg) => {
        const width = 500
        const height = 200
        const dotSize = 5


        svg.attr("viewBox", [-width / 20, -height / 2, width, height])

        // baseline
        svg.append('line')
            .attr('x1', 0)
            .attr('x2', data[data.length - 1]['timeStamp'] * 10)
            .attr('stroke', 'grey')
        // .attr('stroke-width', 3)

        // wrapper for event representations
        const sequence = svg
            .append('g')
            .classed('wrapper', true)

        // event representation
        const event = sequence
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .classed('event', true)
            .attr('transform', ({ timeStamp }, i) => `translate(${10 * timeStamp})`)
            .on('mouseover', function handleHover(e, d) {
                d3.select(this).select('circle')
                    // .transition()
                    .attr('stroke', 'black')
                    .attr('stroke-width', .3)

                // attach event details
                d3.select(this)
                    .selectAll('.details')
                    .data(d => d.extra) // replace with dynamic data
                    .enter()
                    .append('text')
                    .classed('details', true)
                    .text(d => d)
                    .attr('dy', (d, i) => `${i * 1.3}em`)
                    .attr('transform', `translate(${-dotSize},${3 * dotSize})`)
                    .attr('font-size', 5)
            })
            .on('mouseout', function handleUnhover(e, d) {
                d3.select(this).select('circle')
                    // .transition()
                    .attr('stroke-width', 0)

                d3.select(this).selectAll('.details').remove()
            })



        // draw node
        event.append('circle')
            .attr('r', dotSize)
            .attr('fill', '#fdd835')

        // event name
        event.append('text')
            .classed('title', true)
            .text(({ name }) => name) // replace with dynamic data
            .attr('transform', `rotate(-45) translate(${dotSize * 1.5})`)
            .attr('font-size', 5)

        // event duration
        event.append('text')
            .classed('duration', true)
            .text(({ duration }) => `${duration}s`) // replace with dynamic data
            .attr('transform', ` translate(${dotSize * 2},${dotSize * 1.5})`)
            .attr('font-size', 5)

        // zoom behavior
        function handleZoom(e) {
            console.log(e)
            d3.select('svg g')
                .attr('transform', `translate(${e.transform.x}) scale(${e.transform.k})`);
            d3.select('svg line')
                .attr('transform', `translate(${e.transform.x}) scale(${e.transform.k})`);
        }
        let zoom = d3.zoom()
            .on('zoom', handleZoom);
        svg
            .call(zoom);

    }, [data])

    return (
        <>
            <p className='mb-3 text-4xl font-light'>Player 123456789</p>
            <p className="mx-5">Total time taken: 78s</p>
            <svg
                ref={diagram}
                className="w-full mx-0"
            />
        </>


    )
}

function convert(rawData) {

    // console.log(rawData)

    const rawPath = rawData.val.vals[0][0]

    let path = [8]
    let current = '8'
    while (true) {
        if (rawPath.hasOwnProperty(current)) {
            path.push(rawPath[current][0][0])

            current = rawPath[current][0][0]
        }
        else break
    }

    console.log(path)
    return path
}