require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const passport = require("passport");
const PassportConfig = require('./auth/passport')

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(passport.initialize());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

  next();
});

var auth = require('./routes/auth')(app);
var editApt = require('./routes/editApt')(app);
var editSrv = require('./routes/editSrv')(app);
var book = require('./routes/book')(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});