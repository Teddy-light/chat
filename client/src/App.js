import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import {useAuth0} from '@auth0/auth0-react';
import axios from "axios";


function App() {
  // const { user } = useContext(AuthContext);
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently} = useAuth0();
  const [myuser, setMyuser] = useState(null);
  

  useEffect(() => {
    const saveUser = async (user) => {
      console.log('user: ', user);

      const _user = localStorage.getItem("user");
      if (!_user) {
        console.log('trying to save user');
      const res = await axios.post("/auth/register", user);
      console.log('user: ', res);

      localStorage.setItem("user", JSON.stringify(res.data));
      setMyuser(res.data)
      } else {
        setMyuser(JSON.parse(_user));
      }
      
      
    }
    if (user)
    saveUser(user);
  },[user])

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {myuser ? <Home /> : <Login />}
        </Route>
        <Route path="/login">{myuser ? <Redirect to="/" /> : <Login />}</Route>
       
        <Route path="/messenger">
          {!myuser ? <Redirect to="/" /> : <Messenger />}
        </Route>
        <Route path="/profile/:username">
          <Profile />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
