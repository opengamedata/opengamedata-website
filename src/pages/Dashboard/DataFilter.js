// global imports
import { AdjustmentsIcon, XIcon, CogIcon } from '@heroicons/react/solid'
import { render } from '@testing-library/react';
import { useEffect, useState } from 'react'
import { SelectionOptions } from '../../apis/SelectionOptions';
// local imports
import LargeButton from '../../components/buttons/LargeButton'
import { API_ORIGIN, timeline_url_path, vis_games } from '../../config';

export default function Settings({ loading, currentFilterOptions, setContainerFilterOptions }) {

   // server-side filtering options
   const [gameSelected, setGameSelected] = useState(vis_games[0]);
   const [startDate, setStartDate] = useState();
   const [endDate, setEndDate] = useState();
   const [minAppVersion, setMinAppVersion] = useState(null);
   const [maxAppVersion, setMaxAppVersion] = useState(null);
   const [minLogVersion, setMinLogVersion] = useState(null);
   const [maxLogVersion, setMaxLogVersion] = useState(null);
   const [ids, setIDs] = useState([]);
   const [idMode, setIDMode] = useState([]);
   const [minPlaytime, setMinPlaytime] = useState(null);
   const [maxPlaytime, setMaxPlaytime] = useState(null);

   // local filtering options

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

      const adjustedFilterOptions = new SelectionOptions(gameSelected, startDate, endDate,
         minAppVersion, maxAppVersion, minLogVersion, maxLogVersion)

      setContainerFilterOptions(adjustedFilterOptions)
      // switch back to brief
      // setAdejustMode(false)
   }

   useEffect(() => {
      setGameSelected(currentFilterOptions.game_name)
      setStartDate(currentFilterOptions.start_date)
      setEndDate(currentFilterOptions.endDate)
      setMinAppVersion(currentFilterOptions.min_app_version)
      setMaxAppVersion(currentFilterOptions.min_app_version)
      setMinLogVersion(currentFilterOptions.min_log_version)
      setMaxLogVersion(currentFilterOptions.min_log_version)
      setMinPlaytime(currentFilterOptions.minPlaytime)
      setMaxPlaytime(currentFilterOptions.maxPlaytime)
   }, [adjustMode])

   useEffect(() => {
      if (!loading) setAdjustMode(false)
   }, [loading])

   renderDatePicker = () => {
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
      );
   }

   return (
      <div className=" bg-white fixed top-14 left-3 p-3 w-content border shadow-sm">
         <div className='flex justify-between mb-2'>
            <div>
               <span className='font-medium '>{gameSelected}&nbsp;</span>
               {/* <span>version</span> */}
            </div>
            {adjustMode ?
               !loading ? <XIcon className="cursor-pointer h-5 w-5" onClick={() => setAdjustMode(false)} /> : <></>
               :
               <AdjustmentsIcon className="cursor-pointer h-5 w-5" onClick={() => setAdjustMode(true)} />
            }
         </div>

         {adjustMode ?
            <div>
               {renderDatePicker()}

               <div className='flex space-x-2 items-center'>

                  {loading ?
                     <><CogIcon className='animate-spin h-8 w-8' /> &nbsp;Please wait...</>
                     :
                     <LargeButton
                        // action={adjust}
                        onClick={adjust}
                        label='visualize'
                     />
                  }
               </div>
            </div>
            :
            <div>
               <div className='text-sm'>{startDate.replace('T', ' ')}</div>
               <div className='text-sm'>to</div>
               <div className='text-sm'>{endDate.replace('T', ' ')}</div>
            </div>
         }

      </div>
   )
}