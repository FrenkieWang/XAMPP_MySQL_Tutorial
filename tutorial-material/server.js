const http = require('http');
const mysql = require('mysql'); //npm install mysql
const url = require('url');

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


// Configure HTTP Server - 5 Paths
const server = http.createServer((request, response) => {

  // Set CORS headers to allows Cross-Origin-Resourse-Share
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS -> Preflight request ... Browser will determine whether server is safe
  // Browser will determine whether server is safe
  if (request.method === 'OPTIONS') {
    response.writeHead(204); // No Content
    response.end();
    return;
  }

  // Get request URL, split path by '/', remove empty segments.
  const URL = url.parse(request.url, true);
  const path = URL.pathname;
  const segments = path.split('/').filter(Boolean); 

  let SQL = ''; // Initialize  SQL as null


  // [Path 1 - Get] -- Get all Modules - '/modules/get'
  if (path === '/modules/get' && request.method === 'GET') {
    SQL = 'SELECT * FROM modules';
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

  // [Path 2 - POST] Create a Module - '/modules/create'
  else if (path === '/modules/create' && request.method === 'POST') {
    let body = '';
    request.on('data', chunk => {
      //convert Buffer Chunks to Strings and concatenate them
      body += chunk.toString();
    });
    request.on('end', () => {
      const module = JSON.parse(body); // String -> JSON

      SQL = 'INSERT INTO modules SET ?';
      db.query(SQL, module, (error, result) => {
        if (error) {
          response.writeHead(500);
          response.end('Server Error');
          return;
        }
        response.writeHead(201);
        response.end(`Module created successfully!`);
      });
    }); 
  } 

  // [Path 3 - GET] -- Get a Module - '/modules/get/:moduleId'
  else if (segments[1] === 'get' && segments.length === 3 && request.method === 'GET') {
    const moduleId = segments[2]; // This is `/:moduleId`

    SQL = 'SELECT * FROM modules WHERE moduleId = ?';
    db.query(SQL, [moduleId], (error, result) => {
      if (error) {
        response.writeHead(500);
        response.end('Server Error');
        return;
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(result));
    });
  }

  // [Path 4 - PUT] -- Update a Module - '/modules/update/:moduleId'
  else if (segments[1] === 'update' && segments.length === 3 && request.method === 'PUT') {
    let body = '';
    const moduleId = segments[2];

    request.on('data', chunk => {
      body += chunk.toString();
    });
    
    request.on('end', () => {
      const module = JSON.parse(body);
      const { code, moduleName } = module;

      SQL = 'UPDATE modules SET code = ?, moduleName = ? WHERE moduleId = ?';
      db.query(SQL, [code, moduleName, moduleId], (error, result) => {
        if (error) {
          response.writeHead(500);
          response.end('Server Error');
          return;
        }
        response.writeHead(200);
        response.end(`Module with ID: ${moduleId}  updated.`);
      });
    });
  }

  // [Path 5 -- DELETE] -- Delete a Module - '/modules/delete/:modulId'
  else if (segments[1] === 'delete' && segments.length === 3  && request.method === 'DELETE') {
    const moduleId = segments[2];

    SQL = 'DELETE FROM modules WHERE moduleId = ?';
    db.query(SQL, [moduleId], (error, result) => {
      if (error) {
        response.writeHead(500);
        response.end('Server Error');
        return;
      }
      response.writeHead(200);
      response.end(`User with ID: ${moduleId} deleted.`);
    });
  }

  // [Path 6] Path Not Found
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