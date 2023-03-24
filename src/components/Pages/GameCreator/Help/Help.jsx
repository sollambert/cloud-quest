import { useHistory } from "react-router-dom";

function Help() {

    const history = useHistory();

    const goBack = () => {
        history.goBack();
    }

    return (
        <>
            Testing
            <div>
                <button className="btn" onClick={goBack}>RETURN</button>
            </div>
        </>

    );
}

export default Help;