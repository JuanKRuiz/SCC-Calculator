# GitHub Flow & Branching Strategy

## Contexto
Este proyecto sigue una variante simplificada de **GitHub Flow** para mantener un historial limpio, facilitar la integración continua (CI) y asegurar que `main` sea siempre un estado desplegable y estable.

## Regla: Una Tarea = Una Rama

**NUNCA** trabajes directamente sobre `main`. Cada unidad de trabajo (nueva funcionalidad, corrección, mejora de documentación) debe tener su propia rama efímera.

### 1. Nomenclatura de Ramas
Usa prefijos semánticos seguidos de una descripción corta en `kebab-case`:

*   **`feature/`**: Nuevas funcionalidades o mejoras significativas.
    *   *Ejemplo:* `feature/add-cloud-run-calculator`, `feature/gravity-falls-theme`
*   **`fix/`**: Corrección de errores o bugs.
    *   *Ejemplo:* `fix/deploy-paths`, `fix/mobile-responsive-layout`
*   **`docs/`**: Cambios exclusivos en documentación (README, CHANGELOG, etc.).
    *   *Ejemplo:* `docs/update-contribution-guide`
*   **`refactor/`**: Cambios de código que no alteran el comportamiento visible (limpieza, optimización).
    *   *Ejemplo:* `refactor/simplify-pricing-logic`
*   **`chore/`**: Tareas de mantenimiento (actualizar dependencias, configurar CI).
    *   *Ejemplo:* `chore/update-dependencies`

### 2. Flujo de Trabajo (Workflow)

1.  **Sincronizar**: Antes de empezar, asegúrate de tener la última versión de `main`.
    *   `git checkout main && git pull origin main`
2.  **Crear Rama**: Crea tu rama desde `main`.
    *   `git checkout -b feature/mi-nueva-caracteristica`
3.  **Desarrollar**: Realiza tus cambios y commits (siguiendo Conventional Commits).
4.  **Publicar**: Sube tu rama al repositorio remoto.
    *   `git push -u origin feature/mi-nueva-caracteristica`
5.  **Pull Request (PR)**:
    *   Crea un PR hacia `main`.
    *   Espera a que pasen las pruebas automáticas (CI).
6.  **Merge & Delete**: Una vez fusionado, **borra la rama** tanto local como remotamente para evitar ruido.

### 3. Conventional Commits
Tus mensajes de commit deben seguir la estructura: `tipo(alcance): descripción breve`.

*   `feat`: Nueva característica.
*   `fix`: Corrección de bug.
*   `docs`: Documentación.
*   `style`: Formato (espacios, puntos y comas).
*   `refactor`: Refactorización de código.
*   `test`: Añadir o corregir tests.
*   `chore`: Mantenimiento general.

*Ejemplo:* `feat(auth): implementar login con Google`

## Intervención del Asistente
Si el usuario solicita comenzar una nueva tarea, **PROACTIVAMENTE SUGIERE**:
1.  El comando para crear la rama adecuada basándote en la descripción de la tarea.
2.  El nombre de rama recomendado siguiendo esta convención.
