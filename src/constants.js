export const FILE_SERVER = 'https://opengamedata.fielddaylab.wisc.edu';

export const API_PATH = 'https://fieldday-web.wcer.wisc.edu/wsgi-bin/opengamedata.wsgi/game/'

export const thumbs = {
    'AQUALAB': './assets/aqualab-thumb.jpg',
    'BACTERIA': './assets/bacteria-thumb.png',
    'BALLOON': './assets/balloon-thumb.png',
    'CRYSTAL': './assets/crystal-thumb.png',
    'CYCLE_CARBON': './assets/cycle-carbon-thumb.png',
    'CYCLE_NITROGEN': './assets/cycle-nitrogen-thumb.png',
    'CYCLE_WATER': './assets/cycle-water-thumb.png',
    'EARTHQUAKE': './assets/earthquake-thumb.png',
    'JOWILDER': './assets/jowilder-thumb.jpg',
    'LAKELAND': './assets/lakeland-thumb.jpg',
    'MAGNET': './assets/magnet-thumb.png',
    'WAVES': './assets/waves-thumb.jpg',
    'WIND': './assets/wind-thumb.png',
    'SHADOWSPECT': './assets/shadowspect-thumb.jpg'
}

export const data_readmes = {
    'AQUALAB': 'https://github.com/fielddaylab/aqualab/blob/develop/README.md',
    'BACTERIA': 'https://github.com/fielddaylab/bacteria/blob/master/readme.md',
    'BALLOON': 'https://github.com/fielddaylab/balloon/blob/master/readme.md',
    'CRYSTAL': 'https://github.com/fielddaylab/crystal/blob/master/README.md',
    'CYCLE_CARBON': 'https://github.com/fielddaylab/cycle/blob/master/README',
    'CYCLE_NITROGEN': 'https://github.com/fielddaylab/cycle/blob/master/README',
    'CYCLE_WATER': 'https://github.com/fielddaylab/cycle/blob/master/README',
    'EARTHQUAKE': 'https://github.com/fielddaylab/earthquake/blob/master/readme.md',
    'JOWILDER': 'https://github.com/fielddaylab/jo_wilder/blob/master/README.md',
    'LAKELAND': 'https://github.com/fielddaylab/lakeland/blob/master/README.md',
    'MAGNET': 'https://github.com/fielddaylab/magnetism/blob/master/readme.md',
    'WAVES': 'https://github.com/fielddaylab/waves/blob/master/README.md',
    'WIND': 'https://github.com/fielddaylab/wind/blob/master/readme.md',
    'SHADOWSPECT': 'https://github.com/fielddaylab/shadowspect/blob/master/readme.md'
}

export const feature_readmes = {
    'AQUALAB': 'https://opengamedata.fielddaylab.wisc.edu/data/AQUALAB/readme.md',
    'BACTERIA': 'https://opengamedata.fielddaylab.wisc.edu/data/BACTERIA/readme.md',
    'BALLOON': 'https://opengamedata.fielddaylab.wisc.edu/data/BALLOON/readme.md',
    'CRYSTAL': 'https://opengamedata.fielddaylab.wisc.edu/data/CRYSTAL/readme.md',
    'CYCLE_CARBON': 'https://opengamedata.fielddaylab.wisc.edu/data/CYCLE_CARBON/readme.md',
    'CYCLE_NITROGEN': 'https://opengamedata.fielddaylab.wisc.edu/data/CYCLE_NITROGEN/readme.md',
    'CYCLE_WATER': 'https://opengamedata.fielddaylab.wisc.edu/data/CYCLE_WATER/readme.md',
    'EARTHQUAKE': 'https://opengamedata.fielddaylab.wisc.edu/data/EARTHQUAKE/readme.md',
    'JOWILDER': 'https://opengamedata.fielddaylab.wisc.edu/data/JOWILDER/readme.md',
    'LAKELAND': 'https://opengamedata.fielddaylab.wisc.edu/data/LAKELAND/readme.md',
    'MAGNET': 'https://opengamedata.fielddaylab.wisc.edu/data/MAGNET/readme.md',
    'WAVES': 'https://opengamedata.fielddaylab.wisc.edu/data/WAVES/readme.md',
    'WIND': 'https://opengamedata.fielddaylab.wisc.edu/data/WIND/readme.md',
    'SHADOWSPECT': 'https://opengamedata.fielddaylab.wisc.edu/data/SHADOWSPECT/readme.md'
}

export const game_links = {
    'AQUALAB': 'https://fielddaylab.wisc.edu/play/aqualab/ci/develop',
    'BACTERIA': 'https://theyardgames.org/game/bacteria/',
    'BALLOON': 'https://theyardgames.org/game/balloon.html',
    'CRYSTAL': 'https://theyardgames.org/game/crystal.html',
    'CYCLE_CARBON': 'https://theyardgames.org/game/carbon.html',
    'CYCLE_NITROGEN': 'https://theyardgames.org/game/nitrogen.html',
    'CYCLE_WATER': 'https://theyardgames.org/game/water.html',
    'EARTHQUAKE': 'https://theyardgames.org/game/earthquake.html',
    'JOWILDER': 'https://wpteducation.org/CapitolCase',
    'LAKELAND': 'https://fielddaylab.wisc.edu/play/lakeland/game/iframe.html',
    'MAGNET': 'https://theyardgames.org/game/magnetism.html',
    'SHADOWSPECT': 'http://shadowspect.org/',
    'WAVES': 'https://theyardgames.org/game/waves.html',
    'WIND': 'https://theyardgames.org/game/wind.html'
}

// job11_JobCompleteCount: "0"
// job11_JobCompletionTime: "0:00:00"
// job11_JobName: "bayou-shrip-tastrophe"
// job11_JobStartCount: "1"
// job11_JobTasksCompleted: "0"

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
        { id: 'start', avgTime: 1 },
        { id: 'job 1', avgTime: .71 },
        { id: 'job 2', avgTime: .4 },
        { id: 'job 3', avgTime: .3 },
        { id: 'job 4', avgTime: .1 },
        { id: 'quit', avgTime: 1 },
    ],
    links: [ // represents player transitions: {value: players who made this transition}
        {source:'start', target: 'job 1', value: 10},
        {source:'job 1', target: 'job 2', value: 1},
        // {source:'job 1', target: 'job 3', value: 1},
        // {source:'job 1', target: 'job 4', value: 1},
        // {source:'job 1', target: 'quit', value: 1},
        {source:'job 2', target: 'job 3', value: 1},
        {source:'job 2', target: 'job 4', value: 1},
        {source:'job 2', target: 'quit', value: 1},
        {source:'job 3', target: 'job 4', value: 1},
        {source:'job 3', target: 'quit', value: 1},
        {source:'job 4', target: 'quit', value: 1},
    ]
}