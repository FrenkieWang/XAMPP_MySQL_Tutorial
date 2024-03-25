const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = 5000;

app.use(cors()); 
app.use(bodyParser.json());

// Configure Database
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'assignment4'
});

// Connect to Database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database');
});


/* Users **************************************************************************** */
// GET - Get all Users
app.get('/users/get', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST - Create a User
app.post('/users/create', (req, res) => {
  const { title, firstName, surName, mobile, email } = req.body;
  if (!firstName || !surName || !mobile || !email) {
    return res.status(400).send('Missing required fields');
  }

  const user = { title, firstName, surName, mobile, email };
  db.query('INSERT INTO users SET ?', user, (err, result) => {
    if (err) throw err;
    res.status(201).send(`User added with ID: ${result.insertId}`);
  });
});

// GET - Get a User
app.get('/users/get/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM users WHERE userId = ?', [userId], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// PUT - Update a User
app.put('/users/update/:userId', (req, res) => {
  const { userId } = req.params;
  const { title, firstName, surName, mobile, email } = req.body;
  db.query('UPDATE users SET title = ?, firstName = ?, surName = ?, mobile = ?, email = ? WHERE userId = ?', [title, firstName, surName, mobile, email, userId], (err, result) => {
    if (err) throw err;
    res.send(`User with ID: ${userId} updated.`);
  });
});

// DELETE - Delete a User
app.delete('/users/delete/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('DELETE FROM users WHERE userId = ?', [userId], (err, result) => {
    if (err) throw err;
    res.send(`User with ID: ${userId} deleted.`);
  });
});


/* Addresses**************************************************************************** */
// GET - Get all addresses for a specific user
app.get('/users/:userId/addresses', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM addresses WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});

// POST - Create an address for a specific user
app.post('/users/:userId/addresses/create', (req, res) => {
  const { userId } = req.params;
  const { addressType, addressLine1, addressLine2, town, countyCity, eircode } = req.body;
  
  if (!addressType || !addressLine1 || !town || !countyCity) {
    return res.status(400).send('Missing required fields');
  }

  const address = { userId, addressType, addressLine1, addressLine2, town, countyCity, eircode };
  db.query('INSERT INTO addresses SET ?', address, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).send(`Address added with ID: ${result.insertId}`);
  });
});

// GET - Get a specific address for a specific user
app.get('/users/:userId/addresses/:addressId', (req, res) => {
  const { userId, addressId } = req.params;
  db.query('SELECT * FROM addresses WHERE userId = ? AND addressId = ?', [userId, addressId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(result);
  });
});

// PUT - Update a specific address for a specific user
app.put('/users/:userId/addresses/:addressId/update', (req, res) => {
  const { userId, addressId } = req.params;
  const { addressType, addressLine1, addressLine2, town, countyCity, eircode } = req.body;

  db.query(`UPDATE addresses SET addressType = ?, addressLine1 = ?, addressLine2 = ?
  , town = ?, countyCity = ?, eircode = ? WHERE userId = ? AND addressId = ?`
  , [addressType, addressLine1, addressLine2, town, countyCity, eircode, userId, addressId,]
  , (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.send(`Address with ID: ${addressId} updated.`);
  });
});

// DELETE - Delete a specific address for a specific user
app.delete('/users/:userId/addresses/delete/:addressId/', (req, res) => {
  const { userId, addressId } = req.params;
  db.query('DELETE FROM addresses WHERE userId = ? AND addressId = ?', [userId, addressId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.send(`Address with ID: ${addressId} deleted.`);
  });
});

/* Port **************************************************************************** */
// Setting the back-end port
// Test the Vercel
app.get("/", (req, res) => {
	res.send("You succeeded to deploy backend to Vercel!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});