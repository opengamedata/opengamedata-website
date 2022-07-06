var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { useState } from "react";
import { QuestionMarkCircleIcon, CursorClickIcon, ViewBoardsIcon, ColorSwatchIcon, CloudIcon } from '@heroicons/react/solid';

export default function JobGraphLegend(_ref) {
    var populationSummary = _ref.populationSummary;

    var _useState = useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        showLegend = _useState2[0],
        setShowLegend = _useState2[1];

    return React.createElement(
        "div",
        { className: "fixed bottom-5 left-8 font-light" },
        showLegend && React.createElement(
            "div",
            { className: "pb-5 pr-5 backdrop-blur" },
            React.createElement(
                "p",
                { className: "font-bold" },
                "Understanding the Graph"
            ),
            React.createElement(
                "p",
                null,
                "Each ",
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "node"
                ),
                " represents a ",
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "job"
                ),
                ", and the ",
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "links"
                ),
                " between nodes denote ",
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "player progression"
                ),
                "."
            ),
            React.createElement(
                "p",
                null,
                "The ",
                React.createElement(ColorSwatchIcon, { className: "w-5 h-5 inline mr-1" }),
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "node color"
                ),
                " signifies the ",
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "% percentage of job completion"
                ),
                "."
            ),
            React.createElement(
                "p",
                null,
                "The ",
                React.createElement(ViewBoardsIcon, { className: "w-5 h-5 inline mr-1" }),
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "link width"
                ),
                " signifies the ",
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "# number of players taking a path"
                ),
                ". Use the radio buttons on the right to change the link type."
            ),
            React.createElement(
                "p",
                null,
                React.createElement(CloudIcon, { className: "w-5 h-5 inline mr-1" }),
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "Hover"
                ),
                " over nodes and links to reveal more details."
            ),
            React.createElement(
                "p",
                null,
                React.createElement(CursorClickIcon, { className: "w-5 h-5 inline mr-1" }),
                React.createElement(
                    "span",
                    { className: "font-semibold" },
                    "Click on a link"
                ),
                " to see the list of players who took this path."
            )
        ),
        React.createElement(
            "div",
            { className: "flex space-x-2 items-center" },
            React.createElement(
                "p",
                { className: "text-4xl font-light" },
                "Job Graph"
            ),
            React.createElement(QuestionMarkCircleIcon, {
                className: "text-slate-500 h-8 w-8",
                onMouseEnter: function onMouseEnter() {
                    setShowLegend(true);
                },
                onMouseLeave: function onMouseLeave() {
                    setShowLegend(false);
                }
            })
        ),
        Object.entries(populationSummary).map(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                key = _ref3[0],
                value = _ref3[1];

            return React.createElement(
                "p",
                { key: key, className: "font-light" },
                key,
                ": ",
                React.createElement(
                    "span",
                    { className: "font-bold" },
                    value
                )
            );
        })
    );
}