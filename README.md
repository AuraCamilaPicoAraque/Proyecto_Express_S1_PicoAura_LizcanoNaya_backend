# <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHI3ZDBoaDM5OWk4ODRmNWo0c2ppeHh6eTR3d2QzczJ2MXMwNzRmNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/jdPMeyv9rn0hZHh8n9/giphy.gif" width="40"/> KarenFlix — Backend (Node.js + Express)

> En este repo construimos el backend REST de **KarenFlix** para gestionar usuarios, películas/series, reseñas con rating y un ranking ponderado. Optamos por **JWT** para autenticación, **MongoDB (driver oficial)** con **transacciones** para consistencia, validaciones robustas, rate limiting y documentación con **Swagger**.  

<br>

## 🏷️ Badges

### Tecnologías
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Driver%20Oficial-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)
![Swagger](https://img.shields.io/badge/Swagger-Docs-85EA2D?logo=swagger&logoColor=000)
<br>


### Calidad y estilo
![ESLint](https://img.shields.io/badge/ESLint-config-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-format-1A2C34?logo=prettier&logoColor=F7B93E)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-orange)

<br>

### Seguridad y límites
![bcrypt](https://img.shields.io/badge/bcrypt-Hashing-informational)
![Rate%20Limit](https://img.shields.io/badge/express--rate--limit-Enabled-success)

<br>

### Versionado
![SemVer](https://img.shields.io/badge/SemVer-API%20v1-blue)

<br>

##  <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW40OGttN3RicThza3lucW1tZHhlMDVibHRlc2RiYmx0YnNwOWwyYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/sUvXqhA9nukbIM0MyO/giphy.gif" width="30"/> Índice
- [Arquitectura](#arquitectura)
- [Stack y principios](#stack-y-principios)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [Documentación de API (Swagger)](#documentación-de-api-swagger)
- [Autenticación y roles](#autenticación-y-roles)
- [Modelo de datos mínimo](#modelo-de-datos-mínimo)
- [Transacciones y consistencia](#transacciones-y-consistencia)
- [Ranking ponderado](#ranking-ponderado)
- [Endpoints principales y ejemplos](#endpoints-principales-y-ejemplos)
- [Manejo de errores](#manejo-de-errores)
- [CORS](#cors)
- [Contribución y Git Flow](#contribución-y-git-flow)
- [Planeación (SCRUM) y evidencias](#planeación-scrum-y-evidencias)
- [Frontend asociado](#frontend-asociado)
- [Licencia y créditos](#licencia-y-créditos)

<br>


##  <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2h2dmsxbWp4b3N4a3djN2duYmgwcTJtNmdrdG56dWozMm4wMnlzMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/lSa5REAX23ECgpcDHj/giphy.gif" width="30"/> Arquitectura

Pensamos el proyecto en capas para aislar responsabilidades y facilitar pruebas.

```js
/src
  /config         # dotenv, conexión db, swagger, rate limit, cors
  /routes         # define rutas por recurso (auth, users, movies, reviews, categories)
  /controllers    # orquesta petición/respuesta HTTP (sin lógica de negocio dura)
  /services       # casos de uso/reglas de negocio
  /models         # acceso a datos con mongodb (sin mongoose) + helpers de transacciones
  /middlewares    # auth (passport-jwt), validaciones, manejo de errores
  /utils          # utilidades (ranking, formateos, helpers comunes)
  app.js          # crea la app de Express
  server.js       # arranque del servidor HTTP
/docs
  swagger.json    # OpenAPI 3.x
/planning
  scrum.pdf       # documento de planeación
/tests            # (opcional) unitarias/integración
```

- **controllers**: mantienen los endpoints limpios; delegan a servicios.
- **services**: concentran la lógica; aquí se validan reglas, permisos y flujos.
- **models**: encapsulan queries y transacciones con el driver oficial de MongoDB.

<br>


##  <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmdpNjNzd2I5NWZtZ2x3Y3dmZ25obGFwdmJ0YzA2ajFxdzA2OXNhYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dHM/kAm4u0lhDCmXnugz6p/giphy.gif" width="30"/> Stack y principios

- **Node.js + Express** para una API REST predecible y rápida de iterar.
- **MongoDB (driver oficial)** para aprovechar transacciones y control fino de consultas.
- **JWT** (con `passport-jwt`) para autenticación stateless.
- **Validaciones** con `express-validator` para entradas confiables desde el borde.
- **Rate limiting** y **CORS** configurables para seguridad y DX.
- **Versionado** de API bajo **SemVer** (ej. `/api/v1`) para cambios controlados.
- **Swagger** con `swagger-ui-express` para documentación viva.
- **Errores centralizados** y códigos HTTP adecuados.

<br>
<br>

## <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2liYTJtbmdwNmp6aHIwM214b3F5d2ttOG94azJlajI1cjNpNWttaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/NPjKrInDbAHJelWm5X/giphy.gif" width="30"/>  Requisitos previos

- Node.js **20+**
- MongoDB **6.x** (ideal en **Replica Set** para transacciones)
- npm 9+ (o pnpm/yarn)

<br>


## <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2liYTJtbmdwNmp6aHIwM214b3F5d2ttOG94azJlajI1cjNpNWttaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/NPjKrInDbAHJelWm5X/giphy.gif" width="30"/>  Instalación

Explicamos cada paso para que el onboarding sea inmediato:

```bash
# 1) Clonar el repo
git clone https://github.com/AuraCamilaPicoAraque/Proyecto_Express_S1_PicoAura_LizcanoNaya_backend


# 2) Instalar dependencias
npm install argon2 bcrypt dotenv express express-rate-limit jsonwebtoken mongodb nodemon passport passport-jwt swagger-jsdoc swagger-ui-express
# o
npm i

# 3) Variables de entorno
cp .env.example .env
# Rellenamos .env con credenciales locales o de staging

# 4) (Opcional) Datos seed
npm run .
```

<br><br>

## <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMW92dTE1ZDJ0c3g0cDRhbzdjdGExc3VqbXl4czFpanMyYTM3anNjcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/dFv9SnGralwSQwfuBp/giphy.gif" width="30"/>  Variables de entorno

Incluimos valores por defecto y comentarios para entender su impacto:

```bash
# Servidor
PORT=3000                 # Puerto HTTP
NODE_ENV=development      # dev | test | production

# Base de datos
MONGODB_URI=mongodb://localhost:27017           # Conexión
MONGODB_DB_NAME=karenflix                       # Nombre DB
# Para transacciones reales, usar Replica Set:
# MONGODB_URI=mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0

# Seguridad
JWT_SECRET=supersecret    # Clave de firma de tokens
JWT_EXPIRES_IN=1d         # Vida de token (ej. 1d, 12h)
BCRYPT_SALT_ROUNDS=10     # Factor de coste para hashing

# Límite de peticiones
RATE_LIMIT_WINDOW_MS=900000   # Ventana (ms) → 15 min
RATE_LIMIT_MAX=100            # Máx. req por ventana

# CORS
CORS_ORIGIN=http://localhost:5173  # Origen permitido (frontend)

# API
API_PREFIX=/api
API_VERSION=v1

# Swagger
SWAGGER_ROUTE=/docs
```

<br><br>

##  <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmZxcHlwOTJtbzh2bm0xMWRwZWllc2E2bTU0d3NyaXV5ajBzMm5tZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/JOrED1HkYfgjEZwJd3/giphy.gif" width="30"/> Ejecución

```bash
# Desarrollo
npm run .
```

- Servidor por defecto: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`

<br>

##  <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWJvZ3E0eDI0cGswOGs1dXdyZGtpNGFtazY3N3ZobGJicjNoaWNyZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/DjuXSRQ9PYkqvL3DAK/giphy.gif" width="30"/>  Documentación de API (Swagger)

Documentamos esquemas, parámetros, ejemplos y códigos de respuesta:

- **Ruta**: `${SWAGGER_ROUTE}` (por defecto `/docs`)
- **OpenAPI 3.x** con ejemplos de requests/responses por recurso
- Mantener sincronizado con cambios de endpoints para evitar drift

<br>

## <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXZncTNjNWY3YWV6amdzdGF4Mm5ib3d6ZHB2dTYwcXUwMXhmaTF6diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/TbJtNftH7OzNFm1MNE/giphy.gif" width="30"/>  Autenticación y roles

- Portamos **JWT Bearer** en `Authorization: Bearer <token>`.
- Roles mínimos: **user** y **admin**.
- Reglas que aplicamos:
  - Solo **admin** **aprueba** películas/series y gestiona **categorías**.
  - Cada usuario puede **CRUD** sus **propias reseñas**.
  - **Like/Dislike** para reseñas de terceros (nunca las propias).

<br><br>

##  <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnk3azFtNDU3Z3d1aTl6aTNtcDF5a29yNXlmejFrbm96Z2swMjMzdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/8T2sUmuGlWU7ahH5Ev/giphy.gif" width="30"/> Modelo de datos mínimo

Definimos un esquema conceptual simple para iterar rápido:

- **users**: `{ _id, name, email (unique), passwordHash, role, createdAt }`
- **categories**: `{ _id, name (unique), createdAt }`
- **movies**: `{ _id, title (unique), description, categoryId, year, imageUrl?, approved (bool), createdAt }`
- **reviews**: `{ _id, userId, movieId, title, comment, score (1.0..5.0 step 0.1), likes, dislikes, createdAt, updatedAt }`
- **votes** (opcional): `{ _id, reviewId, voterUserId, type: 'like'|'dislike', createdAt }`

> Accedemos a datos con el **driver oficial de MongoDB**; para operaciones críticas empleamos **transacciones**.

<br><br>

##  <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2ZkODB3ZXRhNG1mdjhiamZzbmw1NnloNDk5b21wejU5MHBkeXp1YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/RlO1xYMj3eX3yXZQEp/giphy.gif" width="30"/> Transacciones y consistencia

Agrupamos operaciones que deben ser atómicas para evitar estados intermedios:

- **Crear reseña** + actualizar agregados + (opcional) voto inicial.
- **Votar reseña** y reflejar contadores.
- **Aprobar película** y propagar flags necesarios.

Cada flujo se implementa con `session` y `withTransaction`.

<br><br>

##  <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjh0d2xrYzh6Mmdpdjc3OXBkdGUxemJxaGE4ZXhwMjFtYW5xejJwMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/rt65yvUWc5v0S5ICyV/giphy.gif" width="30"/>  Ranking ponderado

El ranking de una película combina:

1. **Media de scores** (precisión decimal 0.1),
2. **Engagement** (likes/dislikes de reseñas),
3. **Recencia** (decaimiento temporal).

Centralizamos el cálculo en `utils/ranking.js` y lo recalculamos al:

- Crear/editar/eliminar reseñas,
- Registrar votos,
- (Opcional) ejecutar jobs periódicos.

<br><br>

## <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWU0aHhrNHoxdHEyM3Vidmc3ZHI0aXZ4bWdxaDY3aWNpOXdhb3R0dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/WRocW2SN1BFk49SFQR/giphy.gif" width="30"/> Endpoints principales y ejemplos

> Prefijo base: `/${API_PREFIX}/${API_VERSION}` → `/api/v1`

### Auth

**Registro**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "name":"Ada", "email":"ada@lovelace.dev", "password":"P4ssw0rd!" }'
```
<br>

**Login**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email":"ada@lovelace.dev", "password":"P4ssw0rd!" }'
# → { token, user }
```
<br>

## Películas / Series

**Crear (admin)**
```bash
curl -X POST http://localhost:3000/api/v1/movies \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "title":"Spirited Away", "description":"...", "categoryId":"...", "year":2001, "imageUrl":"..." }'
```
<br>

**Aprobar (admin)**
```bash
curl -X PATCH http://localhost:3000/api/v1/movies/:id/approve \
  -H "Authorization: Bearer $TOKEN"
```

<br>

**Listar con filtros**
```bash
curl "http://localhost:3000/api/v1/movies?category=<catId>&sort=ranking&order=desc&page=1&limit=20"
```

<br>

## Reseñas y votos

**Crear reseña**
```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "movieId":"...", "title":"Obra maestra", "comment":"...", "score":4.7 }'
```

**Like / Dislike**
```bash
curl -X POST http://localhost:3000/api/v1/reviews/:id/vote \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "type":"like" }'   # o "dislike"
```
<br><br>

## Categorías (admin)

**Crear categoría**
```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "name":"Ciencia Ficción" }'
```

**Listar (mín. 4 categorías)**
```bash
curl http://localhost:3000/api/v1/categories
```

<br><br>

## Manejo de errores

Un middleware central devuelve respuestas consistentes en JSON:

```json
{
  "error": {
    "message": "Descripción del problema",
    "details": { "campo": "motivo" }
  }
}
```

Usamos códigos estándar: `400`, `401`, `403`, `404`, `409`, `429`, `500`.

<br><br>

## CORS

Restringimos el origen del frontend vía `CORS_ORIGIN`. Para desarrollo:

```
CORS_ORIGIN=http://localhost:5173
```

En producción, listamos dominios permitidos.

<br>

##  <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTdxa3ZzcWhha2NqaXpqMm1leTIzNjk4YzU3YjczZTZ5amwxM2wzOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/kH1DBkPNyZPOk0BxrM/giphy.gif" width="30"/> Contribución y Git Flow

- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`…).
- **Ramas**: `main` (estable), `dev`, y feature branches por issue.
- **PRs**: descripción, screenshots si aplica y linters pasando.
- **SemVer** para releases (`1.0.0`, `1.1.0`, `2.0.0`…).
- Recomendamos checks automáticos (lint/test) en CI.

<br>

##  <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExODFzemswZmljOGY4aWo1cnJ5Y2VwcTlnM3FocjRlcWQzcG1nNGM4YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/VtdEHkFxEA9nMPNExT/giphy.gif" width="30"/> Planeación (SCRUM) y evidencias

- Trabajamos con **SCRUM** en **≥ 2 sprints**.
- Roles: **Scrum Master**, **Product Owner**, **Developers**.
- Seguimiento en tablero (GitHub Projects / Trello / ClickUp).
- Evidencias:
  - `/planning/scrum.pdf` con nuestra planeación.
  - Video (≤10 min) explicando backend + demo con frontend.

> Enlace al video (pendiente): `[Video Demo](https://...)`

<br>

##  <img src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWdreHIxeW1rczRud3RqcnJ6ejltanpsZDdrcm5vaG04aTE3Y3Y0ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/M4NykXxUE0HAcK7UJ6/giphy.gif" width="30"/> Frontend asociado

El frontend vive en un repo aparte (HTML + CSS + JS puro).  
Enlace: [Repo Frontend](https://github.com/AuraCamilaPicoAraque/Proyecto_Express_S1_PicoAura_LizcanoNaya_frontend)

<br>

##  <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDN1cXQwOXZxMm9obWJ5azI4dnY5NTg3c3JwNGZnYWxzZGZzbWlmMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/1ji2Ht5MVO4wnQxQHL/giphy.gif" width="30"/>  Licencia y créditos

- Licencia: MIT (o la que definamos como equipo).
- Créditos: Equipo KarenFlix.