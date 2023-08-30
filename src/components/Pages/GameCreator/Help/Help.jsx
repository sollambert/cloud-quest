import { useHistory } from "react-router-dom";

function Help() {

    const history = useHistory();

    const goBack = () => {
        history.goBack();
    }

    return (
        <>
            <h2>
                Game Info
            </h2>
            <p>The fields at the top of the editor are used to designate important information for the game. Name, description, starting location (room name), and which items the player will start with in their inventory.</p>
            <h2>
                Image Parser
            </h2>
            <p>CloudQuest does not use actual image files. In lieu of images, we use a graphical library to convert an image to a string filled with characters that represent the brightness value of the associated region within the image.</p>
            <p>To fine tune the conversion process, there are controls to invert the brightness value, and add random noise to the image to allow for a less flat looking result.</p>
            <h2>Interactables</h2>
            <p>The interactables for a given room are a JSON object containing an array of objects.
                The keys for the objects within said array are the interactions a player can have with the object in question as described below.</p>
            {/* <p>Interaction Keys</p> */}
            <table>
                <thead>
                    <tr>
                        <th style={{ width: "30vw" }}>
                            Keys
                        </th>
                        <th>
                            Effect
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            "add_interaction" : {'{Object}'}
                        </td>
                        <td>
                            Adds a new interaction to the current interactable.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            "condition" : {'{Object}'}
                        </td>
                        <td>
                            Allows a condition tied to a global variable. The keys of the contained object are the names for global variables to check and the values are the values they must equal for the conditional to be true.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            "condition_message" : {"\"String\""}
                        </td>
                        <td>
                            The message to send to the player in the case that the condition is unfulfilled.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            "new_description" : {"\"String\""}
                        </td>
                        <td>
                            The new string to set the current associated interactable's description to.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            "new_exits" : {"Array[\"String\"]"}
                        </td>
                        <td>
                            Sets the current room's exits to the provided array of strings.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            "persistent" : {"true, false"}
                        </td>
                        <td>
                            Dictates whether or not the interaction is removed from the current interactable after handling.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            "set_var" : {"{Object}"}
                        </td>
                        <td>
                            Sets the corresponding global variables to the key and value pairs within the object provided.
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>Example: </p>
            <textarea
                className="editor-textarea"
                style={{ height: "35vh" }}>
                {JSON.stringify(
                    [
                        {
                            name: ["interactable", "alias"],
                            display_name: "interactable",
                            description: "description",
                            use: {
                                itemId: {
                                    condition: {
                                        variable: "value"
                                    },
                                    condition_message: "message to send to user on condition failure",
                                    new_exits: ["new exit"],
                                    message: "message to send to user upon interaction success"
                                }
                            },
                        }
                    ], null, 2)}
            </textarea>
            <h2>Exits</h2>
            <p>The exits of the room are described as an array of strings and may contain spaces.</p>
            <p>Example: ["exit 1", "exit 2"]</p>
            <h2>Items</h2>
            <p>To create an item, a name and a description are required.
                An associated room ID can be provided to ensure that the newly created item will appear in that room during gameplay, but this is not strictly necessary and an item can be introduced into gameplay through interactable logic.</p>
            <div>
                <button className="btn" onClick={goBack}>RETURN</button>
            </div>
        </>

    );
}

export default Help;