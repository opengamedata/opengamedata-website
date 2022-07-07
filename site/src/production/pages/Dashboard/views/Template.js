import { Fragment } from 'react';
import * as d3 from "d3";
import { useD3 } from "../../../hooks/useD3";

export default function Template(_ref) {
    var data = _ref.data;

    var diagram = useD3(function (svg) {
        var circle = svg.insert('circle').attr('cx', 10).attr('cy', 10).attr('r', 10);

        // const json = circle.append('p').text(JSON.stringify(data))
    }, [data]);

    return React.createElement(
        Fragment,
        null,
        React.createElement("svg", {
            ref: diagram,
            className: "h-96 w-full mx-0"
        })
    );
}