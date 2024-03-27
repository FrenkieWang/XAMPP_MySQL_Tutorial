import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function AddressList() {
  let { userId, addressId } = useParams();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:5000/users/${userId}/addresses`, true);
    
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        console.log(JSON.parse(this.responseText));
        const addresses = JSON.parse(this.responseText);
        setAddresses(addresses);
      } else {
        console.log('Error:', this.statusText);
      }
    };
    
    xhr.onerror = function() {
      console.error('Network error');
    };
    
    xhr.send();    
    
  }, [userId]);

  function deleteAddress(addressId) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:5000/users/${userId}/addresses/delete/${addressId}`, true);
  
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        setAddresses(addresses.filter(address => address.addressId !== addressId));
      } else {
        console.log('Failed to delete Address:', this.statusText);
      }
    };
  
    xhr.onerror = function() {
      console.error('Network error');
    };

    xhr.send();     
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
