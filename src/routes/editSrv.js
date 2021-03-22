const services = require("../services/services");

const { body, validationResult } = require("express-validator");

module.exports = function (app) {
  app.get("/getSrv", async (req, res) => {
    const aptData = await services.getServices();

    res.send(aptData);
  });

  app.post("/addSrv",
  body("name").isLength({ min: 1, max: 50 }),
  body("price").isLength({ min: 1, max: 3 }), async (req, res) => {
    const aptData = await services.addServices(req.body);

    res.send(aptData);
  });

  app.post("/removeSrv",
  body("id").isLength({ min: 1, max: 5 }), async (req, res) => {
    const aptData = await services.removeServices(req.body.id);

    res.send(aptData);
  });

  app.post("/editSrv",
  body("id").isLength({ min: 1, max: 5 }),
  body("name").isLength({ min: 1, max: 50 }),
  body("price").isLength({ min: 1, max: 3 }), async (req, res) => {
    const aptData = await services.editServices(req.body);

    res.send(aptData);
  });

};
