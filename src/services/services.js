const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.CONNECT_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

module.exports.getServices = async () => {
  try {
    sqlLine = `SELECT * FROM SERVICE ORDER BY SRV_PRICE`;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.addServices = async (data) => {
  try {
    sqlLine =
      `INSERT INTO SERVICE (SRV_NAME, SRV_PRICE) VALUES ('` +
      data.name +
      `', ` +
      data.price +
      `);`;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.removeServices = async (id) => {
  try {
    sqlLine = `DELETE FROM SERVICE WHERE SRV_ID = ` + id;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.editServices = async (data) => {
  try {
    sqlLine =
      `UPDATE SERVICE SET SRV_NAME = '` +
      data.name +
      `', SRV_PRICE = ` +
      data.price +
      ` WHERE SRV_ID = ` +
      data.id;

    const query = {
      text: sqlLine,
    };

    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err.stack);
  }
};
