
const passport = require("passport");
const appointmentDataService = require('../appointments/appointments')
const employeeDataService = require('../employees/employees')

var moment = require('moment'); 

module.exports = function async (app) {
    app.get("/getEmployeeSchedule", passport.authenticate('jwt', { session: false }), async (req, res) => {
        if (!req.user.isEmployee) {
            return res.json({
                status: "fail"
            })
        }

        const time = moment().format("yyyy-MM-DD");
        const employee = await employeeDataService.getEmployeeByUserId(req.user.usr_id)
        const appointments = await appointmentDataService.getEmployeeSchdule(employee.emp_id, time)
        let schedule = {}

        await Promise.all(appointments.map(a => {
            if (schedule[a.apt_date] == undefined){
                schedule[a.apt_date] = {
                    date: moment(a.apt_date).format("YYYY-MM-DD"),
                    start_time: moment(a.apt_time_start, 'hh:mm:ss').format('h:mm A'),
                    end_time: moment(a.apt_time_end, 'hh:mm:ss').format('h:mm A')
                }
            } else {
                if ( moment(moment(schedule[a.apt_date].start_time, 'HH:mm')).isAfter(moment(a.apt_time_start, 'HH:mm')) ) {
                    schedule[a.apt_date].start_time = moment(a.apt_time_start, 'hh:mm:ss').format('h:mm A')
                }

                if ( moment(moment(schedule[a.apt_date].end_time, 'HH:mm')).isBefore(moment(a.apt_time_end, 'HH:mm')) ) {
                    schedule[a.apt_date].end_time = moment(a.apt_time_end, 'hh:mm:ss').format('h:mm A')
                }
            }
        }))

        res.json({status: "success", schedule});
      });
};