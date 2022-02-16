import { NavLink } from "react-router-dom";

export default function Navigation() {


    return (
        <nav className="w-screen flex justify-between shadow-sm fixed top-0 bg-white">
            {/* <div> */}
            <NavLink
                className="px-5  py-3"
                to="/">Open Game Data</NavLink>
            {/* </div> */}
            <div className="flex">
                <NavLink className="
                        px-5
                        py-3
                        transition-colors 
                        duration-300
                        ease-in-out
                        hover:text-yellow-300
                        hover:bg-slate-800
                        " to="/about">About</NavLink>
                <NavLink className="
                        px-5
                        py-3
                        transition-colors 
                        duration-300
                        ease-in-out
                        hover:text-yellow-300
                        hover:bg-slate-800
                        " to="/datasets">Datasets</NavLink>
                <NavLink className="
                        px-5
                        py-3
                        transition-colors 
                        duration-300
                        ease-in-out
                        hover:text-yellow-300
                        hover:bg-slate-800
                        " to="/dashboard">Visulizations</NavLink>
            </div>
        </nav>
    )
}