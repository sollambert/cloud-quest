import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

function RoomEditor({ room, cancel }) {

    const dispatch = useDispatch();

    const [roomInfo, setRoomInfo] = useState({
        id: -1,
        description: '',
        exits: [],
        image: '',
        interactables: [],
        name: '',
    });

    useEffect(() => {
        setRoomInfo({
            ...room,
            exits: JSON.stringify(room.exits),
            interactables: JSON.stringify(room.interactables, null, 4)
        });
    }, [room]);

    const handleChange = (e, key) => {
        setRoomInfo({ ...roomInfo, [key]: e.target.value })
    }

    const saveRoom = () => {
        try {
            const interactables = JSON.parse(roomInfo.interactables);
            const exits = JSON.parse(roomInfo.exits);
            dispatch({
                type: "SAVE_ROOM_CREATOR",
                payload:
                {
                    ...roomInfo,
                    interactables,
                    exits
                }, callback: cancel
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
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

                width: 98vw;
                height: 20vw;
            </div>
            <div>
                <button className="btn" onClick={saveRoom}>SAVE</button>
                <button className="btn" onClick={cancel}>GO BACK</button>
            </div>
        </>
    )
}

export default RoomEditor;