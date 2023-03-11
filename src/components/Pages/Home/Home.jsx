import './Home.css';
import Room from './HomeComponents/Room/Room';
import ChatHistory from './HomeComponents/ChatHistory/ChatHistory';
import ChatInput from './HomeComponents/ChatInput/ChatInput';

function Home() {

    const getRoom = () => {
    }

    const sendCommand = (message, cb) => {
    }

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