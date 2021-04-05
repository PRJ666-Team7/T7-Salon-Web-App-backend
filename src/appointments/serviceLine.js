const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.CONNECT_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

module.exports.getServiceLineById = async (aptId) => {
  const appointmentId = aptId;

  try {
    sqlLine =
      `SELECT SERVICE.SRV_NAME AS "service" FROM SERVICE_LINE INNER JOIN SERVICE ON SERVICE_LINE.SRV_ID = SERVICE.SRV_ID WHERE SERVICE_LINE.APT_ID = ` +
      appointmentId;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return Promise.all(
      res.rows.map(async (line) => {
        return line.service;
      })
    );

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.getServiceLine = async (aptId) => {
  const appointmentId = aptId;

  try {
    sqlLine =
      `SELECT SERVICE.SRV_ID AS "srvId", SERVICE.SRV_NAME AS "service", SERVICE.SRV_PRICE AS "price" FROM SERVICE_LINE INNER JOIN SERVICE ON SERVICE_LINE.SRV_ID = SERVICE.SRV_ID WHERE SERVICE_LINE.APT_ID = ` +
      appointmentId;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    // return Promise.all(res.rows.map(async line => {
    //     return line.service
    // }))

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.removeServiceLineById = async (id) => {
  try {
    sqlLine = `DELETE FROM SERVICE_LINE WHERE APT_ID = ` + id;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.addServiceLine = async (id, srv_id) => {
  try {
    sqlLine =
      `INSERT INTO SERVICE_LINE (APT_ID, SRV_ID) VALUES (` +
      id +
      `, ` +
      srv_id +
      `)`;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};
