import { React } from 'react';

export default function SmallButton({ selected, action, label }) {
    const baseStyle = "px-2 py-1 mr-2 my-1 shadow-sm border border-stone-300 transition-colors ease-in-out duration-300 font-medium hover:text-yellow-300 hover:bg-slate-800 rounded-sm text-sm "

    return (
        <button
            className={selected ? baseStyle + 'text-yellow-300 bg-slate-800' : baseStyle + 'bg-white'}
            onClick={action}
        >
            {label}
        </button>
    )

}