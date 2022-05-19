import { useState } from "react";
import { QuestionMarkCircleIcon, CursorClickIcon, ViewBoardsIcon, ColorSwatchIcon, CloudIcon } from '@heroicons/react/solid'

export default function JobGraphLegend({ populationSummary }) {
    const [showLegend, setShowLegend] = useState(false)

    return (
        <div className="fixed bottom-5 left-8 font-light">
            {showLegend &&
                <div className="pb-5 pr-5 backdrop-blur">
                    <p className="font-bold">Understanding the Graph</p>
                    <p>
                        Each <span className="font-semibold">node</span> represents a <span className="font-semibold">job</span>, and the <span className="font-semibold">links</span> between nodes denote <span className="font-semibold">player progression</span>.
                    </p>
                    <p>
                        The <ColorSwatchIcon className="w-5 h-5 inline mr-1" /><span className="font-semibold">node color</span> signifies the <span className="font-semibold">% percentage of job completion</span>.
                    </p>
                    <p>
                        The <ViewBoardsIcon className="w-5 h-5 inline mr-1" /><span className="font-semibold">link width</span> signifies the <span className="font-semibold"># number of players taking a path</span>. Use the radio buttons on the right to change the link type.
                    </p>
                    <p>
                        <CloudIcon className="w-5 h-5 inline mr-1" />
                        <span className="font-semibold">Hover</span> over nodes and links to reveal more details.
                    </p>
                    <p>
                        <CursorClickIcon className="w-5 h-5 inline mr-1" />
                        <span className="font-semibold">Click on a link</span> to see the list of players who took this path.
                    </p>
                </div>
            }
            <div className="flex space-x-2 items-center">
                <p className="text-4xl font-light">Job Graph</p>
                <QuestionMarkCircleIcon
                    className="text-slate-500 h-8 w-8"
                    onMouseEnter={() => { setShowLegend(true) }}
                    onMouseLeave={() => { setShowLegend(false) }}
                />
            </div>
            {
                Object.entries(populationSummary).map(([key, value]) =>
                    <p key={key} className="font-light">
                        {key}: <span className="font-bold">{value}</span>
                    </p>)
            }
        </div>
    )
}