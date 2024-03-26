import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users/get')
      .then(response => {
        setUsers(response.data);
        // console.log(response.data);
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  function deleteUser(userId) {
    axios.delete(`http://localhost:5000/users/delete/${userId}`)
      .then(response => { 
        console.log(response.data);
      });

    setUsers(users.filter(user => user.userId !== userId));
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