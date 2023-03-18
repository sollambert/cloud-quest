import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function GameInfoEditor({ game, items }) {

    const dispatch = useDispatch();
    const [gameInfo, setGameInfo] = useState({ ...game.gameInfo });
    const [itemChecks, setItemChecks] = useState([]);

    useEffect(() => {
        if (game.gameInfo) {
            setGameInfo({ ...game.gameInfo });
            setItemChecks(Array.apply(null, Array(game.items.length)).map((value, i) => {
                if (game.gameInfo.inventory.includes(i + 1)) {
                    return true;
                } else {
                    return false;
                }
            }))
        }
    }, [game]);

    const handleGameInfoChange = (e, key, index) => {
        if (key == "inventory") {
            if (e.target.checked) {
                let checks = itemChecks;
                checks[index] = true;
                setItemChecks(checks);
                setGameInfo({ ...gameInfo, inventory: [...gameInfo.inventory, e.target.value] });
            } else {
                let checks = itemChecks;
                checks[index] = false;
                setItemChecks(checks);
                setGameInfo({
                    ...gameInfo, inventory: gameInfo.inventory.filter((id) => {
                        if (id != e.target.value) {
                            return id;
                        }
                    })
                });
            }
        } else {
            setGameInfo({ ...gameInfo, [key]: e.target.value });
        }
    }

    const updateGameInfo = () => {
        dispatch({ type: "SAVE_GAME_INFO_CREATOR", payload: gameInfo });
    }

    return (
        <>
            {/* {JSON.stringify(gameInfo)} */}
            {gameInfo.items ?
                <>
                    <div>
                        <label htmlFor="game-name">Game Name:</label>
                        <input name="game-name" type="text" value={gameInfo.name} onChange={(e) => handleGameInfoChange(e, "name")}></input>
                    </div>
                    <div>
                        <label htmlFor="game-start">Start Location:</label>
                        <input name="game-start" type="text" value={gameInfo.start_location} onChange={(e) => handleGameInfoChange(e, "start_location")}></input>
                    </div>
                    <div>
                        <label htmlFor="game-inventory">Inventory: </label>
                        {items && items.map((item, i) => {
                            return (
                                <span key={i}>
                                    <label htmlFor={item.name}>| {item.name}</label>
                                    <input name={item.name} type="checkbox" value={item.id} checked={itemChecks[i]} onChange={(e) => handleGameInfoChange(e, "inventory", i)} />
                                </span>
                            )
                        })}
                        <button className="btn" onClick={updateGameInfo}>UPDATE GAME INFO</button>
                    </div>
                </>
                : ''}
        </>
    )
}

export default GameInfoEditor;