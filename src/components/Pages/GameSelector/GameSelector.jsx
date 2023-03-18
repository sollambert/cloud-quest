import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import './GameSelector.css';


function GameSelector() {

    const games = useSelector(store => store.games);
    const user = useSelector(store => store.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const [searchBuffer, setSearchBuffer] = useState({ name: '', author: '' });

    useEffect(() => {
        dispatch({ type: "FETCH_GAMES" });
    }, []);

    const clearInput = () => {
        setSearchBuffer({ name: '', author: '' });
    }

    const handleSelect = (e, id) => {
        dispatch({ type: "SELECT_GAME", payload: id });
        history.push("/home");
    }

    const handleSubmit = () => {
        dispatch({ type: "FETCH_GAMES", payload: { name: searchBuffer.name, author: searchBuffer.author }, callback: clearInput })
    }

    const handleChange = (e, key) => {
        setSearchBuffer({ ...searchBuffer, [key]: e.target.value });
    }

    const handleEdit = (id) => {
        dispatch({ type: "CLEAR_GAME_STATE" });
        history.push(`/edit/${id}`);
    }

    return (
        <>
            <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center"}}>
                <form className="game-search-form" onSubmit={(e) => { handleSubmit(e) }}>
                    <div className="game-search-input">
                        <label htmlFor="game-search-name">Name:</label>
                        <input type="text" onChange={(e) => handleChange(e, 'name')} value={searchBuffer.name}></input>
                    </div>
                    <div className="game-search-input">
                        <label htmlFor="game-search-author">Author:</label>
                        <input type="text" onChange={(e) => handleChange(e, 'author')} value={searchBuffer.author}></input>
                    </div>
                    <div>
                        <button type="submit" className="btn">SEARCH</button>
                    </div>
                </form>
                <div
                style={{alignSelf: "center"}}>
                    <button className="btn">CREATE</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>
                            NAME
                        </th>
                        <th>
                            AUTHOR
                        </th>
                        <th colSpan={2}></th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => {
                        return (<tr key={game.id}>
                            <td>{game.name}</td>
                            <td>{game.author}</td>
                            <td className='btn-td' colSpan={(user.username == game.author ? 2 : 1)}>
                                <button className="btn" onClick={(e) => handleSelect(e, game.id)}>PLAY</button>
                            </td>
                            {user.username == game.author ?
                                <td className='btn-td'>
                                    <button className="btn" onClick={() => handleEdit(game.id)}>
                                        EDIT
                                    </button>
                                </td>
                                : ''}
                        </tr>)
                    })}
                </tbody>
            </table>
        </>
    )
}

export default GameSelector;