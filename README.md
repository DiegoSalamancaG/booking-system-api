# Booking System API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Backend REST API profesional para la gestión de reservas, usuarios y disponibilidad. 
Construida con **Node.js, Express y PostgreSQL**, siguiendo principios de arquitectura limpia y un sistema robusto de manejo de errores.

---

## Features

- **User Management:** Registro y autenticación con control de acceso basado en roles (RBAC).
- **Professional Error Handling:** Sistema centralizado de errores con clases personalizadas (400, 401, 403, 404, 409, 500).
- **Security:** Autenticación basada en JWT y protección de rutas mediante middlewares.
- **Validation Layer:** Validación de esquemas y datos de entrada (Zod/Joi) antes de procesar lógica de negocio.
- **Clean Architecture:** Separación clara de responsabilidades (Controllers, Services, Repositories).
- **Database Integrity:** Uso de transacciones y restricciones para garantizar la consistencia de las reservas.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma (Type-safe database client)
- **Authentication:** JSON Web Tokens (JWT)
- **Architecture:** Service-Layer Pattern

---

## Project Structure

```text
prisma/          # Schema de la base de datos y migraciones
src/
├── config/      # Configuraciones de DB y variables de entorno
├── controllers/ # Orquestación de peticiones y respuestas
├── errors/      # Clases de error personalizadas (CustomError, ValidationError, etc.)
├── middlewares/ # Auth, RBAC y validación de esquemas
├── repositories/# Capa de acceso a datos (Queries directas)
├── routes/      # Definición de end-points de la API
├── schemas/     # Capa de validación de esquemas y contratos de datos (Zod).
├── services/    # Lógica de negocio pura (Service Layer)
├── utils/       # Helpers y funciones de soporte
├── app.js       # Configuración de Express y Middleware Global de Errores
└── server.js    # Punto de entrada del servidor
```

---

## Error Handling System

Este proyecto implementa un sistema de errores centralizado para garantizar respuestas consistentes:

- **ValidationError (400):** Datos de entrada incorrectos o faltantes.
- **UnauthorizedError (401):** Fallos en autenticación o tokens inválidos.
- **ForbiddenError (403):** El usuario no tienen los permisos necesarios para el recurso.
- **NotFoundError (404):** Recurso no encontrado en la base de datos.
- **ConflictError (409):** Conflictos de lógica (ej. email ya registrado o reserva duplicada)
- **InternalServerError (500):** Falla interna en el servicio.

---


### Installation

Sigue los pasos mostrados a continuacion para correr el proyecto:

1. **Clone the repository**
    ```bash
    git clone https://github.com/DiegoSalamancaG/booking-system-api
    cd booking-system-api
    ```

2. **Install dependencys:**

    ```bash
    npm install
    ```

3. **Setup Prisma**
    ```bash
    npx prisma generate    
    npx prisma migrate dev 
    ```

4.  **Configure environment variables**

    Crea un nuevo archivo .env en la raiz del directorio y agrega tus credenciales:

    ```bash
    PORT=yourPort
    DATABASE_URL=yourDDBBUrl
    JWT_SECRET=yourSecretKey
    JWT_EXPIRES=1h
    NODE_ENV=development
    ```

5.  **Initialize the App**

    ```bash
    npm run dev
    ```

---

## API Endpoints (Overview)

**Auth**
Servicio de autenticacion de usuarios y regristros
- POST /api/v1/auth/login
- POST /api/v1/auth/register

**Users**
Usuario del sistema
- GET     /api/v1/users/
- GET     /api/v1/users/active
- GET     /api/v1/users/:id
- POST    /api/v1/users/
- PUT     /api/v1/users/
- DELETE  /api/v1/users/:id

**Barber**
Prestador del servicio (ej. barbero, medico, etc)
- GET     /api/v1/barber/
- GET     /api/v1/barber/:id
- POST    /api/v1/barber/
- PUT     /api/v1/barber/
- DELETE  /api/v1/barber/:id

**Bookings**
Citas/reservas creadas
- GET     /api/v1/reservations/
- GET     /api/v1/reservations/:id
- POST    /api/v1/reservations/
- PUT     /api/v1/reservations/:id
- PATCH   /api/v1/reservations/cancel/:id
- PATCH   /api/v1/reservations/complete/:id

---

## Git Workflow

El proyecto utiliza un sistema de dos ramas principales:
- **main:**    Código estable y probado para producción.
- **develop:** Rama de desarrollo donde se integran las nuevas funcionalidades.

---

## Future Improvements

- [ ]Automatic NO_SHOW marking (scheduled job / cron).
- [ ]Swagger API documentation.
- [ ]Docker support.
- [ ]Unit & integration testing.
- [ ]CI/CD pipeline.
- [ ]Logger.
- [✓]Pagination & filtering on list endpoints.

---

## Author

- Developed by Diego Salamanca
- Backend Developer | Node.js | PostgreSQL

---

## License

This project is licensed under the MIT License.

---