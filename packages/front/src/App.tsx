import React from "react"
import {BrowserRouter as Router, Route, Link} from "react-router-dom"

import "./App.css"

import {Register} from "./features/register/Register"
import {Login} from "./features/login/Login"
import {ErrorMessageComponent} from "./components/error"
import {NotificationMessageComponent} from "./components/notification"
import {Profile} from "./features/profile/Profile"
import {GetUser} from "./features/getUser/GetUser"

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/user">Userlist</Link>
        </nav>
        <ErrorMessageComponent />
        <NotificationMessageComponent />

        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/user" exact component={GetUser} />
      </Router>
    </div>
  )
}

export default App
