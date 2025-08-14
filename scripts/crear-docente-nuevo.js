const Usuario = require('../src/models/usuario.model');
const { sequelize } = require('../config/db');
require('dotenv').config({ path: '../.env' });

async function inicializarBaseDatos() {
    try {
        // Verificar conexión
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida.');
        
        // Sincronizar modelos
        await sequelize.sync({ force: false });
        console.log('✅ Modelos sincronizados.');
        
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        process.exit(1);
    }
}

async function crearDocente() {
    try {
        await inicializarBaseDatos();
        
        console.log('🔄 Intentando crear usuario docente...');
        
        const nuevoDocente = await Usuario.create({
            nombre: 'Docente Prueba',
            correo: 'docente.prueba@demo.com',
            password: 'docente123',
            rol: 'docente',
            provider: 'local'
        });

        console.log('✅ Usuario docente creado exitosamente:');
        console.log({
            id: nuevoDocente.id,
            nombre: nuevoDocente.nombre,
            correo: nuevoDocente.correo,
            rol: nuevoDocente.rol
        });
    } catch (error) {
        console.error('❌ Error al crear usuario docente:', error.message);
        if (error.errors) {
            error.errors.forEach(err => console.error('- ', err.message));
        }
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

crearDocente();
