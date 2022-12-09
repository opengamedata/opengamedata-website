// global imports
import { useState, useEffect, useReducer } from 'react';
// local imports
import LargeButton from '../../components/buttons/LargeButton';
import { API_ORIGIN, timeline_url_path, vis_games } from '../../config';

import Settings from './Settings';
import InitialVisualizer from './InitialVisualizer';
import JobVisualizer from './JobVisualizer';
import PlayerVisualizer from './PlayerVisualizer';
import LoadingBlur from '../../components/LoadingBlur';


export default function VizContainer(props) {
   // whether initial form completed
   const [initialized, setInitialized] = useState(false); // in production: defalt to false 
   const [gameSelected, setGameSelected] = useState(vis_games[0]);
   const [gameVersions, setGameVersions] = useReducer({
      app_versions: [],
      log_versions: []
   })

   // vis metrics
   const [metrics, setMetrics] = useState({
      game: '',
      version: '',
      startDate: '',
      endDate: '',
      minPlaytime: 0,
      maxPlaytime: 0
   })
   const [viewMetrics, setViewMetrics] = useState()
   const [currentView, setCurrentView] = useState('JobGraph')
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState(null);

   const emptyContainer = () => {
      return (
         <InitialVisualizer
            loading={loading}
            updateGlobalMetrics={updateGlobalMetrics}
         />
      )
   }

   const filledContainer = () => {
      <>
         {currentView === 'JobGraph' &&
            <Settings
               metrics={metrics}
               loading={loading}
               updateGlobalMetrics={updateGlobalMetrics}
            />
         }
         <LoadingBlur loading={loading} />
         {data &&
            {
               'JobGraph':
                  <JobVisualizer
                     rawData={data}
                     metrics={metrics}
                     updateViewMetrics={updateViewMetrics} />,
               'PlayerTimeline':
                  <PlayerVisualizer
                     rawData={data}
                     metrics={metrics}
                     viewMetrics={viewMetrics}
                     updateViewMetrics={updateViewMetrics} />
            }[currentView]
         }
      </>
   }


    return (
      <div className='w-screen'>

         {/* For DEBUG purpose, remove in production */}
         <div className='fixed top-0 right-1/2 z-10'>
            <LargeButton
               label='clear cache'
               onClick={() => {
                  localStorage.clear()
                  alert('localStorage reset')
               }}
            />
         </div>


         {!initialized ? emptyContainer() : filledContainer()
         }
      </div>

    )
}