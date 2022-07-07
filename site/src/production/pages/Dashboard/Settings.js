var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { AdjustmentsIcon, XIcon, CogIcon } from '@heroicons/react/solid';
import { Fragment, useEffect, useState } from 'react';
import LargeButton from '../../components/buttons/LargeButton';

export default function Settings(_ref) {
    var loading = _ref.loading,
        metrics = _ref.metrics,
        updateGlobalMetrics = _ref.updateGlobalMetrics;

    // vis metrics
    var _useState = useState(''),
        _useState2 = _slicedToArray(_useState, 2),
        game = _useState2[0],
        setGame = _useState2[1];

    var _useState3 = useState(''),
        _useState4 = _slicedToArray(_useState3, 2),
        version = _useState4[0],
        setVersion = _useState4[1];

    var _useState5 = useState(''),
        _useState6 = _slicedToArray(_useState5, 2),
        startDate = _useState6[0],
        setstartDate = _useState6[1];

    var _useState7 = useState(''),
        _useState8 = _slicedToArray(_useState7, 2),
        endDate = _useState8[0],
        setEndDate = _useState8[1];

    var _useState9 = useState(0),
        _useState10 = _slicedToArray(_useState9, 2),
        minPlaytime = _useState10[0],
        setMinPlaytime = _useState10[1];

    var _useState11 = useState(0),
        _useState12 = _slicedToArray(_useState11, 2),
        maxPlaytime = _useState12[0],
        setMaxPlaytime = _useState12[1];

    var _useState13 = useState(false),
        _useState14 = _slicedToArray(_useState13, 2),
        adjustMode = _useState14[0],
        setAdejustMode = _useState14[1];

    var adjust = function adjust() {
        // validation
        if (startDate > endDate) {
            alert('The start date has to be no later than the end date');
            return;
        }

        // refresh vis
        var metrics = {
            game: game,
            version: version,
            startDate: startDate,
            endDate: endDate,
            minPlaytime: minPlaytime,
            maxPlaytime: maxPlaytime
        };

        updateGlobalMetrics(metrics);
        // switch back to brief
        // setAdejustMode(false)
    };

    useEffect(function () {
        setGame(metrics.game);
        setVersion(metrics.version);
        setstartDate(metrics.startDate);
        setEndDate(metrics.endDate);
        setMinPlaytime(metrics.minPlaytime);
        setMaxPlaytime(metrics.maxPlaytime);
    }, [adjustMode]);

    useEffect(function () {
        if (!loading) setAdejustMode(false);
    }, [loading]);

    return React.createElement(
        'div',
        { className: ' bg-white fixed top-14 left-3 p-3 w-content border shadow-sm' },
        React.createElement(
            'div',
            { className: 'flex justify-between mb-2' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { className: 'font-medium ' },
                    game,
                    '\xA0'
                )
            ),
            adjustMode ? !loading ? React.createElement(XIcon, { className: 'cursor-pointer h-5 w-5', onClick: function onClick() {
                    return setAdejustMode(false);
                } }) : React.createElement(Fragment, null) : React.createElement(AdjustmentsIcon, { className: 'cursor-pointer h-5 w-5', onClick: function onClick() {
                    return setAdejustMode(true);
                } })
        ),
        adjustMode ? React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'mb-5' },
                    React.createElement(
                        'div',
                        { className: 'col mb-2' },
                        React.createElement(
                            'div',
                            { className: 'input-group-prepend' },
                            React.createElement(
                                'h4',
                                { className: 'text-sm' },
                                'From'
                            )
                        ),
                        React.createElement('input', { type: 'date', className: 'block w-full', value: startDate, onChange: function onChange(e) {
                                return setstartDate(e.target.value);
                            } })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col' },
                        React.createElement(
                            'div',
                            { className: 'input-group-prepend' },
                            React.createElement(
                                'h4',
                                { className: 'text-sm' },
                                'To'
                            )
                        ),
                        React.createElement('input', { type: 'date', className: 'block w-full', value: endDate, onChange: function onChange(e) {
                                return setEndDate(e.target.value);
                            } })
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'flex space-x-2 items-center' },
                loading ? React.createElement(
                    Fragment,
                    null,
                    React.createElement(CogIcon, { className: 'animate-spin h-8 w-8' }),
                    ' \xA0Please wait...'
                ) : React.createElement(LargeButton
                // action={adjust}
                , { onClick: adjust,
                    label: 'visualize'
                })
            )
        ) : React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'text-sm' },
                startDate.replace('T', ' ')
            ),
            React.createElement(
                'div',
                { className: 'text-sm' },
                'to'
            ),
            React.createElement(
                'div',
                { className: 'text-sm' },
                endDate.replace('T', ' ')
            )
        )
    );
}