import { Fragment } from 'react';
import { CogIcon } from '@heroicons/react/solid';
export default function LoadingBlur(_ref) {
    var loading = _ref.loading;


    return loading ? React.createElement(
        'div',
        { className: 'absolute left-0 top-0 w-screen h-screen z-10 backdrop-blur-md flex justify-center items-center space-x-3' },
        React.createElement(CogIcon, { className: 'animate-spin h-12 w-12' }),
        React.createElement(
            'p',
            { className: 'text-3xl font-light' },
            'Loading...'
        )
    ) : React.createElement(Fragment, null);
}