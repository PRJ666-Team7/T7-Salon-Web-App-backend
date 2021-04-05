const { Client } = require("pg");
const services = require("../appointments/serviceLine");
const employees = require("../employees/employees");

const client = new Client({
  connectionString: process.env.CONNECT_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

module.exports.getAppointments = async (id) => {
  try {
    sqlLine = `SELECT APPOINTMENT.APT_ID AS "id", CONCAT(USERS.USR_FNAME, ' ', USERS.USR_LNAME) AS "name", USERS.USR_PHONE AS "phone", APPOINTMENT.USR_ID AS "usr_id", APPOINTMENT.APT_DATE AS "date", APPOINTMENT.APT_TIME_START AS "time_start", APPOINTMENT.APT_TIME_END AS "time_end" FROM APPOINTMENT INNER JOIN USERS ON APPOINTMENT.USR_ID = USERS.USR_ID WHERE APPOINTMENT.emp_id = (select emp_id from employee where usr_id = ` + id + `) AND APT_DATE >= NOW() ORDER BY APPOINTMENT.APT_DATE, APT_TIME_START`;

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
          date: line.date,
          time_start: line.time_start,
          time_end: line.time_end,
          usr_id: line.usr_id
        };
      })
    );
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.removeAppointments = async (id) => {
  try {
    sqlLine = `UPDATE APPOINTMENT SET USR_ID = NULL, AVAILABLE = TRUE WHERE APT_ID = ` + id;

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
        `', APT_TIME_START = '` +
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
      console.log(usrId)
      sqlLine =
        `UPDATE APPOINTMENT SET USR_ID = ` + usrId + `, AVAILABLE = FALSE WHERE APT_ID = `+ data + ` RETURNING APT_ID`;

      const query = {
        text: sqlLine,
      };

      const res = await client.query(query);

      console.log(res.rows)
      return res.rows[0].apt_id;

    } catch (err) {
      console.log(err.stack);
    }
  } else {
    return null;
  }
};

module.exports.getAllAppointment = async () => {
    try {
      sqlLine = `SELECT * FROM APPOINTMENT WHERE AVAILABLE = TRUE AND APT_DATE >= NOW() ORDER BY APT_DATE, APT_TIME_START`

      const query = {
        text: sqlLine,
      };

      const res = await client.query(query);

      return res.rows;

    } catch (err) {
      console.log(err.stack);
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

module.exports.adminDeleteAppointment = async (id, date) => {
  try {
      const query = {
          text: 'Delete from appointment where emp_id = $1 and apt_date = $2 and available = true',
          values: [id, date]
      }
      const res = await client.query(query)

      return res.rows
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


module.exports.getUserAppointments = async (id) => {
  try {
    sqlLine = `SELECT APT_ID AS "id", EMP_ID AS "empId", APT_DATE AS "date", APT_TIME_START AS "startTime", APT_TIME_END AS "endTime" FROM APPOINTMENT WHERE USR_ID = ` + id + ` ORDER BY APT_DATE, APT_TIME_START`;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    let money = 0;
    return Promise.all(
      res.rows.map(async (line) => {
        return {
          id: line.id,
          name: await employees.getEmployeeName(line.empId),
          service: await services.getServiceLine(line.id),
          date: line.date,
          startTime: line.startTime,
          endTime: line.endTime,
        };
      })
    );
  } catch (err) {
    console.log(err.stack);
  }
};

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

module.exports.getEmployeeScheduleUniqueDate = async (id, date) => {
  try {
      const query = {
          text: 'SELECT DISTINCT apt_date from appointment where emp_id = $1 and apt_date >= $2',
          values: [id, date]
      }
      const res = await client.query(query)

      return res.rows
  } catch (err) {
      console.log(err.stack)
  }
}


