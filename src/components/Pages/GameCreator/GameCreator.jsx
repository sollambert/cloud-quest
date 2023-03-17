import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './GameCreator.css';

function GameCreator() {

    const { game_id } = useParams();
    const dispatch = useDispatch();
    const game = useSelector(store => store.gameCreator);
    const [roomEditing, setRoomEditing] = useState(-1);

    const [gameInfo, setGameInfo] = useState({ ...game.gameInfo });
    const [rooms, setRooms] = useState(game.rooms);
    const [items, setItems] = useState(game.items);
    const [itemChecks, setItemChecks] = useState([]);

    const [itemInfo, setItemInfo] = useState({ name: '', description: '', room_id: '' });

    useEffect(() => {
        dispatch({ type: "FETCH_GAME_EDIT_DETAILS", payload: game_id });
    }, []);

    useEffect(() => {
        if (game.gameInfo) {
            setGameInfo({ ...game.gameInfo });
            setRooms(game.rooms);
            setItems(game.items);
            setItemChecks(Array.apply(null, Array(game.items.length)).map((value, i) => {
                if (game.gameInfo.inventory.includes(i + 1)) {
                    return true;
                } else {
                    return false;
                }
            }))
        }
    }, [game]);

    console.log(itemChecks);

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

    const handleItemInfoChange = (e, key) => {
        setItemInfo({ ...itemInfo, [key]: e.target.value });
    }

    const addItem = () => {
        dispatch({
            type: "ADD_ITEM_CREATOR",
            payload: { id: game_id, name: itemInfo.name, description: itemInfo.description, room_id: itemInfo.room_id },
            callback: () => {
                setItemInfo({ name: '', description: '', room_id: ''})
            }
        })
    }

    const deleteItem = (item_id) => {
        dispatch({ type: "DELETE_ITEM_CREATOR", payload: { game_id, item_id } });
    }

    return (
        <>
            {roomEditing == -1 ?
                <>
                    {JSON.stringify(gameInfo)}
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
                        <button className="btn">UPDATE GAME INFO</button>
                    </div>
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
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Item Description</th>
                                    <th>Room-ID</th>
                                </tr>
                            </thead>
                            <tbody>

                                {items && items.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.description}
                                            </td>
                                            <td>
                                                {item.room_id}
                                            </td>
                                            <td>
                                                <button className="btn">
                                                    EDIT
                                                </button>
                                                <button className="btn" onClick={e => deleteItem(item.id)}>
                                                    DELETE
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr>
                                    <td>
                                        <label htmlFor="item-name">Name</label>
                                        <input name="item-name" value={itemInfo.name} onChange={e => handleItemInfoChange(e, "name")} type="text" />
                                    </td>
                                    <td>
                                        <label htmlFor="item-description">Description</label>
                                        <input name="item-description" value={itemInfo.description} onChange={e => handleItemInfoChange(e, "description")} type="text" />
                                    </td>
                                    <td>
                                        <label htmlFor="item-room-id">Room-ID</label>
                                        <input name="item-room-id" value={itemInfo.room_id} onChange={e => handleItemInfoChange(e, "room_id")} type="number" />
                                    </td>
                                    <td>
                                        <button className="btn" onClick={addItem}>ADD</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
                :
                <>
                    {JSON.stringify(rooms[roomEditing - 1])}
                    <div>
                        <button className="btn" onClick={() => setRoomEditing(-1)}>BACK</button>
                    </div>
                </>
            }
        </>
    )
}

export default GameCreator;