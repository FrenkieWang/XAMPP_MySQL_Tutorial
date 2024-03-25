import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function AddressList() {
  let { userId, addressId } = useParams();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/users/${userId}/addresses`)
      .then(response => {
        setAddresses(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [userId]);

  function deleteAddress(addressId) {
    axios.delete(`http://localhost:5000/users/${userId}/addresses/delete/${addressId}`)
      .then(response => { 
        console.log(response.data);
      });

      alert(`http://localhost:5000/users/${userId}/addresses/delete/${addressId}`);
    setAddresses(addresses.filter(address => address.addressId !== addressId));
  }

  return (
    <div>
      <h1>Addresses for User ID: {userId}</h1>
      <Link to= {`/user/${userId}/address/create`}>Create Address</Link>
      <div className="addresses">
        {addresses.length > 0 ? (
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>User ID</th>
                <th>Address ID</th>
                <th>Type</th>
                <th>AddressLine</th>
                <th>Town</th>
                <th>countyCity</th>
                <th>Postal Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map(currentAddress => (
                <tr key={currentAddress.addressId}>
                  <td>{currentAddress.userId}</td>
                  <td>{currentAddress.addressId}</td>
                  <td>{currentAddress.addressType}</td>
                  <td>{currentAddress.addressLine1} &nbsp; {currentAddress.addressLine2}</td>
                  <td>{currentAddress.town}</td>
                  <td>{currentAddress.countyCity}</td>
                  <td>{currentAddress.eircode}</td>
                  <td>
                    <Link to={`/user/${currentAddress.userId}/address/edit/${currentAddress.addressId}`}>edit</Link> | 
                    <a href="/" onClick={(e) => {e.preventDefault(); deleteAddress(currentAddress.addressId); }}>delete</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No addresses found for this user.</p>
        )}
        <Link to="/">Back to User List</Link>
      </div>
    </div>
  );
}

export default AddressList;
