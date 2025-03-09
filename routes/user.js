const userController = require('../controllers/UserController');

module.exports = (app) => {
  app.get('/api/users', userController.getAllUsers);
  app.post('/api/users', userController.createUser);
};
