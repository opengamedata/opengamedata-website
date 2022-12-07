import SmallButton from "./buttons/SmallButton"


export default function GameList(props) {

    const games = []
    Object.keys(props.fileList).forEach(key => {
        games.push(
            <SmallButton
                key={key}
                selected={props.game === key}
                label={key.replace('_', ' ')} 
                action={() => props.setGame(key)}/>
        )

    })
    return (
        <div className="flex-wrap ">
            {games}
        </div>
    )
}