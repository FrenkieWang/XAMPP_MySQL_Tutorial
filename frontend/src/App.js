
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import CreateUser from './components/user/CreateUser';
import UserList from "./components/user/UserList";
import EditUser from "./components/user/EditUser";
import CreateAddress from "./components/address/CreateAddress";
import AddressList from './components/address/AddressList';
import EditAddress from "./components/address/EditAddress";

function App() {
  return (
    <Router>
      <div className="container">
      <Routes>z
        <Route path="/" element={<UserList/>} />
        <Route path="/user/create" element={<CreateUser/>} />
        <Route path="/user/edit/:userId" element={<EditUser/>} />
        <Route path="/user/:userId/address/" element={<AddressList/>} />
        <Route path="/user/:userId/address/create" element={<CreateAddress/>} />
        <Route path="/user/:userId/address/edit/:addressId" element={<EditAddress/>} />
      </Routes>
       </div>
    </Router>
  );
}

export default App;

/*
  Local Host: http://localhost:5000
  Deployed Host: https://mern-stack-crud-3-tables.vercel.app/
*/