import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// Create a styled span for the red asterisk
const RequiredStar = styled.span`
  color: red;
`;

function EditAddress() {
  const [address, setAddress] = useState({
    addressType: 'home',
    addressLine1: '',
    addressLine2: '',
    town: '',
    countyCity: '',
    eircode: ''
  });

  let { userId, addressId } = useParams();

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:5000/users/${userId}/addresses/${addressId}`, true);
  
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        const addresses = JSON.parse(this.responseText);
        // `addressId` is unique -> get the first element in Array.
        setAddress(addresses[0]);
      } else {
        console.log('Error:', this.statusText);
      }
    };
  
    xhr.onerror = function() {
      console.error('Network error');
    };
  
    xhr.send();
    
  }, [userId, addressId]);

  function onChangeAddress(e) {
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value
    }));
  };

  function onSubmit(e) {
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `http://localhost:5000/users/${userId}/addresses/${addressId}/update`, true);  
    // Set the `type of data` to be sent in Request Header
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        // Navigate the Page
        window.location = `/user/${userId}/address/`;
      } else {
        console.log('Error:', this.statusText);
      }
    };
  
    xhr.onerror = function() {
      console.error('Network error');
    };
    // Set `body` information in the request.
    xhr.send(JSON.stringify(address));
  }

  return (
    <div>
      <h3>Edit Address</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Address Type:<RequiredStar>*</RequiredStar></label>
          <div>
            <input
              type="radio"
              id="home"
              name="addressType"
              value="home"
              checked={address.addressType === 'home'}
              onChange={onChangeAddress}
            />
            <label htmlFor="home">Home</label>
          </div>
          <div>
            <input
              type="radio"
              id="shipping"
              name="addressType"
              value="shipping"
              checked={address.addressType === 'shipping'}
              onChange={onChangeAddress}
            />
            <label htmlFor="shipping">Shipping</label>
          </div>
        </div>
        <div className="form-group">
          <label>Address Line 1:<RequiredStar>*</RequiredStar></label>
          <input required
            type="text"
            name="addressLine1"
            className="form-control"
            value={address.addressLine1}
            onChange={onChangeAddress}
          />
        </div>
        <div className="form-group">
          <label>Address Line 2:</label>
          <input
            type="text"
            name="addressLine2"
            className="form-control"
            value={address.addressLine2}
            onChange={onChangeAddress}
          />
        </div>
        <div className="form-group">
          <label>Town/City:<RequiredStar>*</RequiredStar></label>
          <input required
            type="text"
            name="town"
            className="form-control"
            value={address.town}
            onChange={onChangeAddress}
          />
        </div>
        <div className="form-group">
          <label>County/City:<RequiredStar>*</RequiredStar></label>
          <input required
            type="text"
            name="countyCity"
            className="form-control"
            value={address.countyCity}
            onChange={onChangeAddress}
          />
        </div>
        <div className="form-group">
          <label>Eircode:</label>
          <input
            type="text"
            name="eircode"
            className="form-control"
            value={address.eircode}
            onChange={onChangeAddress}
          />
        </div>        
        <div className="form-group">
          <input type="submit" value="Update Address" className="btn btn-primary" />
        </div>
        <Link to="/">Back to Address List</Link>
      </form>
    </div>
  );
}

export default EditAddress;
