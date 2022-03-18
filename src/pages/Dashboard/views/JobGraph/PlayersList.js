export default function PlayersList({ data }) {

    const redirect = () => {

    }

    return (
        <div className="fixed top-14 right-3">
            <div className="px-2 bg-slate-100 grid grid-cols-1 gap-4 border">
                <div className='p-2 font-medium'>Player ID</div>
                {/* <div className='p-2 font-medium'>Time taken</div>
                <div className='p-2 font-medium'>Outcome</div> */}
            </div>
            {data.map((player) => {
                return (
                    <div key={player.id} className="px-2 border-b" onClick={redirect}>
                        <div className="grid grid-cols-1 gap-4">
                            <div className='p-2'>{player.id}</div>
                            {/* <div className='p-2'>{player.duration} sec</div>
                            <div className='p-2'>{player.outcome}</div> */}

                        </div>
                    </div>)
            })}
        </div>
    )
}