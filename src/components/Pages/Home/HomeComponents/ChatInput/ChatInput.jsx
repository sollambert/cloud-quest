import './ChatInput.css'
import {useState} from 'react';

function ChatInput({ send }) {

    const [chatBuffer, setChatBuffer] = useState('');

    const handleInputBuffer = (event) => {
        setChatBuffer(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key == "Enter") {
            send(chatBuffer, clearInput);
        }
    }

    const clearInput = () => {
        setChatBuffer('');
    }

    return (<>
        <label htmlFor="input"></label>
        <input
            onKeyDown={handleKeyDown}
            onChange={handleInputBuffer}
            name="input"
            type="text"
            value={chatBuffer}
            placeholder="Enter commands here..."
        />
    </>)
}

export default ChatInput;