
export default function ExpandableRow(props) {

    const FILE_ENDPOINT = 'https://opengamedata.fielddaylab.wisc.edu/'

    const toggleRow = () => {
        if (props.expand) {
            props.setFocused(null)
        }
        else {
            props.setFocused(props.identifier)
        }
    }

    return (
        <>
            <tr onClick={toggleRow}>
                <td>{props.entry.start_date ? props.entry.start_date : '-'}</td>
                <td>{props.entry.end_date ? props.entry.end_date : '-'}</td>
                <td>{props.entry.date_modified ? props.entry.date_modified : '-'}</td>
                {/* <td>{props.entry.ogd_revision ? props.entry.ogd_revision : '-'}</td> */}
                <td>{props.entry.sessions ? props.entry.sessions : '-'}</td>
            </tr>
            {props.expand ?
                <div>
                    {props.entry.events_file ?
                        <a className="button xsmall" role="button" href={FILE_ENDPOINT + props.entry.events_file} download="blob">
                            events
                        </a> : <></>}
                    {props.entry.sessions_file ?
                        <a className="button xsmall" role="button" href={FILE_ENDPOINT + props.entry.sessions_file} download="blob">
                            sessions
                        </a> : <></>}
                    {props.entry.population_file ?
                        <a className="button xsmall" role="button" href={FILE_ENDPOINT + props.entry.population_file} download="blob">
                            population
                        </a> : <></>}
                </div>
                : <></>
            }
        </>
    )
}