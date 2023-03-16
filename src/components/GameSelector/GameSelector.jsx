import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import './GameSelector.css';


function GameSelector() {

    const games = useSelector(store => store.games);
    const dispatch = useDispatch();
    const history = useHistory();

    const [searchBuffer, setSearchBuffer] = useState({name: '', author: ''});

    useEffect(() => {
        dispatch({ type: "FETCH_GAMES" });
    }, []);

    const clearInput = () => {
        setSearchBuffer({name: '', author: ''});
    }

    const handleSelect = (e, id) => {
        dispatch({ type: "SELECT_GAME", payload: id });
        history.push("/home");
    }

    const handleSubmit = () => {
        dispatch({ type: "FETCH_GAMES", payload: {name: searchBuffer.name, author: searchBuffer.author}, callback: clearInput})

    }

    const handleChange = (e, key) => {
        setSearchBuffer({...searchBuffer, [key]: e.target.value});
    }

    console.log(games);
    return (
        <>
            <form className="game-search-form" onSubmit={(e) => {handleSubmit(e)}}>
                <div className="game-search-input">
                    <label htmlFor="game-search-name">Name:</label>
                    <input type="text" onChange={(e) => handleChange(e, 'name')} value={searchBuffer.name}></input>
                </div>
                <div className="game-search-input">
                    <label htmlFor="game-search-author">Author:</label>
                    <input type="text" onChange={(e) => handleChange(e, 'author')} value={searchBuffer.author}></input>
                </div>
                <button type="submit" className="btn">SEARCH</button>
            </form>
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
                                <button className="btn" onClick={(e) => handleSelect(e, game.id)}>PLAY</button>
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </>
    )
}

export default GameSelector;