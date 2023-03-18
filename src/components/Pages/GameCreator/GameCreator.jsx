import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import GameInfoEditor from "./GameInfoEditor/GameInfoEditor";
import RoomEditor from "./RoomEditor/RoomEditor";
import './GameCreator.css';
import ItemEditor from "./ItemEditor/ItemEditor";

function GameCreator() {

    const { game_id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const game = useSelector(store => store.gameCreator);
    const [roomEditing, setRoomEditing] = useState(-1);

    const [rooms, setRooms] = useState(game.rooms);
    const [items, setItems] = useState(game.items);

    const play = () => {
        dispatch({ type: "SELECT_GAME", payload: game_id });
        history.push("/home");
    }
    
    useEffect(() => {
        dispatch({ type: "FETCH_GAME_EDIT_DETAILS", payload: game_id });
    }, []);

    useEffect(() => {
        if (game.gameInfo) {
            setRooms(game.rooms);
            setItems(game.items);
        }
    }, [game]);

    return (
        <>
            {roomEditing == -1 ?
                <>
                    <GameInfoEditor game={game} items={items} />
                    <button className="btn" onClick={play}>PLAY</button>
                    <button className="btn">NEW ROOM</button>
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
                </>
                :
                <>
                    <RoomEditor
                    room={rooms.filter((room) => {
                        if (room.id == roomEditing) {
                            return room;
                        }
                    })[0]}
                    cancel={() => setRoomEditing(-1)}/>
                </>
            }
        </>
    )
}

export default GameCreator;