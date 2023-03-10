import './Home.css';
import Room from './HomeComponents/Room/Room';
import ChatHistory from './HomeComponents/ChatHistory/ChatHistory';
import ChatInput from './HomeComponents/ChatInput/ChatInput';

function Home(props) {

    const getRoom = () => {
    }

    const updateHistory = (message, response) => new Promise((resolve, reject) => {
        //console.log(response)
        dispatch({
            type: 'ADD_HISTORY',
            payload: { message: message }
        })
        dispatch({
            type: 'ADD_HISTORY',
            payload: { message: response.data.result }
        })
        resolve();
    })

    const sendCommand = (message, cb) => {
    }

    return (
        <>
            <div className="images">
                <Room />
            </div>
            <div className="chat">
                <ChatHistory {...props} />
                <ChatInput send={sendCommand} />
            </div>
        </>
    )
}

export default Home;