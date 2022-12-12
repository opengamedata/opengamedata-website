import LoadingBlur from '../../components/LoadingBlur';
import LargeButton from '../../components/buttons/LargeButton';

export default function InitialVisualizer({available_games, loading}) {
    const populateGameList = () => {
        const games = []
        available_games.forEach((k) => {
            games.push(
                <option key={k} value={k}>{k}</option>
            )
        })
        return games
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
                        value={game} onChange={(e) => setGame(e.target.value)}
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