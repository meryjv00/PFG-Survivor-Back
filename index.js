//express & bodyparser & cors
var express = require('express');
var bodyParser = require('body-parser');
var cors = require("cors");
var app = express();
var configFire = require("./config/firebase.config");

var corsOptions = {
    origin: [
        "http://localhost:4200",
        "https://pfg-survivor.netlify.app",
        "http://localhost:9876",
    ]
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const firebase = require("firebase/app");
require('firebase-admin');
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");

firebase.initializeApp(configFire.firebaseConfig);

//motor plantillas -> jade
app.set("view engine", "jade");

//Importamos las rutas
require('./routes/app.routes.js')(app);

//Exportamos los métodos de esta clase.
module.exports = app;

//Ruta de bienvenida
app.get("/", function (req, res) {
    res.send('¡Back Survivor!');
});

app.listen(process.env.PORT || 6060);