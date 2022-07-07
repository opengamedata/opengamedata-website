var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { Fragment, useState, useEffect } from 'react';
import LargeButton from "../../../../components/buttons/LargeButton";
import { initial_timeline_filter_options, color_20 } from '../../../../constants';
import { useD3 } from "../../../../hooks/useD3";
import CodeForm from './CodeForm';
import EventFilterCtrl from './EventFilterCtrl';
import timeline from "./timeline";

export default function PlayerTimeline(_ref) {
    var metrics = _ref.metrics,
        viewMetrics = _ref.viewMetrics,
        rawData = _ref.rawData,
        updateViewMetrics = _ref.updateViewMetrics;


    var convertedData = convert(rawData);

    var _useState = useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        formVisible = _useState2[0],
        setFormVisible = _useState2[1];

    var _useState3 = useState(null),
        _useState4 = _slicedToArray(_useState3, 2),
        selectedEventForTagging = _useState4[0],
        setSelectedEventForTagging = _useState4[1];

    var _useState5 = useState(null),
        _useState6 = _slicedToArray(_useState5, 2),
        eventTypesDisplayed = _useState6[0],
        setEventTypesDisplayed = _useState6[1];

    var _useState7 = useState(),
        _useState8 = _slicedToArray(_useState7, 2),
        data = _useState8[0],
        setData = _useState8[1];

    var _useState9 = useState(1),
        _useState10 = _slicedToArray(_useState9, 2),
        timelineZoom = _useState10[0],
        setZoom = _useState10[1];

    var _useState11 = useState(0),
        _useState12 = _slicedToArray(_useState11, 2),
        timelinePan = _useState12[0],
        setPan = _useState12[1];

    // register types of events found for this user


    useEffect(function () {
        var initialTypes = new Set();
        initial_timeline_filter_options[metrics.game].forEach(function (type) {
            if (Object.hasOwn(convertedData.meta.types, type)) initialTypes.add(type);
        });

        setEventTypesDisplayed(initialTypes);
    }, []);

    // re-filter data when user changes the event types to be displayed
    useEffect(function () {
        if (eventTypesDisplayed instanceof Set) setData(filter(convertedData, eventTypesDisplayed));
    }, [eventTypesDisplayed]);

    var eventOnClick = function eventOnClick(event) {
        // console.log(event)
        setSelectedEventForTagging(event);
        setFormVisible(true);
    };

    /**
     * draws the timeline
     */
    var diagram = useD3(function (svg) {
        if (data) timeline(svg, data, eventOnClick, timelineZoom, timelinePan, setZoom, setPan);
    }, [data]);

    return React.createElement(
        Fragment,
        null,
        rawData && React.createElement(
            Fragment,
            null,
            React.createElement('svg', {
                ref: diagram,
                className: 'w-full mx-0'
            }),
            React.createElement(
                'div',
                { className: 'fixed bottom-5 left-8' },
                React.createElement(LargeButton, {
                    selected: false,
                    onClick: function onClick() {
                        updateViewMetrics('JobGraph');
                    },
                    label: '\u2190 BACK TO JOB GRAPH'
                }),
                React.createElement(
                    'p',
                    { className: 'mb-3 text-4xl font-light' },
                    'Player ',
                    convertedData.meta.playerID
                ),
                React.createElement(
                    'p',
                    { className: 'font-light' },
                    'From ',
                    React.createElement(
                        'span',
                        { className: 'font-bold' },
                        convertedData.meta.startTime
                    ),
                    ' to ',
                    React.createElement(
                        'span',
                        { className: 'font-bold' },
                        convertedData.meta.endTime
                    )
                ),
                React.createElement(
                    'p',
                    { className: 'font-light' },
                    'Total time taken: ',
                    React.createElement(
                        'span',
                        { className: 'font-bold' },
                        convertedData.meta.totalTime,
                        's'
                    )
                ),
                React.createElement(
                    'p',
                    { className: 'font-light' },
                    'Session count: ',
                    React.createElement(
                        'span',
                        { className: 'font-bold' },
                        convertedData.meta.sessionCount
                    )
                )
            ),
            React.createElement(EventFilterCtrl, {
                data: convertedData,
                eventTypesDisplayed: eventTypesDisplayed,
                setEventTypesDisplayed: setEventTypesDisplayed
            }),
            formVisible && React.createElement(CodeForm, {
                metrics: metrics,
                viewMetrics: viewMetrics,
                setFormVisible: setFormVisible,
                event: selectedEventForTagging
            })
        )
    );
}

