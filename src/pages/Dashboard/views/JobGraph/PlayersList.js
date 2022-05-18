import { EyeIcon } from "@heroicons/react/solid"

export default function PlayersList({ data, redirect, playerHighlight, setHighlight }) {
    return (
        <div className="fixed top-14 right-3 w-64">
            <div className="p-2 bg-stone-100 grid grid-cols-1 gap-4 ">
                <div className='font-medium'>{data.title}</div>
                {/* <div className='p-2 font-medium'>Time taken</div>
                <div className='p-2 font-medium'>Outcome</div> */}
            </div>
            <div className=" h-96 overflow-y-auto">
                {data.players.map((player, i) => {
                return (
                    <div
                        key={player + i}
                        className={`px-2 py-1 border-b ${player === playerHighlight ? 'bg-stone-200' : 'bg-white'}`}
                        onClick={() => {
                            setHighlight(player === playerHighlight ? null : player)
                        }}
                    >

                        <div className="p-2 flex items-center justify-between">
                            <div className=" cursor-default ">{player}</div>
                            <EyeIcon
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => redirect({ player: player })}
                            />
                            {/* <div className='p-2'>{player.duration} sec</div>
                            <div className='p-2'>{player.outcome}</div> */}

                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}