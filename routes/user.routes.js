const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const chatController = require("../controllers/chat.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/api/login', authController.login);

    app.post('/api/registro', authController.registro);

    app.post('/api/sendPasswordResetEmail', authController.sendPasswordResetEmail);
    
    app.post('/api/updateUserLogin', userController.updateUserLogin);

    app.post('/api/getUser', userController.getUser);

    app.post('/api/getItemsUser', userController.getItemsUser);

    app.post('/api/getImgsChat', chatController.getImgsChat);

};