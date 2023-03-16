import './ChatInput.css'
import {useState} from 'react';
import { useDispatch } from 'react-redux';

function ChatInput() {

    const dispatch = useDispatch();

    const [chatBuffer, setChatBuffer] = useState('');

    const handleInputBuffer = (event) => {
        setChatBuffer(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key == "Enter") {
            sendCommand(chatBuffer);
        }
    }

    function sendCommand(message) {
        dispatch({type: "PARSE_COMMAND", payload: message})
        clearInput()
    }

    const clearInput = () => {
        setChatBuffer('');
    }

    return (<>
        <label htmlFor="input"></label>
        <input
            autoComplete='off'
            autoFocus={true}
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