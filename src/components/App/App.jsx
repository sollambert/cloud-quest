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
import Help from '../Pages/Help/Help';
import Saves from '../Pages/Saves/Saves';
import Inventory from '../Pages/Inventory/Inventory';
import GameSelector from '../GameSelector/GameSelector';

import './App.css';

function App() {

  const dispatch = useDispatch();

  const user = useSelector(store => store.user);
  const gameState = useSelector(store => store.gameState);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          <Redirect exact from="/" to="/select" />

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
            path="/home"
          >
            <Home />
          </ProtectedRoute>
          <ProtectedRoute
            exact
            path="/inventory"
          >
            <Inventory />
          </ProtectedRoute>

          <ProtectedRoute
            exact
            path="/saves"
          >
            <Saves />
          </ProtectedRoute>

          <ProtectedRoute
            exact
            path="/help"
          >
            <Help />
          </ProtectedRoute>

          <Route
            exact
            path="/select"
          >
            {user.id ?
              <>
                {gameState.id ?
                  <Redirect to="/home" />
                  :
                  <GameSelector/>
                }
              </>
              : 
              <Redirect to="/login"/>
            }
          </Route>
          <Route
            exact
            path="/login"
          >
            {user.id ?
              // If the user is already logged in, 
              // redirect to the /user page
              <Redirect to="/select" />
              :
              // Otherwise, show the login page
              <LoginPage />
            }
          </Route>

          <Route
            exact
            path="/registration"
          >
            {user.id ?
              // If the user is already logged in, 
              // redirect them to the /user page
              <Redirect to="/select" />
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
  );
}

export default App;
