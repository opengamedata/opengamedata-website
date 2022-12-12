import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="container p-10">
            <p className="text-4xl font-light mb-5">Page Not Found</p>
            <p className="mb-2">Please make sure you entered a valid URL.</p>
            <Link className="text-yellow-600" to="/">TAKE ME HOME</Link>
        </div>
    )
}