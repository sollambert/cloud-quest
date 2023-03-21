import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import GameInfoEditor from "./GameInfoEditor/GameInfoEditor";
import RoomEditor from "./RoomEditor/RoomEditor";
import './Editor.css';
import ItemEditor from "./ItemEditor/ItemEditor";

function GameCreator() {

    const { game_id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const game = useSelector(store => store.gameCreator);
    const [roomEditing, setRoomEditing] = useState(0);
    const errors = useSelector(store => store.errors);
    const [checkDelete, setCheckDelete] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    const [rooms, setRooms] = useState(game.rooms);
    const [items, setItems] = useState(game.items);

    const play = () => {
        dispatch({ type: "SELECT_GAME", payload: game_id });
        history.push("/home");
    }

    useEffect(() => {
        dispatch({ type: "FETCH_GAME_EDIT_DETAILS", payload: game_id });
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    useEffect(() => {
        if (game.gameInfo) {
            setRooms(game.rooms);
            setItems(game.items);
        }
    }, [game]);

    const cancelRoomEdit = () => {
        setRoomEditing(0);
        dispatch({ type: "CLEAR_EDITOR_NOTIFICATION" });
    }

    const handleKeyDown = (e) => {
        if (errors.editorMessage) {
            dispatch({ type: "CLEAR_EDITOR_NOTIFICATION" });
        }
    }

    const handleDeleteKeydown = (e) => {
        if (e.key == 'Enter') {
            deleteGame();
        }
    }

    const deleteGame = () => {
        if (deleteInput == game.gameInfo.name) {
            dispatch({
                type: "DELETE_GAME",
                payload: game_id,
                callback: () => {
                    history.push('/games')
                }
            })
        }
    }

    const deleteGameBool = () => {
        setCheckDelete(true);
    }

    const cancelDelete = () => {
        setCheckDelete(false);
    }

    return (
        <div onKeyDown={handleKeyDown}>
            {roomEditing == 0 ?
                <>
                    <GameInfoEditor game={game} items={items} />
                    {errors.editorMessage && (
                        <h3 className="alert" role="alert">
                            {errors.editorMessage}
                        </h3>
                    )}
                    <button className="btn" onClick={play}>PLAY</button>
                    <button className="btn" onClick={() => setRoomEditing(-1)}>NEW ROOM</button>
                    <div className="room-cards">
                        {rooms && rooms.map((room) => {
                            return (
                                <div key={room.id} className={"room-container"} onClick={() => setRoomEditing(room.id)}>
                                    ID: {room.id}
                                    <div className="room-container-image">
                                        {room.image.split('\\n').map((newLine, i) => {
                                            return (
                                                <div key={i}>
                                                    {newLine}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <span>
                                        Name: {room.name}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <ItemEditor items={items} game_id={game_id} />
                    <div style={{ alignSelf: "right" }}>
                        {checkDelete ?
                            <>
                                <label>Are you sure? Type '{game.gameInfo.name}' to confirm:</label>
                                <input
                                    type="text"
                                    value={deleteInput}
                                    onChange={e => setDeleteInput(e.target.value)}
                                    onKeyDown={handleDeleteKeydown} />
                                <div>
                                    <button
                                        style={{ backgroundColor: "red", alignSelf: "right" }}
                                        className="btn" onClick={deleteGame}>DELETE</button>
                                    <button
                                        className="btn"
                                        onClick={cancelDelete}>
                                        CANCEL
                                    </button>
                                </div>
                            </>
                            :
                            <button
                                style={{ backgroundColor: "red", alignSelf: "right" }}
                                className="btn"
                                onClick={deleteGameBool}>DELETE</button>}
                    </div>
                </>
                :
                <>
                    {roomEditing == -1 ?
                        <RoomEditor room={{
                            game_id,
                            id: -1,
                            description: '',
                            exits: [],
                            image: '',
                            interactables: [],
                            name: '',
                        }}
                            cancel={() => cancelRoomEdit()} />
                        :
                        <RoomEditor
                            room={rooms.filter((room) => {
                                if (room.id == roomEditing) {
                                    return room;
                                }
                            })[0]}
                            cancel={() => cancelRoomEdit()} />
                    }
                </>
            }
        </div>
    )
}

export default GameCreator;