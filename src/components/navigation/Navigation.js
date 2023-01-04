import { React } from 'react';
import { NavLink } from "react-router-dom";

export default function Navigation() {
    let base = 'opengamedata-testing/'

    return (
        <nav className="w-screen flex justify-between fixed top-0 bg-white">
            <base href={base}></base>
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
                        " to={base+"about"}>ABOUT</NavLink>
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
                        " to={base+"./datasets"}>DATASETS</NavLink>
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
                        " to={base}>DASHBOARD</NavLink>
            </div>
        </nav>
    )
}