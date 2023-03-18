import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

function RoomEditor({ room, cancel }) {

    const dispatch = useDispatch();
    const errors = useSelector(store => store.errors);

    const [roomInfo, setRoomInfo] = useState({
        id: -1,
        description: '',
        exits: [],
        image: '',
        interactables: [],
        name: '',
    });

    useEffect(() => {
        // if (room.id != -1) {
            setRoomInfo({
                ...room,
                exits: JSON.stringify(room.exits),
                interactables: JSON.stringify(room.interactables, null, 4)
            });
        // }
    }, [room]);

    const handleChange = (e, key) => {
        setRoomInfo({ ...roomInfo, [key]: e.target.value })
    }

    const saveRoom = () => {
        try {
            const interactables = JSON.parse(roomInfo.interactables);
            const exits = JSON.parse(roomInfo.exits);
            let type = "SAVE_ROOM_EDITOR"
            if (room.id == -1) {
                type = "SAVE_NEW_ROOM_EDITOR"
            }
            dispatch({
                type,
                payload:
                {
                    ...roomInfo,
                    interactables,
                    exits
                }, callback: cancel
            });
        } catch (error) {
            dispatch({ type: 'JSON_PARSE_ERROR', payload: error.message});
            console.error(error);
        }
    }

    const deleteRoom = () => {
        dispatch({
            type: "DELETE_ROOM_EDITOR",
            payload: {game_id: room.game_id, id: roomInfo.id},
            callback: cancel
        })
    }

    return (
        <>
            {errors.editorMessage && (
                <h3 className="alert" role="alert">
                    {errors.editorMessage}
                </h3>
            )}
            <div>
                <label htmlFor="name">Name: </label>
                <input
                    name="name"
                    type="text"
                    value={roomInfo.name}
                    onChange={e => handleChange(e, "name")}
                />
            </div>
            <div>
                <div>
                    <label htmlFor="description">Description: </label>
                </div>
                <textarea
                    style={{ width: "98vw", height: "5vw" }}
                    name="interactables" className={"editor-textarea"}
                    value={roomInfo.description}
                    onChange={e => handleChange(e, "description")}
                />
            </div>
            <div>
                <label htmlFor="interactables">Interactables:</label>
            </div>
            <div>
                <textarea
                    style={{ width: "98vw", height: "30vw" }}
                    name="interactables"
                    className={"editor-textarea"}
                    value={roomInfo.interactables}
                    onChange={e => handleChange(e, "interactables")}
                />
            </div>
            <div>
                <label htmlFor="exits">Exits:</label>
            </div>
            <div>
                <textarea
                    style={{ width: "98vw", height: "4vw" }}
                    name="exits"
                    className={"editor-textarea"}
                    value={roomInfo.exits}
                    onChange={e => handleChange(e, "exits")}
                />
            </div>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <div>
                    <button className="btn" onClick={saveRoom}>SAVE</button>
                    <button className="btn" onClick={cancel}>GO BACK</button>
                </div>
                {roomInfo.id != -1 ?
                
                <div style={{alignSelf: "right"}}>
                    <button
                        style={{backgroundColor: "red", alignSelf: "right"}}
                        className="btn" 
                        onClick={deleteRoom}>DELETE</button>
                </div>
                : ''}
            </div>
        </>
    )
}

export default RoomEditor;