import { EyeIcon, XIcon } from "@heroicons/react/solid"

export default function PlayersList({ data, redirect, playerHighlight, setHighlight, setPlayerList }) {
    return (
        <div className="fixed top-14 right-3 w-auto">
            <div className="p-2 flex items-center space-x-2 justify-between">
                <div className='font-bold text-lg underline'>{data.title}</div>
                <XIcon className="w-6 h-6 cursor-pointer" onClick={() => { setPlayerList(null) }} />
            </div>

            <div className="h-2/3 overflow-y-auto">
                <table className="table-auto bg-stone-200">
                    <thead>
                        <tr className="text-left">
                            <th className='p-2 font-medium'>Player ID</th>
                            <th className='p-2 font-medium'>Sessions</th>
                            <th className='p-2 font-medium'>Jobs Completed</th>
                            <th className='p-2 font-medium'>Active Time</th>
                            {/* <th className='p-2 font-medium'>Timeline</th> */}
                        </tr>
                    </thead>

                    <tbody>
                    {data.players.map((player, i) =>
                        <tr key={player + i}
                            className={`px-2 py-1 border-b ${player === playerHighlight ? 'bg-stone-300' : 'bg-white'}`}
                            onClick={() => {
                                setHighlight(player === playerHighlight ? null : player)
                            }}
                        >
                            <td className='p-2 font-light cursor-default'>{player}</td>
                            <td className='p-2 font-light cursor-default'>{player}</td>
                            <td className='p-2 font-light cursor-default'>{player}</td>
                            <td className='p-2 font-light cursor-default'>{player}</td>
                            <td className='p-2 font-light cursor-default'>
                                <EyeIcon
                                    className="w-5 h-5 cursor-pointer"
                                    onClick={() => redirect({ player: player })}
                                />
                            </td>
                        </tr>

                    )}
                </tbody>

            </table>
            </div>
        </div>
    )
}