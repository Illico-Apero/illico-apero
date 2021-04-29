import './App.css';

import defaultTheme from './styles/Themes';
import { ThemeProvider } from '@material-ui/core/styles';

import {BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';

function App() {
  return (
      <Router>
        <ThemeProvider theme={defaultTheme}>
        {/**
            <div className="App">
                <Landing/>
            </div>
        */}
            <Switch>

            <div className="App">
                <Route exact path="/">
                    <Landing/>
                </Route>

                <Route path="/login">
                    <Login/>
                </Route>

                <Route path="/register">
                    <Register/>
                </Route>

                <Route path="/home">
                    <Home/>
                </Route>
            </div>

            </Switch>
        </ThemeProvider>
      </Router>

  );
}

export default App;
