

export default function SmallButton(_ref) {
    var selected = _ref.selected,
        action = _ref.action,
        label = _ref.label;

    var baseStyle = "px-2 py-1 mr-2 my-1 shadow-sm border border-stone-300 transition-colors ease-in-out duration-300 font-medium hover:text-yellow-300 hover:bg-slate-800 rounded-sm text-sm ";

    return React.createElement(
        'button',
        {
            className: selected ? baseStyle + 'text-yellow-300 bg-slate-800' : baseStyle + 'bg-white',
            onClick: action
        },
        label
    );
}