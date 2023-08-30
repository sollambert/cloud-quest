import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Saves() {

    const dispatch = useDispatch();
    const history = useHistory();
    const saveData = useSelector(store => store.saves);

    useEffect(() => {
        if (saveData.length == 0) {
            dispatch({ type: "GET_SAVE_DATA" });
        }
    }, []);

    const newSave = () => {
        dispatch({type: "SAVE_GAME"})
    }

    const deleteSave = (id) => {
        dispatch({type: "DELETE_SAVE", payload: id})
    }

    const overwriteSave = (id) => {
        dispatch({type: "OVERWRITE_SAVE", payload: id})
    }

    const loadSave = (id) => {
        dispatch({type: "LOAD_SAVE", payload: id, callback: () => {
            history.push('/play');
        }})

    }

    return (
        <table>
            <tbody>
                {saveData.map((save) => {
                    return (
                        <tr key={save.id}>
                            <td>
                                <button onClick={() => overwriteSave(save.id)} className='btn'>OVERWRITE</button>
                            </td>
                            <td>{new Date(save.timestamp).toLocaleString()}</td>
                            <td>
                                <button onClick={() => loadSave(save.id)} className='btn'>LOAD</button>
                            </td>
                            <td>
                                <button onClick={() => deleteSave(save.id)} className='btn'>DELETE</button>
                            </td>
                        </tr>
                    )
                })}
                <tr>
                    <td colSpan="4">
                        <button onClick={newSave} className="btn">NEW SAVE</button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Saves;