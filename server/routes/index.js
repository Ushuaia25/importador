const express = require('express');

const app = express();

app.use(require('./uploads'));
app.use(require('./imagenes'));

module.exports = app;