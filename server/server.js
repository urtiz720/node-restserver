require('./config/config.js');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
    res.json('getUsuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({ //no lleva nombre
            ok: false,
            mensaje: "el nombre es requerido"
        })
    } else {
        res.json({
            persona: body //si existe
        })

    }
    res.json({
        persona: body
    })
    res.json('Hellosss');
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuario', (req, res) => {
    res.json('Hellosss');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});