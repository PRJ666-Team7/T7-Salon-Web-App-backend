const express = require('express')
const app = express();
const port = 8000;
var routes = require('./routes/login')(app);

app.get('/', function(req, res) {
  res.write("Hi I am the root")
  res.end();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});