import * as d3 from "d3";
import { useD3 } from "../../../hooks/useD3";


export default function PlayerTimeline({ rawData }) {

    const data = convert(rawData)

    // console.log(rawData)
    console.log(convert(rawData))

    // const data = [
    //     { name: 'jump', timestamp: '0', duration: 10, extra: ['jobID', '7ft', 'sessionID'] },
    //     { name: 'dive', timestamp: '10', duration: 4, extra: ['jobID', '300m', 'sessionID'] },
    //     { name: 'swim', timestamp: '14', duration: 4, extra: ['jobID', 'freestyle', 'sessionID'] },
    //     { name: 'run', timestamp: '18', duration: 10, extra: ['jobID', '100m', 'sessionID'] },
    //     { name: 'run', timestamp: '28', duration: 15, extra: ['jobID', '100m', 'sessionID'] },
    //     { name: 'run', timestamp: '43', duration: 35, extra: ['jobID', '100m', 'sessionID'] },
    //     { name: 'run', timestamp: '78', duration: 0, extra: ['jobID', '100m', 'sessionID'] },
    // ]

    const diagram = useD3((svg) => {
        const width = window.innerWidth
        const height = window.innerHeight
        const dotSize = 20
        // scale according to shortest duration (so that its length stays at 100)
        const sacleFactorY = 100 / data.meta.minDuration

        const colors = d3.schemeTableau10


        svg.attr("viewBox", [-width / 20, -height / 2, width, height])
        svg.selectAll('*').remove();

        // baseline
        svg.append('line')
            .attr('x1', 0)
            .attr('x2', data.events[data.events.length - 1].timestamp * sacleFactorY)
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
            .attr('transform', ({ timestamp }, i) => `translate(${sacleFactorY * timestamp})`)
            .on('mouseover', function handleHover(e, d) {
                d3.select(this).select('circle')
                    // .transition()
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)

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
            .text(({ name, type }) => `${type} @ ${name}`) // replace with dynamic data
            .attr('transform', `rotate(-45) translate(${dotSize * 1.5})`)
            .attr('font-size', dotSize)

        // event duration
        event.append('text')
            .classed('duration', true)
            .text(({ duration }) => `${duration}s`) // replace with dynamic data
            .attr('transform', ` translate(${dotSize * 2},${dotSize * 1.5})`)
            .attr('font-size', dotSize)

        // zoom behavior
        function handleZoom(e) {
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
            <div className="fixed bottom-5 left-8">
                <p className='mb-3 text-4xl font-light'>Player {data.meta.playerID}</p>
                <p className="font-light">
                    From <span className="font-bold">{data.meta.startTime}</span> to <span className="font-bold">{data.meta.endTime}</span>
                </p>
                <p className="font-light">
                    Total time taken: <span className="font-bold">{data.meta.totalTime}s</span>
                </p>
            </div>
            <svg
                ref={diagram}
                className="w-full mx-0 border"
            />
        </>


    )
}

function convert(rawData) {
    const rawEvents = rawData.vals[0]

    // console.log(rawEvents)

    // extract primary values
    const meta = {
        playerID: rawEvents[0].user_id
    }
    const events = rawEvents.map((e) => {
        // console.log(e)
        return {
            name: e.job_name,
            type: e.name,
            timestamp: ((new Date(e.timestamp)).getTime() / 1000).toFixed(0),
            date: (new Date(e.timestamp)).toLocaleString()
        }
    })


    // calculate derived values
    const startTime = events[0].timestamp
    let minDuration = Infinity
    for (let i = 0; i < events.length; i++) {


        // calculate duration
        let duration = 0
        if (i < events.length - 1) duration = events[i + 1].timestamp - events[i].timestamp
        events[i].duration = duration

        if (duration > 0 && duration < minDuration) minDuration = duration // update minimum duration

        // normalize timestamps
        events[i].timestamp = events[i].timestamp - startTime
        // add extra features
        let extra = []
        for (const [k, v] of Object.entries(rawEvents[i])) {
            if (!['job_name', 'name', 'timestamp', 'user_id'].includes(k))
                extra.push(`${k}: ${v}`)
        }
        events[i].extra = extra
    }

    meta.minDuration = minDuration
    meta.startTime = events[0].date
    meta.endTime = events[events.length - 1].date
    meta.totalTime = events[events.length - 1].timestamp - events[0].timestamp



    console.log()
    return { meta, events }
}