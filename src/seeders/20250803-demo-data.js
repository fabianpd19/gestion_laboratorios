// 'use strict';

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     // Usuarios
//     await queryInterface.bulkInsert('usuarios', [
//       { id: 1, nombre: 'Admin', correo: 'admin@demo.com', password: 'admin123', rol: 'admin', createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, nombre: 'Docente Uno', correo: 'docente1@demo.com', password: 'docente1', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, nombre: 'Juan Yasig', correo: 'jcyasig2@espe.edu.ec', password: 'estudiante123', rol: 'estudiante', createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, nombre: 'Docente Dos', correo: 'docente2@demo.com', password: 'docente2', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//       { id: 5, nombre: 'Docente Tres', correo: 'docente3@demo.com', password: 'docente3', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//       { id: 6, nombre: 'Docente Cuatro', correo: 'docente4@demo.com', password: 'docente4', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//       { id: 7, nombre: 'Docente Cinco', correo: 'docente5@demo.com', password: 'docente5', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // Asignaturas
//     await queryInterface.bulkInsert('asignaturas', [
//       { id: 1, nombre: 'Aplicaciones Distribuidas', codigo: '23128', createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, nombre: 'Seguridad Informatica', codigo: '23122', createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, nombre: 'Mineria de datos', codigo: '23047', createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, nombre: 'Programacion Avanzada', codigo: '23119', createdAt: new Date(), updatedAt: new Date() },
//       { id: 5, nombre: 'Proyectos TI', codigo: '23123', createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // Laboratorios
//     await queryInterface.bulkInsert('laboratorios', [
//       { id: 1, nombre: 'Lab 01', descripcion: 'Laboratorio de Informaticas', responsable_id: 2, createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, nombre: 'Lab 02', descripcion: 'Laboratorio de Informaticas', responsable_id: 1, createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, nombre: 'Lab 03', descripcion: 'Laboratorio de Informaticas', responsable_id: 3, createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, nombre: 'Lab 04', descripcion: 'Laboratorio de Informaticas', responsable_id: 4, createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // Guias Laboratorio
//     await queryInterface.bulkInsert('guias_laboratorio', [
//       { id: 1, titulo: 'Guía de Instalacion de Maquinar virtuales', laboratorio_id: 2, asignatura_id: 2, docente_id: 2, createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, titulo: 'Guía de modelo de ia para mineria', laboratorio_id: 3, asignatura_id: 3, docente_id: 1, createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // DocenteAsignaturas
//     await queryInterface.bulkInsert('docente_asignaturas', [
//       { id: 1, docente_id: 1, asignatura_id: 1, createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, docente_id: 2, asignatura_id: 2, createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, docente_id: 3, asignatura_id: 3, createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, docente_id: 4, asignatura_id: 4, createdAt: new Date(), updatedAt: new Date() },
//       { id: 5, docente_id: 5, asignatura_id: 5, createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // Horarios Laboratorio
//     await queryInterface.bulkInsert('horarios_laboratorio', [
//       { id: 1, laboratorio_id: 1, asignatura_id: 2, docente_id: 2, horario: 'Lunes 8-10', createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, laboratorio_id: 2, asignatura_id: 1, docente_id: 1, horario: 'Martes 10-12', createdAt: new Date(), updatedAt: new Date() },
//     ]);
//   },

