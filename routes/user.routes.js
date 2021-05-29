const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const chatController = require("../controllers/chat.controller");
const shopController = require("../controllers/shop.controller");
const comunidadController = require("../controllers/comunidad.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // AUTH
    app.post('/api/login', authController.login);
    app.post('/api/registro', authController.registro);
    app.post('/api/sendPasswordResetEmail', authController.sendPasswordResetEmail);

    // USER
    app.post('/api/updateUserLogin', userController.updateUserLogin);
    app.get('/api/getUser/:userUID', userController.getUser);
    app.post('/api/getItemsUser', userController.getItemsUser);
    app.post('/api/updateProfilePhoto/:userUID', userController.updateProfilePhoto);
    app.put('/api/updateName/:userUID', userController.updateName);
    app.put('/api/updateEmail/:userUID', userController.updateEmail);
    app.put('/api/updatePass/:userUID', userController.updatePass);

    // CHAT
    app.post('/api/getImgsChat', chatController.getImgsChat);

    // SHOP
    app.get('/api/getItems', shopController.getItems);
    app.put('/api/buyItem', shopController.buyItem);

    // COMUNIDAD
    app.get('/api/getUsers/:name/:userUID', comunidadController.getUsers);
    app.put('/api/sendFriendRequest/:userUID/:friendUID', comunidadController.sendFriendRequest);
    app.delete('/api/deleteFriendRequest/:userUID/:friendUID', comunidadController.deleteFriendRequest);
    app.delete('/api/deleteFriend/:userUID/:friendUID', comunidadController.deleteFriend);
    app.put('/api/acceptFriendRequest/:userUID/:friendUID', comunidadController.acceptFriendRequest);
    app.get('/api/getFriendsUID/:userUID', comunidadController.getFriendsUID);

};