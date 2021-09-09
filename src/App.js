import './App.css';

import defaultTheme      from './styles/Themes';
import { ThemeProvider } from '@material-ui/core/styles';

import {BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Landing      from './screens/Landing';
import Login        from './screens/Login';
import Register     from './screens/Register';
import Home         from './screens/Home';
import DeliveryZone from './screens/DeliveryZone';
import LegalTerms from './screens/LegalTerms';

function App() {
  return (
      <Router>
        <ThemeProvider theme={defaultTheme}>
            <div className='App'>
                <Switch>

                    <Route exact path='/' component={Landing} />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route path='/delivery-zone' component={DeliveryZone} />
                    <Route path='/legal-terms' component={LegalTerms} />
                    <Route path='/home' component={Home} />
                </Switch>
            </div>

        </ThemeProvider>
      </Router>

  );
}

export default App;
