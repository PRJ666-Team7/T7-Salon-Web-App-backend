const services = require("../services/services");
const passport = require("passport");

const { body, validationResult } = require("express-validator");

module.exports = function (app) {
  app.get("/getSrv", passport.authenticate('jwt', { session: false }), async (req, res) => {
    
    // if(!req.user){
    //   return res.json({
    //     status: "fail"
    //   })
    // }

    const aptData = await services.getServices();

    res.send(aptData);
  });

  app.post("/addSrv",
  body("name").isLength({ min: 1, max: 50 }),
  body("price").isLength({ min: 1, max: 3 }), 
  passport.authenticate('jwt', { session: false }),async (req, res) => {

    if(!req.user.isAdmin){
      return res.json({
        status: "fail"
      })
    }

    const aptData = await services.addServices(req.body);

    res.send(aptData);
  });

  app.post("/removeSrv",
  body("id").isLength({ min: 1, max: 5 }), 
  passport.authenticate('jwt', { session: false }),async (req, res) => {

    if(!req.user.isAdmin ){
      return res.json({
        status: "fail"
      })
    }

    const aptData = await services.removeServices(req.body.id);

    res.send(aptData);
  });

  app.post("/editSrv",
  body("id").isLength({ min: 1, max: 5 }),
  body("name").isLength({ min: 1, max: 50 }),
  body("price").isLength({ min: 1, max: 3 }), 
  passport.authenticate('jwt', { session: false }),async (req, res) => {

    if(!req.user.isAdmin){
      return res.json({
        status: "fail"
      })
    }

    const aptData = await services.editServices(req.body);

    res.send(aptData);
  });

};
