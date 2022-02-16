import { thumbs, data_readmes, feature_readmes, game_links } from '../../constants'

export default function InfoCard({ game }) {

    return (
        <div className="mt-5 bg-white shadow-sm flex space-x-2">
            <img className='w-48 h-36 rounded-l' src={thumbs[game]} />
            <div className='p-3'>
                <p className='font-bold text-xl'>{game}</p>
                <div>
                    {data_readmes[game] ?
                        <a href={data_readmes[game]}
                            target="_blank"
                            className='text-yellow-500 block hover:underline'>
                            about the data
                        </a> : <></>
                    }
                    {feature_readmes[game] ?
                        <a href={feature_readmes[game]}
                            target="_blank"
                            className='text-yellow-500 block hover:underline'>
                            about features
                        </a> : <></>
                    }
                    {game_links[game] ?
                        <a href={game_links[game]}
                            target="_blank"
                            className='text-yellow-500 block'>
                            play {game.toLowerCase()}
                        </a> : <></>
                    }
                </div>
            </div>

        </div>
    )
}