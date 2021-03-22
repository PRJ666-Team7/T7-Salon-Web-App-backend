const appointments = require("../appointments/appointments");
const serviceLine = require("../appointments/serviceLine");

const { body, validationResult } = require("express-validator");

module.exports = function (app) {
  app.get("/getApt", async (req, res) => {
    const aptData = await appointments.getAppointments();

    res.send(aptData);
  });

  app.get("/getSrvLine", async (req, res) => {
    const srvData = await serviceLine.getServiceLine(req.query.id);

    res.send(srvData);
  });

  app.post(
    "/removeApt",
    body("id").isLength({ min: 1, max: 5 }),
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.json({
            status: "fail",
            err: errors.msg + ": " + errors.param,
          });
        } else {
          const aptData = await appointments.removeAppointments(req.body.id);

          res.send(aptData);
        }
      } catch (error) {
        return res.json({ status: "fail" });
      }
    }
  );

  app.post(
    "/editApt",
    body("id").isLength({ min: 1, max: 5 }),
    body("date").isLength({ min: 10, max: 10 }),
    body("time").isLength({ min: 4, max: 8 }),
    body("services").isArray({ min: 0, max: 10 }),
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.json({
            status: "fail",
            err: errors.msg + ": " + errors.param,
          });
        } else {
          console.log(req.body)
          const rmvSrvLine = await serviceLine.removeServiceLineById(req.body.id);

          const addSrvLine = await req.body.services.map(async (i) => {
            await serviceLine.addServiceLine(req.body.id, i);
          });

          const aptData = await appointments.editAppointments(req.body);

          res.send(aptData);
        }
      } catch (error) {
        return res.json({ status: "fail" });
      }
    }
  );
};
