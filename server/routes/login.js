const express = require('express');
const { autentificarUsuario } = require('../middlewares/autentications');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

var cookieParser = require('cookie-parser');
app.use(cookieParser());

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            res.render('index', {
                error_login: "Falló la conexión a la base de datos"
            });
            return;
        }

        if (!usuarioDB) {
            res.render('index', {
                error_login: "No existe ningún usuario registrado con ese email"
            });
            return;
        }

        let validacionPass = bcrypt.compareSync(body.password, usuarioDB.password);
        if (!validacionPass) {
            res.render('index', {
                error_login: "Nombre de usuario o contraseña incorrectos"
            });
            return;
        } else {
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //caduca en 30 días
            res.cookie('auth', token);
            process.env.TOKEN = token;
            process.env.USER = usuarioDB.nombre;

            if (usuarioDB.role === 'ADMIN_ROLE') {
                process.env.ISADMIN = true;
                //res.render('main_admin');
                res.redirect('/establecimientos');
            } else {
                process.env.ISADMIN = false;
                res.redirect('/establecimientos');
            }

        }

    });

});

app.get('/logout', (req, res) => {

    res.clearCookie('auth');
    res.redirect('/');
    process.env.TOKEN = undefined;
    process.env.USER = undefined;
    process.env.ADMIN = false;

});


module.exports = app;