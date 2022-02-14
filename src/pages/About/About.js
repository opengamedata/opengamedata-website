import JobGraph from "../Dashboard/views/JobGraph";
import { dummyData } from "../../constants";

export default function About() {
    return (
        <div className="container">
            <p>About page</p>
            <JobGraph data={dummyData} />
        </div>
    )
}