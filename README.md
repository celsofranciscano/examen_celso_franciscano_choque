# Todo App - Gestión de Tareas

## 1. Tipo de arquitectura

El proyecto tiene una arquitectura monolítica, ya que todo el sistema (frontend y backend) está dentro de una sola aplicación en Next.js.

Sin embargo, internamente está organizado por secciones, separando la interfaz de usuario, la lógica del backend y el acceso a la base de datos.

Esto permite mantener cierto orden aunque todo esté en un mismo proyecto.

---

## 2. Módulos o componentes

En el proyecto se identifican los siguientes componentes:

### Frontend
- Componente principal `TodoApp`
- Componentes de interfaz de SHADCN como botones, tarjetas, inputs, etc.
- Manejo de estado con React (useState, useEffect)
- Consumo de la API mediante axios

### Backend
- Endpoints que permiten:
  - Listar tareas
  - Crear tareas
  - Actualizar tareas
  - Eliminar tareas

### Base de datos
- Tabla `tasks`
- Contiene campos como id, título, descripción, estado, prioridad y fechas

---

## 3. Mejoras propuestas

El sistema funciona correctamente, pero se pueden hacer mejoras:

- Usar enums en la base de datos para evitar errores en estados y prioridades
- Mejorar la escalabilidad en caso de crecimiento del sistema
- Integrar gestion de usuarios, para que puedan acceder a sus tareas

---
