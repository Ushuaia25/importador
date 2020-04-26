///////////////////////////////
// Guardar Fichero
///////////////////////////////

var originalBodeca;
var originalSolomo;
var originalDue;
var confirmacionesCorreos;

$('#btnGenerarSalidaCorreos').hide();
$('#confirmacionCorreos').hide();

function guardarFichero(input, tipo) {

    if (input.files && input.files[0]) {

        var data = new FormData();
        data.append('archivo', input.files[0]);

        $.ajax({
            url: `/upload/${tipo}`,
            type: 'PUT',
            data: data,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response != 0) {
                    $('#labelSubirFichero' + tipo).text('OK');
                    $('#inputPregunta' + tipo).prop('disabled', true);

                    $('#btnGenerarSalidaCorreos').fadeIn(100);

                    switch (tipo) {

                        case 'bodeca':
                            originalBodeca = JSON.parse(response.file);
                            break;
                        case 'solomo':
                            originalSolomo = JSON.parse(response.file);
                            break;
                        case 'due':
                            originalDue = JSON.parse(response.file);
                            break;

                        default:
                            break;

                    }

                } else {
                    alert('file not uploaded');
                }



            },
            error: function(request, status, error) {
                alert(request.responseText + ' error:', error);
            }
        });
    }

}


function generarArchivoCorreos() {

    var arrayConjunto = [];

    if (originalBodeca) {
        originalBodeca.forEach(element => {
            arrayConjunto.push(element);
        });
    }

    if (originalSolomo) {
        originalSolomo.forEach(element => {
            arrayConjunto.push(element);
        });
    }

    if (originalDue) {
        originalDue.forEach(element => {
            arrayConjunto.push(element);
        });
    }

    var data = new FormData();
    data.append('contenido', JSON.stringify(arrayConjunto));

    $.ajax({
        url: `/generarficherocorreos`,
        type: 'PUT',
        data: data,
        contentType: false,
        processData: false,
        success: function(response) {

            if (response != 0) {
                $('#confirmacionCorreos').fadeIn(100);
                var link = document.createElement('a');
                link.href = response.filename;
                link.click();

            } else {
                alert('fallo al procesar');
            }



        },
        error: function(request, status, error) {
            alert('ERROR EN LA RESPUESTA');
        }
    });

}

///////////////////////////////
//Adjuntamos la confirmación de envío
///////////////////////////////
function adjuntarConfirmacionEnvio(input) {

    if (input.files && input.files[0]) {

        var data = new FormData();
        data.append('archivo', input.files[0]);

        $.ajax({
            url: `/upload/confirmacionescorreos`,
            type: 'PUT',
            data: data,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response != 0) {
                    $('#labelSubirFicheroConfirmacionCorreos').text('OK');
                    $('#inputPreguntaConfirmacionCorreos').prop('disabled', true);

                    var arrayConfirmaciones = JSON.parse(response.datoscorreosparseados);

                    var documentoFinal = [];

                    if (originalBodeca) {
                        const filasCSV = ["order_id", "order_status", "force_email_notification", "dispatch_date", "custom_text", "tracking_info"];
                        let csvContent = "data:text/csv;charset=utf-8,";
                        let cabecera = filasCSV.join(";");
                        csvContent += cabecera + "\r\n";

                        let fecha = new Date();
                        let dia = ("0" + fecha.getDate()).slice(-2);
                        let mes = ("0" + fecha.getMonth()).slice(-2);
                        let fechaFormateada = `${fecha.getFullYear()}-${mes}-${dia}`;


                        originalBodeca.forEach(element => {
                            var valorEncontrado = arrayConfirmaciones.filter(dato => dato.ref === element.referencia)[0];
                            element.tracking = valorEncontrado.tracking;

                            var filElementCSV = `${element.referencia};wc-completed;send_email_customer_completed_order;${fechaFormateada};;0:${element.tracking}`;

                            csvContent += filElementCSV + "\r\n";
                        });

                        let encodedUri = encodeURI(csvContent);
                        let link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `confirmacionBodeca-${fechaFormateada}.csv`);
                        document.body.appendChild(link);
                        link.click();

                    }

                    if (originalSolomo) {

                        const cabeceraAmazon = 'order-id' + '\t' + 'order-item-id' + '\t' + 'quantity' + '\t' + 'ship-date' + '\t' + 'carrier-code' + '\t' + 'carrier-name' + '\t' + 'tracking-number' + '\t' + 'ship-method' + '\t' + 'transparency_code';
                        let csvContent = "data:text/csv;charset=utf-8,";
                        csvContent += cabeceraAmazon + "\r\n";

                        let fechaAmazon = new Date();
                        let diaAmazon = ("0" + fechaAmazon.getDate()).slice(-2);
                        let mesAmazon = ("0" + fechaAmazon.getMonth()).slice(-2);
                        let fechaAmazonFormateada = `${diaAmazon}-${mesAmazon}-${fechaAmazon.getFullYear()}`;

                        originalSolomo.forEach(element => {
                            let valorEncontrado = arrayConfirmaciones.filter(dato => dato.ref === element.referencia)[0];
                            element.tracking = valorEncontrado.tracking;

                            let filElementCSV = `${element.referencia}\t${element.numeroenviocliente}\t${element.bultos}\t${fechaAmazonFormateada}\tCorreos\tCorreos\t${element.tracking}`;
                            csvContent += filElementCSV + "\r\n";
                        });

                        let encodedUri = encodeURI(csvContent);
                        let link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `confirmacionAMAZONSolomo-${fechaAmazonFormateada}.txt`);
                        document.body.appendChild(link);
                        link.click();
                    }
                    if (originalDue) {
                        const cabeceraAmazon = 'order-id' + '\t' + 'order-item-id' + '\t' + 'quantity' + '\t' + 'ship-date' + '\t' + 'carrier-code' + '\t' + 'carrier-name' + '\t' + 'tracking-number' + '\t' + 'ship-method' + '\t' + 'transparency_code';
                        let csvContent = "data:text/csv;charset=utf-8,";
                        csvContent += cabeceraAmazon + "\r\n";

                        let fechaAmazon = new Date();
                        let diaAmazon = ("0" + fechaAmazon.getDate()).slice(-2);
                        let mesAmazon = ("0" + fechaAmazon.getMonth()).slice(-2);
                        let fechaAmazonFormateada = `${diaAmazon}-${mesAmazon}-${fechaAmazon.getFullYear()}`;

                        originalDue.forEach(element => {
                            let valorEncontrado = arrayConfirmaciones.filter(dato => dato.ref === element.referencia)[0];
                            element.tracking = valorEncontrado.tracking;

                            let filElementCSV = `${element.referencia}\t${element.numeroenviocliente}\t${element.bultos}\t${fechaAmazonFormateada}\tCorreos\tCorreos\t${element.tracking}`;
                            csvContent += filElementCSV + "\r\n";
                        });

                        let encodedUri = encodeURI(csvContent);
                        let link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `confirmacionAMAZONDue-${fechaAmazonFormateada}.txt`);
                        document.body.appendChild(link);
                        link.click();
                    }




                    // TODO: AÑADIR TRACKING Y CREAR BOTONES PARA DESCARGAS

                    //POR ELEMENTOS AÑADIR EL TRACKING Y EXPORTAR A CSV Y TXT
                    console.log(documentoFinal);

                } else {
                    alert('file not uploaded');
                }

            },
            error: function(request, status, error) {
                alert(request.responseText + ' error:', error);
            }
        });
    }

}