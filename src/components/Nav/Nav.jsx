import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">CloudQuest</h2>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/home">
              Home
            </Link>

            {/* link to saves page */}
            <Link className="navLink" to="/saves">
              Saves
            </Link>

            {/* link to help page */}
            <Link className="navLink" to="/help">
              Help
            </Link>

          </>
        )}

        <Link className="navLink" to="/about">
          About
        </Link>
        {user.id &&
          <LogOutButton className="logOutButton" />
        }
      </div>
    </div>
  );
}

export default Nav;
