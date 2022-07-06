
export default function About() {
    return React.createElement(
        "div",
        { className: "container pt-16" },
        React.createElement(
            "div",
            { className: "mb-10 mx-10 pr-10 max-w-xl " },
            React.createElement(
                "p",
                null,
                "v0.1.0 These anonymous data are provided in service of future educational data mining research. They are made available under the ",
                React.createElement(
                    "a",
                    {
                        className: "text-yellow-600",
                        href: "https://creativecommons.org/publicdomain/zero/1.0/",
                        rel: "noreferrer",
                        target: "_blank" },
                    "Creative Commons CCO 1.0 Universal license"
                ),
                ". Source code for this website and related data processing is available on ",
                React.createElement(
                    "a",
                    {
                        className: "text-yellow-600",
                        href: "https://github.com/opengamedata",
                        rel: "noreferrer",
                        target: "_blank" },
                    "github"
                ),
                "."
            )
        ),
        React.createElement("div", { className: "mb-10 pr-10 max-w-xl" })
    );
}