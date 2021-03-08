module.exports = function(app) {
    app.get('/login', (req, res) => {
        res.send('login stuff')
      });
}