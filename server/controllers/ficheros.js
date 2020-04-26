// const express = require('express');
// const fileUpload = require('express-fileupload');
// const app = express();
// const fs = require('fs');
// const path = require('path');

// const ctrl = {};

// ctrl.moverImagenInformePrincipal = (nombre, id, callback) => {

//     let pathImagenOriginal = path.resolve(__dirname, `../../public/uploads/tmp/informe/${id}/`);
//     let pathImagenFinal = path.resolve(__dirname, `../../public/uploads/informe/${id}/`);

//     if (!fs.existsSync(pathImagenOriginal)) {
//         console.log('No existía ', pathImagenOriginal);
//         fs.mkdirSync(pathImagenOriginal, { recursive: true }, (err) => {
//             if (err) throw err;
//         });
//     }

//     if (!fs.existsSync(pathImagenFinal)) {
//         console.log('No existía ', pathImagenFinal);
//         fs.mkdirSync(pathImagenFinal, { recursive: true }, (err) => {
//             if (err) throw err;
//         });
//     }

//     fs.rename(`${pathImagenOriginal}/${nombre}`, `${pathImagenFinal}/${nombre}`, (err) => {
//         if (err) {
//             return callback(err, null);
//         } else {
//             return callback(null, nombre);
//         }
//     });

// };

// module.exports = ctrl;