const firebase = require("firebase/app");
const auth = firebase.auth();
const storage = firebase.storage();

require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());


getImgsChat = (req, res) => {
    console.log('Obteniendo imágenes chat...');
    // console.log(auth.CurrentUser);
    var urlImgsChat = [];
    var path = 'images/' + req.body.uid + '/' + req.body.uidFriend;
    var cont = 0;
    const ref = storage.ref(path);
    ref.listAll()
        .then(dir => {
            var itemsLength = dir.items.length;
            console.log('FOTOS esperadas', itemsLength);
            if(itemsLength == 0) {
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

module.exports = {
    getImgsChat,
}
