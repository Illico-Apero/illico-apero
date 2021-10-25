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
import ForgottenPassword from './screens/ForgottenPassword';
import Contact from './screens/Contact';
import About from './screens/About';
import Category from './screens/Category';
import Profile from './screens/Profile';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import UserService from './network/services/UserService';
import ApiResponse from './models/api/ApiResponse';

function App() {
    return (
        <Router>
            <ThemeProvider theme={defaultTheme}>
                <div className='App'>
                    <Switch>

                        <Route exact path='/' component={Landing} />
                        <Route path='/login' component={Login} />
                        <Route path='/forgotten-password' component={ForgottenPassword} />
                        <Route path='/register' component={Register} />
                        <Route path='/delivery-zone' component={DeliveryZone} />
                        <Route path='/legal-terms' component={LegalTerms} />
                        <Route path='/home' component={Home} />
                        <Route path='/profile' component={Profile} />
                        <Route path='/cart' component={Cart} />
                        <Route path='/contact' component={Contact} />
                        <Route path='/about' component={About} />
                        <Route path='/category' component={Category} />
                        <Route path='/checkout' component={Checkout} />
                    </Switch>
                </div>

            </ThemeProvider>
        </Router>

    );
}

export default App;
