import Settings from "../../pages/Dashboard/Settings";


export default function Template({ data }) {


    return (
        <div className="">

            <div className="container">
                <div>{JSON.stringify(data)}</div>
            </div>
            <Settings />
        </div>

    )
}