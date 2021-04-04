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

module.exports.getEmployeeByUserId = async (id) => {
  try {
      const query = {
          text: 'select * from employee where usr_id = $1',
          values: [id]
      }
      const res = await client.query(query)

      return res.rows[0]
  } catch (err) {
      console.log(err.stack)
  }
}


module.exports.getEmployeeSchdule = async (id, date) => {
  try {
      const query = {
          text: 'SELECT * from appointment where emp_id = $1 and apt_date > $2 order by apt_date',
          values: [id, date]
      }
      const res = await client.query(query)

      return res.rows
  } catch (err) {
      console.log(err.stack)
  }
}