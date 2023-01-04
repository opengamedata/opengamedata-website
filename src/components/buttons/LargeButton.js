import { React } from 'react';

export default function LargeButton({ selected, onClick, label }) {
    const baseStyle = "px-7 py-2 my-3 border border-slate-800 transition-colors ease-in-out duration-300 font-medium text-xl hover:text-yellow-300 hover:bg-slate-800 rounded-md text-sm "

    return (
        <button
            className={selected ? baseStyle + 'text-yellow-300 bg-slate-800' : baseStyle + 'bg-white'}
            onClick={onClick}
        >
            {label}
        </button>
    )

}