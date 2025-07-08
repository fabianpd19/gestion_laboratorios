# Sistema de Registro de Uso de Laboratorios

Sistema universitario para el control y registro del uso de laboratorios, desarrollado con Node.js, Express y Sequelize.

## 🚀 Características

- **Arquitectura Limpia**: Separación por capas (Models, Repositories, Services, Controllers)
- **Base de Datos**: PostgreSQL con Sequelize ORM
- **API RESTful**: Endpoints completos para todas las operaciones
- **Manejo de Errores**: Sistema robusto de manejo de excepciones
- **Docker**: Configuración lista para desarrollo
- **Validaciones**: Validación de datos en todos los niveles

## 📋 Requisitos Previos

- Node.js >= 16.0.0
- Docker y Docker Compose
- PostgreSQL (si no usas Docker)

## 🛠️ Instalación

1. **Clonar el repositorio**
   \`\`\`bash
   git clone <url-del-repositorio>
   cd registro-uso-laboratorios
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar variables de entorno**
   \`\`\`bash
   cp .env.example .env

# Editar .env con tus configuraciones

\`\`\`

4. **Levantar base de datos con Docker**
   \`\`\`bash
   npm run db:setup
   \`\`\`

5. **Iniciar el servidor**
   \`\`\`bash

# Desarrollo

npm run dev

# Producción

npm start
\`\`\`

## 🏗️ Estructura del Proyecto

\`\`\`
registro-uso-laboratorios/
├── src/
│ ├── models/ # Modelos de Sequelize
│ │ ├── usuario.model.js
│ │ ├── laboratorio.model.js
│ │ └── usoLaboratorio.model.js
│ ├── repositories/ # Acceso a datos
│ │ ├── usuario.repository.js
│ │ ├── laboratorio.repository.js
│ │ └── usoLaboratorio.repository.js
│ ├── services/ # Lógica de negocio
│ │ ├── usuario.service.js
│ │ ├── laboratorio.service.js
│ │ └── usoLaboratorio.service.js
│ ├── controllers/ # Controladores HTTP
│ │ ├── usuario.controller.js
│ │ ├── laboratorio.controller.js
│ │ └── usoLaboratorio.controller.js
│ ├── routes/ # Rutas API
│ │ ├── usuario.routes.js
│ │ ├── laboratorio.routes.js
│ │ └── usoLaboratorio.routes.js
│ └── index.js # Servidor principal
├── config/
│ └── db.js # Configuración de base de datos
├── utils/
│ └── errorHandler.js # Manejo global de errores
├── docker-compose.yml # Configuración Docker
├── .env.example # Variables de entorno ejemplo
└── package.json
\`\`\`

## 📚 API Endpoints

### Usuarios

- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `POST /api/usuarios/auth` - Autenticar usuario
- `GET /api/usuarios/estadisticas` - Estadísticas de usuarios

### Laboratorios

- `POST /api/laboratorios` - Crear laboratorio
- `GET /api/laboratorios` - Obtener todos los laboratorios
- `GET /api/laboratorios/:id` - Obtener laboratorio por ID
- `PUT /api/laboratorios/:id` - Actualizar laboratorio
- `DELETE /api/laboratorios/:id` - Eliminar laboratorio
- `GET /api/laboratorios/disponibles` - Obtener laboratorios disponibles

### Usos de Laboratorio

- `POST /api/usos` - Registrar uso de laboratorio
- `GET /api/usos` - Obtener todos los usos
- `GET /api/usos/:id` - Obtener uso por ID
- `PUT /api/usos/:id` - Actualizar uso
- `DELETE /api/usos/:id` - Eliminar uso
- `PATCH /api/usos/:id/iniciar` - Iniciar uso
- `PATCH /api/usos/:id/finalizar` - Finalizar uso
- `GET /api/usos/reporte` - Generar reporte
- `GET /api/usos/laboratorio/:laboratorioId/historial` - Historial por laboratorio

## 🧪 Ejemplos de Uso

### Crear Usuario

\`\`\`bash
curl -X POST http://localhost:3000/api/usuarios \
 -H "Content-Type: application/json" \
 -d '{
"nombre": "Juan Pérez",
"email": "juan@universidad.edu",
"password": "123456",
"rol": "docente",
"programa_academico": "Ingeniería de Sistemas"
}'
\`\`\`

### Crear Laboratorio

\`\`\`bash
curl -X POST http://localhost:3000/api/laboratorios \
 -H "Content-Type: application/json" \
 -d '{
"nombre": "Laboratorio de Química",
"codigo": "LAB-QUI-01",
"ubicacion": "Edificio A, Piso 2",
"capacidad_maxima": 25,
"tipo_laboratorio": "quimica",
"equipos_disponibles": ["Microscopio", "Balanza", "pH metro"]
}'
\`\`\`

### Registrar Uso

\`\`\`bash
curl -X POST http://localhost:3000/api/usos \
 -H "Content-Type: application/json" \
 -d '{
"usuario_id": "uuid-del-usuario",
"laboratorio_id": "uuid-del-laboratorio",
"fecha_inicio": "2024-01-20T08:00:00Z",
"proposito": "Práctica de síntesis orgánica",
"asignatura": "Química Orgánica",
"numero_estudiantes": 20,
"equipos_utilizados": ["Microscopio", "Balanza"]
}'
\`\`\`

## 🐳 Docker

### Comandos útiles

\`\`\`bash

# Levantar servicios

npm run db:setup

# Ver logs

docker-compose logs -f

# Parar servicios

npm run db:down

# Reset completo

npm run db:reset
\`\`\`

### Acceso a pgAdmin

- URL: http://localhost:8080
- Email: admin@lab.com
- Password: admin123

## 🧪 Testing

### Ejecutar pruebas

\`\`\`bash
npm test
\`\`\`

### Probar endpoints con curl

\`\`\`bash

# Health check

curl http://localhost:3000/health

# Obtener usuarios

curl http://localhost:3000/api/usuarios

# Obtener laboratorios

curl http://localhost:3000/api/laboratorios
\`\`\`

## 📊 Modelos de Datos

### Usuario

- `id`: UUID (Primary Key)
- `nombre`: String (100 chars)
- `email`: String único (150 chars)
- `password`: String encriptado
- `rol`: Enum (estudiante, docente, jefe_laboratorio)
- `codigo_estudiante`: String opcional
- `programa_academico`: String opcional
- `telefono`: String opcional
- `activo`: Boolean

### Laboratorio

- `id`: UUID (Primary Key)
- `nombre`: String (100 chars)
- `codigo`: String único (20 chars)
- `ubicacion`: String (200 chars)
- `capacidad_maxima`: Integer
- `tipo_laboratorio`: Enum (quimica, fisica, biologia, computacion, electronica)
- `equipos_disponibles`: JSON Array
- `horario_disponible`: JSON Object
- `activo`: Boolean
- `observaciones`: Text

### UsoLaboratorio

- `id`: UUID (Primary Key)
- `usuario_id`: UUID (Foreign Key)
- `laboratorio_id`: UUID (Foreign Key)
- `fecha_inicio`: DateTime
- `fecha_fin`: DateTime opcional
- `proposito`: String (200 chars)
- `asignatura`: String opcional
- `numero_estudiantes`: Integer
- `equipos_utilizados`: JSON Array
- `observaciones`: Text opcional
- `estado`: Enum (programado, en_curso, finalizado, cancelado)
- `calificacion`: Integer (1-5) opcional
- `comentarios_finales`: Text opcional

## 🔧 Configuración de Desarrollo

### Variables de Entorno

\`\`\`env
DATABASE_URL=postgresql://lab_user:lab_password@localhost:5432/laboratorios_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=laboratorios_db
DB_USER=lab_user
DB_PASSWORD=lab_password
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
\`\`\`

## 🚨 Manejo de Errores

El sistema implementa un manejo robusto de errores:

- **Errores de Validación**: Campos requeridos, formatos inválidos
- **Errores de Base de Datos**: Duplicados, referencias inexistentes
- **Errores de Negocio**: Capacidad excedida, estados inválidos
- **Errores HTTP**: 400, 401, 404, 500

## 📈 Características Avanzadas

### Validaciones de Negocio

- Verificación de capacidad de laboratorio
- Validación de fechas y horarios
- Control de transiciones de estado
- Verificación de disponibilidad

### Reportes y Estadísticas

- Uso por laboratorio
- Estadísticas por usuario
- Reportes de tiempo
- Análisis de ocupación

## 🔄 Flujo de Trabajo

1. **Registro de Usuario**: Docentes y estudiantes se registran
2. **Creación de Laboratorios**: Jefe de laboratorio configura espacios
3. **Programación de Uso**: Docentes programan sesiones
4. **Inicio de Sesión**: Se marca el inicio del uso
5. **Finalización**: Se registra el fin y se evalúa
6. **Reportes**: Se generan estadísticas y reportes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- Email: soporte@universidad.edu
- Issues: [GitHub Issues](link-to-issues)

---

**Desarrollado con ❤️ para la gestión eficiente de laboratorios universitarios**
"# gestion_laboratorios" 
