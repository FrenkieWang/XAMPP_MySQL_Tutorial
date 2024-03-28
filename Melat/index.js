//
// AJAX - API - Database Demo
//
// CS230 Demo Program - John G. Keating
//
// (c) 2021
//

// Load the NodeJS modules required

var http = require("http"); // creating an API using http
var url = require("url"); // using url to extract the route (e.g. /, /api/user)
var querystring = require("querystring"); // this will contain the body of the POST request
var fs = require("fs"); //(file system) manages files -  file handling to read the index.html served for / route

var server = http.createServer(); // create the server

var userDatabase = []; // this is the in-memory database that holds the JSON records
// supplied by the POST request via route /api/user

function setCORSHeaders(response) {
  // set the appropriate headers
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.setHeader("Access-Control-Max-Age", "2592000"); // 30 days
  response.setHeader("Content-Type", "text/html"); // 30 days
}

// listen for requests from clients
server.on("request", function (request, response) {
  // Set CORS in every response's Header, not only in path '/'
  setCORSHeaders(response)

  var currentRoute = url.format(request.url); // get the route (/ or /api/user)
  var currentMethod = request.method; // get the HTTP request type (POST - Create; GET - Retrieve)
  var requestBody = ""; // will contain the extracted POST data later

  // determine the route (/ or /api/user)
  switch (currentRoute) {
    //
    // If no API call made then the default route is / so
    // just return the default index.html file to the user.
    // This contains the forms, etc. for making the CRUD
    // requests (only Create and Retrieve implemented)
    //
    case "/": //root of the application
      fs.readFile(__dirname + "/index.html", function (err, data) {
        // get the file and add to data
        response.writeHead(200, headers);
        response.end(data); // return the data (index.html)
      }); // as part of the response

      break;

    //
    // Handle the requests from client made using the route /api/user
    // These come via AJAX embedded in the earlier served index.html
    // There will be a single route (/api/user) but two HTTP request methods
    // POST (for Create) and GET (for Retrieve)
    //
    case "/api/user":
      // Handle a POST request; This is wheen the user is sending user data via AJAX!
      // This is the CRUD (C)reate request. These data need to be
      // extracted from the POST request and saved to the database!

      if (currentMethod === "POST") {
        // read the body of the POST request
        request.on("data", function (chunk) {
          requestBody += chunk.toString();
        });

        // determine the POST request Content-type (and log to console)
        // Either: (i)  application/x-www-form-urlencoded or (ii) application/json
        const { headers } = request;
        let ctype = headers["content-type"];
        console.log("RECEIVED Content-Type: " + ctype + "\n");

        // finished reading the body of the request
        request.on("end", function () {
          var userData = "";
          // saving the user data from the body to the database
          if (ctype.match(new RegExp("^application/x-www-form-urlencoded"))) {
            userData = querystring.parse(requestBody);
          } else {
            userData = JSON.parse(requestBody);
          }
          userDatabase.push(userData);
          // log the user data to console
          console.log(
            "USER DATA RECEIVED: \n\n" +
              JSON.stringify(userData, null, 2) +
              "\n"
          );
          // respond to the user with confirmation message
          var headers = {
            "Content-Type": "text/plain",
          };
          response.writeHead(200, headers);
          response.end(
            "User (" +
              userData.firstname +
              " " +
              userData.surname +
              ") data added to the Database!"
          );
        });
      }

      // Handle a GET request; this is when the user is requesting user data via AJAX!
      // This is the CRUD (R)etrieve request.
      // These data need to be extracted from the database and returned to the user as JSON!
      else if (currentMethod === "GET") {
        var headers = {
          "Content-Type": "application/json",
        };
        console.log(
          "USER DATABASE REQUESTED: \n\n" +
            JSON.stringify(userDatabase, null, 2) +
            "\n"
        );
        response.writeHead(200, headers);
        response.end(JSON.stringify(userDatabase));
      }
      break;
  }
});

// Set up the HTTP server and listen on port 8000
server.listen(8000, function () {
  console.log("\nAJAX - API - Database Demo");
  console.log("CS230 Demo Program - John G. Keating\n(c) 2021\n");
  console.log("AJAX (HTTP) API server running on port: 8000\n");
});