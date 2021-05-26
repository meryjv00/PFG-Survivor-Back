const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());


//Update user login
exports.updateUserLogin = (req, res) => {
    var db = firebase.firestore();
    var user = req.body.user;
    db.collection("users").doc(user.uid).get()
        .then((doc) => {

            // Registro usuario Firestore
            if (doc.data() == undefined) {
                console.log('No está registrado');
                db.collection("users").doc(user.uid).set({
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    chatOpen: "",
                    status: 'online',
                    coins: 10,
                }).then(user => {
                    res.status(200).send({ status: 200, message: user });
                }).catch(error => {
                    return res.status(404).send({ status: 404, message: error });
                });
            }
            // Ya está registrado: actualizar estado en línea
            else {
                console.log('Está registrado');
                db.collection("users").doc(user.uid).update({
                    status: 'online'
                }).then(user => {
                    res.status(200).send({ status: 200, message: user });
                }).catch(error => {
                    return res.status(404).send({ status: 404, message: error });
                });
            }

        });

}
