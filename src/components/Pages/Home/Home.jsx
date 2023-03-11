import './Home.css';
import Room from './HomeComponents/Room/Room';
import ChatHistory from './HomeComponents/ChatHistory/ChatHistory';
import ChatInput from './HomeComponents/ChatInput/ChatInput';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function Home() {

    const dispatch = useDispatch();
    const gameState = useSelector(store => store.gameState);

    return (
        <>
            <div className="images">
                <Room />
            </div>
            <div className="chat">
                <ChatHistory />
                <ChatInput />
            </div>
        </>
    )
}

export default Home;