import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './EditPage.css';

function EditPage() {

    const { id } = useParams();
    const dispatch = useDispatch();
    const gameInfo = useSelector(store => store.gameCreator);
    const [roomEditing, setRoomEditing] = useState(-1);

    useEffect(() => {
        dispatch({ type: "FETCH_GAME_EDIT_DETAILS", payload: id });
    }, []);

    return (
        <div className="room-cards">
            {roomEditing == -1 && gameInfo.rooms && gameInfo.rooms.map((room) => {
                return (
                    <div key={room.id} className={"room-container"} onClick={() => setRoomEditing(room.id)}>
                        <div className="room-container-image">
                        {room.image.split('\\n').map((newLine, i) => {
                            return (
                                <div key={i}>
                                    {newLine}
                                </div>
                            )
                        })}
                        </div>
                        {room.name}
                    </div>
                )
            })}
            {roomEditing && roomEditing != -1 ? 
            <>
            {JSON.stringify(gameInfo.rooms[roomEditing -1])};
            <button className="btn" onClick={() => setRoomEditing(-1)}>BACK</button>
            </>
            : ''}
        </div>
    )
}

export default EditPage;