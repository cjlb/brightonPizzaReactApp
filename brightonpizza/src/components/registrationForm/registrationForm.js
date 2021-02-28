import React, {useState} from 'react';
import axios from 'axios';
import './registrationForm.css';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants.js';
import { withRouter } from "react-router-dom";
import ReactPasswordStrength from 'react-password-strength';

function RegistrationForm(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        confirmPassword: "",
        successMessage: null,
        firstName : "",
        lastName : "",
        dob : "",
        streetAddress : "",
        city: "",
        county: ""
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const sendDetailsToServer = () => {
        if(state.email.length && state.password.length) {
            props.showError(null);
            const payload={
                "email":state.email,
                "password":state.password,
                "firstName":state.firstName,
                "lastName":state.lastName,
                "dob":state.dob,
                "streetAddress":state.streetAddress,
                "city":state.city,
                "county":state.county
            }

            console.log("Payload: " + JSON.stringify(payload));
            axios.post(API_BASE_URL+'/user/register', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Registration successful. Redirecting to home page..'
                        }))
                        //save CSRF token
                        localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                        redirectToHome();
                        props.showError(null)
                    } else{
                        props.showError("Some error ocurred");
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        // Request made and server responded
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
        } else {
            props.showError('Please enter valid username and password')    
        }
        
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
    }
    const handleSubmitClick = (e) => {
        console.log("Button press");
        e.preventDefault();
        if(state.password === state.confirmPassword) {
            sendDetailsToServer()    
        } else {
            props.showError('Passwords do not match');
        }
    }
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" 
                        className="form-control" 
                        id="email" 
                        
                        placeholder="Enter email" 
                        value={state.email}
                        onChange={handleChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email without permission.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">First Name</label>
                    <input type="text" 
                        className="form-control" 
                        id="firstName" 
                        
                        placeholder="Enter first name" 
                        value={state.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Last Name</label>
                    <input type="text" 
                        className="form-control" 
                        id="lastName" 
                        
                        placeholder="Enter last name" 
                        value={state.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Date of Birth</label>
                    <input type="date" 
                        className="form-control" 
                        id="dob" 
                         
                        
                        value={state.dob}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Street Address</label>
                    <input type="address" 
                        className="form-control" 
                        id="streetAddress" 
                         
                        placeholder="Enter street address"
                        value={state.streetAddress}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">City</label>
                    <input type="address" 
                        className="form-control" 
                        id="city" 
                         
                        placeholder="Enter city"
                        value={state.city}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">County</label>
                    <input type="address" 
                        className="form-control" 
                        id="county" 
                         
                        placeholder="Enter county"
                        value={state.county}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="password">Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Enter password"
                        value={state.password}
                        onChange={handleChange} 
                    />
                    <small id="emailHelp" className="form-text text-muted">Your password must be at least 6 characters long</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        placeholder="Confirm password"
                        value={state.confirmPassword}
                        onChange={handleChange} 
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Register
                </button>

            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
            </div>
            
        </div>
    )
}

export default withRouter(RegistrationForm);