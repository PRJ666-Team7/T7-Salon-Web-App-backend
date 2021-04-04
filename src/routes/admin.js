
const employees = require("../employees/employees");
const passport = require("passport");

const { body, validationResult } = require("express-validator");


module.exports = function (app) {
    app.get("/getUsrInfo",passport.authenticate('jwt', { session: false }), async (req, res) => {
    //app.get("/getUsrInfo", async (req, res) => {

        const userData = await employees.getUserInfo(req.query.term);
        //const userData = await employees.getUserInfo("jack");
        res.send(userData);
    });

    app.post(
        "/setEmployee",
        body("id").isLength({ min: 1, max: 5 }),
        body("employee").isBoolean(),
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
          
          if(!req.user.isAdmin){
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
                const employee;
              if(req.body.employee === true){
    
                employee= await employees.setEmployee(req.body.id, req.body.employee);
    
                res.send(employee);
              }
              else if(req.body.employee === false){
                employee = await employees.setEmployee(req.body.id, req.body.employee);
    
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
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
          
          if(!req.user.isAdmin){
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
                const admin= await employees.setAdmin(req.body.id);
    
                res.send(admin);
            }
          } catch (error) {
            return res.json({ status: "fail" });
          }
        }
      );
};
