import './Room.css'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

function Room() {

    const gameState = useSelector(store => store.gameState);
    const [roomImage, setRoomImage] = useState('');

    useEffect(() => {
        if (gameState && gameState.rooms) {
            console.log(gameState)
            for (let room of gameState.rooms) {
                    if (room.room_name == gameState.location) {
                        setRoomImage(room.room_image);
                        // console.log(room.room_image)
                    }
                }
        }
    }, [gameState]);

    return (
        <div className="room">
            {roomImage.split('\\n').map((newLine, i) => {
                return (
                    <div key={i}>
                        {newLine}
                    </div>
                )
            })}
        </div>
    )
}

export default Room;