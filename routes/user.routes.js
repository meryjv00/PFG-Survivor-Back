const controller = require("../controllers/user.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //--Update user login
    app.post(
        '/api/updateUserLogin', controller.updateUserLogin
    );

/*     app.put(
        '/api/updatePersona',  controller.updatePersona
    );

    app.delete(
        '/api/deletePersona', controller.deletePersona
    );
 */


};