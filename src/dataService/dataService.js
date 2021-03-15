const { Pool, Client } = require('pg')

const connectionString = 'postgres://vzkverhazpkutr:e025b418dceb93238d7481b152d92ec94d76a63e9313b933ef79489d517adb26@ec2-3-211-37-117.compute-1.amazonaws.com:5432/d49u410ndpdbno'

const client = new Client({
  connectionString: "postgres://vzkverhazpkutr:e025b418dceb93238d7481b152d92ec94d76a63e9313b933ef79489d517adb26@ec2-3-211-37-117.compute-1.amazonaws.com:5432/d49u410ndpdbno",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()

module.exports.getUsers = async () => {
    try {
        const query = {
            text: 'SELECT * from users',
            // values: ['brianc', 'brian.m.carlson@gmail.com'],
        }

        const res = await client.query(query)

        return res.rows
    } catch (err) {
        console.log(err.stack)
    }
}