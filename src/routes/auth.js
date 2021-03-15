const dataService = require('../dataService/dataService')

module.exports = function(app) {
    app.get('/login', async (req, res) => {
        const userData = await dataService.getUsers()

        res.send( userData)
      });
}