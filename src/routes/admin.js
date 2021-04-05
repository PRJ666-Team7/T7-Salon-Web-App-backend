
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const adminDataService = require('../dataService/admin/admin')
const appointmentDataService = require('../appointments/appointments')
var moment = require('moment'); 

module.exports = function async(app) {
    app.post("/scheduleEmployee",
        body("employee").isLength({ min: 1 }),
        body("date").isLength({ min: 1 }),
        body("startTime").isLength({ min: 1 }),
        body("endTime").isLength({ min: 1 }),
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
              if(!req.user.isAdmin){
                return res.json({
                  status: "fail"
                })
              }
            try {
                const errors = validationResult(req);

                const errorDates = []
                if (!errors.isEmpty()) {
                    return res.json({
                        status: "fail",
                        err: errors.msg + ": " + errors.param,
                    });
                } else {
                    const dayStartTime = moment(req.body.startTime, 'hh:mm');
                    const dayEndTime = moment(req.body.endTime, 'hh:mm');
                    const numApt = dayEndTime.diff(dayStartTime, "minute")/30;

                    await Promise.all(req.body.date.map(async (d) =>{
                        const result = await appointmentDataService.getAppointmentsByEmployee(req.body.employee, d)

                        const startTime = moment(req.body.startTime, 'hh:mm');
                        const endTime = moment(req.body.startTime, 'hh:mm');
                        endTime.add(30, "minutes")

                        const aptExist = result.find(a => a.apt_time_start == startTime.format("hh:mm:ss"))
                        if (aptExist == undefined){
                            const addAptResult = await appointmentDataService.adminAddAppointment(req.body.employee, d, startTime.format("hh:mm"), endTime.format("hh:mm"))
                        }

                        for (let i = 1; i < numApt; i++) {
                            startTime.add(30, "minutes").format("hh:mm") 
                            endTime.add(30, "minutes").format("hh:mm")

                            const aptExist = result.find(a => a.apt_time_start == startTime.format("hh:mm:ss"))
                            if (aptExist == undefined){
                                const addAptResult = await appointmentDataService.adminAddAppointment(req.body.employee, d, startTime.format("hh:mm"), endTime.format("hh:mm"))
                            }
                        }
                    }))

                    res.send({status: "success"});
                }
            } catch (error) {
                console.log("post /scheduleEmployee error", error)
                return res.json({ status: "fail" });
            }
        }
    );

    // get employee appointment helper
    const employeeAppointments = async (employee) => {
        const time = moment().format("yyyy-MM-DD");
        const appointmentDates = await appointmentDataService.getEmployeeScheduleUniqueDate(employee, time)

        let workingDates = []
        await Promise.all(appointmentDates.map(async (a) => {
            const date = moment(a.apt_date, "yyyy-mm-dd")
            workingDates.push(date.format("yyyy-MM-DD"))
        }))

        return workingDates
    }

    app.post("/getEmployeeScheduleDays", passport.authenticate('jwt', { session: false }), async (req, res) => {
        try {
            const workingDates = await employeeAppointments(req.body.employee)

            res.json({status: "success", workingDates});
        } catch (error) {
            return res.json({ status: "fail" });
        }
      });

      app.post("/unscheduleEmployee", passport.authenticate('jwt', { session: false }), async (req, res) => {
        try {
            let remainingAppointments = []

            await Promise.all(req.body.date.map(async (date) => {
                const appointmentDates = await appointmentDataService.adminDeleteAppointment(req.body.employee, date)
                const bookedAppointments = await appointmentDataService.getAppointmentsByEmployee(req.body.employee, date)

                remainingAppointments = remainingAppointments.concat(bookedAppointments)
            }))

            const workingDates = await employeeAppointments(req.body.employee)

            res.json({status: "success", remainingAppointments, workingDates});
        } catch (error) {
            console.log("error", error)
            return res.json({ status: "fail" });
        }
      });
};
