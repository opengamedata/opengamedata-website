
import { AdjustmentsIcon, XIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import LargeButton from '../../components/buttons/LargeButton'

export default function Settings({ data }) {
    const [adjustMode, setAdejustMode] = useState(false)


    const adjust = () => {
        // refresh vis

        // switch back to brief
        setAdejustMode(false)
    }

    return (
        <div className="fixed top-15 left-5 p-2 w-content border shadow-sm">
            <div className='flex justify-between'>
                <div>
                    <span className='font-medium'>gameName&nbsp;</span>
                    <span>version</span>
                </div>
                {adjustMode ?
                    <XIcon className="cursor-pointer h-7 w-7" onClick={() => setAdejustMode(false)} />
                    :
                    <AdjustmentsIcon className="cursor-pointer h-7 w-7" onClick={() => setAdejustMode(true)} />
                }
            </div>

            {adjustMode ?
                <div>
                    <div>
                        data tuner
                    </div>
                    <LargeButton
                        // action={adjust}
                        onClick={adjust}
                        label='visualize'
                    />
                </div>
                :
                <div>
                    data detail
                </div>
            }

        </div>
    )
}