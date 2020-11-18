import React, { useEffect, useState } from 'react';

// ROUTER
import { Switch, Route, Redirect } from 'react-router-dom';

// CONTAINERS
import Login from './containers/Login/Login';
import Home from './containers/Home/Home';
import CourseView from './containers/CourseView/CourseView';

import { useGoogleAuth } from './googleAuth';



function App() {
  const { isSignedIn } = useGoogleAuth();
  const [loading, setLoading] = useState(true)
  let routes;

  // prevents flashing of login screen
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 700)
  }, [])


  if (isSignedIn) {
    routes = (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/courses/:id" component={CourseView} />
        <Redirect to="/" />
      </Switch>
    )
  } else if (isSignedIn === false) {
    routes = (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Redirect to="/login" />
      </Switch>
    )
  }

  return (
    <React.Fragment>
      {loading ? <div>...Loading</div> : routes}
    </React.Fragment>

  );
}

export default App;













/*
   axios.get('https://classroom.googleapis.com/v1/courses/62179143513/courseWork?key=AIzaSyCMjGr5TUHvrvREISD6DxzhOlo6ysPk5HQ', {
      headers: {
        authorization: 'Bearer ' + accessToken
      }
    }).then((response) => {
      console.log(response)
    })
    */
























/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const App = () => {
  const [authenticated, setAuthenticated] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  let routes;

  function updateSigninStatus(isSignedIn) {
    setAuthenticated(isSignedIn)
  }

  useEffect(() => {
    setTimeout(() => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client.init({
          apiKey: window.API_KEY,
          clientId: window.CLIENT_ID,
          discoveryDocs: window.DISCOVERY_DOCS,
          scope: window.SCOPES
        }).then(() => {
          setAccessToken(window.gapi.auth2.getAuthInstance().currentUser.le.wc.access_token)
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state
          updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        });
      });
    }, 100)
  }, [])

  if (authenticated) {
    console.log(accessToken)
    window.gapi.client.classroom.courses.list({
      pageSize: 10
    }).then(function (response) {
      var courses = response.result.courses;
      console.log(courses)
    })
    axios.get('https://content-classroom.googleapis.com/v1/courses/154456770617?key=AIzaSyCMjGr5TUHvrvREISD6DxzhOlo6ysPk5HQ', {
      headers: {
        authorization: 'Bearer ' + accessToken
      }
    }).then((response) => {
      console.log(response)
    })
  }
  if (authenticated) {
    routes = (
      <button onClick={() => window.handleSignoutClick()}>Signout</button>

    )
  } else if (authenticated === false) {
    routes = (
      <button onClick={() => window.handleAuthClick()}>Signin</button>
    )
  }


  return (
    <React.Fragment>
      {routes}
    </React.Fragment>
  )
}

export default App;
*/