const { Client } = require("pg");
const services = require("../appointments/serviceLine");

const client = new Client({
  connectionString: process.env.CONNECT_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

module.exports.getAppointments = async (id) => {
  try {
    sqlLine = `SELECT APPOINTMENT.APT_ID AS "id", CONCAT(USERS.USR_FNAME, ' ', USERS.USR_LNAME) AS "name", USERS.USR_PHONE AS "phone", CONCAT(APPOINTMENT.APT_DATE, ' ', APPOINTMENT.APT_TIME) AS "time" FROM APPOINTMENT INNER JOIN USERS ON APPOINTMENT.USR_ID = USERS.USR_ID WHERE APPOINTMENT.emp_id = (select emp_id from employee where usr_id = ` + id + `) ORDER BY APPOINTMENT.APT_DATE, APT_TIME`;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return Promise.all(
      res.rows.map(async (line) => {
        return {
          id: line.id,
          name: line.name,
          phone: line.phone,
          service: await services.getServiceLineById(line.id),
          time: line.time,
        };
      })
    );
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.removeAppointments = async (id) => {
  try {
    sqlLine = `DELETE FROM APPOINTMENT WHERE APT_ID = ` + id;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.editAppointments = async (data) => {
  if (data) {
    try {
      sqlLine =
        `UPDATE APPOINTMENT SET APT_DATE = '` +
        data.date +
        `', APT_TIME = '` +
        data.time +
        `' WHERE APT_ID =` +
        data.id;

      const query = {
        text: sqlLine,
      };

      const res = await client.query(query);

      return res;
    } catch (err) {
      console.log(err.stack);
    }
  } else {
    return null;
  }
};

module.exports.addAppointments = async (data, usrId) => {
  if (data) {
    try {
      sqlLine =
        `INSERT INTO APPOINTMENT (EMP_ID, APT_DATE, APT_TIME, USR_ID) VALUES (` +
        data.empId +
        `, '` +
        data.date +
        `', '` +
        data.time +
        `', ` +
        usrId +
        `) RETURNING APT_ID`;

      const query = {
        text: sqlLine,
      };

      const res = await client.query(query);

      return res.rows[0].apt_id;

    } catch (err) {
      console.log(err.stack);
    }
  } else {
    return null;
  }
};

module.exports.addAppointments = async (data, usrId) => {
  if (data) {
    try {
      sqlLine =
        `INSERT INTO APPOINTMENT (EMP_ID, APT_DATE, APT_TIME, USR_ID) VALUES (` +
        data.empId +
        `, '` +
        data.date +
        `', '` +
        data.time +
        `', ` +
        usrId +
        `) RETURNING APT_ID`;

      const query = {
        text: sqlLine,
      };

      const res = await client.query(query);

      return res.rows[0].apt_id;

    } catch (err) {
      console.log(err.stack);
    }
  } else {
    return null;
  }
};

module.exports.adminAddAppointment = async (emp, date, startTime, endTime) => {
  try {
      const query = {
          text: 'INSERT INTO appointment( emp_id, apt_date, apt_time_start, apt_time_end) VALUES($1, $2, $3, $4) RETURNING *',
          values: [emp, date, startTime, endTime],
      }
      const res = await client.query(query)

      return res.rows[0]
  } catch (err) {
      console.log(err.stack)
  }
}

module.exports.getAppointmentsByEmployee = async (id, date) => {
  try {
      const query = {
          text: 'SELECT * from appointment where emp_id = $1 and apt_date= $2',
          values: [id, date]
      }
      const res = await client.query(query)

      return res.rows
  } catch (err) {
      console.log(err.stack)
  }
}

module.exports.getEmployeeSchdule = async (id, date) => {
  try {
      const query = {
          text: 'SELECT * from appointment where emp_id = $1 and apt_date >= $2',
          values: [id, date]
      }
      const res = await client.query(query)

      return res.rows
  } catch (err) {
      console.log(err.stack)
  }
}