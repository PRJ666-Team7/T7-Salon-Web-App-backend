const dataService = require('../dataService/dataService')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
var moment = require('moment'); 

module.exports = function (app) {
  app.post('/login', body('email').isLength({min: 5, max: 50}), body('password').isLength({min: 1, max: 30}), async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({status: "fail", err: errors.msg + ": " + errors.param})
    } else {
      const userData = await dataService.getUser(req.body.email)

      if (userData) {
        const employee = await dataService.getEmployee(userData.usr_id)

        let isEmployee = false
        if (employee != undefined){
          isEmployee = true
        }

        const result = await bcrypt.compare(req.body.password, userData.usr_password)

        if (!result) {
          throw "Wrong password"
        }

        const token = await getJwt(userData.usr_email, userData.usr_fname, userData.usr_lname, userData.usr_phone, userData.usr_id, userData.isadmin, isEmployee)

        return res.json({
          status: "success",
          message: "login successful",
          token: token,
          user: {
            usr_id: userData.usr_id,
            email: userData.usr_email,
            fname: userData.usr_fname,
            lname: userData.usr_lname,
            phone: userData.usr_phone,
            isAdmin: userData.isadmin,
            isEmployee: isEmployee
          }
        });
      } else {
        return res.json({status: "fail"})
      }
    }
  });

  app.post('/signup', 
    body('email').isLength({min: 5, max: 50}), 
    body('fname').isLength({min: 1, max: 45}), 
    body('lname').isLength({min: 1, max: 45}), 
    body('phone').isLength({min: 10, max: 15}), 
    body('password').isLength({min: 1, max: 30}),
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.json({status: "fail"})
        } else {
          const hashPassword = await bcrypt.hash(req.body.password, 15)
          const userDataAdd = await dataService.addUser(req.body.email, req.body.fname, req.body.lname, req.body.phone, hashPassword)

          const token = await getJwt(req.body.email, req.body.fname, req.body.lname, req.body.phone, userDataAdd.usr_id, userDataAdd.isadmin, false)

          res.json({ 
            status: "success",
            message: "signup successful", 
            token: token, 
            user: {
              usr_id: userDataAdd.usr_id,
              email: req.body.email, 
              fname: req.body.fname, 
              lname: req.body.lname, 
              phone: req.body.phone,
              isAdmin: userDataAdd.isadmin,
              isEmployee: false
            } 
          });
        }
      } catch (error) {
        return res.json({status: "fail"})
      }
  });

  app.post('/passwordRecovery', 
    body('email').isLength({min: 5, max: 50}), 
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          throw "validation error"
        } else {
          const userData = await dataService.getUser(req.body.email)

          if (!userData) {
            throw "no email"
          }

          const token = await bcrypt.hash(userData.usr_password + moment.unix(Number), 10)
          const updateResult = await dataService.updateUserResetHash(token, req.body.email)

          if (!updateResult){
            throw "database error"
          }

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
            subject: "Password reset link",
            text:
              `Hi ${userData.usr_fname},\n\n` +
              "Please click the below link to reset your password.\n\n" + 
              `http://localhost:3000/passwordReset?passwordHash=${token}`
          };
          
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              return res.json({status: "fail"})
            } else {
              console.log("Mail sent");
              return res.json({status: "success"});
            }
          });
        }
      } catch (error) {
        console.log("error: ", error)
        return res.json({status: "fail"})
      }
  });

  app.post('/passwordReset', 
    body('password').isLength({min: 1, max: 30}),
    body('passwordHash').isLength({min: 1}),
    async (req, res) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          throw "validation error"
        } else {
          const userData = await dataService.getUserByResetHash(req.body.passwordHash)

          if (!userData) {
            throw "no user"
          }

          const hashPassword = await bcrypt.hash(req.body.password, 15)
          const updateResult = await dataService.updateUserPassword(hashPassword, req.body.passwordHash)

          if (updateResult) {
            return res.json({status: "success"});
          } else {
            throw "fail to update password"
          }
        }
      } catch (error) {
        console.log("error: ", error)
        return res.json({status: "fail"})
      }
  });
}

const getJwt = async (email, fname, lname, phone, usr_id, isAdmin, isEmployee) => {
  var token = jwt.sign({ email, fname, lname, phone, usr_id, isAdmin,isEmployee}, process.env.TOKEN_SECRET );
  return token
}