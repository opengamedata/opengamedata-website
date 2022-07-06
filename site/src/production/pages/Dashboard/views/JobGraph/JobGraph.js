var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import * as d3 from "d3";
import { Fragment, useEffect, useState } from "react";
import { useD3 } from "../../../../hooks/useD3";
import PlayersList from "./PlayersList";
import { url_search_metrics } from "../../../../constants";
import ForceGraph from './forceGraph';
import JobGraphLegend from "./JobGraphLegend";

/**
 * force directed graph component for job/mission level data
 * @param {Object} data raw data JSON object 
 * @returns 
 */
export default function JobGraph(_ref) {
    var rawData = _ref.rawData,
        metrics = _ref.metrics,
        updateViewMetrics = _ref.updateViewMetrics;

    var _useState = useState('TopJobCompletionDestinations'),
        _useState2 = _slicedToArray(_useState, 2),
        linkMode = _useState2[0],
        setLinkMode = _useState2[1];

    var _useState3 = useState(null),
        _useState4 = _slicedToArray(_useState3, 2),
        data = _useState4[0],
        setData = _useState4[1];

    var _useState5 = useState(),
        _useState6 = _slicedToArray(_useState5, 2),
        playersList = _useState6[0],
        setPlayerList = _useState6[1];

    var _useState7 = useState(),
        _useState8 = _slicedToArray(_useState7, 2),
        playerHighlight = _useState8[0],
        setHighlight = _useState8[1];

    useEffect(function () {
        setData(convert(rawData));
        // console.log(convert(rawData))

        setPlayerList(null);
    }, [rawData, linkMode]);

    // useEffect(() => {
    //     console.log(data)
    // }, [data])

    /* manipulate raw data to a format to be used by the vis views */
    var convert = function convert(rawData) {

        // console.log('rawData', rawData)

        // metadata
        var meta = {
            playerSummary: JSON.parse(rawData.PlayerSummary.replaceAll('\\', '')),
            populationSummary: JSON.parse(rawData.PopulationSummary.replaceAll('\\', '').replaceAll('_', ' ')),
            maxAvgTime: 0,
            minAvgTime: Infinity

            // nodes
        };var nodeBuckets = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(rawData)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref2 = _step.value;

                var _ref3 = _slicedToArray(_ref2, 2);

                var key = _ref3[0];
                var value = _ref3[1];

                if (key.substring(0, 3) !== 'job' && key.substring(0, 7) !== 'mission') continue;

                var _key$split = key.split('_'),
                    _key$split2 = _slicedToArray(_key$split, 2),
                    k = _key$split2[0],
                    metric = _key$split2[1];
                // console.log(`${k}'s ${metric}: ${value}`);

                if (metric === 'JobsAttempted-avg-time-complete') {
                    if (parseFloat(value) > meta.maxAvgTime) meta.maxAvgTime = parseFloat(value);
                    if (parseFloat(value) < meta.minAvgTime) meta.minAvgTime = parseFloat(value);
                }

                if (!nodeBuckets.hasOwnProperty(k)) nodeBuckets[k] = {}; // create node pbject

                if (metric === 'JobsAttempted-job-name') nodeBuckets[k].id = value; // store job name as node id
                else if (metric === 'JobsAttempted') continue;else nodeBuckets[k][metric] = value;

                // parse job difficulty json
                if (metric === 'JobsAttempted-job-difficulties') {
                    nodeBuckets[k][metric] = JSON.parse(nodeBuckets[k][metric]);
                }
            }

            // console.log(nodeBuckets)

            // links
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

        var l = [];
        var rawLinks = JSON.parse(rawData[linkMode].replaceAll('\\', ''));

        switch (linkMode) {
            case 'TopJobCompletionDestinations':
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {

                    for (var _iterator2 = Object.entries(rawLinks)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _ref4 = _step2.value;

                        var _ref5 = _slicedToArray(_ref4, 2);

                        var sourceKey = _ref5[0];
                        var targets = _ref5[1];
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = Object.entries(targets)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _ref6 = _step3.value;

                                var _ref7 = _slicedToArray(_ref6, 2);

                                var targetKey = _ref7[0];
                                var players = _ref7[1];


                                if (sourceKey === targetKey) continue; // omit self-pointing jobs

                                l.push({
                                    source: sourceKey,
                                    sourceName: sourceKey,
                                    target: targetKey,
                                    targetName: targetKey,
                                    value: players.length,
                                    players: players
                                });
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                break;

            case 'TopJobSwitchDestinations':
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {

                    for (var _iterator4 = Object.entries(rawLinks)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _ref8 = _step4.value;

                        var _ref9 = _slicedToArray(_ref8, 2);

                        var _sourceKey = _ref9[0];
                        var _targets = _ref9[1];
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = Object.entries(_targets)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _ref10 = _step5.value;

                                var _ref11 = _slicedToArray(_ref10, 2);

                                var _targetKey = _ref11[0];
                                var _players = _ref11[1];


                                if (_sourceKey === _targetKey) continue; // omit self-pointing jobs

                                l.push({
                                    source: _sourceKey,
                                    sourceName: _sourceKey,
                                    target: _targetKey,
                                    targetName: _targetKey,
                                    value: _players.length,
                                    players: _players
                                });
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                break;

            case 'ActiveJobs':

                var activeJobs = Object.keys(rawLinks);
                for (var i = 1; i < activeJobs.length; i++) {
                    var target = activeJobs[i];

                    l.push({
                        source: activeJobs[0],
                        sourceName: activeJobs[0],
                        target: target,
                        targetName: target
                    });
                }

                break;

            default:
                alert('Something went wrong. Plase refresh the page and try again');
                break;
        }

        // filter out nodes w/ no edges
        var relevantNodes = Object.values(nodeBuckets).filter(function (_ref12) {
            var id = _ref12.id;
            return l.map(function (link) {
                return link.source;
            }).includes(id) || l.map(function (link) {
                return link.target;
            }).includes(id);
        });

        if (linkMode === 'ActiveJobs') relevantNodes.forEach(function (n) {
            // console.log(rawLinks)
            n.players = rawLinks[n.id];
        });

        // console.log('relevantNodes', relevantNodes)
        // console.log('links', l)

        return { nodes: relevantNodes, links: l, meta: meta };
    };
    // const data = convert(rawData)


    var showPlayersList = function showPlayersList(link) {
        var players = void 0,
            title = void 0;
        if (linkMode === 'ActiveJobs') {
            players = data.nodes.find(function (n) {
                return n.id === link.id;
            }).players;
            title = link.id + " (" + players.length + " in progress)";
        } else {
            players = data.links.find(function (l) {
                return l.source === link.source.id && l.target === link.target.id;
            }).players;
            title = link.source.id + "\n" + ("\u2794 " + link.target.id + "\n") + ("(" + players.length + " " + (linkMode === 'TopJobSwitchDestinations' ? 'switched' : 'completed') + ")");
        }
        setPlayerList({ players: players, title: title });
    };

    /**
    * redirect function
    * this function is passed to PlayersList
    * when user selects a player/session, they will be taken to that player/session's timeline
    */
    var toPlayerTimeline = function toPlayerTimeline(viewMetrics) {
        updateViewMetrics('PlayerTimeline', viewMetrics);
    };

    /**
     * draw the force directed graph on jobs/missions
     */
    var ref = useD3(function (svg) {
        if (data) {
            /**
                * utility function that maps average complete time to node radius
            */
            var projectRadius = d3.scaleLinear().domain([data.meta.minAvgTime, data.meta.maxAvgTime]).range([3, 20]);

            /**
             * generates node details to be displayed when hover over a job node
             * contains game specific settings
             * @param {*} d data of a particular node (aka an element of the data obj)
             * @returns node details
             */
            var getNodeDetails = function getNodeDetails(d) {
                var generic = d['JobsAttempted-num-completes'] + " of " + d['JobsAttempted-num-starts'] + " (" + parseFloat(d['JobsAttempted-percent-complete']).toFixed(2) + "%) players completed\n" + ("Average time to complete: " + parseFloat(d['JobsAttempted-avg-time-complete']).toFixed() + "s\n") + ("Standard deviation: " + parseFloat(d['JobsAttempted-std-dev-complete']).toFixed(2));

                var gameSpecific = '';
                switch (metrics.game) {
                    case 'AQUALAB':
                        gameSpecific = '\n' + ("Experimentation: " + (d['JobsAttempted-job-difficulties'] ? d['JobsAttempted-job-difficulties'].experimentation : 'N/A') + "\n") + ("Modeling: " + (d['JobsAttempted-job-difficulties'] ? d['JobsAttempted-job-difficulties'].modeling : 'N/A') + "\n") + ("Argumentation: " + (d['JobsAttempted-job-difficulties'] ? d['JobsAttempted-job-difficulties'].argumentation : 'N/A'));
                        break;

                    default:
                        break;
                }

                return generic + gameSpecific;
            };

            var getLinkColor = function getLinkColor(l) {
                if (linkMode === 'ActiveJobs') return "#fff0";
                if (l.players.includes(playerHighlight)) return 'blue';
                return "#999";
            };

            var chart = ForceGraph(data, {
                nodeId: function nodeId(d) {
                    return d.id;
                },
                nodeGroup: function nodeGroup(d) {
                    return d['JobsAttempted-num-completes'] / (d['JobsAttempted-num-starts'] === '0' ? 1 : d['JobsAttempted-num-starts']);
                },
                nodeTitle: function nodeTitle(d) {
                    return d.id;
                },
                nodeDetail: function nodeDetail(d) {
                    return getNodeDetails(d);
                },
                nodeRadius: function nodeRadius(d) {
                    return projectRadius(d['JobsAttempted-avg-time-complete']);
                },
                linkStrokeWidth: function linkStrokeWidth(l) {
                    return l.value;
                },
                linkDetail: function linkDetail(l) {
                    return l.value + " players moved from " + l.sourceName + " to " + l.targetName;
                },
                linkStrength: 1,
                linkDistance: 100,
                nodeStrength: -1000,
                linkStroke: function linkStroke(l) {
                    return getLinkColor(l);
                }, // link stroke color, no color when showing jobs in progress
                outLinks: linkMode === 'ActiveJobs',
                outLinkWidth: linkMode === 'ActiveJobs' ? function (d) {
                    return d.players.length;
                } : null,
                outLinkDetail: linkMode === 'ActiveJobs' ? function (d) {
                    return d.players.length + " players in progress";
                } : null,
                parent: svg,
                nodeClick: ''
            }, showPlayersList);
        }
    }, [data, playerHighlight]); // dependency -> data: change in linkMode will trigger data recalculation (@useEffect)

    // render component
    return React.createElement(
        Fragment,
        null,
        React.createElement("svg", { ref: ref, className: "w-full border-b" }),
        playersList ? React.createElement(PlayersList, {
            data: playersList,
            playerSummary: data.meta.playerSummary,
            redirect: toPlayerTimeline,
            playerHighlight: playerHighlight,
            setHighlight: setHighlight,
            setPlayerList: setPlayerList
        }) : React.createElement(Fragment, null),
        React.createElement(
            "div",
            { className: "fixed bottom-3 right-3 font-light text-sm" },
            React.createElement(
                "fieldset",
                { className: "block" },
                React.createElement(
                    "legend",
                    null,
                    "Show paths of players who"
                ),
                React.createElement(
                    "div",
                    { className: "mt-2" },
                    url_search_metrics[metrics.game].includes('TopJobCompletionDestinations') && React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "label",
                            { className: "inline-flex items-center" },
                            React.createElement("input", {
                                className: "form-radio",
                                type: "radio",
                                name: "radio-direct",
                                checked: linkMode === 'TopJobCompletionDestinations',
                                onChange: function onChange(e) {
                                    setLinkMode(e.currentTarget.value);
                                },
                                value: "TopJobCompletionDestinations" }),
                            React.createElement(
                                "span",
                                { className: "ml-2" },
                                "finished the job"
                            )
                        )
                    ),
                    url_search_metrics[metrics.game].includes('TopJobSwitchDestinations') && React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "label",
                            { className: "inline-flex items-center" },
                            React.createElement("input", {
                                className: "form-radio",
                                type: "radio",
                                name: "radio-direct",
                                checked: linkMode === 'TopJobSwitchDestinations',
                                onChange: function onChange(e) {
                                    setLinkMode(e.currentTarget.value);
                                },
                                value: "TopJobSwitchDestinations" }),
                            React.createElement(
                                "span",
                                { className: "ml-2" },
                                "left the job"
                            )
                        )
                    ),
                    url_search_metrics[metrics.game].includes('ActiveJobs') && React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "label",
                            { className: "inline-flex items-center" },
                            React.createElement("input", {
                                className: "form-radio",
                                type: "radio",
                                name: "radio-direct",
                                checked: linkMode === 'ActiveJobs',
                                onChange: function onChange(e) {
                                    setLinkMode(e.currentTarget.value);
                                },
                                value: "ActiveJobs" }),
                            React.createElement(
                                "span",
                                { className: "ml-2" },
                                "still in progress"
                            )
                        )
                    )
                )
            )
        ),
        data && React.createElement(JobGraphLegend, { populationSummary: data.meta.populationSummary })
    );
}