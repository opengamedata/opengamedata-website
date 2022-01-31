import SmallButton from '../../components/buttons/SmallButton.js'
import { FILE_ENDPOINT } from '../../constants.js'
import { DownloadIcon } from '@heroicons/react/solid'

export default function ExpandableRow(props) {


    const toggleRow = () => {
        if (props.expand) {
            props.setFocused(null)
        }
        else {
            props.setFocused(props.identifier)
        }
    }

    return (
        <div className="px-2 odd:bg-slate-100 even:bg-white last:rounded-b-md hover:bg-slate-300 transition duration-300">
            <div className="grid grid-cols-4 gap-4" onClick={toggleRow}>
                <div className='p-2'>{props.entry.start_date ? props.entry.start_date : '-'}</div>
                <div className='p-2'>{props.entry.end_date ? props.entry.end_date : '-'}</div>
                <div className='p-2'>{props.entry.date_modified ? props.entry.date_modified : '-'}</div>
                {/* <td>{props.entry.ogd_revision ? props.entry.ogd_revision : '-'}</td> */}
                <div className='p-2'>{props.entry.sessions ? props.entry.sessions : '-'}</div>
            </div>
            {
                props.expand ?
                    <div className='flex space-x-2 justify-start px-1 pb-2'>
                        {props.entry.events_file ?
                            <a role="button" href={FILE_ENDPOINT + props.entry.events_file} download="blob">
                                <SmallButton
                                    label={
                                        <span className='flex'>
                                            <DownloadIcon className="h-5 w-5" />
                                            &nbsp;events
                                        </span>
                                    }
                                />
                            </a> : <></>}
                        {props.entry.sessions_file ?
                            <a role="button" href={FILE_ENDPOINT + props.entry.sessions_file} download="blob">
                                <SmallButton
                                    label={
                                        <span className='flex'>
                                            <DownloadIcon className="h-5 w-5" />
                                            &nbsp;sessions
                                        </span>
                                    }
                                />
                            </a> : <></>}
                        {props.entry.population_file ?
                            <a role="button" href={FILE_ENDPOINT + props.entry.population_file} download="blob">
                                <SmallButton
                                    label={
                                        <span className='flex'>
                                            <DownloadIcon className="h-5 w-5" />
                                            &nbsp;poplulation
                                        </span>
                                    }
                                />
                            </a> : <></>}
                    </div>
                    : <></>
            }
        </div>
    )
}