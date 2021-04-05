const passport = require("passport");
const { body, validationResult } = require("express-validator");
const adminDataService = require("../dataService/admin/admin");
const appointmentDataService = require("../appointments/appointments");
const employees = require("../employees/employees");
var moment = require("moment");

module.exports = function async(app) {
  app.post(
    "/scheduleEmployee",
    body("employee").isLength({ min: 1 }),
    body("date").isLength({ min: 1 }),
    body("startTime").isLength({ min: 1 }),
    body("endTime").isLength({ min: 1 }),
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      console.log("req.body", req.body);
      //   if(!req.user.isAdmin){
      //     return res.json({
      //       status: "fail"
      //     })
      //   }
      try {
        const errors = validationResult(req);

        const errorDates = [];
        if (!errors.isEmpty()) {
          return res.json({
            status: "fail",
            err: errors.msg + ": " + errors.param,
          });
        } else {
          const dayStartTime = moment(req.body.startTime, "hh:mm");
          const dayEndTime = moment(req.body.endTime, "hh:mm");
          const numApt = dayEndTime.diff(dayStartTime, "minute") / 30;

          await Promise.all(
            req.body.date.map(async (d) => {
              const result = await appointmentDataService.getAppointmentsByEmployee(
                req.body.employee,
                d
              );

              console.log("result", result);
              const startTime = moment(req.body.startTime, "hh:mm");
              const endTime = moment(req.body.startTime, "hh:mm");
              endTime.add(30, "minutes");

              const aptExist = result.find(
                (a) => a.apt_time_start == startTime.format("hh:mm:ss")
              );
              if (aptExist == undefined) {
                console.log("startTime", startTime);
                const addAptResult = await appointmentDataService.adminAddAppointment(
                  req.body.employee,
                  d,
                  startTime.format("hh:mm"),
                  endTime.format("hh:mm")
                );
              }

              for (let i = 1; i < numApt; i++) {
                startTime.add(30, "minutes").format("hh:mm");
                endTime.add(30, "minutes").format("hh:mm");

                const aptExist = result.find(
                  (a) => a.apt_time_start == startTime.format("hh:mm:ss")
                );
                if (aptExist == undefined) {
                  console.log("startTime", startTime);
                  const addAptResult = await appointmentDataService.adminAddAppointment(
                    req.body.employee,
                    d,
                    startTime.format("hh:mm"),
                    endTime.format("hh:mm")
                  );
                }
              }
            })
          );

          res.send({ status: "success" });
        }
      } catch (error) {
        console.log("post /scheduleEmployee error", error);
        return res.json({ status: "fail" });
      }
    }
  );

  app.get(
    "/getUsrInfo",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      if(!req.user.isAdmin){
        return res.json({
          status: "fail"
        })
      }
      const userData = await employees.getUserInfo(req.query.term);
      //const userData = await employees.getUserInfo("jack");
      res.send(userData);
    }
  );

  app.post(
    "/setEmployee",
    body("id").isLength({ min: 1, max: 5 }),
    body("employee").isBoolean(),
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      if (!req.user.isAdmin) {
        return res.json({
          status: "fail",
        });
      }
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.json({
            status: "fail",
            err: errors.msg + ": " + errors.param,
          });
        } else {
          var employee;
          if (req.body.employee === true) {
            employee = await employees.setEmployee(
              req.body.id,
              req.body.employee
            );

            res.send(employee);
          } else if (req.body.employee === false) {
            employee = await employees.setEmployee(
              req.body.id,
              req.body.employee
            );

            res.send(employee);
          }
        }
      } catch (error) {
        return res.json({ status: "fail" });
      }
    }
  );

  app.post(
    "/setAdmin",
    body("id").isLength({ min: 1, max: 5 }),
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      if (!req.user.isAdmin) {
        return res.json({
          status: "fail",
        });
      }
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.json({
            status: "fail",
            err: errors.msg + ": " + errors.param,
          });
        } else {
          const admin = await employees.setAdmin(req.body.id);

          res.send(admin);
        }
      } catch (error) {
        return res.json({ status: "fail" });
      }
    }
  );

  app.get("/getEmpId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    // if (!req.user.isAdmin) {
    //   console.log("not admin!")
    // }

    const empId = await employees.getEmployeeByUserID(req.query.id);
    res.send(empId);
  });

  
  app.get("/getEmpApt", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const empApt = await employees.getEmployeeAppointments(req.query.id);
    res.send(empApt);
  });
};
