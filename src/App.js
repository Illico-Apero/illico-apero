import './App.css';

import defaultTheme      from './styles/Themes';
import { ThemeProvider } from '@material-ui/core/styles';

import {BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import DeliveryZone from './screens/DeliveryZone';
import LegalTerms from './screens/LegalTerms';
import ForgottenPassword from './screens/ForgottenPassword';
import Contact from './screens/Contact';
import About from './screens/About';
import Category from './screens/Category';
import Profile from './screens/Profile';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';
import configuration from './config/configuration.json';
import { Alert } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import NotFound from './screens/NotFound';


function App() {
    return (
        <div>
        {
            configuration.maintenance ?
            <div style={{marginRight:'auto', marginLeft:'auto'}}>
                <Alert severity='error' elevation={3} style={{marginTop:'2em', marginBottom:'2em', marginLeft:'auto', marginRight:'auto', width:'290px', textAlign:'left'}}>
                    Le site d'Illico Apéro est actuellement en cours de maintenance. Veuillez réessayer plus tard.
                    Vous pouvez nous retrouver sur Uber Eats et Deliveroo ! (si notre boutique est ouverte).
                    Vous pouvez nous contacter par mail à l'adresse suivante : illicoapero.serviceclient@gmail.com.
                    Vous pouvez également nous contacter sur intagram ou facebook (@illico.apero.dijon)
                </Alert> 
                <Typography variant='body1' style={{textAlign:'center'}}>
                    <a href='https://www.ubereats.com/fr/store/illico-apero/EksdSFypXEihZJIq7F2UOg'>Uber Eats</a>
                    <br/>
                    <br/>
                    <a href='https://deliveroo.fr/en/menu/dijon/quetigny/illico-apero?geohash=u07t4gb45qd5'>Deliveroo</a>
                    <br/>
                    <br/>
                    <a  href='https://www.facebook.com/illico.apero.dijon'>Facebook</a>
                    <br/>
                    <br/>
                    <a  href='https://www.instagram.com/illico.apero.dijon/?hl=fr'>Instagram</a>
                </Typography>
            </div>
            :
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
                            <Route component={NotFound} />
                        </Switch>
                    </div>

                </ThemeProvider>
            </Router>
        }
        </div>
    );
}

export default App;
