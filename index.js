//express & bodyparser & cors
var express = require('express');
var bodyParser = require('body-parser');
var cors = require("cors");
var app = express();

var corsOptions = {
    //origin: "http://localhost:4200"
    origin: "https://pfg-survivor.netlify.app"
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

const firebaseConfig = {
    apiKey: "AIzaSyBk3lAsk9X_Xo4A0tTVRdqHjrpopoIYVjc",
    authDomain: "pfg-survivor-40d0e.firebaseapp.com",
    projectId: "pfg-survivor-40d0e",
    storageBucket: "pfg-survivor-40d0e.appspot.com",
    messagingSenderId: "873225520432",
    appId: "1:873225520432:web:fa887ae2ff52532f4a34f5",
    measurementId: "G-RE9BBXF4E2"
};
firebase.initializeApp(firebaseConfig);

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