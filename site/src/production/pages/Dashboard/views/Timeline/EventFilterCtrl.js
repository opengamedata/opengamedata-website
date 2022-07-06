var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';

export default function EventFilterCtrl(_ref) {
    var data = _ref.data,
        eventTypesDisplayed = _ref.eventTypesDisplayed,
        setEventTypesDisplayed = _ref.setEventTypesDisplayed;

    var _useState = useState(true),
        _useState2 = _slicedToArray(_useState, 2),
        expanded = _useState2[0],
        setExpanded = _useState2[1];

    /**
     * genrates the options (radio buttons) for the event type filter
     */


    var filterControl = function filterControl() {
        var listOfEvents = Object.entries(data.meta.types).map(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                type = _ref3[0],
                color = _ref3[1];

            return React.createElement(
                'div',
                { key: type },
                React.createElement(
                    'label',
                    { className: 'text-xs font-light ' },
                    React.createElement('input', { className: 'form-checkbox',
                        style: eventTypesDisplayed.has(type) ? { backgroundColor: color } : {} // not pretty but works
                        , type: 'checkbox',
                        checked: eventTypesDisplayed.has(type),
                        onChange: function onChange() {
                            if (eventTypesDisplayed.has(type) && eventTypesDisplayed.size > 1) setEventTypesDisplayed(new Set([].concat(_toConsumableArray(eventTypesDisplayed)).filter(function (d) {
                                return d !== type;
                            })));else {
                                var newList = [].concat(_toConsumableArray(eventTypesDisplayed));
                                newList.push(type);
                                setEventTypesDisplayed(new Set(newList));
                            }
                        }
                    }),
                    React.createElement(
                        'span',
                        null,
                        ' ',
                        type
                    )
                )
            );
        });
        return listOfEvents;
    };

    return expanded ? React.createElement(
        'div',
        { className: 'fixed bottom-0 right-0 bg-white py-5 px-8 rounded-md shadow-sm' },
        React.createElement(
            'fieldset',
            { className: 'font-light' },
            React.createElement(
                'div',
                { className: 'flex justify-between items-center' },
                React.createElement(
                    'legend',
                    { className: '' },
                    'Show event types of:'
                ),
                React.createElement(ChevronDownIcon, {
                    className: 'h-6 w-6 cursor-pointer',
                    onClick: function onClick() {
                        setExpanded(false);
                    }
                })
            ),
            React.createElement(
                'div',
                { className: 'mt-2 grid xl:grid-cols-6 lg:grid-cols-3 grid-flow-row gap-1' },
                eventTypesDisplayed instanceof Set && filterControl()
            )
        )
    ) : React.createElement(
        'div',
        {
            className: 'fixed bottom-0 right-0 py-5 px-8 flex justify-between items-center cursor-pointer',
            onClick: function onClick() {
                setExpanded(true);
            }
        },
        React.createElement(
            'legend',
            { className: 'font-medium underline' },
            'Event Filter'
        ),
        React.createElement(ChevronUpIcon, { className: 'h-6 w-6' })
    );
}