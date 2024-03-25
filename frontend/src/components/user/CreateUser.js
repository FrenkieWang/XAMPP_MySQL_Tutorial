import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Create a styled span for the red asterisk
const RequiredStar = styled.span`
  color: red;
`;

function CreateUser() {
  const [user, setUser] = useState({
    title: '',
    firstName: '',
    surName: '',
    mobile: '',
    email: ''
  });

  // Handler for changes 
  function onChangeUser(e){
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  function onSubmit(e) {
    e.preventDefault();

    console.log(user);

    axios.post('http://localhost:5000/users/create', user)
      .then(res => console.log(res.data))
      .catch(error => console.log(error));

    window.location = '/';
  }

  return (
    <div>
      <h3>Create New User</h3>
      <form onSubmit={onSubmit}>
        {/* User Information */}
        <div className="form-group">
          <label>Title:<RequiredStar>*</RequiredStar></label>
          <input required
            type="text"
            name="title"
            className="form-control"
            value={user.title}
            onChange={onChangeUser}
          />
        </div>
        <div className="form-group"> 
          <label>First Name:<RequiredStar>*</RequiredStar></label>
          <input required
            type="text"
            name="firstName"
            className="form-control" 
            value={user.firstName} 
            onChange={onChangeUser}
          />
        </div>
        <div className="form-group"> 
          <label>Last Name:<RequiredStar>*</RequiredStar></label>
          <input required
            type="text"
            name="surName"
            className="form-control" 
            value={user.surName} 
            onChange={onChangeUser}
          />
        </div>
        <div className="form-group"> 
          <label>Phone Number:<RequiredStar>*</RequiredStar></label>
          <input required
            type="text"
            name="mobile"
            className="form-control" 
            value={user.mobile} 
            onChange={onChangeUser} 
          />
        </div>
        <div className="form-group"> 
          <label>Email:<RequiredStar>*</RequiredStar></label>
          <input required
            type="email"
            name="email"
            className="form-control" 
            value={user.email} 
            onChange={onChangeUser}
          />
        </div>

        <div className="form-group">
          <input type="submit" value="Create User" className="btn btn-primary" />
        </div>
        <Link to="/">Back to User List</Link>
      </form>
    </div>
  )  
}

export default CreateUser;