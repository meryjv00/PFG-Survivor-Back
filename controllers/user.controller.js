const firebase = require("firebase/app");
const db = firebase.firestore();
const auth = firebase.auth();

require("firebase/auth");
require("firebase/firestore");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/* auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log('LOGED');
    } else {
        console.log('NOT LOGED');
    }
}); */

//Update user login
updateUserLogin = (req, res) => {
    var user = req.body.user;
    auth.CurrentUser = user; 
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
                    return res.status(500).send({ status: 500, message: error });
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
                    return res.status(500).send({ status: 500, message: error });
                });
            }

        });
}

getUser = (req, res) => {
    var uid = req.body.uid;
    db.collection("users").doc(uid).get()
        .then((doc) => {
            var user = {
                'uid': doc.id,
                'status': doc.data().status,
                'displayName': doc.data().displayName,
                'photoURL': doc.data().photoURL,
                'email': doc.data().email,
                'coins': doc.data().coins,
            }
            res.status(200).send({ status: 200, message: user });
        })
        .catch((error) => {
            return res.status(500).send({ status: 500, message: error });
        });
}

getItemsUser = (req, res) => {
    var uid = req.body.uid;
    var items = [];
    db.collection('users').doc(uid).collection('items').get()
        .then((doc) => {
            doc.forEach(item => {
                const itemUsu = {
                    'id': item.id,
                    'name': item.data().name,
                    'description': item.data().description,
                    'img': item.data().img,
                    'price': item.data().price,
                    'obtainedDate': String(item.data().obtainedDate.toDate()).substring(4, 15)
                }
                items.push(itemUsu);
            });
            res.status(200).send({ status: 200, message: items });

        })
        .catch((error) => {
            return res.status(500).send({ status: 500, message: error });
        });
}

module.exports = {
    updateUserLogin,
    getUser,
    getItemsUser
}
