"use strict";

var fs = require("fs"),
  path = require("path"),
  http = require("http");

const express = require("express")
var app = express();
var swaggerTools = require("swagger-tools");
var jsyaml = require("js-yaml");
var serverPort = process.env.PORT || 8080;
let cookieSession = require("cookie-session");
let cookieParser = require("cookie-parser");
var cors = require('cors');

let { setupDataLayer } = require("./service/DataLayer");
var docsRouter = require("./docs/docs-router");

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, "/swagger.json"),
  controllers: path.join(__dirname, "./controllers"),
  useStubs: process.env.NODE_ENV === "development" // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, "api/swagger.yaml"), "utf8");
var swaggerDoc = jsyaml.safeLoad(spec);

// CORS policy
app.use(cors({origin: 'https://bookstore-hypermedia-fe.herokuapp.com', credentials: true}));

// Add cookies to responses
app.use(cookieParser());
app.use(cookieSession({ name: "session", keys: ["abc", "def"] }));

// Documentation
app.use('/', docsRouter);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  setupDataLayer().then((res, err) => {
    if (err) {
      console.log("Unable to connect to the database, shutting down...");
    } else {
      console.log("Connected to the database with version: ");
      console.log(res.rows[0].version);
      // Start the server
      http.createServer(app).listen(serverPort, function() {
        console.log(
          "Your server is listening on port %d (http://localhost:%d)",
          serverPort,
          serverPort
        );
        console.log(
          "Swagger-ui is available on http://localhost:%d/docs",
          serverPort
        );
      });
    }
  });
});
