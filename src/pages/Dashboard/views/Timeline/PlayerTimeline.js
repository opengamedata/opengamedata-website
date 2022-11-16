import { useState, useEffect } from 'react';
import LargeButton from "../../../../components/buttons/LargeButton";
import { initial_timeline_filter_options, color_20 } from '../../../../constants';
import { useD3 } from "../../../../hooks/useD3";
import CodeForm from './CodeForm';
import EventFilterCtrl from './EventFilterCtrl';
import timeline from "./timeline";


export default function PlayerTimeline({ metrics, viewMetrics, rawData, updateViewMetrics }) {

    const convertedData = convert(rawData)

    const [formVisible, setFormVisible] = useState(false)
    const [selectedEventForTagging, setSelectedEventForTagging] = useState(null)

    const [eventTypesDisplayed, setEventTypesDisplayed] = useState(null)
    const [data, setData] = useState()

    const [timelineZoom, setZoom] = useState(1)
    const [timelinePan, setPan] = useState(0)


    // register types of events found for this user
    useEffect(() => {
        const initialTypes = new Set()
        initial_timeline_filter_options[metrics.game].forEach(type => {
            if (Object.hasOwn(convertedData.meta.types, type)) initialTypes.add(type)
        });

        setEventTypesDisplayed(initialTypes)
    }, [])

    // re-filter data when user changes the event types to be displayed
    useEffect(() => {
        if (eventTypesDisplayed instanceof Set)
            setData(filter(convertedData, eventTypesDisplayed))
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
        if (data)
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
                    <p className='mb-3 text-4xl font-light'>Player {convertedData.meta.playerID}</p>
                    <p className="font-light">
                        From <span className="font-bold">{convertedData.meta.startTime}</span> to <span className="font-bold">{convertedData.meta.endTime}</span>
                    </p>
                    <p className="font-light">
                        Total time taken: <span className="font-bold">{convertedData.meta.totalTime}s</span>
                    </p>
                    <p className="font-light">
                        Session count: <span className="font-bold">{convertedData.meta.sessionCount}</span>
                    </p>
                </div>

                {/* chart settings */}
                <EventFilterCtrl
                    data={convertedData}
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
    const event_list = JSON.parse(rawData["EventList"])
    const sess_count = rawData["SessionCount"]

    const events = event_list.map((evt) => {
        return {
            level:     evt.job_name,
            detail:    evt.event_primary_detail,
            type:      evt.name,
            timestamp: ((new Date(evt.timestamp)).getTime() / 1000).toFixed(0),
            date:      (new Date(evt.timestamp)).toLocaleString(),
            sessionID: evt.session_id
        }
    })

    // a dictionary-like stucture that stores timestamp -> event(s) mappings
    let timestamps = {}
    event_list.forEach((evt, i) => {
        const timestamp = ((new Date(evt.timestamp)).getTime() / 1000).toFixed(0)

        // if timestamp already in the dictionary 
        if (timestamp in timestamps) {
            if (typeof timestamps[timestamp] === 'number') {
                timestamps[timestamp] = [timestamps[timestamp]]
            }
            timestamps[timestamp].push(i)
        }
        // base case: add timestamp to dictionary
        else timestamps[timestamp] = i
    });


    // calculate derived values
    const playerID = event_list[0].user_id ?? "Null User"
    const startTimestamp = events[0].timestamp ?? new Date()
    const endTimestamp = events[events.length - 1].timestamp ?? new Date()
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
        events[i].timestamp = events[i].timestamp - startTimestamp

        // construct list of types
        typeList.add(events[i].type)

        // lump extra features into one field
        let extra = []
        for (const [k, v] of Object.entries(event_list[i])) {
            if (!['user_id', 'index'].includes(k)) // put what you don't want to show in this array
                extra.push(`${k}: ${v}`)
        }
        extra.push(`duration: ${duration}`)
        events[i].extra = extra
    }

    // assign colors to types
    const types = {}
    let count = 0
    typeList.forEach((t) => {
        types[t] = color_20[count % color_20.length]
        count++
    });


    // extract primary values
    const meta = {
        playerID: playerID,
        sessionCount: sess_count,
        minDuration: minDuration,
        startTime: events[0].date,
        endTime: events[events.length-1].date,
        totalTime: endTimestamp - startTimestamp,
        types: types
    }

    // console.log(meta)
    // console.log(events)
    // console.log(types)
    // console.log(timestamps)

    return { meta, events, timestamps: Object.entries(timestamps) }
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