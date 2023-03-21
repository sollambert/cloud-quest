import { useDispatch } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function Creator() {
    const dispatch = useDispatch();
    const history = useHistory();

    const [name, setName] = useState('');

    const forwardUser = (id) => {
        history.push(`/edit/${id}`)
    }

    const createGame = () => {
        dispatch({type: "NEW_GAME_EDITOR",
        payload: {name}, callback: forwardUser,})
    }

    return(
        <div>
            <label htmlFor="name">Name:</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}/>
            <button className="btn" onClick={createGame}>SUBMIT</button>
        </div>
    )
}

export default Creator;