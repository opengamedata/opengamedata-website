import { useState, useEffect } from 'react';
import LargeButton from "../../../../components/buttons/LargeButton";
import { useD3 } from "../../../../hooks/useD3";
import timeline from "./timeline";


export default function PlayerTimeline({ rawData, updateViewMetrics }) {

    const [eventTypesDisplayed, setEventTypesDisplayed] = useState(null)
    const [data, setData] = useState(convert(rawData))

    // register types of events found for this user
    useEffect(() => {
        setEventTypesDisplayed(data.meta.types)
    }, [])

    // re-filter data when user changes the event types to be displayed
    useEffect(() => {
        if (eventTypesDisplayed instanceof Set)
            setData(filter(convert(rawData), eventTypesDisplayed))
    }, [eventTypesDisplayed])

    /**
     * draws the timeline
     */
    const diagram = useD3((svg) => {

        timeline(svg, data)

    }, [data])

    /**
     * genrates the options (radio buttons) for the event type filter
     */
    const filterControl = () => {
        const listOfEvents = [...data.meta.types].map((e) => (
            <div key={e}>
                <label>
                    <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={eventTypesDisplayed.has(e)}
                        onChange={() => {
                            if (eventTypesDisplayed.has(e) && eventTypesDisplayed.size > 1) setEventTypesDisplayed(new Set([...eventTypesDisplayed].filter(d => d !== e)))
                            else {
                                const newList = [...eventTypesDisplayed]
                                newList.push(e)
                                setEventTypesDisplayed(new Set(newList))
                            }
                        }}
                    />
                    <span> {e}</span>
                </label>
            </div>
        ))
        return listOfEvents
    }

    return (
        <>
            {rawData && <>
                {/* chart */}
                <svg
                    ref={diagram}
                    className="w-full mx-0"
                />

                {/* chart info */}
                <div className="fixed bottom-5 left-8">
                    <LargeButton
                        selected={false}
                        onClick={() => { updateViewMetrics('JobGraph') }}
                        label='← BACK TO JOB GRAPH'
                    />
                    <p className='mb-3 text-4xl font-light'>Player {data.meta.playerID}</p>
                    <p className="font-light">
                        From <span className="font-bold">{data.meta.startTime}</span> to <span className="font-bold">{data.meta.endTime}</span>
                    </p>
                    <p className="font-light">
                        Total time taken: <span className="font-bold">{data.meta.totalTime}s</span>
                    </p>
                    <p className="font-light">
                        Session count: <span className="font-bold">{data.meta.sessionCount}</span>
                    </p>
                </div>

                {/* chart settings */}
                <fieldset className="fixed bottom-5 right-8 font-light">
                    <legend className="">Show event types of:</legend>
                    <div className="mt-2">
                        {eventTypesDisplayed instanceof Set && filterControl()}
                    </div>
                </fieldset>
            </>}
        </>
    )
}

/**
 * converts raw data from the server to a chart-understandable format
 * @param {*} rawData 
 * @returns converted data
 */
function convert(rawData) {
    const rawEvents = JSON.parse(rawData.vals[0])

    console.log(rawData)
    // console.log(rawEvents)

    // extract primary values
    const meta = {
        playerID: rawEvents[0].user_id,
        sessionCount: rawData.vals[1]
    }
    const events = rawEvents.map((e) => {
        // console.log(e)
        return {
            name: e.job_name,
            type: e.name,
            timestamp: ((new Date(e.timestamp)).getTime() / 1000).toFixed(0),
            date: (new Date(e.timestamp)).toLocaleString(),
            sessionID: e.session_id
        }
    })


    // calculate derived values
    const startTime = events[0].timestamp
    let minDuration = Infinity
    // let minDuration = 1000000
    const typeList = new Set()
    for (let i = 0; i < events.length; i++) {

        // calculate duration
        let duration = 0
        if (i < events.length - 1) duration = events[i + 1].timestamp - events[i].timestamp
        events[i].duration = duration
        if (duration > 0 && duration < minDuration) minDuration = duration // update minimum duration

        // normalize timestamps
        events[i].timestamp = events[i].timestamp - startTime

        // construct list of types
        typeList.add(events[i].type)

        // lump extra features to one field
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
    meta.types = typeList

    console.log(meta, events)

    return { meta, events }
}

/**
 * filter events by event type
 * @param {*} data 
 * @param {*} filterParams list of event types to be included
 * @returns filtered data
 */
function filter(data, filterParams) {

    // select objects of specified event type
    const filteredEvents = data.events.filter(({ type }) => filterParams.has(type))


    let minDuration = Infinity
    // let minDuration = 1000000
    // recalculate time elapsed in between filtered events
    for (let i = 0; i < filteredEvents.length - 1; i++) {
        const e = filteredEvents[i];

        const d = filteredEvents[i + 1].timestamp - e.timestamp
        if (d > 0 && d < minDuration) minDuration = d
        e.duration = d
    }
    // recalculate min duration
    data.meta.minDuration = minDuration


    data.events = filteredEvents
    return data
}