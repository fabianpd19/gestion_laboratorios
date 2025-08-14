const Usuario = require('../src/models/usuario.model');
require('../config/db'); // Importar configuración de la base de datos

require('dotenv').config({ path: '../.env' });

async function crearDocente() {
    try {
        console.log('Intentando crear usuario docente...');
        
        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({
            where: { correo: 'docente.prueba@demo.com' }
        });

        if (existeUsuario) {
            console.log('El usuario docente ya existe');
            return;
        }

        const nuevoDocente = await Usuario.create({
            id: "b273c4bd-43b7-420e-ae38-fcc1635cce3b", 
            nombre: 'Docente Prueba',
            correo: 'docente.prueba@demo.com',
            password: 'docente123',
            rol: 'docente',
            provider: 'local'
        });

        console.log('Usuario docente creado exitosamente:');
        console.log({
            id: nuevoDocente.id,
            nombre: nuevoDocente.nombre,
            correo: nuevoDocente.correo,
            rol: nuevoDocente.rol
        });
    } catch (error) {
        console.error('Error al crear usuario docente:', error.message);
        if (error.errors) {
            error.errors.forEach(err => console.error('- ', err.message));
        }
    } finally {
        process.exit(0);
    }
}

crearDocente();
