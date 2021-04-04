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

module.exports.getEmployeeName = async (id) => {
  try {
    sqlLine = `SELECT CONCAT(USERS.USR_LNAME, ' ', USERS.USR_FNAME) AS "name" FROM USERS INNER JOIN EMPLOYEE ON USERS.USR_ID = EMPLOYEE.USR_ID WHERE EMPLOYEE.EMP_ID = ` + id;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows[0].name;
  } catch (err) {
    console.log(err.stack);
  }
};


module.exports.setEmployee = async (id, emp) => {
  try {
    if(emp){
      sqlLine = `INSERT INTO EMPLOYEE (USR_ID) VALUES (` + id + `)`
    }
    else{
      sqlLine = `DELETE FROM EMPLOYEE WHERE USR_ID = ` + id + `;`
    }

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.setAdmin = async (id) => {
  try {
    sqlLine = `uPDATE USERS SET ISADMIN = NOT ISADMIN WHERE USR_ID = ` + id;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

