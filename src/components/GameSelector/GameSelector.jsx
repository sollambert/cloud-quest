import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";


function GameSelector() {
    const games = useSelector(store => store.games);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch({ type: "FETCH_GAMES" });
    }, []);

    const handleSelect = (e, id) => {
        dispatch({ type: "SELECT_GAME", payload: id });
        history.push("/home");
    }

    console.log(games);
    return (
        <table>
            <thead>
                <tr>
                    <td>
                        NAME
                    </td>
                    <td>
                        AUTHOR
                    </td>
                </tr>
            </thead>
            <tbody>
                {games.map((game) => {
                    return (<tr key={game.id}>
                        <td>{game.name}</td>
                        <td>{game.author}</td>
                        <td>
                            <button className="btn" onClick={(e) => handleSelect(e, game.id)}>SELECT</button>
                        </td>
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default GameSelector;