import { useDispatch, useSelector } from 'react-redux';

function Inventory() {

    const inventory = useSelector(store => store.gameState.inventory);

    return (
        <>
            {inventory != undefined ?
                <table>
                    <tbody>
                        {inventory.map((item, i) => {
                            return (<tr key={i}>
                                <td>
                                    {item.item_name}
                                </td>
                                <td>
                                    {item.item_description}
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </table> : ''}
        </>
    )
}

export default Inventory;