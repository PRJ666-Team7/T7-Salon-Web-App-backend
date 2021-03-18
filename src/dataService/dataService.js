const { Pool, Client } = require('pg')

const client = new Client({
  connectionString: process.env.CONNECT_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()

module.exports.getUser = async (email) => {
    try {
        const query = {
            text: 'SELECT * from users where usr_email = $1',
            values: [email]
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}


module.exports.getEmployee = async (id) => {
    try {
        const query = {
            text: 'SELECT * from employee where usr_id = $1',
            values: [id]
        }

        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}


module.exports.addUser = async (email, fname, lname, phone, password) => {
    try {
        const query = {
            text: 'INSERT INTO users( usr_email, usr_fname, usr_lname, usr_phone, usr_password) VALUES($1, $2, $3, $4, $5) RETURNING *',
            values: [email, fname, lname, phone, password],
        }
        const res = await client.query(query)

        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
    }
}