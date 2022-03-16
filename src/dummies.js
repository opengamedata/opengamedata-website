export const dummyData = [
    {
        job: '1',
        avgDuration: 300,
        stdDuration: .4,
        jobStarted: 36,
        jobFinished: 30,
        nextJobs: [['3', .2], ['2', .7], ['4', .1]]
    },
    {
        job: '2',
        avgDuration: 100,
        stdDuration: .2,
        jobStarted: 30,
        jobFinished: 24,
        nextJobs: [['3', .7], ['4', .2], ['exited', .1]]
    },
    {
        job: '3',
        avgDuration: 100,
        stdDuration: .2,
        jobStarted: 30,
        jobFinished: 24,
        nextJobs: [['4', .9], ['exited', .1]]
    },
    {
        job: '4',
        avgDuration: 300,
        stdDuration: .4,
        jobStarted: 36,
        jobFinished: 24,
        nextJobs: [['exited', 1]]
    }
]

export const reducedDummy = {
    nodes: [ // represents jobs: {id: name of the job, group: average time taken (seconds)} 
        { id: 'start', JobName: 'start', JobStartCount: 100, JobCompleteCount: 0, 'JobsAttempted-avg-time-complete': 180, 'JobsAttempted-std-dev-complete': .5 },
        { id: 'job 1', JobName: 'job 1', JobStartCount: 100, JobCompleteCount: 100, 'JobsAttempted-avg-time-complete': 380, 'JobsAttempted-std-dev-complete': .5 },
        { id: 'job 2', JobName: 'job 2', JobStartCount: 100, JobCompleteCount: 80, 'JobsAttempted-avg-time-complete': 780, 'JobsAttempted-std-dev-complete': .5 },
        { id: 'job 3', JobName: 'job 3', JobStartCount: 100, JobCompleteCount: 30, 'JobsAttempted-avg-time-complete': 580, 'JobsAttempted-std-dev-complete': .5 },
        { id: 'job 4', JobName: 'job 4', JobStartCount: 100, JobCompleteCount: 10, 'JobsAttempted-avg-time-complete': 480, 'JobsAttempted-std-dev-complete': .5 },
        { id: 'quit ', JobName: 'quit', JobStartCount: 100, JobCompleteCount: 0, 'JobsAttempted-avg-time-complete': 180, 'JobsAttempted-std-dev-complete': .5 },
    ],
    links: [ // represents player transitions: {value: players who made this transition}
        { source: 'start', target: 'job 1', sourceName: 'start', targetName: 'job 1', value: 110 },
        { source: 'job 1', target: 'job 2', sourceName: 'job 1', targetName: 'job 2', value: 70 },
        { source: 'job 1', target: 'job 3', sourceName: 'job 1', targetName: 'job 3', value: 6 },
        { source: 'job 3', target: 'job 1', sourceName: 'job 3', targetName: 'job 1', value: 6 },
        { source: 'job 2', target: 'job 3', sourceName: 'job 2', targetName: 'job 3', value: 40 },
        { source: 'job 2', target: 'job 4', sourceName: 'job 2', targetName: 'job 4', value: 1 },
        { source: 'job 2', target: 'quit ', sourceName: 'job 2', targetName: 'quit ', value: 2 },
        { source: 'job 3', target: 'job 4', sourceName: 'job 3', targetName: 'job 4', value: 43 },
        { source: 'job 4', target: 'quit ', sourceName: 'job 4', targetName: 'quit ', value: 8 },
    ],
    meta: {
        SessionCount: 10,
        maxAvgTime: 1000,
        minAvgTime: 130
    }
}

// **session_id** = Column '*session_id*'  
// **app_id** = null  
// **timestamp** = Column '*timestamp*'  
// **event_name** = Column '*event_name*'  
// **event_data** = Column '*event_params*'  
// **app_version** = null  
// **time_offset** = null  
// **user_id** = Column '*user_id*'  
// **user_data** = null  
// **game_state** = null  
// **event_sequence_index** = null 
export const mockData = JSON.parse('{"type": "GET", "val": {"cols": ["TopJobDestinations"], "vals": [[{"8": [[4, 1]], "4": [[7, 1]], "7": [[18, 1]]}]]}, "msg": "SUCCESS: Generated features for the given session", "status": "SUCCESS"}')

