class BodecaLine {


    constructor(array, amazon = false) {

        if (amazon) {
            this.escliente = "R";
            this.codigocliente = "599140001";
            this.nombreremitente = "PROMOINCENTIVA";
            this.contactoremitente = "IMANOL A. PRADOS";
            this.telefonoremitente = "633670134";
            this.emailremitente = "imanol.prados@promoincentiva.com";
            this.paisremitente = "ES";
            this.codigopostalremitente = "18150";
            this.direccionremitente = "C/Abedul";
            this.numeroremitente = "41";
            this.restodireccionremitente = "Gojar";
            this.nombredestinatario = array[8];
            this.contactodestinatario = array[16];
            this.telefonodestinatario = array[9];
            this.emaildestinatario = array[7];
            this.paisdestinatario = "ES";
            this.codigopostaldestinatario = array[22];
            this.localidaddestinatario = array[21];
            this.direcciondestinatario = array[17];
            this.numerodestinatario = ".";
            this.restodirecciondestinatario = array[18];
            this.codigoproducto = this.codigopostaldestinatario.startsWith('07') ? 66 : 27;
            this.bultos = array[14];
            this.peso = array[14];
            this.referencia = array[0];
            this.numeroenviocliente = array[1];
            this.tipomercancia = "FRAGIL";
            this.descripcionmercancia = "BOTELLA FRAGIL";
            this.importeasegurado = "";
            this.observaciones = this.bultos + 'X' + array[11].substring(0, 30);
            this.reembolso = "";
            this.seguro = "";
            this.sabado = "N";
        } else {
            this.escliente = "R";
            this.codigocliente = "599140001";
            this.nombreremitente = "PROMOINCENTIVA";
            this.contactoremitente = "IMANOL A. PRADOS";
            this.telefonoremitente = "633670134";
            this.emailremitente = "imanol.prados@promoincentiva.com";
            this.paisremitente = "ES";
            this.codigopostalremitente = "18150";
            this.direccionremitente = "C/Abedul";
            this.numeroremitente = "41";
            this.restodireccionremitente = "Gojar";
            this.nombredestinatario = array[11];
            this.contactodestinatario = array[11];
            this.telefonodestinatario = array[13];
            this.emaildestinatario = array[14];
            this.paisdestinatario = "ES";
            this.codigopostaldestinatario = array[16];
            this.localidaddestinatario = array[17];
            this.direcciondestinatario = array[18];
            this.numerodestinatario = ".";
            this.restodirecciondestinatario = array[20];
            this.codigoproducto = this.codigopostaldestinatario.startsWith('07') ? 66 : 27;
            this.bultos = array[22];
            this.peso = array[23];
            this.referencia = array[24];
            this.numeroenviocliente = array[25];
            this.tipomercancia = "FRAGIL";
            this.descripcionmercancia = "BOTELLA FRAGIL";
            this.importeasegurado = "";
            this.observaciones = this.bultos + 'X' + array[29].substring(0, 30);
            this.reembolso = "";
            this.seguro = "";
            this.sabado = "N";
        }
    }
}


module.exports = {
    BodecaLine
};