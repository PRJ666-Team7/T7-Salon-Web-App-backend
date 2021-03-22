
const serviceLine = require("../appointments/serviceLine");
const appointments = require("../appointments/appointments");
const employees = require("../employees/employees");
const passport = require("passport");

const { body, validationResult } = require("express-validator");

module.exports = function (app) {
  app.get("/getEmp", passport.authenticate('jwt', { session: false }), async (req, res) => {

    const empData = await employees.getEmployee();

    res.send(empData);
  });

  app.post("/addApt", 
  body("empId").isLength({ min: 1, max: 5 }),
  body("date").isLength({ min: 10, max: 10 }),
  body("time").isLength({ min: 4, max: 8 }),
  body("services").isArray({ min: 1, max: 10 }),
  passport.authenticate('jwt', { session: false }), async (req, res) => {

    const addApt = await appointments.addAppointments(req.body, req.user.usr_id);
    console.log(req.body.services)
    const addSrvLine = await req.body.services.map(async s => {
        await serviceLine.addServiceLine(addApt, s);
    });

    res.send(addSrvLine);
  });

};

