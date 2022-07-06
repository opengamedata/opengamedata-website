import { NavLink } from "react-router-dom";

export default function Navigation() {

    return React.createElement(
        "nav",
        { className: "w-screen flex justify-between fixed top-0 bg-white" },
        React.createElement(
            NavLink,
            { className: "px-5 py-3 tracking-wide font-light", to: "/" },
            "Open Game Data"
        ),
        React.createElement(
            "div",
            { className: "flex" },
            React.createElement(
                NavLink,
                { className: "\r font-light\r tracking-wide\r px-5\r py-3\r transition-colors \r duration-300\r ease-in-out\r hover:text-yellow-300\r hover:bg-slate-800\r ", to: "/about" },
                "ABOUT"
            ),
            React.createElement(
                NavLink,
                { className: "\r font-light\r tracking-wide\r px-5\r py-3\r transition-colors \r duration-300\r ease-in-out\r hover:text-yellow-300\r hover:bg-slate-800\r ", to: "/datasets" },
                "DATASETS"
            ),
            React.createElement(
                NavLink,
                { className: "\r font-light\r tracking-wide\r px-5\r py-3\r transition-colors \r duration-300\r ease-in-out\r hover:text-yellow-300\r hover:bg-slate-800\r ", to: "/dashboard" },
                "DASHBOARD"
            )
        )
    );
}