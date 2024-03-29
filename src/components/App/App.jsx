import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import AboutPage from '../Pages/AboutPage/AboutPage';
import LoginPage from '../Pages/LoginPage/LoginPage';
import RegisterPage from '../Pages/RegisterPage/RegisterPage';
import Home from '../Pages/Home/Home';
import GameHelp from '../Pages/Help/Help';
import EditorHelp from '../Pages/GameCreator/Help/Help';
import Saves from '../Pages/Saves/Saves';
import Inventory from '../Pages/Inventory/Inventory';
import GameSelector from '../Pages/GameSelector/GameSelector';
import Creator from '../Pages/GameCreator/Creator';
import Editor from '../Pages/GameCreator/Editor';

import './App.css';
import './Range.css'

function App() {

  const dispatch = useDispatch();

  const user = useSelector(store => store.user);
  const gameState = useSelector(store => store.gameState);
  const gameCreator = useSelector(store => store.gameCreator);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <>
      {/* {user.loading ?
        ''
        : */}
        <Router>
          <div>
            <Nav />
            <Switch>
              {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
              <Redirect exact from="/" to="/games" />

              {/* Visiting localhost:3000/about will show the about page. */}
              <Route
                // shows AboutPage at all times (logged in or not)
                exact
                path="/about"
              >
                <AboutPage />
              </Route>

              {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
              <ProtectedRoute
                // logged in shows UserPage else shows LoginPage
                exact
                path="/play"
              >
                <Home />
              </ProtectedRoute>

              {/* Brings user to inventory view during gameplay */}
              <ProtectedRoute
                exact
                path="/inventory"
              >
                <Inventory />
              </ProtectedRoute>

              {/* Brings user to saves view during gameplay */}
              <ProtectedRoute
                exact
                path="/saves"
              >
                <Saves />
              </ProtectedRoute>

              {/* Brings user to help view */}
              <ProtectedRoute
                exact
                path="/help"
              >
                {gameState.game_id && <GameHelp />}
                {gameCreator?.gameInfo?.id && <EditorHelp />}
              </ProtectedRoute>


              {/* Navigates to new game editor view */}
              <Route
                exact
                path="/create">
                {user.id ?
                  <Creator />
                  :
                  <Redirect to="/login" />
                }
              </Route>

              {/* Navigates to game editor view */}
              <Route
                exact
                path="/edit/:game_id">
                {user.id ?
                  <Editor />
                  :
                  <Redirect to="/login" />
                }
              </Route>

              {/* Brings user to games list view if user is authenticated,
          otherwise redirects to login page */}
              <Route
                exact
                path="/games"
              >
                {user.id ?
                  <>
                    {gameState.id ?
                      <Redirect to="/play" />
                      :
                      <GameSelector />
                    }
                  </>
                  :
                  <Redirect to="/login" />
                }
              </Route>

              {/* Login page */}
              <Route
                exact
                path="/login"
              >
                {user.id ?
                  // If the user is already logged in, 
                  // redirect to the /user page
                  <Redirect to="/games" />
                  :
                  // Otherwise, show the login page
                  <LoginPage />
                }
              </Route>

              {/* Registration page */}
              <Route
                exact
                path="/registration"
              >
                {user.id ?
                  // If the user is already logged in, 
                  // redirect them to the /user page
                  <Redirect to="/games" />
                  :
                  // Otherwise, show the registration page
                  <RegisterPage />
                }
              </Route>

              {/* If none of the other routes matched, we will show a 404. */}
              <Route>
                <h1>404</h1>
              </Route>
            </Switch>
            <Footer />
          </div>
        </Router>
        {/* } */}
      </>
  );
}

export default App;
