// ====================================
// PUERTO
// ====================================

process.env.PORT = (process.env.PORT || 3000);


// =======================
// ENTORNO
// =======================
process.env.NODE_ENV = (process.env.NODE_ENV || 'dev');

// =======================
// Vencimiento del Token
//mongod --dbpath /System/Volumes/Data/data/db
// =======================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//También vale esto
process.env.CADUCIDAD_TOKEN = '48h';

// =======================
// Seed de autentificación
// =======================
process.env.SEED = (process.env.SEED || 'desarrollo de Imanol A. Prados, semilla secreta $2020!');

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/importadordatos';
} else {
    urlDB = process.env.MONGO_URL;
    console.log("Entro con esta base de datos", urlDB);
}
process.env.URLDB = urlDB; //Nos lo hemos inventado

// =======================
// Google Client
// =======================
//process.env.CLIENT_ID = (process.env.CLIENT_ID || '840655882940-9tn298v59hsbugu9g6qmkbgulbi42vd2.apps.googleusercontent.com')

// =======================
// Token
// =======================
process.env.TOKEN = undefined;
process.env.ISADMIN = false;