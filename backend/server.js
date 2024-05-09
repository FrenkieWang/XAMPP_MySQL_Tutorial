const http = require('http');
const mysql = require('mysql');
const url = require('url');

const generateRandomUser = require('./faker/fakerUser'); 
const generateRandomAddress = require('./faker/fakerAddress'); 

// Configure Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'assignment4'
});

// Connect to Database
db.connect((error) => {
  if (error) throw error;
  console.log('Connected to the database');
});

const server = http.createServer((request, response) => {
  const reqUrl = url.parse(request.url, true);
  const path = reqUrl.pathname;
  const segments = path.split('/').filter(Boolean); // Split path and remove empty segments
  let SQL = ''; // Initialize  SQL as null

  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight request = OPTIONS
  if (request.method === 'OPTIONS') {
    response.writeHead(204); // No Content
    response.end();
    return;
  }

  // [Path 1] GET - Generate Random User - '/users/get/generate-user'
  if (path === '/users/generate-user') {
    const user = generateRandomUser(); 
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(user));
  }

  // [Path 2] GET - Get all Users - '/users/get'
  else if (path === '/users/get' && request.method === 'GET') {
    SQL = 'SELECT * FROM users';
    db.query(SQL, (error, results) => {
      if (error) {
        response.writeHead(500);
        response.end('Server Error');
        return;
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(results));
    });
  }

  // [Path 3] POST - Create a User - '/users/create'
  else if(path === '/users/create' && request.method === 'POST') {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    request.on('end', () => {
      const user = JSON.parse(body);
      const { title, titleOther, firstName, surName, mobile, email } = user;

      const validTitles = ['Mx', 'Ms', 'Mr', 'Mrs', 'Miss', 'Dr', 'Other'];
      if (!validTitles.includes(title)) {
        response.writeHead(400);
        response.end('Invalid title. Must be one of Mx, Ms, Mr, Mrs, Miss, Dr, Other.');
        return;
      }

      if (title === 'Other' && !titleOther) {
        response.writeHead(400);
        response.end('titleOther is required when title is Other.');
        return;
      }

      if (!firstName || !surName || !mobile || !email) {
        response.writeHead(400);
        response.end('Missing required fields');
        return;
      }

      SQL = 'INSERT INTO users SET ?';
      db.query(SQL, user, (error, result) => {
        if (error) {
          response.writeHead(500);
          response.end('Server Error');
          return;
        }
        response.writeHead(201);
        response.end(`User added with ID: ${result.insertId}`);
      });
    }); 

  // [Path 4] GET - Read a User - '/users/get/:userID'
  } else if (path.startsWith('/users/get/') && request.method === 'GET') {
    const userID = segments[2];
    SQL = 'SELECT * FROM users WHERE userID = ?';
    db.query(SQL, [userID], (error, result) => {
      if (error) {
        response.writeHead(500);
        response.end('Server Error');
        return;
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(result));
    });
  }

  // [Path 5] PUT - Update a User - '/users/update/:userID'
  else if (path.startsWith('/users/update/') && request.method === 'PUT') {
    let body = '';
    const userID = segments[2];
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      const user = JSON.parse(body);
      const { title, titleOther, firstName, surName, mobile, email } = user;

      // Add your validation and update logic here
      SQL = 'UPDATE users SET title = ?, titleOther = ?, firstName = ?, surName = ?, mobile = ?, email = ? WHERE userID = ?';
      db.query(SQL, [title, titleOther, firstName, surName, mobile, email, userID], (error, result) => {
        if (error) {
          response.writeHead(500);
          response.end('Server Error');
          return;
        }
        response.writeHead(200);
        response.end(`User with ID: ${userID} updated.`);
      });
    });
  }

  // [Path 6] DELETE - Delete a User - '/users/delete/:userID'
  else if (path.startsWith('/users/delete/') && request.method === 'DELETE') {
    const userID = segments[2];
    SQL = 'DELETE FROM users WHERE userID = ?';
    db.query(SQL, [userID], (error, result) => {
      if (error) {
        response.writeHead(500);
        response.end('Server Error');
        return;
      }
      response.writeHead(200);
      response.end(`User with ID: ${userID} deleted.`);
    });
  }

  // [Path 7] GET - Generate Random Address - '/users/addresses/generate-address'
  else if (path === '/users/addresses/generate-address') {
    const address = generateRandomAddress(); 
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(address));
  }

  // [Path 8] GET - Get all addresses for a specific user - '/users/addresses/get/:userID/:addressType'  
  else if (path.startsWith('/users/addresses/get/') && request.method === 'GET') {
    const userID = segments[3]; // Extract userID from the path
    const addressType = segments[4]; // Extract userID from the path
    const SQL = 'SELECT * FROM addresses WHERE userID = ? and addressType = ?';
    db.query(SQL, [userID, addressType], (error, results) => {
      if (error) {
        response.writeHead(500);
        response.end('Server Error');
        return;
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(results));
    });
  }

  // [Path 9] POST - Create an address for a specific user - '/users/addresses/create/:userID'
  else if (path.startsWith('/users/addresses/create') && request.method === 'POST') {
    let body = '';
    const userID = segments[3]; // Extract userID from the path

    request.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });

    request.on('end', () => {
      const { addressType, addressLine1, addressLine2, town, countyCity, eircode } = JSON.parse(body);

      if (!addressType || !addressLine1 || !town || !countyCity) {
        response.writeHead(400);
        response.end('Missing required fields');
        return;
      }

      const address = { userID, addressType, addressLine1, addressLine2, town, countyCity, eircode };
      const SQL = 'INSERT INTO addresses SET ?';
      
      db.query(SQL, address, (error, result) => {
        if (error) {
          response.writeHead(500);
          response.end('Internal Server Error');
          return;
        }
        response.writeHead(201);
        response.end(`Address added with ID: ${result.insertId}`);
      });
    });
  }

  // [Path 10] GET - Get a specific address for a specific user - '/users/addresses/getone/:userID/:addressID'  
  else if (path.startsWith('/users/addresses/getone/') && request.method === 'GET') {
    const userID = segments[3]; // Extract userID from the path
    const addressID = segments[4]; // Extract addressID from the path
    const SQL = 'SELECT * FROM addresses WHERE userID = ? AND addressID = ?';

    db.query(SQL, [userID, addressID], (error, result) => {
      if (error) {
        response.writeHead(500);
        response.end('Internal Server Error');
        return;
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(result));
    });
  }

  // [Path 11] PUT - Update a specific address for a specific user - '/users/addresses/update/:userID/:addressID'
  else if (path.startsWith('/users/addresses/update/') && request.method === 'PUT') {
    let body = '';
    const userID = segments[3]; // Extract userID from the path
    const addressID = segments[4]; // Extract addressID from the path

    request.on('data', chunk => {
      body += chunk.toString(); // Convert Buffer to string
    });

    request.on('end', () => {
      const { addressType, addressLine1, addressLine2, town, countyCity, eircode } = JSON.parse(body);
      
      const SQL = `UPDATE addresses SET addressType = ?, addressLine1 = ?, addressLine2 = ?, town = ?, countyCity = ?, eircode = ? WHERE userID = ? AND addressID = ?`;

      db.query(SQL, [addressType, addressLine1, addressLine2, town, countyCity, eircode, userID, addressID], (error, result) => {
        if (error) {
          response.writeHead(500);
          response.end('Internal Server Error');
          return;
        }
        response.writeHead(200);
        response.end(`Address with ID: ${addressID} updated.`);
      });
    });
  }

  // [Path 12] DELETE - Delete a specific address for a specific user - '/users/addresses/delete/:userID/:addressID'
  else  if (path.startsWith('/users/addresses/delete/') && request.method === 'DELETE') {
    const userID = segments[3]; // Extract userID from the path
    const addressID = segments[4]; // Extract addressID from the path
    const SQL = 'DELETE FROM addresses WHERE userID = ? AND addressID = ?';

    db.query(SQL, [userID, addressID], (error, result) => {
      if (error) {
        response.writeHead(500);
        response.end('Internal Server Error');
        return;
      }
      response.writeHead(200);
      response.end(`Address with ID: ${addressID} deleted.`);
    });
  }

  // [Path 13] Path Not Found
  else {
    response.writeHead(404);
    response.end('Not Found');
  }
}); // end of http.createServer

// Server listen to the PORT => http://localhost:5000/
const port = 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});