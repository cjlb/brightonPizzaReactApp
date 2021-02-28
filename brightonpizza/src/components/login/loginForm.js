import React, {useRef, useState} from 'react';
import axios from 'axios';
import './loginForm.css';
import {API_BASE_URL, ACCESS_TOKEN_NAME, SITE_KEY} from '../../constants/constants.js';
import { withRouter } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import ReactPasswordStrength from 'react-password-strength';

function LoginForm(props) {
    const reRef = useRef();
    
    const [state , setState] = useState({
        email : "",
        password : "",
        successMessage: null,
        captchaToken: ""
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    const recaptchaLoaded = (value) => {
        state.captchaToken = value;
    }
    

    

    const handleSubmitClick = (e) => {
        e.preventDefault();
        const payload={
            "email":state.email,
            "password":state.password,
            "captchaToken":state.captchaToken
        }
        axios.post(API_BASE_URL+'/user/login', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    console.log(response.data.token);
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                    redirectToHome();
                    props.showError(null)
                }
                else if(response.status === 204){
                    props.showError("Username and password do not match");
                }
                else{
                    console.log(response)
                    props.showError("User not found");
                }
            })
            .catch(function (error) {
                if (error.response) {
                    // Request made and server responded
                    console.log("TEST")
                    console.log(error)
                    if(error.response.data.errors && error.response.data.errors.length > 0) {
                       props.showError(error.response.data.errors[0].msg);
                    } else {
                        props.showError(error.response.data.msg);
                    }

                  } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                  } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log(error);
                  }
            });
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register'); 
        props.updateTitle('Register');
    }
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="Enter email" 
                       value={state.email}
                       onChange={handleChange}
                />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" 
                       className="form-control" 
                       id="password" 
                       placeholder="Password"
                       value={state.password}
                       onChange={handleChange} 
                />
                </div>
                <ReCAPTCHA sitekey={SITE_KEY} size="compact" onChange={recaptchaLoaded}/>
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Dont have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span> 
            </div>
        </div>
    )
}

export default withRouter(LoginForm);