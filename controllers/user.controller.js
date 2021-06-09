const firebase = require("firebase/app");
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const config = require("../config/auth.config.js");

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
    config.secret = user.stsTokenManager.accessToken;
    db.collection("users").doc(user.uid).get()
        .then((doc) => {

            // Registro usuario Firestore
            if (doc.data() == undefined) {
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
    var uid = req.params.userUID;
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

updateProfilePhoto = (req, res) => {
    var userUID = req.params.userUID;
    var photoURL = req.body.photoURL;
    db.collection("users").doc(userUID).update({
        photoURL: photoURL,
    })
        .then(ok => {
            res.status(200).send({ status: 200, message: ok });
        })
        .catch((error) => {
            return res.status(500).send({ status: 500, message: error });
        });

    /*  
        var file = req.body.img;
     console.log(file);
    storage.ref('profileImages/' + userUID).put(file).then(fileSnapshot => {
         return fileSnapshot.ref.getDownloadURL()
             .then(url => {
                 // Actualizar imágen a el usuario
                 db.collection("users").doc(userUID).update({
                     photoURL: url,
                 });
             });
     }); */
}

updateName = (req, res) => {
    var userUID = req.params.userUID;
    var name = req.body.name;
    db.collection("users").doc(userUID).update({
        displayName: name,
    })
        .then(ok => {
            res.status(200).send({ status: 200, message: ok });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });

}

updateEmail = (req, res) => {
    var email = req.body.email;
    var user = auth.currentUser;
    user.updateEmail(email)
        .then(function () {

            db.collection("users").doc(user.uid).update({
                email: email,
            })
                .then(ok => {
                    res.status(200).send({ status: 200, message: ok });
                })
                .catch(error => {
                    console.log(error);
                    return res.status(500).send({ status: 500, message: error });
                });

        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
    ;
}

updatePass = (req, res) => {
    var pass = req.body.pass;
    var user = firebase.auth().currentUser;
    user.updatePassword(pass)
        .then(function () {
            res.status(200).send({ status: 200, message: ok });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

updateStatus = (req, res) => {
    var userUID = req.params.userUID;
    var status = req.body.status;

    db.collection("users").doc(userUID).update({
        status: status
    })
        .then(ok => {
            res.status(200).send({ status: 200, message: ok });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}


module.exports = {
    updateUserLogin,
    getUser,
    getItemsUser,
    updateProfilePhoto,
    updateName,
    updateEmail,
    updatePass,
    updateStatus
}
