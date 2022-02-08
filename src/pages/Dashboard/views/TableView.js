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
            {data.map(({ job, avgDuration, stdDuration, jobStarted, jobFinished, nextJobs }) => {
                return (
                    <div key={job} className="px-2 border-b">
                        <div className="grid grid-cols-6 gap-4">
                            <div className='p-2'>{job}</div>
                            <div className='p-2'>{avgDuration} sec</div>
                            <div className='p-2'>{stdDuration}</div>
                            <div className='p-2'>{jobStarted}</div>
                            <div className='p-2'>{jobFinished}</div>
                            <div className='p-2'>{nextJobs.map(element => element[0]+' ')}</div>
                        </div>
                    </div>)
            })}
        </>
    )
}