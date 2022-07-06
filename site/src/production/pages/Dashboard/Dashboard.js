var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { Fragment, useState } from 'react';
import Settings from './Settings';
import VisForm from './VisForm';
import { API_ORIGIN, timeline_url_path, url_search_metrics } from '../../constants';
import JobGraph from './views/JobGraph/JobGraph';
import PlayerTimeline from './views/Timeline/PlayerTimeline';
import LoadingBlur from '../../components/LoadingBlur';
import LargeButton from '../../components/buttons/LargeButton';

export default function Dashboard() {

    // whether initial form completed
    var _useState = useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        initialized = _useState2[0],
        setInitialized = _useState2[1]; // in production: defalt to false 

    // vis metrics


    var _useState3 = useState({
        game: '',
        version: '',
        startDate: '',
        endDate: '',
        minPlaytime: 0,
        maxPlaytime: 0
    }),
        _useState4 = _slicedToArray(_useState3, 2),
        metrics = _useState4[0],
        setMetrics = _useState4[1];

    var _useState5 = useState(),
        _useState6 = _slicedToArray(_useState5, 2),
        viewMetrics = _useState6[0],
        setViewMetrics = _useState6[1];

    var _useState7 = useState('JobGraph'),
        _useState8 = _slicedToArray(_useState7, 2),
        currentView = _useState8[0],
        setCurrentView = _useState8[1];

    var _useState9 = useState(false),
        _useState10 = _slicedToArray(_useState9, 2),
        loading = _useState10[0],
        setLoading = _useState10[1];

    var _useState11 = useState(null),
        _useState12 = _slicedToArray(_useState11, 2),
        data = _useState12[0],
        setData = _useState12[1];

    /**
     * updates global metrics as seen in the metrics state above
     * @param {*} newMetrics 
     */


    var updateGlobalMetrics = function updateGlobalMetrics(newMetrics) {
        // console.log(newMetrics)

        var searchParams = void 0,
            urlPath = void 0;
        switch (currentView) {
            case 'JobGraph':
                // construct url path and params
                searchParams = new URLSearchParams({
                    start_datetime: encodeURIComponent(newMetrics.startDate) + 'T00:00',
                    end_datetime: encodeURIComponent(newMetrics.endDate) + 'T23:59',
                    metrics: '[' + url_search_metrics[newMetrics.game].toString() + ']'
                });

                urlPath = 'game/' + newMetrics.game + '/metrics';

                break;
            case 'PlayerTimeline':
                // construct url path and params
                searchParams = new URLSearchParams({
                    metrics: 'EventList'
                });

                urlPath = 'game/' + newMetrics.game + '/' + timeline_url_path[newMetrics.game] + '/' + viewMetrics.player + '/metrics';

                break;

            default:
                break;
        }

        var url = new URL(urlPath + '?' + searchParams.toString(), API_ORIGIN);

        // fetch by url
        propagateData(url.toString(), function () {

            setMetrics(newMetrics);
        });
    };

    /**
     * Update view-specific metrics
     * for job graph: {}
     * for player timeline: {player}
     * @param {*} view 
     * @param {*} newViewMetrics 
     */
    var updateViewMetrics = function updateViewMetrics(view, newViewMetrics) {
        // console.log(newViewMetrics)

        var searchParams = void 0,
            urlPath = void 0;
        switch (view) {
            case 'JobGraph':
                // construct url path and params
                searchParams = new URLSearchParams({
                    start_datetime: encodeURIComponent(metrics.startDate) + 'T00:00',
                    end_datetime: encodeURIComponent(metrics.endDate) + 'T23:59',
                    metrics: '[' + url_search_metrics[metrics.game].toString() + ']'
                });

                urlPath = 'game/' + metrics.game + '/metrics';

                break;
            case 'PlayerTimeline':
                // construct url path and params
                searchParams = new URLSearchParams({
                    metrics: '[EventList]'
                });

                urlPath = 'game/' + metrics.game + '/' + timeline_url_path[metrics.game] + '/' + newViewMetrics.player + '/metrics';

                break;

            default:
                break;
        }

        var url = new URL(urlPath + '?' + searchParams.toString(), API_ORIGIN);

        // fetch by url
        propagateData(url.toString(), function () {
            setViewMetrics(newViewMetrics);
            // console.log('newViewMetrics', newViewMetrics)

            if (view !== currentView) setCurrentView(view);
        });
    };

    /**
     * bundles input states and post to server then receives corresponding dataset
     * 
     * the function constructs a query string which is used in to ways:
     * 1. if data was previously fetched from the backend, it serves as the storage key for quick data retrieval from the browser's localStorage
     * 2. as the query parameter for fetching data from the backend
     * 
     * @param {*} metrics user-input metrics are passed in from VisForm or Settings
     * 
     * 
     */
    var propagateData = function propagateData(url, fetchCallback) {
        // flush current dataset
        setData(null);

        // localStorage.clear() // DEBUG

        // start loading animation
        setLoading(true);

        // console.log(url)

        // if query found in storage, retreive JSON
        var localData = localStorage.getItem(url);
        // console.log(localData)
        if (localData) {

            fetchCallback();

            setData(JSON.parse(localData));

            // console.log(localData)


            // store response to parent component state
            setInitialized(true);
            // stop loading animation
            setLoading(false);
        }
        // if not found in storage, request dataset
        else {
                console.log('fetching:', url);

                fetch(url).then(function (res) {
                    return res.json();
                }).then(function (data) {
                    if (data.status !== 'SUCCESS') throw data.msg;

                    console.log(data);

                    // store data locally
                    localStorage.setItem(url, JSON.stringify(data.val));

                    fetchCallback();

                    // set data state
                    setData(data.val);

                    // store response to parent component state
                    setInitialized(true);

                    // stop loading animation
                    setLoading(false);
                }).catch(function (error) {
                    console.error(error);
                    setLoading(false);
                    alert(error);
                });
            }
    };

    return React.createElement(
        'div',
        { className: 'w-screen' },
        React.createElement(
            'div',
            { className: 'fixed top-0 right-1/2 z-10' },
            React.createElement(LargeButton, {
                label: 'clear cache',
                onClick: function onClick() {
                    localStorage.clear();
                    alert('localStorage reset');
                }
            })
        ),
        !initialized ? React.createElement(VisForm, {
            loading: loading,
            updateGlobalMetrics: updateGlobalMetrics
        }) : React.createElement(
            Fragment,
            null,
            currentView === 'JobGraph' && React.createElement(Settings, {
                metrics: metrics,
                loading: loading,
                updateGlobalMetrics: updateGlobalMetrics
            }),
            React.createElement(LoadingBlur, { loading: loading }),
            data && {
                'JobGraph': React.createElement(JobGraph, {
                    rawData: data,
                    metrics: metrics,
                    updateViewMetrics: updateViewMetrics }),
                'PlayerTimeline': React.createElement(PlayerTimeline, {
                    rawData: data,
                    metrics: metrics,
                    viewMetrics: viewMetrics,
                    updateViewMetrics: updateViewMetrics })
            }[currentView]
        )
    );
}