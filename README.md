# F2Fit - Wellness Tracking Application

Sistema de seguimiento de bienestar personal con funcionalidad offline y sincronización automática.

## 🚀 Instalación

### Backend (Node.js)

```bash
cd nodejs
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Frontend (React)

```bash
cd react
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Decisiones de Arquitectura

### Backend - Arquitectura Limpia

El backend implementa **Clean Architecture** con múltiples patrones de diseño:

**Patrón Repository**: Abstrae la lógica de acceso a datos mediante interfaces (`IWellnessRepository`), permitiendo cambiar la implementación de persistencia sin afectar la lógica de negocio. Actualmente usa SQLite (`WellnessSQLiteRepository`).

**Patrón Factory**: `HabitFactory` centraliza la creación de objetos `Habit` y sus subclases (`ExerciseHabit`, `HydrationHabit`, etc.), encapsulando la lógica de instanciación y validación.

**Inyección de Dependencias**: El sistema usa un contenedor IoC (`Container`) que gestiona todas las dependencias. Los servicios reciben sus dependencias por constructor, facilitando testing y desacoplamiento.

**Arquitectura por Capas**:
- **Controllers**: Manejan HTTP requests y validación con Zod
- **Services**: Implementan lógica de negocio y reglas (ej: un registro por usuario/día)
- **Repositories**: Gestión de persistencia
- **Models**: Entidades de dominio con POO (herencia: `Habit` como clase base)

**Middleware**: Sistema de autenticación mock y validación centralizada de requests.

### Frontend - Arquitectura Modular

**Separación de Responsabilidades**:
- **Views**: Componentes de página (`WellnessForm`, `Dashboard`)
- **Components**: Componentes reutilizables (`RangeSlider`, `Toast`, `StatsCard`)
- **Services**: Lógica de API y almacenamiento offline
- **Hooks**: Lógica reutilizable (`useOnlineStatus`)

**Offline-First**: Implementación con IndexedDB que permite operación sin conexión y sincronización automática al recuperar internet. Los datos se cachean localmente y las operaciones pendientes se procesan en cola.

**Estado Local**: Manejo con React Hooks, auto-save con debouncing para mejor UX.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/wellness
```

### Autenticación
Todas las peticiones requieren header:
```
Authorization: Bearer {user1|user2|user3}
```

### Endpoints

#### GET `/api/wellness`
Obtiene todos los registros del usuario autenticado.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "date": "2026-01-30",
      "physical_energy": 4,
      "emotional_state": 5,
      "notes": "Gran día",
      "habits": {
        "exercise": { "completed": true },
        "hydration": { "completed": true },
        "sleep": { "completed": false },
        "nutrition": { "completed": true }
      }
    }
  ]
}
```

#### GET `/api/wellness/:date`
Obtiene el registro de una fecha específica (formato: YYYY-MM-DD).

**Response:** `{ "data": {...} }` o `{ "data": null }` si no existe.

#### POST `/api/wellness`
Crea o actualiza un registro (upsert por fecha/usuario).

**Body:**
```json
{
  "date": "2026-01-30",
  "physical_energy": 4,
  "emotional_state": 5,
  "notes": "string",
  "habits": {
    "exercise": true,
    "hydration": true,
    "sleep": false,
    "nutrition": true
  }
}
```

**Validaciones:**
- `physical_energy` y `emotional_state`: números 1-5
- `date`: formato YYYY-MM-DD
- `habits`: objeto con propiedades booleanas

**Response:** `{ "data": {...} }`

#### GET `/api/wellness/:id/summary`
Obtiene resumen de salud del registro.

#### GET `/api/wellness/:id/recommendations`
Obtiene recomendaciones personalizadas basadas en el registro.

## 🎨 Características

- ✅ Auto-guardado con debouncing (2 segundo)
- ✅ Funcionamiento offline con IndexedDB
- ✅ Sincronización automática al recuperar conexión
- ✅ Validación con Zod en backend
- ✅ Dashboard con gráficos (últimos 7 días)
- ✅ Responsive design con Tailwind CSS
- ✅ Múltiples usuarios (mock authentication)
- ✅ Componentes reutilizables y modulares

## 🛠️ Stack Tecnológico

**Backend:**
- Node.js + TypeScript
- Express.js
- Better-SQLite3
- Zod (validación)

**Frontend:**
- React 19 + Vite
- Tailwind CSS v4
- Axios
- Recharts
- IndexedDB
- React Router

## 📝 Notas

- Los rangos de energía y emoción van de 1 a 5
- Solo puede existir un registro por usuario por día
- Los datos se precargan automáticamente al abrir el formulario
- La sincronización offline es automática y transparente
