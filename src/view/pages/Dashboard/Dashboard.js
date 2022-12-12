import VizContainer from './VizContainer'

export default function Dashboard() {

   return (
        <div className='container flex flex-wrap mt-16'>
            <div className='max-w-xl mb-10 mx-5'>
                <p className='mb-3 text-4xl font-light'>Designer Dashboard</p>
                <p>
                    A visualization tool for you to intuitively interpret data collected from gameplays.
                    Pick a game and a time range to begin.
                </p>
            </div>
            <VizContainer></VizContainer>
            {/* In the future, add controls to manage multiple visualizations, which each get own filtering options. */}
        </div>
   )
}