import SmallButton from "../../components/buttons/SmallButton"


export default function GameList(props) {

    const games = []
    Object.keys(props.fileList).forEach(key => {
        games.push(
            // <button
            //     key={key}
            //     className={props.game === key ? baseStyle + 'text-yellow-300 bg-slate-700' : baseStyle}
            //     onClick={() => props.setGame(key)}
            // >
            //     {key.replace('_', ' ')}
            // </button>
            <SmallButton
                key={key}
                selected={props.game === key}
                label={key.replace('_', ' ')} 
                action={() => props.setGame(key)}/>
        )

    })
    return (
        <div className="container flex-wrap ">
            {games}
        </div>
    )
}