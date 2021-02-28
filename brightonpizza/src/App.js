
import React, {useState} from 'react';
import './App.css';
import Header from './components/header/header';
import LoginForm from './components/login/loginForm';
import RegistrationForm from './components/registrationForm/registrationForm';
import Home from './components/home/home';
import Account from './components/account/account';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AlertComponent from './components/alert/alertComponent';  
import PrivateRoute from './utils/PrivateRoute';



function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router>
    <div className="App">
      <Header title={title}/>
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
              <Home showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/register">
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/login">
              <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
            </Route>
            <Route path="/home">
              <Home/>
            </Route>
            <PrivateRoute path="/account">
              <Account showError={updateErrorMessage} updateTitle={updateTitle}/>
            </PrivateRoute>
          </Switch>
          <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
        </div>
    </div>
    </Router>
  );
}

export default App;
