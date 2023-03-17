import { useDispatch, useSelector } from 'react-redux';

function Inventory() {

    const inventory = useSelector(store => store.gameState.inventory);

    return (
        <>
            {inventory != undefined ?
                <>
                    {inventory.length == 0 ?
                        <p>
                            You don't currently have any items.
                        </p>
                        : <>
                            <table>
                                <tbody>
                                    {inventory.map((item, i) => {
                                        return (<tr key={i}>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.description}
                                            </td>
                                        </tr>)
                                    })}
                                </tbody>
                            </table> </>
                    }
                </>
                : ''}
        </>
    )
}

export default Inventory;