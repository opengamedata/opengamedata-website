import { Link } from "react-router-dom";
// import LargeButton from "../components/buttons/LargeButton";

export default function NotFound() {
    return React.createElement(
        "div",
        { className: "container p-10" },
        React.createElement(
            "p",
            { className: "text-4xl font-light mb-5" },
            "Page Not Found"
        ),
        React.createElement(
            "p",
            { className: "mb-2" },
            "Please make sure you entered a valid URL."
        ),
        React.createElement(
            Link,
            { className: "text-yellow-600", to: "/" },
            "TAKE ME HOME"
        )
    );
}