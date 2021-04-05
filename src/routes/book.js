
const serviceLine = require("../appointments/serviceLine");
const appointments = require("../appointments/appointments");
const employees = require("../employees/employees");
const passport = require("passport");
const services = require("../services/services");
const nodemailer = require("nodemailer");

const { body, validationResult } = require("express-validator");

module.exports = function (app) {
  app.get("/getEmp", passport.authenticate('jwt', { session: false }), async (req, res) => {

    const employeesData = await employees.getEmployee();
    const servicesData = await services.getServices();
    const appointmentData = await appointments.getAllAppointment();

    //console.log("dfj", employeesData, servicesData)
    res.json({status: "success", employeesData, servicesData, appointmentData});
  });

  app.post("/addApt",
    body("aptId").isArray({ min: 1, max: 10 }),
    body("date").isLength({ min: 10, max: 10 }),
    body("time").isLength({ min: 4, max: 8 }),
    body("services").isArray({ min: 1, max: 10 }),
    passport.authenticate('jwt', { session: false }), async (req, res) => {

      console.log(req.body.aptId)
      const addApt = await req.body.aptId.map(async a => {
        console.log("id " + a)
        const val = await appointments.addAppointments(a, req.user.usr_id);
        const addSrvLine = await req.body.services.map(async s => {
            await serviceLine.addServiceLine(val, s);
          });
      }) 
      console.log("apt ids")
      console.log(addApt)



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

      //res.send(addSrvLine);
    });
};

