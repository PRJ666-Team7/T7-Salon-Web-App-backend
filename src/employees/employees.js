const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.CONNECT_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

module.exports.getEmployee = async () => {
  try {
    sqlLine = `SELECT EMPLOYEE.EMP_ID, CONCAT(USERS.USR_FNAME, ' ', USERS.USR_LNAME) AS "usr_name" FROM USERS INNER JOIN EMPLOYEE ON USERS.USR_ID = EMPLOYEE.USR_ID ORDER BY "usr_name"`;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};
