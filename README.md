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
- **Authentication:** JSON Web Tokens (JWT)
- **Architecture:** Service-Layer Pattern

---

## Project Structure

```text
src/
├── config/      # Configuraciones de DB y variables de entorno
├── controllers/ # Orquestación de peticiones y respuestas
├── errors/      # Clases de error personalizadas (CustomError, ValidationError, etc.)
├── middlewares/ # Auth, RBAC y validación de esquemas
├── repositories/# Capa de acceso a datos (Queries directas)
├── routes/      # Definición de end-points de la API
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

3.  **Configure environment variables**

    Crea un nuevo archivo .env en la raiz del directorio y agrega tus credenciales:

    ```bash
    PORT=yourPort
    DATABASE_URL=yourDDBBUrl
    JWT_SECRET=yourSecretKey
    JWT_EXPIRES=1h
    NODE_ENV=development
    ```

4.  **Initialize the App**

    ```bash
    npm run dev
    ```

---

## API Endpoints (Overview)

**Auth**

- POST /api/v1/auth/login
- POST /api/v1/auth/register

**Users**
Usuario del sistema
- GET     /api/v1/users
- GET     /api/v1/users/active
- GET     /api/v1/users/:id
- POST    /api/v1/users/
- PUT     /api/v1/users/
- DELETE  /api/v1/users/:id

**Barber**    (Proximamente)
Prestador del servicio (ej. barbero, medico, etc)

**Bookings**   (proximamente)
Citas/reservas creadas

---

## Git Workflow

El proyecto utiliza un sistema de dos ramas principales:
- **main:** Código estable y probado para producción.
- **develop:** Rama de desarrollo donde se integran las nuevas funcionalidades.

---

## Future Improvements

- [ ]Automatic NO_SHOW marking (scheduled job / cron).
- [ ]Swagger API documentation.
- [ ]Docker support.
- [ ]Unit & integration testing.
- [ ]CI/CD pipeline.
- [ ]Pagination & filtering on list endpoints.

---

## Author

- Developed by Diego Salamanca
- Backend Developer | Node.js | PostgreSQL

---

## License

This project is licensed under the MIT License.

---