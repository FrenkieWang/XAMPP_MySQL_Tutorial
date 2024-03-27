import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    // Configure HTTP Request
    xhr.open('GET', 'http://localhost:5000/users/get', true);  
    // When the request completes successfully and receives a response from the server
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        const users = JSON.parse(this.responseText);
        setUsers(users);
      } else {
        console.log('Failed to fetch users:', this.statusText);
      }
    };  
    // When meets network error
    xhr.onerror = function() {
      console.error('Network error');
    };  
    // Send the HTTP request
    xhr.send();
    
  }, []);

  function deleteUser(userId) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:5000/users/delete/${userId}`, true);
  
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        setUsers(users.filter(user => user.userId !== userId));
      } else {
        console.log('Failed to delete User:', this.statusText);
      }
    };
  
    xhr.onerror = function() {
      console.error('Network error');
    };
  
    xhr.send();
  }

  return (
    <div>
      <h3>Logged Users</h3>
      <Link to="/user/create">Create User</Link>
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Title</th>
            <th>First Name</th>
            <th>Sur Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(currentUser => (
            <tr key={currentUser.userId}>
              <td>{currentUser.title === 'Other' ? currentUser.titleOther : currentUser.title}</td>
              <td>{currentUser.firstName}</td>
              <td>{currentUser.surName}</td>
              <td>{currentUser.mobile}</td>
              <td>{currentUser.email}</td>
              <td>
                <Link to={`/user/${currentUser.userId}/address/`}>Show Address</Link>
              </td>
              <td>
                <Link to={`/user/edit/${currentUser.userId}`}>edit</Link> | 
                <a href="/" onClick={(e) => {e.preventDefault(); deleteUser(currentUser.userId); }}>delete</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;