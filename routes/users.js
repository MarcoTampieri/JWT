const controller = require('../controllers/users');
const validateToken = require('../utils');
const token = validateToken.validateToken;

module.exports = (router) => {
    router.route('/users')
    .post(controller.add)
    .get(token, controller.getAll);

    router.route('/login')
    .post(controller.login)
};

