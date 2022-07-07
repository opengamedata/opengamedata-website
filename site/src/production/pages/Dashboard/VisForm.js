var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { Fragment, useState, useEffect } from 'react';
import LargeButton from '../../components/buttons/LargeButton';
import { CogIcon } from '@heroicons/react/solid';
import { vis_games } from '../../constants';

export default function VisForm(_ref) {
    var loading = _ref.loading,
        updateGlobalMetrics = _ref.updateGlobalMetrics;

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

    var gameList = function gameList() {
        var games = [];
        vis_games.forEach(function (k) {
            games.push(React.createElement(
                'option',
                { key: k, value: k },
                k
            ));
        });
        return games;
    };

    var versionList = function versionList() {};

    /* checks if form is properly filled */
    var formValidation = function formValidation() {
        // console.log(game, version, startDate, endDate, minPlaytime, maxPlaytime)

        // if empty fields, prompt user to fill in the blanks & return
        // if (!(game && version && startDate && endDate && minPlaytime >= 0 && maxPlaytime)) {
        if (!(game && startDate && endDate)) {
            // prompt user
            alert('make sure each field has a valid value');
            return;
        }

        // if start date later than end date, raise warnings & return
        if (startDate > endDate) {
            alert('invalid date range');
            return;
        }

        // if end date later than yesterday, raise warnings & return
        var today = new Date();
        var queryEnd = new Date(endDate);
        // console.log(today, queryEnd)
        // console.log(today - queryEnd)
        if (today - queryEnd <= 1000 * 60 * 60 * 24) {
            alert('select an end date that\'s prior to yesterday');
            return;
        }

        // if min playtime small than max playtime, raise warnings & return
        /* 
        if (minPlaytime >= maxPlaytime) {
            alert('invalid total playtime')
            return
        }
        */

        var metrics = {
            game: game,
            version: version,
            startDate: startDate,
            endDate: endDate,
            minPlaytime: minPlaytime,
            maxPlaytime: maxPlaytime

            // else, post request - propagateData()
            // propagateData(metrics)
        };updateGlobalMetrics(metrics);
    };

    return React.createElement(
        'div',
        { className: 'container flex flex-wrap mt-16' },
        React.createElement(
            'div',
            { className: 'max-w-xl mb-10 mx-5' },
            React.createElement(
                'p',
                { className: 'mb-3 text-4xl font-light' },
                'Designer Dashboard'
            ),
            React.createElement(
                'p',
                null,
                'A visualization tool for you to intuitively interpret data collected from gameplays. Pick a game and a time range to begin.'
            )
        ),
        React.createElement(
            'div',
            { className: 'bg-white mb-10 mx-5 shadow-sm px-7 py-7 max-w-xl' },
            React.createElement(
                'div',
                { className: ' mb-3' },
                React.createElement(
                    'div',
                    { className: 'col' },
                    React.createElement(
                        'div',
                        { className: 'input-group' },
                        React.createElement(
                            'div',
                            { className: 'mb-2' },
                            React.createElement(
                                'span',
                                { className: 'text-xl font-light' },
                                'Game'
                            )
                        ),
                        React.createElement(
                            'select',
                            { className: 'form-select block w-full',
                                value: game, onChange: function onChange(e) {
                                    return setGame(e.target.value);
                                }
                            },
                            React.createElement(
                                'option',
                                null,
                                ' '
                            ),
                            gameList()
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'h3',
                    { className: 'text-xl font-light mb-2' },
                    'Date'
                )
            ),
            React.createElement(
                'div',
                { className: 'columns-2  mb-5' },
                React.createElement(
                    'div',
                    { className: 'col' },
                    React.createElement('input', { type: 'date', className: 'block w-full', value: startDate, onChange: function onChange(e) {
                            return setstartDate(e.target.value);
                        } }),
                    React.createElement(
                        'h4',
                        { className: 'text-sm' },
                        'From'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col' },
                    React.createElement('input', { type: 'date', className: 'block w-full', value: endDate, onChange: function onChange(e) {
                            return setEndDate(e.target.value);
                        } }),
                    React.createElement(
                        'h4',
                        { className: 'text-sm' },
                        'To'
                    )
                )
            ),
            React.createElement('div', { className: 'row columns-2 mb-3' }),
            React.createElement(
                'div',
                { className: 'flex space-x-2 items-center' },
                loading ? React.createElement(
                    Fragment,
                    null,
                    React.createElement(CogIcon, { className: 'animate-spin h-8 w-8' }),
                    ' \xA0This might take a while...'
                ) : React.createElement(LargeButton, {
                    className: 'cursor-progress',
                    onClick: formValidation,
                    label: 'Visualize'
                })
            )
        )
    );
}