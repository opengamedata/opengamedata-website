import { Link } from "react-router-dom";

export default function Navigation() {

    return (
        <nav className="small-nav nav-fixed" id="">
            <div className="left">
                <ul>
                    <li><Link to="/">Open Game Data</Link></li>
                </ul>
            </div>
            <div className="right">
                <ul>
                    <li className="small-navlink"><Link to="/about">About</Link></li>
                    <li className="small-navlink"><Link to="/datasets">Datasets</Link></li>
                    <li className="small-navlink"><Link to="/dashboard">Visulizations</Link></li>
                </ul>
            </div>
        </nav>
    )
}