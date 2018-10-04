const express = require('express');
const app = express();

app.use(require('../routes/usuario.js'));
app.use(require('../routes/login.js'));


module.exports = app;