import './ChatHistory.css'
import { useSelector } from 'react-redux';

function ChatHistory({ historyEndRef }) {

    let messages = useSelector(store => store.history);

    const scrollToBottom = () => {
        historyEndRef.current?.scrollIntoView()
    }

    return (
        <div className="history">
            {/* {messages.map((message) => {
                return <p key={message.id} >{message.message}</p>
            })} */}
            <div ref={historyEndRef} />
        </div>
    );
}

export default ChatHistory;