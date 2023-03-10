import {useDispatch, useSelector} from 'react-redux';

function Inventory() {

    const inventory = useSelector(store => store.inventory);

    return (
        <ul>
            {inventory.map((item) => {
                return <li>{item}</li>
            })}
        </ul>
    )
}

export default Inventory;