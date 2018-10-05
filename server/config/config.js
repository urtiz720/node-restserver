//=============
// Puerto
//=============

process.env.PORT = process.env.PORT || 3000;
//=============
// Entorno
//=============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //Produccion o si no existe es Desarrollo

//=============
// Vencimiento del token
//=============
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=============
// SEED de autenticacion
//=============
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//=============
// Bases de datos
//=============

let urlDB;

if (process.env.NODE_ENV === 'dev') { //Si es desarrollo
    urlDB = 'mongodb://localhost:27017/database'
} else {
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB;

//=============
// Google Client ID
//=============

process.env.CLIENT_ID = process.env.CLIENT_ID || '568000520003-j5kpqvc6kai83se42ham404j7pka9dgp.apps.googleusercontent.com';