import { React } from 'react';
import { CogIcon } from '@heroicons/react/solid'

export default function LoadingBlur({ loading, height, width }) {

    return loading ?
        <div className="absolute left-0 top-0 w-screen h-screen z-10 backdrop-blur-md flex justify-center items-center space-x-3">
            <CogIcon className={`'animate-spin h-${height} w-${width}'`} />
            <p className="text-3xl font-light">Loading...</p>
        </div>
        :
        <></>

}