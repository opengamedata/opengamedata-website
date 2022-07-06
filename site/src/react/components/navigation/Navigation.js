import { NavLink } from "react-router-dom";

export default function Navigation() {


    return (
        <nav className="w-screen flex justify-between fixed top-0 bg-white">
            <NavLink className="px-5 py-3 tracking-wide font-light" to="/">
                Open Game Data
            </NavLink>

            <div className="flex">
                <NavLink className="
                        font-light
                        tracking-wide
                        px-5
                        py-3
                        transition-colors 
                        duration-300
                        ease-in-out
                        hover:text-yellow-300
                        hover:bg-slate-800
                        " to="/about">ABOUT</NavLink>
                <NavLink className="
                        font-light
                        tracking-wide
                        px-5
                        py-3
                        transition-colors 
                        duration-300
                        ease-in-out
                        hover:text-yellow-300
                        hover:bg-slate-800
                        " to="/datasets">DATASETS</NavLink>
                <NavLink className="
                        font-light
                        tracking-wide
                        px-5
                        py-3
                        transition-colors 
                        duration-300
                        ease-in-out
                        hover:text-yellow-300
                        hover:bg-slate-800
                        " to="/dashboard">DASHBOARD</NavLink>
            </div>
        </nav>
    )
}