const express = require('express')
const app = express();
const port = 8000;

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  next();
});

var auth = require('./routes/auth')(app);

app.get('/', function(req, res) {
  res.send('Hi i am root')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});