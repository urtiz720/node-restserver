const jwt = require('jsonwebtoken');
//=============
//Verificar token
//=============

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //Autorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({ //No autorizado
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        //Obtener info de usuario al haber pasado token
        req.usuario = decoded.usuario;
        next();

    });

    // res.json({
    //     token: token
    // });

};

//========================
// Verifica AdminRole
//========================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }


}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}