/**
 * converts raw data from the server to a chart-understandable format
 * @param {*} rawData 
 * @returns converted data
 */
function convert(rawData) {
    var rawEvents = JSON.parse(rawData.vals[0]);

    // console.log(rawData)
    // console.log(rawEvents)
    // console.log(rawEvents[0])

    // extract primary values
    var meta = {
        playerID: rawEvents[0].user_id,
        sessionCount: rawData.vals[1]
    };
    var events = rawEvents.map(function (e) {
        // console.log(e)
        return {
            level: e.job_name,
            detail: e.event_primary_detail,
            type: e.name,
            timestamp: (new Date(e.timestamp).getTime() / 1000).toFixed(0),
            date: new Date(e.timestamp).toLocaleString(),
            sessionID: e.session_id
        };
    });

    // a dictionary-like stucture that stores timestamp -> event(s) mappings
    var timestamps = {};
    rawEvents.forEach(function (e, i) {
        var timestamp = (new Date(e.timestamp).getTime() / 1000).toFixed(0);

        // if timestamp already in the dictionary 
        if (timestamp in timestamps) {

            if (typeof timestamps[timestamp] === 'number') timestamps[timestamp] = [timestamps[timestamp]];

            timestamps[timestamp].push(i);
        }
        // base case: add timestamp to dictionary
        else timestamps[timestamp] = i;
    });

    // calculate derived values
    var startTime = events[0].timestamp;
    var minDuration = Infinity;
    // let minDuration = 1000000
    var typeList = new Set();
    for (var i = 0; i < events.length; i++) {

        // calculate duration
        var duration = 0;
        if (i < events.length - 1) duration = events[i + 1].timestamp - events[i].timestamp;
        events[i].duration = duration;
        if (duration > 0 && duration < minDuration) minDuration = duration; // update minimum duration

        // normalize timestamps
        events[i].timestamp = events[i].timestamp - startTime;

        // construct list of types
        typeList.add(events[i].type);

        // lump extra features into one field
        var extra = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(rawEvents[i])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref2 = _step.value;

                var _ref3 = _slicedToArray(_ref2, 2);

                var k = _ref3[0];
                var v = _ref3[1];

                if (!['user_id', 'index'].includes(k)) // put what you don't want to show in this array
                    extra.push(k + ': ' + v);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        extra.push('duration: ' + duration);
        events[i].extra = extra;
    }

    // assign colors to types
    var types = {};
    var count = 0;
    typeList.forEach(function (t) {
        types[t] = color_20[count % color_20.length];
        count++;
    });

    meta.minDuration = minDuration;
    meta.startTime = events[0].date;
    meta.endTime = events[events.length - 1].date;
    meta.totalTime = events[events.length - 1].timestamp - events[0].timestamp;
    meta.types = types;

    // console.log(meta)
    // console.log(events)
    // console.log(types)
    // console.log(timestamps)

    return { meta: meta, events: events, timestamps: Object.entries(timestamps) };
}

/**
 * filter events by event type
 * @param {*} data 
 * @param {*} filterParams list of event types to be included
 * @returns filtered data
 */
function filter(data, filterParams) {

    // select objects of specified event type
    var filteredEvents = data.events.filter(function (_ref4) {
        var type = _ref4.type;
        return filterParams.has(type);
    });

    // recalculate time elapsed in between filtered events
    for (var i = 0; i < filteredEvents.length - 1; i++) {
        var e = filteredEvents[i];

        var d = filteredEvents[i + 1].timestamp - e.timestamp;
        e.duration = d;
    }

    // (removed) recalculate min duration


    data.events = filteredEvents;
    return data;
}