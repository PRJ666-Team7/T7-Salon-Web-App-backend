const { Pool, Client } = require('pg')

const client = new Client({
  connectionString: process.env.CONNECT_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()

