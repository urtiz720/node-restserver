const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => { //Usuario invalido
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => { //ya esta registrado

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe ser una autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }

        } else { //Nunca se ha logeado (No existe en la BD)
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'; //solo para pasar la autentificion 

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            })

        }

    });

});

module.exports = app;