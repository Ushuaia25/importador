require('./config/config');

const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const express = require('express');
const cors = require('cors');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config(); //Create a .env file in the root directory of your project. Add environment-specific variables on new lines in the form of NAME=VALUE

//Cada petición que hagamos pasa por el parser
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

//parse application/json
app.use(bodyParser.json());

//Habilitar la carpeta public
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
app.set('views', path.join(__dirname, '../views')); //Con esto node sabe donde esta la carpeta views
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    partialsDir: path.join(app.get('views'), 'partials'),
    layoutsDir: path.join(app.get('views'), 'layouts'), //Decimos que las carpetas partials y layout estan en views
    extname: '.hbs', //defino como voy a terminar los archivos
    helpers: require('../hbs/helpers'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})); //el motor que vamos a usar de hadlebars
app.set('view engine', '.hbs'); //Definimos el motor de plantillas



//Configuracion global de rutas
app.use(require('./routes/index'));


app.get('/', async(req, res) => {


    res.render('index', {});
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, db) => {

        if (err) {
            throw err;
        }


    });


app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});