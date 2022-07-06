import { EyeIcon, XIcon } from "@heroicons/react/solid";

export default function PlayersList(_ref) {
    var data = _ref.data,
        redirect = _ref.redirect,
        playerHighlight = _ref.playerHighlight,
        setHighlight = _ref.setHighlight,
        setPlayerList = _ref.setPlayerList,
        playerSummary = _ref.playerSummary;


    // console.log(playerSummary)
    return React.createElement(
        "div",
        { className: "fixed top-14 right-3 w-auto" },
        React.createElement(
            "div",
            { className: "p-2 flex items-center space-x-2 justify-between" },
            React.createElement(
                "div",
                { className: "font-bold text-lg underline" },
                data.title
            ),
            React.createElement(XIcon, { className: "w-6 h-6 cursor-pointer", onClick: function onClick() {
                    setPlayerList(null);
                } })
        ),
        React.createElement(
            "div",
            { className: "max-h-96 overflow-y-auto" },
            React.createElement(
                "table",
                { className: "table-auto bg-stone-200" },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        { className: "text-left" },
                        React.createElement(
                            "th",
                            { className: "px-4 py-2 font-medium" },
                            "Player ID"
                        ),
                        React.createElement(
                            "th",
                            { className: "px-4 py-2 font-medium" },
                            "Sessions"
                        ),
                        React.createElement(
                            "th",
                            { className: "px-4 py-2 font-medium" },
                            "Jobs Done"
                        ),
                        React.createElement(
                            "th",
                            { className: "px-4 py-2 font-medium" },
                            "Active Time"
                        )
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    data.players.map(function (player, i) {
                        return React.createElement(
                            "tr",
                            { key: player + i,
                                className: "px-2 py-1 border-b " + (player === playerHighlight ? 'bg-stone-300' : 'bg-white'),
                                onClick: function onClick() {
                                    setHighlight(player === playerHighlight ? null : player);
                                }
                            },
                            React.createElement(
                                "td",
                                { className: "px-4 py-2 font-light cursor-default" },
                                player
                            ),
                            React.createElement(
                                "td",
                                { className: "px-4 py-2 font-light cursor-default" },
                                playerSummary[player].num_sessions
                            ),
                            React.createElement(
                                "td",
                                { className: "px-4 py-2 font-light cursor-default" },
                                playerSummary[player].jobs_completed.length
                            ),
                            React.createElement(
                                "td",
                                { className: "px-4 py-2 font-light cursor-default" },
                                playerSummary[player].active_time
                            ),
                            React.createElement(
                                "td",
                                { className: "px-4 py-2 font-light cursor-default" },
                                React.createElement(EyeIcon, {
                                    className: "w-5 h-5 cursor-pointer",
                                    onClick: function onClick() {
                                        return redirect({ player: player });
                                    }
                                })
                            )
                        );
                    })
                )
            )
        )
    );
}