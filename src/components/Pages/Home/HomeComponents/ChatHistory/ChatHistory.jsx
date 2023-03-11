import './ChatHistory.css'
import { useSelector } from 'react-redux';
import { useRef } from 'react';

function ChatHistory() {

    let messages = useSelector(store => store.history);

    const historyEndRef = useRef(null)

    const scrollToBottom = () => {
        historyEndRef.current?.scrollIntoView()
    }

    return (
        <div className="history">
            {messages.map((message, i) => {
                return <p key={i} >{message.message}</p>
            })}
            <div ref={historyEndRef} />
        </div>
    );
}

export default ChatHistory;