const firebase = require("firebase/app");
const auth = firebase.auth();

require("firebase/auth");
require("firebase/firestore");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var photoURL = 'https://www.softzone.es/app/uploads/2018/04/guest.png';

login = (req, res) => {
    auth.signInWithEmailAndPassword(req.body.email, req.body.pass)
        .then(user => {
            auth.CurrentUser = user.user;
            res.status(200).send({ status: 200, message: user.user });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

registro = (req, res) => {
    auth.createUserWithEmailAndPassword(req.body.email, req.body.pass)
        .then(user => {
            auth.CurrentUser = user.user;
            user.user.updateProfile({
                displayName: req.body.name,
                photoURL: photoURL
            }).then(() => {
                res.status(200).send({ status: 200, message: user.user });
            });

        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

sendPasswordResetEmail = (req, res) => {
    auth.sendPasswordResetEmail(req.body.email)
        .then(() => {
            res.status(200).send({ status: 200, message: 'OK' });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}


module.exports = {
    login,
    registro,
    sendPasswordResetEmail,
}
