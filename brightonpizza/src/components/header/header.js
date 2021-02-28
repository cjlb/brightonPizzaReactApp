import React from 'react';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants.js';
import { withRouter } from "react-router-dom";

function Header(props) {
    function renderLogout() {
        console.log(props.history.location.pathname)
        if(props.history.location.pathname === '/home'){
            return(
                <div className="ml-auto">
                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                </div>
            )
        }
    }
    function handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN_NAME)
        props.history.push('/login')
    }
    return(
        <div>
            <div className="bg-primary">
                <div className="row col-12 d-flex justify-content-center text-white">
                    <span className="h3">Brighton Pizza</span>
                    {renderLogout()}
                </div>
            </div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="home">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="register">Sign Up</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Login
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a className="dropdown-item" href="#">Employee</a>
                    <a className="dropdown-item" href="login">Customer</a>
                    <div className="dropdown-divider"></div>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="account">Account</a>
                </li>
                </ul>
                
            </div>
            </nav>
        </div>
        
        
    )
}

export default withRouter(Header);