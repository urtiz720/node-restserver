const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario.js');

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img') //Traer todo 
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) { //si sale mal retorna y sale
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            })

        })
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({ //se crea un objeto con los datos obtenidos
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => { //grabar el usuario
        if (err) { //si sale mal retorna y sale
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //arreglo de funciones que si quiero que se actualicen

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { //buscar y actualizar si lo encuentra  --{new:true}-opcion que regresa el nuevo objeto

        if (err) {
            return res.status(400).json({ //si hay error sale
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let cambioEstado = {
        estado: false
    };
    // Usuario.findByIdAndDelete(id, (err, usuaioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, usuaioBorrado) => {

        if (err) {
            return res.status(400).json({ //si hay error sale
                ok: false,
                err
            })
        };

        if (!usuaioBorrado) { //Si ya no existe el usuario
            return res.status(400).json({ //si hay error sale
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuaioBorrado
        })
    });

});

module.exports = app;