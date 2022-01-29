

export default function SmallButton({ selected, action, label }) {
    const baseStyle = "px-2 py-1 m-1 border border-slate-800 transition-colors ease-in-out duration-300 font-medium hover:text-yellow-300 hover:bg-slate-800 rounded-md text-sm "

    return (
        <button
            className={selected ? baseStyle + 'text-yellow-300 bg-slate-800' : baseStyle + 'bg-white'}
            onClick={action}
        >
            {label}
        </button>
    )

}