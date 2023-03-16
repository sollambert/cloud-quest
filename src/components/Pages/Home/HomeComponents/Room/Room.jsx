import './Room.css'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

function Room() {

    const gameState = useSelector(store => store.gameState);
    const [roomImage, setRoomImage] = useState('');

    useEffect(() => {
        if (gameState && gameState.rooms) {
            for (let room of gameState.rooms) {
                    if (room.name == gameState.location) {
                        setRoomImage(room.image);
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