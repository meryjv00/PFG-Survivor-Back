const firebase = require("firebase/app");
const db = firebase.firestore();

require("firebase/firestore");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Get items tienda
getItems = (req, res) => {
    var items = [];
    db.collection('shop').get()
        .then((doc) => {
            doc.forEach(docu => {
                const item = {
                    'id': docu.id,
                    'name': docu.data().name,
                    'description': docu.data().description,
                    'img': docu.data().img,
                    'price': docu.data().price,
                    'owned': false,
                    'obtainedDate': null
                }
                items.push(item);
            });
            res.status(200).send({ status: 200, message: items });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

buyItem = (req, res) => {
    var item = req.body.item;
    var user = req.body.user;

    var query = db.collection('users').doc(user.uid);
    // Añadir item al usuario
    query.collection('items').doc(item.id).set({
        obtainedDate: firebase.firestore.Timestamp.now(),
        description: item.description,
        img: item.img,
        name: item.name,
        price: item.price
    })
        .then(() => {

            // Actualizar monedas
            query.update({
                coins: user.coins - item.price
            })
                .then(() => {
                    res.status(200).send({ status: 200, message: 'Compra realizada con éxito' });
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



module.exports = {
    getItems,
    buyItem,
}
