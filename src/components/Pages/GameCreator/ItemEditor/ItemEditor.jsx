import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function ItemEditor({ game_id, items }) {

    const dispatch = useDispatch();

    const [editingId, setEditingId] = useState(0);
    const [itemInfo, setItemInfo] = useState({ name: '', description: '', room_id: '' });
    const [editInfo, setEditInfo] = useState({});

    const handleItemInfoChange = (e, key) => {
        setItemInfo({ ...itemInfo, [key]: e.target.value });
    }

    const handleEditInfoChange = (e, key) => {
        setEditInfo({ ...editInfo, [key]: e.target.value });
    }

    const handleEdit = (item) => {
        setEditInfo({ ...item });
        setEditingId(item.id);
    }

    const addItem = () => {
        dispatch({
            type: "ADD_ITEM_EDITOR",
            payload: { id: game_id, name: itemInfo.name, description: itemInfo.description, room_id: itemInfo.room_id },
            callback: () => {
                setItemInfo({ name: '', description: '', room_id: '' })
            }
        })
    }

    const clearEdit = () => {
        setEditingId(0);
        setEditInfo({});
    }

    const deleteItem = (item_id) => {
        dispatch({ type: "DELETE_ITEM_EDITOR", payload: { game_id, item_id } });
    }

    const updateItem = (item_id) => {
        dispatch({
            type: "UPDATE_ITEM_EDITOR",
            payload: { ...editInfo, game_id },
            callback: clearEdit
        })
    }

    return (
        <div>
            <table style={{ width: "99vw" }}>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Room</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>

                    {items && items.map((item, i) => {
                        return (
                            <tr key={i}>
                                {editingId == item.id ?
                                    <>
                                        <td>
                                            <label htmlFor="item-name">Name</label>
                                            <input
                                                name="item-name"
                                                style={{ width: "10vw", height: "2em" }}
                                                value={editInfo.name}
                                                onChange={e => handleEditInfoChange(e, "name")}
                                                type="text"
                                            />
                                        </td>
                                        <td>
                                            <div>
                                                <label htmlFor="item-description">Description</label>
                                            </div>
                                            <textarea
                                                style={{ width: "50vw", height: "5vw" }}
                                                className="editor-textarea"
                                                name="item-description"
                                                value={editInfo.description}
                                                onChange={e => handleEditInfoChange(e, "description")}
                                            />
                                        </td>
                                        <td>
                                            <label htmlFor="item-room-id">Room-ID</label>
                                            <input
                                                name="item-room-id"
                                                style={{ width: "5vw", height: "3vh" }}
                                                min={1}
                                                value={editInfo.room_id}
                                                onChange={e => handleEditInfoChange(e, "room_id")}
                                                type="number"
                                            />
                                        </td>
                                        <td>
                                            {item.id}
                                        </td>
                                        <td>
                                            <button className="btn" onClick={e => updateItem(item.id)}>
                                                SUBMIT
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={() => clearEdit()}
                                            >
                                                CANCEL
                                            </button>
                                        </td>
                                    </>
                                    :
                                    <>
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
                                            {item.id}
                                        </td>
                                        <td>
                                            <button
                                                style={{ width: "100%" }}
                                                className="btn"
                                                onClick={() => handleEdit(item)}
                                            >
                                                EDIT
                                            </button>
                                            <button
                                                style={{ width: "100%" }}
                                                className="btn"
                                                onClick={e => deleteItem(item.id)}>
                                                DELETE
                                            </button>
                                        </td>
                                    </>
                                }
                            </tr>
                        );
                    })}
                    <tr>
                        <td>
                            <label htmlFor="item-name">Name</label>
                            <input
                                name="item-name"
                                style={{ width: "10vw", height: "2em" }}
                                value={itemInfo.name}
                                onChange={e => handleItemInfoChange(e, "name")}
                                type="text"
                            />
                        </td>
                        <td>
                            <div>
                                <label htmlFor="item-description">Description</label>
                            </div>
                            <textarea
                                style={{ width: "50vw", height: "5vw" }}
                                className="editor-textarea"
                                name="item-description"
                                value={itemInfo.description}
                                onChange={e => handleItemInfoChange(e, "description")}
                            />
                        </td>
                        <td>
                            <label htmlFor="item-room-id">Room-ID</label>
                            <input
                                name="item-room-id"
                                style={{ width: "5vw", height: "3vh" }}
                                min={1}
                                value={itemInfo.room_id}
                                onChange={e => handleItemInfoChange(e, "room_id")}
                                type="number"
                            />
                        </td>
                        <td>
                            <button className="btn" onClick={addItem}>ADD</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ItemEditor;