export default function PlayersList({ data, redirect }) {

    return (
        <div className="fixed top-14 right-3 w-48">
            <div className="px-2 bg-stone-100 grid grid-cols-1 gap-4 ">
                <div className='p-2 font-medium'>{data.title}</div>
                {/* <div className='p-2 font-medium'>Time taken</div>
                <div className='p-2 font-medium'>Outcome</div> */}
            </div>
            <div className=" h-96 overflow-y-scroll">
                {data.players.map((player, i) => {
                return (
                    <div key={player + i} className="px-2 py-1 border-b bg-white" onClick={() => redirect({ player: player })}>
                        <div className="grid grid-cols-1 gap-4 cursor-pointer">
                            <div className='p-2'>{player}</div>
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