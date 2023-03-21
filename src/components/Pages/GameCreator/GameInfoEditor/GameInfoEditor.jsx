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
        dispatch({ type: "CLEAR_EDITOR_NOTIFICATION" });
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

    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key == 's') {
            e.preventDefault();
            updateGameInfo();
        }
    }

    const updateGameInfo = () => {
        dispatch({
            type: "SAVE_GAME_INFO_EDITOR", payload: gameInfo,
            callback: () => {
                dispatch({ type: 'EDITOR_NOTIFICATION', payload: "Game info saved." });
            }
        });
    }

    return (
        <div onKeyDown={handleKeyDown}>
            {gameInfo.name != undefined && gameInfo.start_location != undefined ?
                <>
                    <div>
                        <button className="btn" onClick={updateGameInfo}>UPDATE GAME INFO</button>
                    </div>
                    <div>
                        <label htmlFor="game-name">Game Name:</label>
                        <input
                            style={{ width: "10vw", height: "2em" }}
                            name="game-name"
                            type="text"
                            value={gameInfo.name}
                            onChange={(e) => handleGameInfoChange(e, "name")}
                        />
                    </div>
                    <div>
                        <label htmlFor="game-start">Start Location:</label>
                        <input
                            style={{ width: "10vw", height: "2em" }}
                            name="game-start"
                            type="text"
                            value={gameInfo.start_location}
                            onChange={(e) => handleGameInfoChange(e, "start_location")}
                        />
                    </div>
                    {itemChecks.length > 0 ?
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
                        </div>
                        : ''}
                </>
                : ''}
        </div>
    )
}

export default GameInfoEditor;