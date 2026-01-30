# F2Fit API - Node.js + TypeScript

Proyecto base de Node.js con TypeScript y arquitectura en capas.

## Estructura del Proyecto

```
nodejs/
├── src/
│   ├── controllers/      # Controladores (manejo de requests/responses)
│   ├── services/         # Lógica de negocio
│   ├── repositories/     # Acceso a datos
│   ├── interfaces/       # Interfaces TypeScript
│   ├── routes/           # Definición de rutas
│   └── index.ts          # Punto de entrada
├── dist/                 # Código compilado
├── .env                  # Variables de entorno
├── package.json
└── tsconfig.json
```

## Instalación

```bash
npm install
```

## Comandos Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con auto-reload
- `npm run build` - Compila el proyecto TypeScript
- `npm start` - Inicia el servidor en modo producción

## Uso

### Desarrollo
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Endpoints Wellness

- `GET /api/wellness` - Obtener todos los wellness
- `GET /api/wellness/:id` - Obtener un wellness por ID
- `POST /api/wellness` - Crear un nuevo wellness
- `PUT /api/wellness/:id` - Actualizar un wellness
- `DELETE /api/wellness/:id` - Eliminar un wellness

### Ejemplo de Request (POST)

```json
{
  "title": "Meditation Session",
  "description": "Daily meditation practice",
  "category": "Mental Health"
}
```

## Tecnologías

- Node.js
- TypeScript
- Express
- CORS
- dotenv
