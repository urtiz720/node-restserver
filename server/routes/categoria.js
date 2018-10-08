const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion.js');

let app = express();

let Categoria = require('../models/categoria.js');

// ======================
// Mostrar todas las categorias
// ======================

app.get('/categoria', verificaToken, (req, res) => {
    //Trae todas las categorias

    Categoria.find({})
        .sort('descripcion')
        //.populate('usuario', 'email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});

// ======================
// Mostrar una categoria por ID
// ======================
app.get('/categoria/:id', (req, res) => {
    //categoria.findById();
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El Id no es valido'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

// ======================
// Crear nueva categoria
// ======================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
});

// ======================
// Mostrar todas las categorias
// ======================

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// ======================
// Mostrar todas las categorias
// ======================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Solo un administrador puede borrar actegorias 
    //CAtegoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) { //Error de BD
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria borrada'
        });

    });



});

module.exports = app;