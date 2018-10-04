const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.js');


app.post('/login', (req, res) => {

    let body = req.body; //Correo y password

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Evalua a usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '-Usuario o contraseña incorrectos'
                }
            });
        }
        // Comprueba que la contraseña sea correcta con la almacenada en la BD
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o -contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB //Payload (todo el usuario de BD)
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //Secret(SID), Tiempo de expiracion

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});


module.exports = app;