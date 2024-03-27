import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// Create a styled span for the red asterisk
const RequiredStar = styled.span`
  color: red;
`;

function EditUser() {
  const [user, setUser] = useState({
    title: '',
    titleOther: '', 
    firstName: '',
    surName: '',
    mobile: '',
    email: '',
  });

  let { userId } = useParams();

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:5000/users/get/${userId}`, true);
  
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        const users = JSON.parse(this.responseText);
        // `userId` is unique -> get the first element in Array.
        setUser(users[0]);
      } else {
        console.log('Error:', this.statusText);
      }
    };
  
    xhr.onerror = function() {
      console.error('Network error');
    };
  
    xhr.send();

  }, [userId]);

  function onChangeUser(e) {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  function onSubmit(e) {
    e.preventDefault();
    
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:5000/users/update/${userId}`, true);
    // Set the `type of data` to be sent in Request Header
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        // Then navigate the Page
        window.location = '/';
      } else {
        console.log('Error:', this.statusText);
      }
    };

    xhr.onerror = function() {
      console.error('Network error');
    };
    // Set `body` information in the request.
    xhr.send(JSON.stringify(user));
  }

  return (
    <div>
      <h3>Edit User</h3>
      <form onSubmit={onSubmit}>
        {/* User Title */}
        <div className="form-group">
          <label>Title:<RequiredStar>*</RequiredStar></label>
          <select required
            name="title"
            className="form-control"
            value={user.title}
            onChange={onChangeUser}
          >
            <option value="Mx">Mx</option>
            <option value="Ms">Ms</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Dr">Dr</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Conditional TitleOther Input */}
        {user.title === 'Other' && (
          <div className="form-group">
            <label>Title (Other):<RequiredStar>*</RequiredStar></label>
            <input required
              type="text"
              name="titleOther"
              className="form-control"
              value={user.titleOther}
              onChange={onChangeUser}
            />
          </div>
        )}
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
          <label>Mobile:<RequiredStar>*</RequiredStar></label>
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
          <input type="submit" value="Update User" className="btn btn-primary" />
        </div>
        <Link to="/">Back to User List</Link>
      </form>
    </div>
  );
}

export default EditUser;
