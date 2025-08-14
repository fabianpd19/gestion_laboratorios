const bcrypt = require('bcryptjs');

async function generarHash() {
    const password = 'docente123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hash de la contraseña:', hash);
}

generarHash();
