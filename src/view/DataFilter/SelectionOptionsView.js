// global imports
import { React } from 'react';
import { useEffect, useState } from 'react'
// local imports
import { vis_games } from '../../config';
import { ViewModes } from "../../controller/ViewModes"

export default function SelectionOptionsView({
   adjustMode, viewMode, 
   gameSelected,
   minAppVersion, maxAppVersion,
   minLogVersion, maxLogVersion,
   startDate, endDate,
   ids,
   updateFunctions
}) {
    const gameList = () => {
        const games = []
        vis_games.forEach((k) => {
            games.push(
                <option key={k} value={k}>{k}</option>
            )
        })
        return games
    }

   const renderSelectionPickers = () => {
      return (
         <div>
            {/* TODO: render the game selector */}
            {/* TODO: render the app version range pickers */}
            {/* TODO: render the log version range pickers */}
            {renderModeSpecificSelectors()}
         </div>
      )
   }

   const renderModeSpecificSelectors = () => {
      switch (viewMode) {
         case ViewModes.POPULATION:
            return (
            <div>
               <div className="row"><h5 className='text-md font-bold'>date</h5></div>
               <div className="mb-5">
                  <div id="MinDateInput" className="col mb-2">
                     <div className="input-group-prepend"><h4 className="text-sm" >From</h4></div>
                     <input type='date' className='block w-full' value={startDate} onChange={(e) => updateFunctions["setStartDate"](e.target.value)}></input>
                  </div>
                  <div id="MaxDateInput" className="col">
                     <div className="input-group-prepend"><h4 className="text-sm" >To</h4></div>
                     <input type='date' className='block w-full' value={endDate} onChange={(e) => updateFunctions["setEndDate"](e.target.value)}></input>
                  </div>
               </div>
            </div>
            )
         case ViewModes.PLAYER:
            // TODO: render ID selector
            return (<></>);
         case ViewModes.SESSION:
            // TODO: render ID selector
            return (<></>);
         default:
            return (
               <div>Invalid ViewMode selected: {viewMode}</div>
            )
      }
   }

   const renderSelectionChoices = () => {
      return (
         <div>
            <div>
               <span className='font-medium '>{gameSelected}&nbsp;</span>
               {/* <span>version</span> */}
            </div>
            <div>
               <div className='text-sm'>{minAppVersion}</div>
               <div className='text-sm'>to</div>
               <div className='text-sm'>{maxAppVersion}</div>
            </div>
            <div>
               <div className='text-sm'>{minLogVersion}</div>
               <div className='text-sm'>to</div>
               <div className='text-sm'>{maxLogVersion}</div>
            </div>
            {renderModeSpecificChoices()}
         </div>
      )
   }

   const renderModeSpecificChoices = () => {
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
               <div className='text-sm'>{ids.join(", ")}</div>
            );
         case ViewModes.SESSION:
            return (
               <div className='text-sm'>{ids.join(", ")}</div>
            );
         default:
            return (
               <div>Invalid ViewMode selected: {viewMode}</div>
            )
      }
   }

   if (adjustMode) {
      return renderSelectionPickers();
   }
   else {
      return renderSelectionChoices();
   }
}