const firebase = require("firebase/app");
const db = firebase.firestore();

require("firebase/firestore");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());


getUsers = (req, res) => {
    var users = [];
    var name = req.params.name;
    var userUID = req.params.userUID;
    var busqueda = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    db.collection("users").get()
        .then((doc) => {
            doc.forEach(docu => {
                // El usuario logeado no se añade
                if (docu.id != userUID) {
                    var name = docu.data().displayName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    if (name.indexOf(busqueda) > -1) {
                        const user = {
                            'uid': docu.id,
                            'displayName': docu.data().displayName,
                            'photoURL': docu.data().photoURL,
                            'email': docu.data().email,
                            'status': docu.data().status,
                            'coins': docu.data().coins,
                            'relation': 'unknown'
                        }
                        users.push(user);
                    }
                }
            });
            res.status(200).send({ status: 200, message: users });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}


getFriendsUID = (req, res) => {
    var friends = [];
    var userUID = req.params.userUID;
    db.collection('users').doc(userUID).collection('friends').get()
        .then(doc => {
            doc.forEach(docu => {
                const user = {
                    'uid': docu.id,
                    'displayName': docu.data().displayName,
                    'photoURL': docu.data().photoURL,
                    'email': docu.data().email,
                    'status': docu.data().status,
                    'coins': docu.data().coins,
                }
                friends.push(user);
            });
            res.status(200).send({ status: 200, message: friends });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}


sendFriendRequest = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;

    db.collection('users').doc(friendUID).collection('friendsRequests').doc(userUID).set({})
        .then(() => {

            db.collection('users').doc(userUID).collection('sentFriendsRequests').doc(friendUID).set({})
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
}

deleteFriendRequest = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;

    db.collection('users').doc(userUID).collection('friendsRequests').doc(friendUID).delete()
        .then(() => {
            db.collection('users').doc(friendUID).collection('sentFriendsRequests').doc(userUID).delete()
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
}

deleteFriend = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;

    db.collection('users').doc(userUID).collection('friends').doc(friendUID).delete()
        .then(() => {
            db.collection('users').doc(friendUID).collection('friends').doc(userUID).delete()
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
}

acceptFriendRequest = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;

    db.collection('users').doc(userUID).collection('friends').doc(friendUID).set({
        'friendshipDate': firebase.firestore.Timestamp.now(),
    })
        .then(() => {
            db.collection('users').doc(friendUID).collection('friends').doc(userUID).set({
                'friendshipDate': firebase.firestore.Timestamp.now(),
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
}

getSentFriendsRequests = (req, res) => {
    var sentRequests = [];
    var userUID = req.params.userUID;
    db.collection('users').doc(userUID).collection('sentFriendsRequests').get()
    .then((doc) => {
        doc.forEach(docu => {
            sentRequests.push(docu.id);
        });
        res.status(200).send({ status: 200, message: sentRequests });
    })
    .catch(error => {
        console.log(error);
        return res.status(500).send({ status: 500, message: error });
    });
}

getDataFriendship = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;

    db.collection('users').doc(userUID).collection('friends').doc(friendUID).get()
    .then(doc => {
        var date = String(doc.data().friendshipDate.toDate());
        date = date.substring(4, 15)
        res.status(200).send({ status: 200, message: date });

    })
    .catch(error => {
        console.log(error);
        return res.status(500).send({ status: 500, message: error });
    });
}

module.exports = {
    getUsers,
    getFriendsUID,
    sendFriendRequest,
    deleteFriendRequest,
    deleteFriend,
    acceptFriendRequest,
    getSentFriendsRequests,
    getDataFriendship
}
