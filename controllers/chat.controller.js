const firebase = require("firebase/app");
const db = firebase.firestore();
const storage = firebase.storage();

require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());


getImgsChat = (req, res) => {
    var urlImgsChat = [];
    var path = 'images/' + req.body.uid + '/' + req.body.uidFriend;
    var cont = 0;
    const ref = storage.ref(path);
    ref.listAll()
        .then(dir => {
            var itemsLength = dir.items.length;
            console.log('FOTOS esperadas', itemsLength);
            if (itemsLength == 0) {
                res.status(200).send({ status: 200, message: urlImgsChat });
            }
            dir.items.forEach(fileRef => {
                fileRef.getDownloadURL().then(url => {
                    urlImgsChat.push(url);
                    cont++;
                    if (cont == itemsLength) {
                        console.log('FOTOS obtenidas', urlImgsChat.length);
                        res.status(200).send({ status: 200, message: urlImgsChat });
                    }
                });

            });

        });
}

setChatOpen = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;
    db.collection("users").doc(userUID).update({
        chatOpen: friendUID,
    })
        .then(ok => {
            res.status(200).send({ status: 200, message: ok });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

setMessagesRead = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;
    var msgID = req.params.msgID;

    db.collection('users').doc(friendUID).collection('friends').doc(userUID).collection('messages').doc(msgID).update({
        isRead: true,
    })
        .then(() => {
            db.collection('users').doc(userUID).collection('friends')
                .doc(friendUID).collection('messages').doc(msgID).update({
                    isRead: true,
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

sendMessage = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;
    var message = req.body.message;
    var user = req.body.user;

    db.collection('users').doc(userUID).collection('friends')
        .doc(friendUID).collection('messages').add({
            uid: user.uid,
            displayName: user.displayName,
            text: message,
            isRead: false,
            timestamp: firebase.firestore.Timestamp.now(),
        })
        .then(msg => {
            db.collection('users').doc(friendUID).collection('friends')
                .doc(userUID).collection('messages').doc(msg.id).set({
                    uid: user.uid,
                    displayName: user.displayName,
                    text: message,
                    isRead: false,
                    timestamp: firebase.firestore.Timestamp.now(),
                })
                .then(() => {
                    res.status(200).send({ status: 200, message: msg.id });
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


checkUserChat = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;
    var open = false;
    db.collection("users").doc(friendUID).get()
        .then((doc) => {
            if (doc.data().chatOpen == userUID) {
                open = true;
            }
            res.status(200).send({ status: 200, message: open });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

deleteMessage = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;
    var msgID = req.params.msgID;
    var msgPhoto = req.params.msgPhoto;

    db.collection('users').doc(userUID).collection('friends')
        .doc(friendUID).collection('messages').doc(msgID).delete()
        .then(ok => {
            //  Eliminar foto asociada al mensaje
            if (msgPhoto != 'null') {
                var path = `images/${userUID}/${friendUID}/${msgPhoto}`;
                storage.ref(path).delete();
            }
            res.status(200).send({ status: 200, message: ok });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

deleteChat = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;
    var deleteImg = req.params.deleteImg;
    var query = db.collection("users").doc(userUID).collection('friends').doc(friendUID).collection('messages');
    query.get()
        .then((doc) => {
            doc.forEach(change => {
                query.doc(change.id).delete();
            });
            // Eliminar imagenes del chat correspondiente
            if (deleteImg == 'true') {
                var path = `images/${userUID}/${friendUID}`;
                const ref = storage.ref(path);
                ref.listAll()
                    .then(dir => {
                        dir.items.forEach(fileRef => {
                            var path = `images/${userUID}/${friendUID}/${fileRef.name}`;
                            storage.ref(path).delete();
                        });
                    });
            }
            res.status(200).send({ status: 200, message: doc });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

sendImgFriend = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;
    var user = req.body.user;
    var urlPhoto = req.body.urlPhoto;
    var namePhoto = req.body.namePhoto;

    db.collection('users').doc(userUID).collection('friends')
        .doc(friendUID).collection('messages').add({
            uid: user.uid,
            displayName: user.displayName,
            imageURL: urlPhoto,
            isRead: false,
            storageRef: namePhoto,
            timestamp: firebase.firestore.Timestamp.now(),
        })
        .then(msg => {
            res.status(200).send({ status: 200, message: msg.id });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

sendImgFriendId = (req, res) => {
    var friendUID = req.params.friendUID;
    var userUID = req.params.userUID;
    var msgID = req.params.msgID;
    var user = req.body.user;
    var urlPhoto = req.body.urlPhoto;
    var namePhoto = req.body.namePhoto;
    db.collection('users').doc(friendUID).collection('friends')
        .doc(userUID).collection('messages').doc(msgID).set({
            uid: user.uid,
            displayName: user.displayName,
            imageURL: urlPhoto,
            isRead: false,
            storageRef: namePhoto,
            timestamp: firebase.firestore.Timestamp.now(),
        })
        .then(msg => {
            res.status(200).send({ status: 200, message: msg });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

module.exports = {
    getImgsChat,
    setChatOpen,
    setMessagesRead,
    sendMessage,
    checkUserChat,
    deleteMessage,
    deleteChat,
    sendImgFriend,
    sendImgFriendId
}
