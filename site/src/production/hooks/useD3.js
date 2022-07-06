import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export var useD3 = function useD3(renderChartFn) {
    var dependencies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var ref = useRef();

    useEffect(function () {
        // console.log('hook triggered')
        renderChartFn(d3.select(ref.current));
        return function () {};
    }, dependencies);
    return ref;
};