const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');

const path = require('path');
const xlsxFile = require('read-excel-file/node');
const { BodecaLine } = require('../classes/bodeca');

var _ = require('underscore');
var excel = require('excel4node');
app.use(fileUpload({ useTempFiles: true }));
var XLSX = require('xlsx');


///////////////////////////////
//GUARDANDO EL FICHERO
///////////////////////////////

// app.put('/upload/:tipo', (req, res) => {


//     let tipo = req.params.tipo;
//     let id = req.params.id;


//     if (!req.files) {
//         return res.status(400)
//             .json({
//                 ok: false,
//                 err: {
//                     message: 'No se ha seleccionado ningún archivo'
//                 }
//             });
//     }

//     //valida tipo
//     let tiposValidos = ['bodeca', 'solomo', 'due'];
//     if (tiposValidos.indexOf(tipo) < 0) { //Si no esta en el vector la extensión pues dará -1
//         return res.status(400).json({
//             ok: false,
//             err: {
//                 message: 'El tipo no es correcto, los tipos son:' + tiposValidos.join(', '),
//                 tipos: tipo
//             }
//         }); //el .join une los elementos del vector con lo que pongamos ahí
//     }


//     let archivo = req.files.archivo;

//     let extensionesValidas = ['xlsx', 'csv', 'txt'];
//     let nombreCortado = archivo.name.split('.');
//     let extension = nombreCortado[nombreCortado.length - 1];


//     if (extensionesValidas.indexOf(extension) < 0) { //Si no esta en el vector la extensión pues dará -1
//         return res.status(400).json({
//             ok: false,
//             err: {
//                 message: 'La extensión no es correcta, las extensiones válidas son:' + extensionesValidas.join(', '),
//                 ext: extension
//             }
//         }); //el .join une los elementos del vector con lo que pongamos ahí
//     }

//     //Cambiar el nombre al archivo
//     let nombreArchivo = `${ tipo }_${ new Date().getDay()  }-${ new Date().getMonth()  }-${ new Date().getFullYear()  }_${ new Date().getMilliseconds()  }.${ extension }`;

//     let pathArchivo = path.resolve(__dirname, `../../public/uploads/tmp/${tipo}`);
//     archivo.mv(`${pathArchivo}/${ nombreArchivo }`, (err) => {

//         if (err)
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });

//         // switch (tipo) {

//         //     case 'bodeca':
//         //         xlsxFile(`${pathArchivo}/${ nombreArchivo }`).then((rows) => {
//         //             console.log(rows);
//         //         });
//         //         break;

//         //     case '':
//         //         break;
//         //     case '':
//         //         break;
//         //     default:
//         //         break;
//         // }

//         res.status(200).json({
//             ok: true,
//             file: nombreArchivo,
//             path: pathArchivo
//         });
//     });

// });

///////////////////////////////
//SIN GUARDAR FICHEROS
///////////////////////////////

app.put('/upload/:tipo', (req, res) => {


    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    //valida tipo
    let tiposValidos = ['bodeca', 'solomo', 'due', 'confirmacionescorreos'];
    if (tiposValidos.indexOf(tipo) < 0) { //Si no esta en el vector la extensión pues dará -1
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo no es correcto, los tipos son:' + tiposValidos.join(', '),
                tipos: tipo
            }
        }); //el .join une los elementos del vector con lo que pongamos ahí
    }


    let archivo = req.files.archivo;

    let extensionesValidas = ['xlsx', 'csv', 'txt', 'xls'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    if (extensionesValidas.indexOf(extension) < 0) { //Si no esta en el vector la extensión pues dará -1
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensión no es correcta, las extensiones válidas son:' + extensionesValidas.join(', '),
                ext: extension
            }
        }); //el .join une los elementos del vector con lo que pongamos ahí
    }

    switch (tipo) {

        case 'confirmacionescorreos':
            console.log('Esto es el archivo', archivo.tempFilePath);

            var workbook = XLSX.readFile(archivo.tempFilePath);

            var jsonDatos = {};
            workbook.SheetNames.forEach(function(sheetName) {
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
                if (roa.length) jsonDatos[sheetName] = roa;
            });

            //ELIMINO DATOS INNECESARIOS
            jsonDatos.LISTADOPRIVADOENVIOS.shift();
            jsonDatos.LISTADOPRIVADOENVIOS.shift();
            jsonDatos.LISTADOPRIVADOENVIOS.shift();
            jsonDatos.LISTADOPRIVADOENVIOS.pop();

            var arrayDatosCorreosParseados = [];

            jsonDatos.LISTADOPRIVADOENVIOS.forEach(element => {
                var datoCorreosParseado = {
                    tracking: element[0],
                    ref: element[1],
                    url: element[13]
                };

                arrayDatosCorreosParseados.push(datoCorreosParseado);
            });

            res.status(200).json({
                ok: true,
                datoscorreosparseados: JSON.stringify(arrayDatosCorreosParseados),
            });


            // xlsxFile(archivo.tempFilePath).then((rows, errors) => {

            //     if (errors) {
            //         res.status(500).json({
            //             ok: false,
            //             file: errors,
            //         });
            //     }

            //     // var documentoDeConfirmaciones = [];
            //     // rows.shift(); //Elimino cabecera
            //     // rows.shift();
            //     // rows.shift();
            //     // rows.forEach(fila => {
            //     //     var datos = {
            //     //         num_envio: fila[1].toString(),
            //     //         ref: fila[2].toString()
            //     //     };
            //     //     documentoDeConfirmaciones.push(datos);
            //     // });

            //     // console.log(documentoDeConfirmaciones);

            //     // return res.status(200).json({
            //     //     ok: true,
            //     //     file: JSON.stringify(documentoDeConfirmaciones),
            //     // });
            // });
            break;

        case 'bodeca':
            xlsxFile(archivo.tempFilePath).then((rows, errors) => {

                if (errors) {
                    res.status(500).json({
                        ok: false,
                        file: errors,
                    });
                }

                var documentoAmazon = [];
                rows.shift(); //Elimino cabecera
                rows.forEach(fila => {
                    var lineaBodeca = new BodecaLine(fila, false);
                    documentoAmazon.push(lineaBodeca);
                });

                documentoAmazon = depurarDocumento(documentoAmazon);

                return res.status(200).json({
                    ok: true,
                    file: JSON.stringify(documentoAmazon),
                });
            });

            break;

        case 'solomo':
        case 'due':

            fs.readFile(archivo.tempFilePath, (err, buffer) => {

                if (err) {
                    res.status(500).json({
                        ok: false,
                        error: err
                    });
                }

                var arrayLineas = buffer.toString();
                arrayLineas = arrayLineas.split('\n');


                arrayLineas.shift(); //Quito las cabeceras

                //console.log('Después de arraylineas', arrayLineas);

                var documentoAmazon = [];

                arrayLineas.forEach(linea => {

                    linea = linea.replace('\r', '');

                    var lineaAmazon = linea.split('\t');

                    if (lineaAmazon.length > 2) {
                        var lineaBodeca = new BodecaLine(lineaAmazon, true);
                        documentoAmazon.push(lineaBodeca);
                    }

                });

                documentoAmazon = depurarDocumento(documentoAmazon);

                return res.status(200).json({
                    ok: true,
                    file: JSON.stringify(documentoAmazon),
                });

            });

            break;
        default:
            break;
    }



});

