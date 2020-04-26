//helpers
const helpers = {};

helpers.getAnio = () => {
    return new Date().getFullYear();
};

helpers.capitalizar = (texto) => {

    if (texto) {
        let palabras = texto.split(' ');
        palabras.forEach((palabra, index) => {

            palabras[index] = palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();

        });

        return palabras.join(' ');
    }
};

helpers.uppercase = (texto) => {

    if (texto) {

        return texto.toUpperCase();
    }
};

helpers.isAdmin = (block) => {

    if (process.env.ISADMIN === 'true') {
        return block.fn();
    }
};

helpers.getNombreUsuario = () => {

    return process.env.USER;
};

module.exports = helpers;