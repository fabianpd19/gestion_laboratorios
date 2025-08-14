const { sequelize } = require('../config/db');
require('dotenv').config({ path: '../.env' });

async function resetSequence() {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión establecida');

        // Obtener el último ID usado
        const [results] = await sequelize.query(`
            SELECT setval(pg_get_serial_sequence('usuarios', 'id'), 
                        (SELECT COALESCE(MAX(id), 0) FROM usuarios), 
                        true);
        `);

        console.log('✅ Secuencia reiniciada');

        // Verificar la secuencia actual
        const [current] = await sequelize.query(`
            SELECT currval(pg_get_serial_sequence('usuarios', 'id'));
        `);

        console.log('Valor actual de la secuencia:', current[0].currval);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

resetSequence();
