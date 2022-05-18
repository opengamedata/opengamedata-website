import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid'


export default function EventFilterCtrl({ data, eventTypesDisplayed, setEventTypesDisplayed }) {
    const [expanded, setExpanded] = useState(true)

    /**
     * genrates the options (radio buttons) for the event type filter
     */
    const filterControl = () => {
        const listOfEvents = Object.entries(data.meta.types).map(([type, color]) => {
            return (
                <div key={type}>
                    <label className='text-xs font-light '>
                        <input className='form-checkbox'
                            style={eventTypesDisplayed.has(type) ? { backgroundColor: color } : {}} // not pretty but works
                            type="checkbox"
                            checked={eventTypesDisplayed.has(type)}
                            onChange={() => {
                                if (eventTypesDisplayed.has(type) && eventTypesDisplayed.size > 1) setEventTypesDisplayed(new Set([...eventTypesDisplayed].filter(d => d !== type)))
                                else {
                                    const newList = [...eventTypesDisplayed]
                                    newList.push(type)
                                    setEventTypesDisplayed(new Set(newList))
                                }
                            }}
                        />
                        <span> {type}</span>
                    </label>
                </div>
            )
        })
        return listOfEvents
    }

    return (expanded ?
        <div className='fixed bottom-0 right-0 bg-white py-5 px-8 rounded-md shadow-sm'>
            <fieldset className='font-light' >
                <div className='flex justify-between'>
                    <legend className=''>Show event types of:</legend>
                    <ChevronDownIcon
                        className='h-8 w-8 cursor-pointer'
                        onClick={() => { setExpanded(false) }}
                    />
                </div>
                <div className="mt-2 grid xl:grid-cols-6 lg:grid-cols-3 grid-flow-row gap-1">
                    {eventTypesDisplayed instanceof Set && filterControl()}
                </div>
            </fieldset>

        </div>
        :
        <div
            className='fixed bottom-0 right-0 py-5 px-8 flex justify-between cursor-pointer'
            onClick={() => { setExpanded(true) }}
        >
            <legend className='font-medium underline'>Event Filter</legend>
            {/* <ChevronUpIcon className='h-6 w-6' /> */}
        </div>

    )
}