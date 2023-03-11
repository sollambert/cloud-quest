import './Help.css'

function Help() {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>
                            Commands
                        </th>
                        <th>
                            Usage
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            GO
                        </td>
                        <td>
                            Used to navigate through the exits of various rooms.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            USE
                        </td>
                        <td>
                            Allows you to use items on various interactables or other items.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            OPEN
                        </td>
                        <td>
                            Opens various interactables found throughout the game. Could also potentially be used on items.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            LOOK
                        </td>
                        <td>
                            Take a closer look at any interactables in the area or get a refresher on the room you're in.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            TAKE
                        </td>
                        <td>
                            This command allows you to pick up objects you've found on your journey.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            EXITS
                        </td>
                        <td>
                            Shows the various exits of the room you're currently in.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Help;