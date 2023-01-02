// global imports
import { AdjustmentsIcon, XIcon, CogIcon } from '@heroicons/react/solid'
import { render } from '@testing-library/react';
import { useEffect, useState } from 'react'
import { SelectionOptions } from '../../apis/SelectionOptions';
// local imports
import LargeButton from '../../components/buttons/LargeButton'
import { API_ORIGIN, timeline_url_path, vis_games } from '../../config';
import { ViewModes } from '../../../controller/ViewModes';
import { PopulationSelectionOptions, PlayerSelectionOptions, SessionSelectionOptions } from '../../../controller/SelectionOptions';
import { FilterOptions } from '../../../controller/FilterOptions';

export default function Settings({ loading, viewMode, containerSelection, setContainerSelection, containerFilter, setContainerFilter}) {

   // server-side selection options
   const [gameSelected, setGameSelected] = useState(vis_games[0]);
   const [minAppVersion, setMinAppVersion] = useState(null);
   const [maxAppVersion, setMaxAppVersion] = useState(null);
   const [minLogVersion, setMinLogVersion] = useState(null);
   const [maxLogVersion, setMaxLogVersion] = useState(null);
   const [startDate, setStartDate] = useState();
   const [endDate, setEndDate] = useState();
   const [ids, setIDs] = useState([]);

   // local filtering options
   const [minJobs, setMinJobs] = useState(null);
   const [minPlaytime, setMinPlaytime] = useState(null);
   const [maxPlaytime, setMaxPlaytime] = useState(null);

   // adjustMode indicates whether the filtering box is expanded to make selections, or not.
   const [adjustMode, setAdjustMode] = useState(false)

   const adjust = () => {
      // validation
      if (startDate > endDate) {
         alert('The start date must not be later than the end date!')
         return
      }
      if (minPlaytime !== null && maxPlaytime !== null && minPlaytime > maxPlaytime) {
         alert('The minimum play time must be less than the maximum!')
         return
      }
      if (minLogVersion !== null && maxLogVersion !== null && minPlaytime > maxPlaytime) {
         alert('The minimum play time must be less than the maximum!')
         return
      }

      setContainerSelection(getSelectionOptions());
      setContainerFilter(getFilterOptions());
      // switch back to brief
      // setAdejustMode(false)
   }

   const getSelectionOptions = () => {
      switch (viewMode) {
         case ViewModes.POPULATION:
            return new PopulationSelectionOptions(gameSelected,
               minAppVersion, maxAppVersion, minLogVersion, maxLogVersion,
               startDate, endDate);
         case ViewModes.PLAYER:
            return new PlayerSelectionOptions(gameSelected,
               minAppVersion, maxAppVersion, minLogVersion, maxLogVersion,
               ids);
         case ViewModes.SESSION:
            return new SessionSelectionOptions(gameSelected,
               minAppVersion, maxAppVersion, minLogVersion, maxLogVersion,
               ids);
         default:
            return new PopulationSelectionOptions(gameSelected,
               minAppVersion, maxAppVersion, minLogVersion, maxLogVersion,
               startDate, endDate);
      }
   }

   const getFilterOptions = () => {
      switch (viewMode) {
         case ViewModes.POPULATION:
            return new FilterOptions();
         case ViewModes.PLAYER:
            return new FilterOptions(minJobs, minPlaytime, maxPlaytime);
         case ViewModes.SESSION:
            return new FilterOptions(minJobs, minPlaytime, maxPlaytime);
         default:
            return new FilterOptions();
      }
   }

   // If adjustMode changes, reset selections from current container selection
   useEffect(() => {
      setGameSelected(containerSelection.game_name)
      setMinAppVersion(containerSelection.min_app_version)
      setMaxAppVersion(containerSelection.min_app_version)
      setMinLogVersion(containerSelection.min_log_version)
      setMaxLogVersion(containerSelection.min_log_version)
      setStartDate(containerSelection.start_date)
      setEndDate(containerSelection.endDate)
      setIDs(containerSelection.ids)
   }, [adjustMode])

   // If adjustMode changes, reset filters from current container filter
   useEffect(() => {
      setMinPlaytime(containerFilter.minPlaytime)
      setMaxPlaytime(containerFilter.maxPlaytime)
      setMinJobs(containerFilter.minJobs)
   }, [adjustMode])

   // If loading changes to false, we are not adjusting and should return to false (resetting selections/filters)
   useEffect(() => {
      if (!loading) setAdjustMode(false)
   }, [loading])

   const renderSelectionPickers = () => {
      const getExtraSelectors = () => {
         switch (viewMode) {
            case ViewModes.POPULATION:
               return (
               <div>
                  {/* <div className="row"><h3 className='text-md font-bold'>date</h3></div> */}
                  <div className="mb-5">
                     {/* date-from selection */}
                     <div className="col mb-2">
                        <div className="input-group-prepend">
                           <h4 className="text-sm" >From</h4>
                        </div>
                        <input type='date' className='block w-full' value={startDate} onChange={(e) => setStartDate(e.target.value)}></input>
                     </div>

                     {/* date-to selection */}
                     <div className="col">
                        <div className="input-group-prepend">
                           <h4 className="text-sm" >To</h4>
                        </div>
                        <input type='date' className='block w-full' value={endDate} onChange={(e) => setEndDate(e.target.value)}></input>
                     </div>
                  </div>
               </div>
               )
            case ViewModes.PLAYER:
               // TODO: render ID selector
            case ViewModes.SESSION:
               // TODO: render ID selector
            default:
         }
      }
      return (
         <div>
            {/* TODO: render the game selector */}
            {/* TODO: render the app version range pickers */}
            {/* TODO: render the log version range pickers */}
            {getExtraSelectors()}
         </div>
      )
   }

   const renderFilterPickers = () => {

   }

   const renderSelectionOptions = () => {
      const getExtraSelectors = () => {
         switch (viewMode) {
            case ViewModes.POPULATION:
               return (
               <div>
                  <div className='text-sm'>{startDate.replace('T', ' ')}</div>
                  <div className='text-sm'>to</div>
                  <div className='text-sm'>{endDate.replace('T', ' ')}</div>
               </div>
               );
            case ViewModes.PLAYER:
               return (
                  <div className='text-sm'>{containerSelection.player_ids}</div>
               );
            case ViewModes.SESSION:
               return (
                  <div className='text-sm'>{containerSelection.session_ids}</div>
               );
            default:
               return (
                  <div>Invalid ViewMode selected: {viewMode}</div>
               )
         }
      }
      return (
         <div>
            {/* TODO: render the game selected */}
            {/* TODO: render the app version range selected */}
            {/* TODO: render the log version range selected */}
            {getExtraSelectors()}
         </div>
      )
   }

   const renderFilterOptions = () => {

   }

   const renderExpandButton = () => {
      const pickIcon = () => {
         if (adjustMode) {
            if (!loading) {
               // If in adjustment mode, and not currently loading, then we'll have expanded view so show an X.
               return (<XIcon className="cursor-pointer h-5 w-5" onClick={() => setAdjustMode(false)} />);
            }
            else {
               return (<></>);
            }
         }
         else {
            // If not in adjustment mode, show "adjustments" button to expand the filter.
            return (<AdjustmentsIcon className="cursor-pointer h-5 w-5" onClick={() => setAdjustMode(true)} />);
         }
      }
      return (
         <div className='flex justify-between mb-2'>
            <div>
               <span className='font-medium '>{gameSelected}&nbsp;</span>
               {/* <span>version</span> */}
            </div>
            { pickIcon() }
         </div>
      );
   }

   const renderDatePicker = (begin, setBegin, end, setEnd) => {
      return (
      );
   }

   if (adjustMode) {
      return (
         <div className=" bg-white fixed top-14 left-3 p-3 w-content border shadow-sm">
            {renderExpandButton()}
            {renderSelectionPickers()}
            {renderFilterPickers()}
            <div className='flex space-x-2 items-center'>
               {loading ?
                  <><CogIcon className='animate-spin h-8 w-8' /> &nbsp;Please wait...</>
                  :
                  <LargeButton onClick={adjust} label='visualize'/>
               }
            </div>

         </div>
      )
   }
   else {
      return (
         <div className=" bg-white fixed top-14 left-3 p-3 w-content border shadow-sm">
            {renderExpandButton()}
            {renderSelectionOptions()}
            {renderFilterOptions()}
            <div className='flex space-x-2 items-center'>
               {loading ?
                  <><CogIcon className='animate-spin h-8 w-8' /> &nbsp;Please wait...</>
                  :
                  <LargeButton onClick={adjust} label='visualize'/>
               }
            </div>

         </div>
      )
   }
}