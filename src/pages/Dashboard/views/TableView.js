export default function TableView({ data }) {

    return (
        <>
            <div className="px-2 bg-slate-100 grid grid-cols-6 gap-4">
                <div className='p-2 font-medium'>job</div>
                <div className='p-2 font-medium'>average duration</div>
                <div className='p-2 font-medium'>std.</div>
                <div className='p-2 font-medium'>job started</div>
                <div className='p-2 font-medium'>job finished</div>
                <div className='p-2 font-medium'>next jobs</div>
            </div>
            {data.map((data) => {
                return (
                    <div key={data.job} className="px-2 border-b">
                        <div className="grid grid-cols-6 gap-4">
                            <div className='p-2'>{data.job}</div>
                            <div className='p-2'>{data.avgDuration} sec</div>
                            <div className='p-2'>{data.stdDuration}</div>
                            <div className='p-2'>{data.jobStarted}</div>
                            <div className='p-2'>{data.jobFinished}</div>
                            <div className='p-2'>{data.nextJobs.map(element => element[0]+' ')}</div>
                        </div>
                    </div>)
            })}
        </>
    )
}