//   async down(queryInterface) {
//     await queryInterface.bulkDelete('horarios_laboratorio', null, {});
//     await queryInterface.bulkDelete('docente_asignaturas', null, {});
//     await queryInterface.bulkDelete('guias_laboratorio', null, {});
//     await queryInterface.bulkDelete('laboratorios', null, {});
//     await queryInterface.bulkDelete('asignaturas', null, {});
//     await queryInterface.bulkDelete('usuarios', null, {});
//   }
// };

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // === 1. Usuarios ===
    await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nombre: "Admin General",
          correo: "admin@example.com",
          password: "hashed_admin123",
          rol: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Juan Pérez",
          correo: "juan.perez@example.com",
          password: "hashed_est123",
          rol: "estudiante",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "María López",
          correo: "maria.lopez@example.com",
          password: "hashed_doc123",
          rol: "docente",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 2. Asignaturas ===
    await queryInterface.bulkInsert(
      "asignaturas",
      [
        {
          nombre: "Programación Avanzada",
          codigo: "PA101",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Redes de Computadoras",
          codigo: "RC202",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 3. Laboratorios ===
    await queryInterface.bulkInsert(
      "laboratorios",
      [
        {
          nombre: "Lab de Computación",
          descripcion: "Laboratorio con 25 PCs",
          responsable_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Lab de Redes",
          descripcion: "Laboratorio para prácticas de redes",
          responsable_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 4. Equipos ===
    await queryInterface.bulkInsert(
      "equipos",
      [
        {
          nombre: "PC-01",
          laboratorio_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Router Cisco",
          laboratorio_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 5. Guias Laboratorio ===
    await queryInterface.bulkInsert(
      "guias_laboratorio",
      [
        {
          titulo: "Guía de JavaScript",
          laboratorio_id: 1,
          asignatura_id: 1,
          docente_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          titulo: "Configuración de Router",
          laboratorio_id: 2,
          asignatura_id: 2,
          docente_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 6. Horarios Laboratorio ===
    await queryInterface.bulkInsert(
      "horarios_laboratorio",
      [
        {
          laboratorio_id: 1,
          asignatura_id: 1,
          docente_id: 3,
          horario: "Lunes 08:00-10:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          laboratorio_id: 2,
          asignatura_id: 2,
          docente_id: 3,
          horario: "Martes 10:00-12:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 7. Usos Laboratorio ===
    await queryInterface.bulkInsert(
      "usos_laboratorio",
      [
        {
          laboratorio_id: 1,
          usuario_id: 2,
          fecha_uso: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          laboratorio_id: 2,
          usuario_id: 2,
          fecha_uso: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 8. Bitácoras ===
    await queryInterface.bulkInsert(
      "bitacoras",
      [
        {
          guia_laboratorio_id: 1,
          laboratorio_id: 1,
          usuario_id: 2,
          contenido: "Se completó la práctica de JavaScript.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          guia_laboratorio_id: 2,
          laboratorio_id: 2,
          usuario_id: 2,
          contenido: "Se configuró el router correctamente.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 9. Docente Asignaturas ===
    await queryInterface.bulkInsert(
      "docente_asignaturas",
      [
        {
          docente_id: 3,
          asignatura_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          docente_id: 3,
          asignatura_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 10. Inscripciones Asignaturas ===
    await queryInterface.bulkInsert(
      "inscripciones_asignaturas",
      [
        {
          estudiante_id: 2,
          asignatura_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          estudiante_id: 2,
          asignatura_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 11. Asignaciones Prácticas ===
    await queryInterface.bulkInsert(
      "asignaciones_practicas",
      [
        {
          estudiante_id: 2,
          equipo_id: 1,
          guia_laboratorio_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          estudiante_id: 2,
          equipo_id: 2,
          guia_laboratorio_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // === 12. Equipos Laboratorio (detallados) ===
    await queryInterface.bulkInsert(
      "equipos_laboratorio",
      [
        {
          nombre: "PC de Escritorio",
          descripcion: "Computadora de alto rendimiento para programación",
          marca: "Dell",
          modelo: "Optiplex 7080",
          numero_serie: "SN123456",
          codigo_inventario: "INV001",
          estado: "disponible",
          laboratorio_id: 1,
          fecha_adquisicion: new Date("2023-05-10"),
          valor_adquisicion: 1200.0,
          observaciones: "En buen estado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nombre: "Switch Cisco",
          descripcion: "Switch gestionable para prácticas de redes",
          marca: "Cisco",
          modelo: "Catalyst 2960",
          numero_serie: "SN7891011",
          codigo_inventario: "INV002",
          estado: "en_uso",
          laboratorio_id: 2,
          fecha_adquisicion: new Date("2022-08-15"),
          valor_adquisicion: 800.0,
          observaciones: "Usado en clases de redes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("equipos_laboratorio", null, {});
    await queryInterface.bulkDelete("asignaciones_practicas", null, {});
    await queryInterface.bulkDelete("inscripciones_asignaturas", null, {});
    await queryInterface.bulkDelete("docente_asignaturas", null, {});
    await queryInterface.bulkDelete("bitacoras", null, {});
    await queryInterface.bulkDelete("usos_laboratorio", null, {});
    await queryInterface.bulkDelete("horarios_laboratorio", null, {});
    await queryInterface.bulkDelete("guias_laboratorio", null, {});
    await queryInterface.bulkDelete("equipos", null, {});
    await queryInterface.bulkDelete("laboratorios", null, {});
    await queryInterface.bulkDelete("asignaturas", null, {});
    await queryInterface.bulkDelete("usuarios", null, {});
  },
};
