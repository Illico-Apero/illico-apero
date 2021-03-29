import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./icons.js";
import Cart from "./screens/Cart";
import Home from "./screens/Home";
import Landing from "./screens/Landing";
import LandingNotOpened from "./screens/LandingNotOpened";
import Login from "./screens/Login";
import ModifyAdress from "./screens/ModifyAdress";
import Orders from "./screens/Orders";
import Payment from "./screens/Payment";
import Profile from "./screens/Profile";
import ProfileNotRegistered from "./screens/ProfileNotRegistered";
import Register from "./screens/Register";
import "./style.css";

function App() {
  return (
    <Router>
      <Route path="/" exact component={Landing} />
      <Route path="/Cart/" exact component={Cart} />
      <Route path="/Home/" exact component={Home} />
      <Route path="/Landing/" exact component={Landing} />
      <Route path="/LandingNotOpened/" exact component={LandingNotOpened} />
      <Route path="/Login/" exact component={Login} />
      <Route path="/ModifyAdress/" exact component={ModifyAdress} />
      <Route path="/Orders/" exact component={Orders} />
      <Route path="/Payment/" exact component={Payment} />
      <Route path="/Profile/" exact component={Profile} />
      <Route
        path="/ProfileNotRegistered/"
        exact
        component={ProfileNotRegistered}
      />
      <Route path="/Register/" exact component={Register} />
    </Router>
  );
}

export default App;
