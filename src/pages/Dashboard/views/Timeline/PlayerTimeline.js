import { useState, useEffect } from 'react';
import LargeButton from "../../../../components/buttons/LargeButton";
import { initial_timeline_filter_options, color_20 } from '../../../../constants';
import { useD3 } from "../../../../hooks/useD3";
import CodeForm from './CodeForm';
import EventFilterCtrl from './EventFilterCtrl';
import timeline from "./timeline";


export default function PlayerTimeline({ metrics, viewMetrics, rawData, updateViewMetrics }) {
    const [formVisible, setFormVisible] = useState(false)
    const [selectedEventForTagging, setSelectedEventForTagging] = useState(null)

    const [eventTypesDisplayed, setEventTypesDisplayed] = useState(null)
    const [data, setData] = useState(convert(rawData))

    const [timelineZoom, setZoom] = useState(1)
    const [timelinePan, setPan] = useState(0)


    // register types of events found for this user
    useEffect(() => {
        let initialTypes = new Set()
        initial_timeline_filter_options[metrics.game].forEach(type => {
            if (Object.hasOwn(data.meta.types, type)) initialTypes.add(type)
        });

        setEventTypesDisplayed(initialTypes)
    }, [])

    // re-filter data when user changes the event types to be displayed
    useEffect(() => {
        if (eventTypesDisplayed instanceof Set)
            setData(filter(convert(rawData), eventTypesDisplayed))
    }, [eventTypesDisplayed])


    const eventOnClick = (event) => {
        // console.log(event)
        setSelectedEventForTagging(event)
        setFormVisible(true)
    }

    /**
     * draws the timeline
     */
    const diagram = useD3((svg) => {

        timeline(
            svg,
            data,
            eventOnClick,
            timelineZoom, timelinePan,
            setZoom, setPan)

    }, [data])



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
                <EventFilterCtrl
                    data={data}
                    eventTypesDisplayed={eventTypesDisplayed}
                    setEventTypesDisplayed={setEventTypesDisplayed}
                />

                {/* error code event tagging  */}
                {formVisible &&
                    <CodeForm
                    metrics={metrics}
                    viewMetrics={viewMetrics}
                    setFormVisible={setFormVisible}
                    event={selectedEventForTagging}
                />
                }
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

    // console.log(rawData)
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

    // a dictionary-like stucture that stores timestamp -> event(s) mappings
    let timestamps = {}
    rawEvents.forEach((e, i) => {
        const timestamp = ((new Date(e.timestamp)).getTime() / 1000).toFixed(0)

        // if timestamp already in the dictionary 
        if (timestamp in timestamps) {

            if (typeof timestamps[timestamp] === 'number') timestamps[timestamp] = [timestamps[timestamp]]

            timestamps[timestamp].push(i)
        }
        // base case: add timestamp to dictionary
        else timestamps[timestamp] = i
    });


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
            if (!['user_id', 'index'].includes(k)) // put what you don't want to show in this array
                extra.push(`${k}: ${v}`)
        }
        events[i].extra = extra
    }

    // assign colors to types
    const types = {}
    let count = 0
    typeList.forEach((t) => {
        types[t] = color_20[count % color_20.length]
        count++
    });


    meta.minDuration = minDuration
    meta.startTime = events[0].date
    meta.endTime = events[events.length - 1].date
    meta.totalTime = events[events.length - 1].timestamp - events[0].timestamp
    meta.types = types

    // console.log(meta, events)
    // console.log(types)

    return { meta, events, timestamps }
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

    // recalculate time elapsed in between filtered events
    for (let i = 0; i < filteredEvents.length - 1; i++) {
        const e = filteredEvents[i];

        const d = filteredEvents[i + 1].timestamp - e.timestamp
        e.duration = d
    }

    // (removed) recalculate min duration


    data.events = filteredEvents
    return data
}