import { Link } from "react-router-dom";
import './NavBar.css'

function NavBar() {
    return (
        <div className='nav-bar'>
            <Link className="link" to='/'>Home</Link>
            <Link className="link" to='/inventory'>Inventory</Link>
            <Link className="link" to='/saves'>Saves</Link>
            <Link className="link" to='/settings'>Settings</Link>
            <Link className="link" to='/help'>Help</Link>
        </div>
    )
}

export default NavBar;