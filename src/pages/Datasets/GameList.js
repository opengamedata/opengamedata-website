

export default function GameList(props) {
    const games = []
    Object.keys(props.fileList).forEach(key => {
        games.push(
            <button
                key={key}
                className="button small"
                style={{ marginBottom: 10 }}
                onClick={() => props.setGame(key)}
            >
                {key}
            </button>)
    })
    return games
}