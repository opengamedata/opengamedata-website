// global imports
import { React, useState, useEffect, useReducer } from 'react';
// local imports
import LargeButton from '../../../components/buttons/LargeButton';
import { API_ORIGIN, timeline_url_path, vis_games } from '../../../config';
import { ViewModes } from '../../../controller/ViewModes';

import DataFilter from '../../DataFilter/DataFilter';
import InitialVisualizer from './InitialVisualizer';
import JobVisualizer from '../../visualizations/JobGraph/JobVisualizer';
import PlayerVisualizer from '../../visualizations/PlayerTimeline/PlayerVisualizer';
import { PopulationSelectionOptions, PlayerSelectionOptions, SessionSelectionOptions } from '../../../controller/SelectionOptions';
import LoadingBlur from '../../../components/LoadingBlur';
import { FilterOptions } from '../../../controller/FilterOptions';

export default function VizContainer(props) {
   // whether initial form completed
   const [initialized, setInitialized] = useState(false); // in production: defalt to false 
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState(null);
   const [viewMode, setViewMode] = useState(ViewModes.POPULATION);
   const [filterOptions, setFilterOptions] = useState(new FilterOptions(0, null, null));
   const [selectionOptions, setSelectionOptions] = useState(
      new PopulationSelectionOptions(
         vis_games[0],
         null, null,
         null, null,
         
      )
   );

   const retrieveData = (url) => {
        // flush current dataset
        setData(null)
        // localStorage.clear() // DEBUG

        // start loading animation
        setLoading(true)
        // console.log(url)

        // if query found in storage, retreive JSON
        const localData = localStorage.getItem(url)
        // console.log(localData)
        if (localData) {
            setData(JSON.parse(localData)) 

            // console.log(localData)


            // store response to parent component state
            setInitialized(true)
            // stop loading animation
            setLoading(false)
        }
        // if not found in storage, request dataset
        else {
            console.log('fetching:', url)

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (data.status !== 'SUCCESS') throw data.msg

                    console.log(data)

                    // store data locally
                    localStorage.setItem(url, JSON.stringify(data.val))
                    // set data state
                    setData(data.val)
                    // store response to parent component state
                    setInitialized(true)
                    // stop loading animation
                    setLoading(false)
                })
                .catch(error => {
                    console.error(error)
                    setLoading(false)
                    alert(error)
                })
        }
   }

   const emptyContainer = () => {
      return (
         <InitialVisualizer
         />
      )
   }

   const filledContainer = () => {
      <>
         {/* TODO: figure out what the height and width ought to be */}
         <LoadingBlur loading={loading} height={10} width={10}/>
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

   const oldInitialViz = (availableGames, currentGame, setCurrentGame, loading) => {
      const populateGameList = () => {
         const games = []
         availableGames.forEach((k) => {
               games.push(
                  <option key={k} value={k}>{k}</option>
               )
         })
         return games
      }

      /* checks if form is properly filled */
      const formValidation = () => {
         // console.log(game, version, startDate, endDate, minPlaytime, maxPlaytime)

         // if empty fields, prompt user to fill in the blanks & return
         // if (!(game && version && startDate && endDate && minPlaytime >= 0 && maxPlaytime)) {
         if (!(game && startDate && endDate)) {
               // prompt user
               alert('make sure each field has a valid value')
               return
         }

         // if start date later than end date, raise warnings & return
         if (startDate > endDate) {
               alert('invalid date range')
               return
         }

         // if end date later than yesterday, raise warnings & return
         const today = new Date();
         const queryEnd = new Date(endDate)
         // console.log(today, queryEnd)
         // console.log(today - queryEnd)
         if (today - queryEnd <= 1000 * 60 * 60 * 24) {
               alert('select an end date that\'s prior to yesterday')
               return
         }

         // if min playtime small than max playtime, raise warnings & return
         /* 
         if (minPlaytime >= maxPlaytime) {
               alert('invalid total playtime')
               return
         }
         */

         const metrics = {
               game: game,
               version: version,
               startDate: startDate,
               endDate: endDate,
               minPlaytime: minPlaytime,
               maxPlaytime: maxPlaytime
         }

         // else, post request - propagateData()
         // propagateData(metrics)
         updateGlobalMetrics(metrics)

      }


      return (
         <>
            <div className="bg-white mb-10 mx-5 shadow-sm px-7 py-7 max-w-xl">
               <div className=" mb-3">
                  {/* game selection */}
                  <div className="col">
                     <div className="input-group">
                        <div className="mb-2">
                           <span className='text-xl font-light' >Game</span>
                        </div>
                        <select className="form-select block w-full"
                           value={currentGame} onChange={(e) => setCurrentGame(e.target.value)}
                        >
                           <option> </option>
                           {populateGameList()}
                        </select>
                     </div>
                  </div>
                  {/* version selection */}
                  {/* <div className="col">
                           <div className="input-group">
                              <div className="mb-1">
                                 <h3 className='text-xl font-bold' >version</h3>
                              </div>
                              <select className="form-select block w-full"
                                 value={version} onChange={(e) => setVersion(e.target.value)}
                              >
                                 <option>Choose...</option>
                                 <option value={'v0.0.1'}>v0.0.1</option>
                              </select>
                           </div>
                     </div> */}
               </div>
               <div className="row"><h3 className='text-xl font-light mb-2'>Date</h3></div>
               <div className="columns-2  mb-5">
                  {/* date-from selection */}
                  <div className="col">
                     <input type='date' className='block w-full' value={startDate} onChange={(e) => setstartDate(e.target.value)}></input>
                     <h4 className="text-sm" >From</h4>

                  </div>

                  {/* date-to selection */}
                  <div className="col">
                     <input type='date' className='block w-full' value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                     <h4 className="text-sm" >To</h4>
                  </div>
               </div>
               {/* <div className="row"><h3 className='text-xl font-bold'>total playtime (minutes)</h3></div> */}
               <div className="row columns-2 mb-3">
                  {/* min playtime selection */}
                  {/* <div className="col">
                           <div className="">
                              <h4 className="text-sm" >From</h4>
                           </div>
                           <input type='number' className='block w-full'
                              value={minPlaytime} onChange={(e) => setMinPlaytime(e.target.value >= 0 ? e.target.value : 0)}></input>
                     </div> */}

                  {/* max playtime selection */}
                  {/* <div className="col">
                           <div className="">
                              <h4 className="text-sm" >To</h4>
                           </div>
                           <input type='number' className='block w-full'
                              value={maxPlaytime} onChange={(e) => setMaxPlaytime(e.target.value >= 0 ? e.target.value : 0)}></input>
                     </div> */}
               </div>
            </div>
            <div className='flex space-x-2 items-center'>
               {loading ?
                  <LoadingBlur loading={loading} height="8" width="8"></LoadingBlur>
                  : 
                  <LargeButton className='cursor-progress' label='Visualize'
                     onClick={formValidation}
                  />
               }
            </div>
         </>
      )
   }

    return (
      <div className='w-screen'>

         {/* For DEBUG purpose, remove in production */}
         <div className='fixed top-0 right-1/2 z-10'>
            <LargeButton
               selected={false}
               label='clear cache'
               onClick={() => {
                  localStorage.clear()
                  alert('localStorage reset')
               }}
            />
         </div>
         <DataFilter
            loading={loading}
            viewMode={viewMode}
            containerSelection={selectionOptions}
            setContainerSelection={setSelectionOptions}
            containerFilter={filterOptions}
            setContainerFilter={setFilterOptions}
            ></DataFilter>


         { initialized ? filledContainer() : emptyContainer() }
      </div>

    )
}