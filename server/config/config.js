//=============
// Puerto
//=============

process.env.PORT = process.env.PORT || 3000;
//=============
// Entorno
//=============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //Produccion o si no existe es Desarrollo

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