import { useDispatch, useSelector } from 'react-redux';

function Inventory() {

    const items = useSelector(store => store.gameState.items);
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
                                    {inventory.map((id, i) => {
                                        let item = items.filter((item, i) => {
                                            if (item.id == id) {
                                                return item;
                                            }
                                        })[0];
                                        return (<tr key={i}>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.description}
                                            </td>
                                        </tr>)
                                    })
                                    }
                                </tbody>
                            </table> </>
                    }
                </>
                : ''}
        </>
    )
}

export default Inventory;