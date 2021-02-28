import React,{ useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import {API_BASE_URL, ACCESS_TOKEN_NAME} from '../../constants/constants.js';
import axios from 'axios'


function Account(props) {
  const [state , setState] = useState({
    currentPassword : "",
    newPassword : "",
    confirmPassword : "",
    successMessage: null
  })

  const handleChange = (e) => {
      const {id , value} = e.target   
      setState(prevState => ({
          ...prevState,
          [id] : value
      }))
  }

  useEffect(() => {
      axios.get(API_BASE_URL+'/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
      .then(function (response) {
          if(response.status !== 200){
            redirectToLogin()
          }
      })
      .catch(function (error) {
        redirectToLogin()
      });
  })

  const sendDetailsToServer = () => {
    const payload={
      "currentPassword":state.currentPassword,
      "newPassword":state.newPassword,
      
      
    }
    axios.post(API_BASE_URL+'/user/change', payload, { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
    .then(function (response) {
      if(response.status === 200){
          console.log(response)
          setState(prevState => ({
            ...prevState,
            'successMessage' : "Password changed successfully"
        }))
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
      
  }

    

  function redirectToLogin() {
    props.history.push('/login');
  }

  const handleChangePassword = (e) => {

    e.preventDefault();

    if(state.newPassword === state.confirmPassword) {
      sendDetailsToServer()    
      props.showError(null);
    } else {
      props.showError('Passwords do not match');
    } 

  }

  return(
    
    <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
        <form>
            <div className="form-group text-left">
              <label htmlFor="currentPassword">Current Password</label>
              <input type="password" 
                      className="form-control" 
                      id="currentPassword" 
                      placeholder="Enter current password" 
                      value={state.currentPassword}
                      onChange={handleChange}
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor="newPassword">New Password</label>
              <input type="password" 
                      className="form-control" 
                      id="newPassword" 
                      placeholder="Enter new password"
                      value={state.newPassword}
                      onChange={handleChange} 
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor="confirmPassword" >Confirm New Password</label>
              <input type="password" 
                      className="form-control" 
                      id="confirmPassword" 
                      placeholder="Confirm new password"
                      value={state.confirmPassword}
                      onChange={handleChange} 
              />
            </div>
            
            <div className="form-check">
            </div>
            <button 
                type="submit" 
                className="btn btn-primary"
                onClick={handleChangePassword}
            >Change Password</button>
        </form>
        <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
            {state.successMessage}
        </div>
    </div>
    
  )
}

export default Account;