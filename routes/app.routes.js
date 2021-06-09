const authJwt = require("../middleware/authJwt");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const chatController = require("../controllers/chat.controller");
const shopController = require("../controllers/shop.controller");
const comunidadController = require("../controllers/comunidad.controller");
const rankingsController = require("../controllers/rankings.controller");

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
    app.post('/api/updateProfilePhoto/:userUID', [authJwt.verifyToken], userController.updateProfilePhoto);
    app.put('/api/updateName/:userUID', [authJwt.verifyToken], userController.updateName);
    app.put('/api/updateEmail/:userUID', [authJwt.verifyToken], userController.updateEmail);
    app.put('/api/updatePass/:userUID', [authJwt.verifyToken], userController.updatePass);
    app.put('/api/updateStatus/:userUID', userController.updateStatus);

    // CHAT
    app.post('/api/getImgsChat', [authJwt.verifyToken], chatController.getImgsChat);
    app.put('/api/setChatOpen/:userUID/:friendUID', chatController.setChatOpen);
    app.put('/api/setMessagesRead/:userUID/:friendUID/:msgID', chatController.setMessagesRead);
    app.put('/api/sendMessage/:userUID/:friendUID', [authJwt.verifyToken], chatController.sendMessage);
    app.get('/api/checkUserChat/:userUID/:friendUID', [authJwt.verifyToken], chatController.checkUserChat);
    app.delete('/api/deleteMessage/:userUID/:friendUID/:msgID/:msgPhoto', [authJwt.verifyToken], chatController.deleteMessage);
    app.delete('/api/deleteChat/:userUID/:friendUID/:deleteImg', [authJwt.verifyToken], chatController.deleteChat);
    app.put('/api/sendImgFriend/:userUID/:friendUID', [authJwt.verifyToken], chatController.sendImgFriend);
    app.put('/api/sendImgFriendId/:userUID/:friendUID/:msgID', [authJwt.verifyToken], chatController.sendImgFriendId);

    // SHOP
    app.get('/api/getItems', shopController.getItems);
    app.put('/api/buyItem', shopController.buyItem);

    // COMUNIDAD
    app.get('/api/getUsers/:name/:userUID', comunidadController.getUsers);
    app.put('/api/sendFriendRequest/:userUID/:friendUID', comunidadController.sendFriendRequest);
    app.delete('/api/deleteFriendRequest/:userUID/:friendUID', [authJwt.verifyToken], comunidadController.deleteFriendRequest);
    app.delete('/api/deleteFriend/:userUID/:friendUID', [authJwt.verifyToken], comunidadController.deleteFriend);
    app.put('/api/acceptFriendRequest/:userUID/:friendUID', comunidadController.acceptFriendRequest);
    app.get('/api/getFriendsUID/:userUID', comunidadController.getFriendsUID);
    app.get('/api/getSentFriendsRequests/:userUID', [authJwt.verifyToken],comunidadController.getSentFriendsRequests);
    app.get('/api/getDataFriendship/:userUID/:friendUID', [authJwt.verifyToken],comunidadController.getDataFriendship);


    // RANKINGS
    app.get('/api/getPodiumCoins/:userUID', rankingsController.getPodiumCoins);
    app.get('/api/getLevelRankings', rankingsController.getLevelRankings);
    app.get('/api/getRankings/:rankingUID/:userUID', rankingsController.getUsersRankingByLevel);
    app.put('/api/updateRanking/:rankingUID', rankingsController.updateUserRanking);
    app.post('/api/createRanking/:rankingUID', rankingsController.createUserRanking);
};