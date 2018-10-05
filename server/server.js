require('./config/config.js');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index.js'));

//habilitar la carpeta public 
app.use(express.static(path.resolve(__dirname, '../public')));

//Coneccion a la BD
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;

    console.log('BD en linea');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});