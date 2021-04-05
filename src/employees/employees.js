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

module.exports.getEmployeeByUserID = async (userID) => {
  try{
    sqlLine = `SELECT EMP_ID FROM EMPLOYEE WHERE USR_ID =` + userID
    const query = {
      text: sqlLine,
    }
    const res = await client.query(query);

    return res.rows[0];
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
      sqlLine = `DELETE FROM EMPLOYEE WHERE USR_ID = ` + id
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

module.exports.getEmployeeAppointments = async (empId) => {
  try {
    sqlLine = `SELECT * FROM APPOINTMENT WHERE EMP_ID = ` + empId;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.getEmployeeAvailableTime = async (userId) => {
  try {
    sqlLine = `SELECT APPOINTMENT.APT_ID AS "id", APPOINTMENT.APT_DATE AS "date", APPOINTMENT.APT_TIME_START AS "time_start", APPOINTMENT.APT_TIME_END AS "time_end" FROM APPOINTMENT WHERE APPOINTMENT.emp_id = (select emp_id from employee where usr_id = ` + userId + `) AND APT_DATE >= NOW() AND AVAILABLE = TRUE ORDER BY APPOINTMENT.APT_DATE, APT_TIME_START`;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.getUserInfo = async (term) => {
  try {
    sqlLine = `SELECT USR_ID, CONCAT(USR_LNAME, ' ', USR_FNAME) AS "name", USR_EMAIL AS "email", ISADMIN AS "admin", (SELECT COUNT(E.EMP_ID) FROM EMPLOYEE E WHERE U.USR_ID = E.USR_ID) AS "employee" FROM USERS U WHERE USR_EMAIL LIKE '%` + term + `%' ORDER BY USR_EMAIL`

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
    sqlLine = `UPDATE USERS SET ISADMIN = NOT ISADMIN WHERE USR_ID = ` + id;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

