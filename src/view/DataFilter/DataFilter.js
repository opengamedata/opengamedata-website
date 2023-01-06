// global imports
import { React, alert } from 'react';
import { AdjustmentsIcon, XIcon, CogIcon } from '@heroicons/react/solid';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
// local imports
import LargeButton from '../../components/buttons/LargeButton';
import { API_ORIGIN, timeline_url_path, vis_games } from '../../config';
import { ViewModes } from '../../controller/ViewModes';
import { FilterOptions } from '../../controller/FilterOptions';
import SelectionOptionsView from './SelectionOptionsView'
import FilterOptionsView from './FilterOptionsView';
import { PopulationSelectionOptions, PlayerSelectionOptions, SessionSelectionOptions } from '../../controller/SelectionOptions';

/**
 * @callback SetterCallback
 * @param {object} newVal
 */

/**
 * @typedef  {object} DataFilterProps
 * @property {boolean} loading
 * @property {ViewModes} viewMode
 * @property {PopulationSelectionOptions|PlayerSelectionOptions|SessionSelectionOptions} containerSelection
 * @property {SetterCallback} setContainerSelection
 * @property {FilterOptions} containerFilter
 * @property {SetterCallback} setContainerFilter
 */

 /**
 * @param {DataFilterProps} props
 */

export default function DataFilter({ loading, viewMode, containerSelection, setContainerSelection, containerFilter, setContainerFilter}) {
   // server-side selection options
   const [gameSelected, setGameSelected]   = useState(containerSelection.game_name);
   const [minAppVersion, setMinAppVersion] = useState(containerSelection.min_app_version);
   const [maxAppVersion, setMaxAppVersion] = useState(containerSelection.max_app_version);
   const [minLogVersion, setMinLogVersion] = useState(containerSelection.min_log_version);
   const [maxLogVersion, setMaxLogVersion] = useState(containerSelection.max_log_version);
   const [startDate, setStartDate] = useState();
   const [endDate, setEndDate] = useState();
   const [ids, setIDs] = useState([]);
   const setSelectionVars = {
      "setGameSelected":setGameSelected,
      "setMinAppVersion":setMinAppVersion,
      "setMaxAppVersion":setMaxAppVersion,
      "setMaxLogVersion":setMaxLogVersion,
      "setMinLogVersion":setMinLogVersion,
      "setStartDate":setStartDate,
      "setEndDate":setEndDate,
      "setIDs":setIDs
   };

   // local filtering options
   const [minJobs, setMinJobs] = useState(null);
   const [minPlaytime, setMinPlaytime] = useState(null);
   const [maxPlaytime, setMaxPlaytime] = useState(null);
   const setFilterVars = {
      "minJobs":setMinJobs,
      "minPlaytime":setMinPlaytime,
      "maxPlaytime":setMaxPlaytime,
   };

   // adjustMode indicates whether the filtering box is expanded to make selections, or not.
   const [adjustMode, setAdjustMode] = useState(false);

   // If adjustMode changes, reset selections from current container selection
   useEffect(() => {
      setGameSelected(containerSelection.game_name)
      setMinAppVersion(containerSelection.min_app_version)
      setMaxAppVersion(containerSelection.min_app_version)
      setMinLogVersion(containerSelection.min_log_version)
      setMaxLogVersion(containerSelection.min_log_version)
      setStartDate(containerSelection['start_date'] || null)
      setEndDate(containerSelection['endDate'] || null)
      setIDs(containerSelection['ids'] || null)
   }, [adjustMode])

   // If adjustMode changes, reset filters from current container filter
   useEffect(() => {
      setMinPlaytime(containerFilter.min_playtime)
      setMaxPlaytime(containerFilter.max_playtime)
      setMinJobs(containerFilter.min_jobs)
   }, [adjustMode])

   // If loading changes to false, we are not adjusting and should return to false (resetting selections/filters)
   useEffect(() => {
      if (!loading) setAdjustMode(false)
   }, [loading])

   const adjust = () => {
      // if empty fields, prompt user to fill in the blanks & return
      // if (!(game && version && startDate && endDate && minPlaytime >= 0 && maxPlaytime)) {
      if (!gameSelected) {
            // prompt user
            alert('make sure a game has been selected!');
            return;
      }
      if (startDate > endDate) {
         alert("The start date must not be later than the end date!")
         return;
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
      if (minAppVersion !== null && maxAppVersion !== null && minAppVersion > maxAppVersion) {
         alert('The minimum App version must be less than the maximum!')
         return
      }
      if (minLogVersion !== null && maxLogVersion !== null && minLogVersion > maxLogVersion) {
         alert('The minimum log version must be less than the maximum!')
         return
      }
      if (minPlaytime !== null && maxPlaytime !== null && minPlaytime > maxPlaytime) {
         alert('The minimum play time must be less than the maximum!')
         return
      }

      setContainerSelection(getSelectionOptions());
      setContainerFilter(getFilterOptions());
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

   const renderToggleButton = () => {
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
      <div className=" bg-white fixed top-14 left-3 p-3 w-content border shadow-sm">
         <div className='flex justify-between mb-2'>
            { renderToggleButton() }
         </div>
         <SelectionOptionsView
            adjustMode={adjustMode} viewMode={viewMode}
            gameSelected={gameSelected}
            minAppVersion={minAppVersion} maxAppVersion={maxAppVersion}
            minLogVersion={minLogVersion} maxLogVersion={maxLogVersion}
            startDate={startDate} endDate={endDate}
            ids={ids}
            updateFunctions={setSelectionVars}></SelectionOptionsView>
         <FilterOptionsView
            adjustMode={adjustMode} viewMode={viewMode}
            minPlaytime={minPlaytime} maxPlaytime={maxPlaytime}
            minJobs={minJobs}
            updateFunctions={setFilterVars}></FilterOptionsView>
         <div className='flex space-x-2 items-center'>
            {loading ?
               <><CogIcon className='animate-spin h-8 w-8' /> &nbsp;Please wait...</>
               :
               <LargeButton label='visualize' onClick={adjust} selected="false"/>
            }
         </div>

      </div>
   )
}

DataFilter.propTypes = {
   loading: PropTypes.bool,

}