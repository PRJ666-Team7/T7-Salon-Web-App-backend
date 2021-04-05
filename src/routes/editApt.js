const appointments = require("../appointments/appointments");
const serviceLine = require("../appointments/serviceLine");
const employees = require("../employees/employees")
const passport = require("passport");
const { body, validationResult } = require("express-validator");

module.exports = function (app) {
  app.get("/getApt", passport.authenticate('jwt', { session: false }), async (req, res) => {

    console.log(req.user)
    if(!req.user.isEmployee ){
      return res.json({
        status: "fail"
      })
    }
    //console.log(req.user)
    const aptData = await appointments.getAppointments(req.user.usr_id);

    res.send(aptData);
  });

  app.get("/getEmpTime", passport.authenticate('jwt', { session: false }), async (req, res) => {

    if(!req.user.isEmployee){
      return res.json({
        status: "fail"
      })
    }

    const empTime = await employees.getEmployeeAvailableTime(req.user.usr_id);
    console.log(empTime);

    res.send(empTime);
  });

  app.get("/getSrvLine", passport.authenticate('jwt', { session: false }), async (req, res) => {

    if(!req.user.isEmployee){
      return res.json({
        status: "fail"
      })
    }

    const srvData = await serviceLine.getServiceLine(req.query.id);

    res.send(srvData);
  });

  app.post(
    "/removeApt",
    body("id").isLength({ min: 1, max: 5 }),
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      
      if(!req.user.isEmployee){
        return res.json({
          status: "fail"
        })
      }
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.json({
            status: "fail",
            err: errors.msg + ": " + errors.param,
          });
        } else {
          const aptData = await appointments.removeAppointments(req.body.id);
          const srvLineData = await serviceLine.removeServiceLineById(req.body.id);
          res.send(aptData);
        }
      } catch (error) {
        return res.json({ status: "fail" });
      }
    }
  );

  app.post(
    "/editApt",
    body("curId").isLength({ min: 1, max: 5 }),
    body("id").isLength({ min: 1, max: 5 }),
    body("userId").isLength({ min: 1, max: 5 }),
    body("srvId").isArray(),
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      
      if(!req.user.isEmployee){
        return res.json({
          status: "fail"
        })
      }
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.json({
            status: "fail",
            err: errors.msg + ": " + errors.param,
          });
        } else {
          const srvRmv = await serviceLine.removeServiceLineById(req.body.curId);
          for(let i = 0; i < req.body.srvId.length; i++){
            const srvAdd = await serviceLine.addServiceLine(req.body.id, req.body.srvId[i]);
          }
          const aptRmv = await appointments.removeAppointments(req.body.curId);
          const aptData = await appointments.addAppointments(req.body.id, req.body.userId);
          res.json({status: "success", srvRmv, aptRmv, aptData });
        }
      } catch (error) {
        return res.json({ status: "fail" });
      }
    }
  );
  app.get("/getUsrApt", passport.authenticate('jwt', { session: false }), async (req, res) => {

    const appointmentData = await appointments.getUserAppointments(req.user.usr_id);

    res.send(appointmentData);
  });
};
