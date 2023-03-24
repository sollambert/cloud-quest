import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';

function Nav() {
  const user = useSelector((store) => store.user);
  const gameState = useSelector((store) => store.gameState);
  const gameCreator = useSelector((store) => store.gameCreator);

  return (
    <div className="nav">
      <Link to="/about">
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
        {user.id && gameState.game_id && (
          <>
            <Link className="navLink" to="/play">
              Play
            </Link>

            {/* link to help page */}
            <Link className="navLink" to="/inventory">
              Inventory
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
        {gameCreator?.gameInfo?.id && (
          <Link className="navLink" to="/help">
            Help
          </Link>
        )}
        {user.id && (
          <Link className="navLink" to="/games">
            Games
          </Link>
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
