
const serviceLine = require("../appointments/serviceLine");
const appointments = require("../appointments/appointments");
const employees = require("../employees/employees");
const services = require("../services/services");
const passport = require("passport");
const nodemailer = require("nodemailer");

const { body, validationResult } = require("express-validator");

module.exports = function (app) {
  app.get("/getEmp", passport.authenticate('jwt', { session: false }), async (req, res) => {

    const employeesData = await employees.getEmployee();
    const servicesData = await services.getServices();

    console.log("dfj", employeesData, servicesData)
    res.json({status: "success", employeesData, servicesData });
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


      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
        debug: true, // show debug output
        logger: true // log information in console
      });
      
      const mailOptions = {
        from: `${process.env.EMAIL_ADDRESS}`,
        to: `${req.body.email}`,
        subject: "Sherry's Nail and Spa: Booking Notification",
        text:
          `Hi ${req.user.fname},\n\n` +
          `You made an appointment at Sherry's Nail and Spa at ${req.body.date} ${req.body.time}\n\n`
      };
      
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.json({status: "fail"})
        } else {
          console.log("Mail sent");
          return res.json({status: "success"});
        }
      });

      res.send(addSrvLine);
    });
};
