import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from './scenes/Home';
import { Login, Register, Logout } from './scenes/user/AuthUser';

import Protected from './scenes/Protected'
import Dashboard from './scenes/user/Dashboard'
import Room from './scenes/user/Room'

function App() {

  axios.defaults.headers.common['Authorization'] = 'Bearer' + ' ' + localStorage.getItem('accessToken');

  const [ userData, setUserData ] = useState({
    username: null,
    password: null,
    bio: null,
    roomId: null
  });
  const [ access, setAccess ] = useState();
  const [ loading, setLoading ] = useState(true);
  const [ message, setMessage ] = useState();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    await axios.get('http://localhost:7000/user/check-token')
      .then(response => {
        setUserData(response.data.userData);
        setAccess(response.data.access)
        setMessage(response.data.message);
        setLoading(false);
      })
  }

  return (
    <Router>
      <Switch>

        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/user/login"
          render={(props) => <Login userDataState={{ userData, setUserData }} messageState={{ message, setMessage }} />} 
        />

        <Route exact path="/user/register"
          render={(props) => <Register userData={userData} setUserData={setUserData} />} 
        />

        <Protected exact path='/user/dashboard' access={access} loading={loading}>
          <Dashboard userData={userData} />
          <Logout />
        </Protected>

        <Protected exact path='/user/room' access={access} loading={loading}>
          <Room userData={userData}/>
        </Protected>

      </Switch>
    </Router>
  );
}

export default App;
