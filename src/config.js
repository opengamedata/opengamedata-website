
/**
 * For dataset download
 */
// the server that hosts all the downloadable datasets
export const FILE_SERVER = 'https://opengamedata.fielddaylab.wisc.edu';

// list of games with downloadable datasets
export const game_list = [
    'AQUALAB',
    'BACTERIA',
    'BALLOON',
    'CRYSTAL',
    'CYCLE_CARBON',
    'CYCLE_NITROGEN',
    'CYCLE_WATER',
    'EARTHQUAKE',
    'JOWILDER',
    'LAKELAND',
    'MAGNET',
    'WAVES',
    'WIND',
    'SHADOWSPECT',
    'SHIPWRECKS'
]

// thumbnail image paths
export const thumbs = {
    'AQUALAB': './img/thumbs/aqualab.jpeg',
    'BACTERIA': './img/thumbs/bacteria.jpeg',
    'BALLOON': './img/thumbs/balloon.jpeg',
    'CRYSTAL': './img/thumbs/crystal.jpeg',
    'CYCLE_CARBON': './img/thumbs/carbongame.jpeg',
    'CYCLE_NITROGEN': './img/thumbs/nitrogengame.jpeg',
    'CYCLE_WATER': './img/thumbs/watergame.jpeg',
    'EARTHQUAKE': './img/thumbs/earthquake.png',
    'JOWILDER': './img/thumbs/jowilder.jpeg',
    'LAKELAND': './img/thumbs/lakeland.jpeg',
    'MAGNET': './img/thumbs/magnet.png',
    'WAVES': './img/thumbs/wave.jpeg',
    'WIND': './img/thumbs/wind.png',
    'SHADOWSPECT': './img/thumbs/shadowspect.png',
    'SHIPWRECKS': './img/thumbs/shipwrecks.jpeg'
}

// links to the documentations on the datasets 
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
    'SHADOWSPECT': 'https://github.com/fielddaylab/shadowspect/blob/master/readme.md',
    'SHIPWRECKS': 'https://github.com/fielddaylab/lost_emerald/blob/master/README.md'
}

// links to the documentations on the features of datasets 
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
    'SHADOWSPECT': 'https://opengamedata.fielddaylab.wisc.edu/data/SHADOWSPECT/readme.md',
    'SHIPWRECKS': 'https://opengamedata.fielddaylab.wisc.edu/data/SHIPWRECKS/readme.md'
}

// links to actual games
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
    'WIND': 'https://theyardgames.org/game/wind.html',
    'SHIPWRECKS': 'https://pbswisconsineducation.org/emerald/play-the-game/'
}

/**
 * For Vis Dashboard
 */
// open game data core
export const API_ORIGIN = 'https://fieldday-web.wcer.wisc.edu/wsgi-bin/opengamedata.wsgi/'

// list of games that can be visualized in the Dashboard (used in VisForm)
export const vis_games = ['AQUALAB', 'SHIPWRECKS']

// list of API call params for each game
// export const requested_extractors = {
//     'AQUALAB': [
//         'TopJobCompletionDestinations',
//         'ActiveJobs',
//         'JobsAttempted',
//         'TopJobSwitchDestinations',
//         'PlayerSummary',
//         'PopulationSummary',

//         'JobsCompleted',
//         'SessionID',
//         'SessionDuration'
//     ],
//     'SHIPWRECKS': ['TopJobCompletionDestinations',
//         'ActiveJobs',
//         'JobsAttempted',
//         'PlayerSummary',
//         'PopulationSummary',

//         'JobsCompleted',
//         'SessionID',
//         'SessionDuration'
//     ],
// }

// when fetching timeline from the graph, what type of timeline each game supports (either 'player' or 'session')
export const timeline_url_path = {
    'AQUALAB': 'player',
    'SHIPWRECKS': 'session'
}

// specifies what event types to display when timeline is initialized
export const initial_timeline_filter_options = {
    'AQUALAB': ['switch_job', 'complete_task', 'complete_job', 'accept_job'],
    'SHIPWRECKS': [] // TODO when backend implemented EventList for this game, consult team about what to include
}

export const color_20 = ["#0cc0aa", "#fc2c44", "#70ce57", "#fb57f9", "#2cf52b", "#c972bd", "#e5ea53", "#f6248f", "#d8fbc9", "#e56c56", "#77d1fd", "#ad7947", "#2282f5", "#f6bb86", "#846dff", "#798a58", "#f7c5f1", "#458da6", "#fbbd13", "#8d7ca6"]
export const color_16 = ["#75eab6", "#f92e5d", "#0ca82e", "#fa63d5", "#b3e61c", "#8b6fed", "#51f310", "#d47389", "#05957a", "#f17e45", "#3588d1", "#fbd127", "#bbc3fe", "#799d10", "#4bd6fd", "#957e84"]