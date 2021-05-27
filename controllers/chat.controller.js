const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());


getImgsChat = (req, res) => {
    console.log('Obteniendo imágenes chat...');
    var urlImgsChat = [];
    var path = 'images/' + req.body.uid + '/' + req.body.uidFriend;
    var cont = 0;
    const ref = firebase.storage().ref(path);
    ref.listAll()
        .then(dir => {
            var itemsLength = dir.items.length;
            console.log('FOTOS esperadas', itemsLength);
            dir.items.forEach(fileRef => {
                fileRef.getDownloadURL().then(url => {
                    urlImgsChat.push(url);
                    cont++;
                    if(cont == itemsLength) {
                        console.log('FOTOS obtenidas',urlImgsChat.length);
                        res.status(200).send({ status: 200, message: urlImgsChat });
                    }
                });

            });

        });
}

module.exports = {
    getImgsChat,
}
