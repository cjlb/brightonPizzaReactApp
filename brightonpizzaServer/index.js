var cors = require('cors');
const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const user = require("./routes/user");
const InitiateMongoServer = require("./config/db");
const {
  db
} = require('./model/User');
const https = require('https');

var privateKey = fs.readFileSync("../ssl/localhost.key");
var certificate = fs.readFileSync("../ssl/localhost.crt");

const credentials = {
  key: privateKey,
  cert: certificate
};


//Initiate the server
InitiateMongoServer();


const app = express();

// PORT
const PORTSSL = process.env.PORTSSL || 443;

//set parser for express application to use
app.use(bodyParser.json());

app.use(cors());


app.get("/", (req, res) => {
  res.send({
    message: "API Working"
  });
});

//regiser user routes
app.use("/user", user);

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORTSSL, () => {
  console.log(`Server Started at PORT ${PORTSSL}`);
});