function borraArchivo(nombreArchivo, tipo) {
    //Borra la imagen. La busca primero en el path y si existe la borra
    let pathArchivo = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathArchivo)) {
        fs.unlinkSync(pathArchivo);
    }
}

//Elimina y unifica duplicados de lineas
function depurarDocumento(documento) {

    var documentoLimpio = [];

    documento.forEach(linea => {

        var filtrada = false;
        documentoLimpio.forEach(lineaFiltrada => {
            if (lineaFiltrada.referencia === linea.referencia) {
                lineaFiltrada.bultos = lineaFiltrada.bultos + linea.bultos;
                lineaFiltrada.observaciones += ' + ' + linea.observaciones;
                filtrada = true;
            }
        });

        // TODO: TIENES QUE SUMAR LAS CANTIDADES


        if (!filtrada) {
            documentoLimpio.push(linea);
        }
    });

    return documentoLimpio;

}

///////////////////////////////
//GENERAR FICHERO CORREOS
///////////////////////////////
app.put('/generarficherocorreos2', (req, res) => {


    var array = JSON.parse(req.body.contenido);

    var workbook = new excel.Workbook(); // Add Worksheets to the workbook
    var worksheet = workbook.addWorksheet('Hoja1');
    var worksheet2 = workbook.addWorksheet('Pedidos');


    var linea = array[0];
    var elementosCabecera = Object.keys(linea);

    for (var i = 0; i < elementosCabecera.length; i++) {
        worksheet2.cell(1, i + 1).string(String(elementosCabecera[i]));
    }

    var fila = 2;
    array.forEach(lineaDocumento => {

        var arrayValues = Object.values(lineaDocumento);

        for (var i = 0; i < arrayValues.length; i++) {
            var valor;
            if (arrayValues[i]) {
                valor = arrayValues[i].toString();
            } else {
                valor = "";
            }
            worksheet2.cell(fila, i + 1).string(valor);
        }
        fila++;
    });

    workbook.write('EJEMPLO.xlsx');

    var workbookNuevo = XLSX.readFile('EJEMPLO.xls');

    XLSX.write(workbookNuevo, 'NUEVO.xls', { BookType: 'xls' });

    res.status(200).json({
        ok: true,
        mensaje: "OK"
    });

});


///////////////////////////////
//GENERAR FICHERO CORREOS
///////////////////////////////
app.put('/generarficherocorreos', (req, res) => {


    var array = JSON.parse(req.body.contenido);

    let wb = XLSX.utils.book_new();

    var ws_hoja1 = "Hoja1";
    var ws_pedidos = "Pedidos";

    var data = [];
    var elementosCabecera = Object.keys(array[0]);
    data.push(elementosCabecera);

    array.forEach(lineaDocumento => {

        var arrayValues = Object.values(lineaDocumento);

        data.push(arrayValues);
    });

    var ws;
    XLSX.utils.book_append_sheet(wb, ws, ws_hoja1);

    ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, ws_pedidos);


    var fecha = new Date();
    var nombreArchivo = `cargasmasivas/cargamasiva-${fecha.getDay()}_${fecha.getMonth()}_${fecha.getDay()}-${fecha.getHours()}-${fecha.getMinutes()}.xls`;

    XLSX.writeFile(wb, `public/${nombreArchivo}`, { bookType: 'biff8' });

    res.status(200).json({
        ok: true,
        filename: nombreArchivo
    });

});

module.exports = app;