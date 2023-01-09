import { React } from 'react'
import { EyeIcon, XIcon } from "@heroicons/react/solid"

export default function PlayersList({ data, redirect, playerHighlight, setHighlight, setPlayerList, playerSummary }) {

    // console.log(playerSummary)
    return (
        <div className="fixed top-14 right-3 w-auto">
            <div className="p-2 flex items-center space-x-2 justify-between">
                <div className='font-bold text-lg underline'>{data.title}</div>
                <XIcon className="w-6 h-6 cursor-pointer" onClick={() => { setPlayerList(null) }} />
            </div>

            <div className="max-h-96 overflow-y-auto">
                <table className="table-auto bg-stone-200">
                    <thead>
                        <tr className="text-left">
                            <th className='px-4 py-2 font-medium'>Player ID</th>
                            <th className='px-4 py-2 font-medium'>Sessions</th>
                            <th className='px-4 py-2 font-medium'>Jobs Done</th>
                            <th className='px-4 py-2 font-medium'>Active Time</th>
                            {/* <th className='px-4 py-2 font-medium'>Timeline</th> */}
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
                            <td className='px-4 py-2 font-light cursor-default'>{player}</td>
                            <td className='px-4 py-2 font-light cursor-default'>{playerSummary[player].num_sessions}</td>
                            <td className='px-4 py-2 font-light cursor-default'>{playerSummary[player].jobs_completed.length}</td>
                            <td className='px-4 py-2 font-light cursor-default'>{playerSummary[player].active_time}</td>
                            <td className='px-4 py-2 font-light cursor-default'>
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