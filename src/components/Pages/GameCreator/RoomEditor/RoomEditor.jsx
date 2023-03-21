import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

import ImageParser from "./ImageParser";

function RoomEditor({ room, cancel }) {

    const dispatch = useDispatch();
    const errors = useSelector(store => store.errors);
    const textAreaRef = useRef(null);
    const [cursor, setCursor] = useState(-1);
    const [checkDelete, setCheckDelete] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

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
            interactables: JSON.stringify(room.interactables, null, 2)
        });
    }, [room]);

    useEffect(() => {
        if (cursor != -1) {
            textAreaRef.current.selectionStart = cursor;
            textAreaRef.current.selectionEnd = cursor;
            setCursor(-1);
        }
    }, [roomInfo.interactables])

    const handleChange = (e, key) => {
        setRoomInfo({ ...roomInfo, [key]: e.target.value })
    }

    const handleSaveKeys = (e) => {
        if (errors.editorMessage) {
            dispatch({ type: "CLEAR_EDITOR_NOTIFICATION" });
        }
        if ((e.ctrlKey || e.metaKey) && e.key == 's') {
            e.preventDefault();;
            saveRoom();
        }
    }

    const handleDeleteKeydown = (e) => {
        if (e.key == 'Enter') {
            deleteRoom();
        }
    }

    const handleTabs = (e) => {
        if (e.key == 'Tab') {
            console.log(textAreaRef.current.selectionStart);
            console.log(textAreaRef);
            e.preventDefault();
            let newJSON = (
                roomInfo.interactables.slice(0, textAreaRef.current.selectionStart)
                + ' '.repeat(4) +
                roomInfo.interactables.slice(textAreaRef.current.selectionEnd, roomInfo.interactables.length));
            setCursor(textAreaRef.current.selectionStart + 4);
            setRoomInfo(
                {
                    ...roomInfo,
                    interactables: newJSON
                });
        }
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
                }, callback: () => {
                    // cancel();
                    dispatch({ type: 'EDITOR_NOTIFICATION', payload: "Room contents saved." });
                }
            });
        } catch (error) {
            dispatch({ type: 'EDITOR_NOTIFICATION', payload: error.message });
            // console.error(error);
        }
    }

    const deleteRoom = () => {
        dispatch({
            type: "DELETE_ROOM_EDITOR",
            payload: { game_id: room.game_id, id: roomInfo.id },
            callback: cancel
        })
    }

    return (
        <div onKeyDown={handleSaveKeys}>
            <ImageParser roomInfo={roomInfo} setRoomInfo={setRoomInfo} roomImage={room.image} />
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
                    style={{ height: "5vw" }}
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
                    style={{ height: "30vw" }}
                    ref={textAreaRef}
                    name="interactables"
                    className={"editor-textarea"}
                    value={roomInfo.interactables}
                    onKeyDown={handleTabs}
                    onChange={e => handleChange(e, "interactables")}
                />
            </div>
            <div>
                <label htmlFor="exits">Exits:</label>
            </div>
            <div>
                <textarea
                    style={{ height: "4vw" }}
                    name="exits"
                    className={"editor-textarea"}
                    value={roomInfo.exits}
                    onChange={e => handleChange(e, "exits")}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div>
                    <button className="btn" onClick={saveRoom}>SAVE</button>
                    <button className="btn" onClick={cancel}>GO BACK</button>
                </div>
                {roomInfo.id != -1 ?
                    <>
                        {checkDelete ?
                            <div>
                                <label>Are you sure? Type '{room.name}' to confirm:</label>
                                <input
                                    type="text"
                                    value={deleteInput}
                                    onChange={e => setDeleteInput(e.target.value)}
                                    onKeyDown={handleDeleteKeydown} />
                                <div>
                                    <button
                                        style={{ backgroundColor: "red"}}
                                        className="btn" onClick={deleteRoom}>DELETE</button>
                                    <button
                                        className="btn"
                                        onClick={() => setCheckDelete(false)}>
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                            :
                            <button
                                style={{ backgroundColor: "red", alignSelf: "right" }}
                                className="btn"
                                onClick={()=>setCheckDelete(true)}>DELETE</button>}
                    </>
                    : ''}
            </div>
        </div>
    )
}

export default RoomEditor;