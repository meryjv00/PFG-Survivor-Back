const firebase = require("firebase/app");
const db = firebase.firestore();
require("firebase/firestore");

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const top = 7;


getUsersRankingByLevel = (req, res) =>{
    var userUID = req.params.userUID;
    var rankingUID = req.params.rankingUID;

    db.collection('rankings').doc(rankingUID).collection('users').doc(userUID).get()
    .then((doc) => {
        var user = {
            'uid': doc.id,
            'enemiesKilled': doc.data().enemiesKilled,
            'punctuation': doc.data().punctuation,
            'time': doc.data().time
        }
        res.status(200).send({ status: 200, message: user });
        
    })
    .catch((error) => {
        return res.status(500).send({ status: 500, message: error });
    });

}

getPodiumCoins = (req, res) => {
    var rankingCoins = [];
    var userUID = req.params.userUID;

    db.collection('users').orderBy('coins', 'desc').limit(top).get()
        .then(doc => {
            doc.forEach(docu => {
                const user = {
                    'uid': docu.id,
                    'displayName': docu.data().displayName,
                    'email': docu.data().email,
                    'photoURL': docu.data().photoURL,
                    'coins': docu.data().coins,
                    'me': false
                }
                if (userUID != null) {
                    if (docu.id == userUID) {
                        user.me = true;
                    }
                }

                rankingCoins.push(user);
            });
            res.status(200).send({ status: 200, message: rankingCoins });

        }).catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

getLevelRankings = (req, res) => {
    var lvlRankings = [];
    db.collection('rankings').orderBy('lvl', 'asc').get()
        .then((doc) => {
            doc.forEach(doc => {
                lvlRankings.push({
                    'id': doc.id,
                    'Nivel': doc.data().lvl,
                    'RankingPuntuacion': [],
                    'RankingEnemigos': [],
                    'RankingTiempo': []
                });
            });
            res.status(200).send({ status: 200, message: lvlRankings });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).send({ status: 500, message: error });
        });
}

module.exports = {
    getPodiumCoins,
    getLevelRankings,
    getUsersRankingByLevel
}
