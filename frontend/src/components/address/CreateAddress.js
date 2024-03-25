import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

// Create a styled span for the red asterisk
const RequiredStar = styled.span`
  color: red;
`;

function CreateAddress() {
  const [address, setAddress] = useState({
    addressType: 'home',
    addressLine1: '',
    addressLine2: '', 
    town: '',
    countyCity: '',
    eircode: '' 
  });

  let { userId } = useParams();

  // Handler for changes 
  function onChangeAddress(e){
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value
    }));
  };

  function onSubmit(e) {
    e.preventDefault();
    console.log(address);

    axios.post(`http://localhost:5000/users/${userId}/addresses/create`, address)
      .then(res => console.log(res.data))
      .catch(error => console.log(error));

    window.location = `/user/${userId}/address/`;
  }

  return (
    <div>
      <h3>Create New Address for User ID: {userId}</h3>
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
          <input type="submit" value="Create Address" className="btn btn-primary" />
        </div>
        <Link to = {`/user/${userId}/address/`}>Back to Address List</Link>
      </form>
    </div>
  )  
}

export default CreateAddress;