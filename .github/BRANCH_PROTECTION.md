# Configuración de Branch Protection para GitHub

## Instrucciones para Proteger la Rama `main`

Una vez que hagas push del workflow de CI/CD, debes configurar manualmente la protección de rama en GitHub:

### Pasos:

1. **Ve a tu repositorio en GitHub**
   - Navega a: `https://github.com/[tu-usuario]/[tu-repo]`

2. **Accede a Settings → Branches**
   - Click en "Settings" (tab superior derecho)
   - En el menú lateral izquierdo, click en "Branches"

3. **Agrega Branch Protection Rule**
   - Click en "Add branch protection rule" (o "Add rule")
   
4. **Configura la Regla para `main`:**
   
   **Branch name pattern:**
   ```
   main
   ```
   
   **Configuraciones Requeridas:**
   
   ✅ **Require a pull request before merging**
   - Esto fuerza que TODOS los cambios pasen por PR
   - Opcional: "Require approvals" (si trabajas en equipo)
   
   ✅ **Require status checks to pass before merging**
   - Esto es CRÍTICO para bloquear merges si fallan los tests
   - Marca: "Require branches to be up to date before merging"
   - En "Status checks that are required", selecciona:
     - `test (18.x)` - Node.js 18
     - `test (20.x)` - Node.js 20
   
   ✅ **Require conversation resolution before merging**
   - Asegura que todos los comentarios de PR estén resueltos
   
   ✅ **Include administrators**
   - Aplica las reglas incluso a administradores del repo
   
   ⚠️ **Do not allow bypassing the above settings**
   - Previene que alguien haga bypass de las reglas

5. **Guarda la Configuración**
   - Click en "Create" o "Save changes"

---

## Resultado

Una vez configurado:

- ❌ **Pushes directos a `main`:** BLOQUEADOS
- ✅ **Pull Requests a `main`:** PERMITIDOS
- ✅ **Merge solo si:**
  - Todos los tests pasan
  - Build es exitoso
  - PR está aprobado (si lo configuraste)
  - Comentarios resueltos

---

## Workflow de Desarrollo Recomendado

```bash
# 1. Crear rama feature
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commits
git add .
git commit -m "feat: nueva funcionalidad"

# 3. Push a GitHub
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub UI
# 5. GitHub Actions ejecutará automáticamente:
#    - npm ci (instalar deps)
#    - npm test (ejecutar tests)
#    - npm run build (compilar)

# 6. Si todo pasa ✅, podrás hacer merge
# 7. Si algo falla ❌, debes arreglarlo antes de merge
```

---

## Tests Que Se Ejecutarán en CI

### Calculators (Unit Tests):
- `ComputeCostCalculator.test.ts`
- `InstanceCostCalculator.test.ts`
- `StorageCostCalculator.test.ts`
- `BigQueryCostCalculator.test.ts`
- `ArtifactCostCalculator.test.ts`
- `ModelArmorCostCalculator.test.ts`

### Service Layer (Integration Tests):
- `SCCCostService.test.ts`

**Total:** 7 archivos de tests con ~31 test cases

---

## Comandos Útiles

```bash
# Ejecutar tests localmente antes de push
npm test

# Ejecutar build para verificar que compila
npm run build

# Ver cobertura de tests (si lo configuras)
npm test -- --coverage

# Ejecutar tests en modo watch (desarrollo)
npm test -- --watch
```

---

## Notas Importantes

1. **Primera vez:** Los status checks no aparecerán en la lista hasta que el workflow se ejecute al menos una vez. Haz un PR de prueba para que GitHub detecte los checks.

2. **Matriz de Node.js:** El workflow prueba con Node.js 18 y 20 para asegurar compatibilidad.

3. **Caching:** Usa `cache: 'npm'` para acelerar builds (reutiliza node_modules entre runs).

4. **Branch `develop`:** El workflow también corre en pushes a `develop` para detectar problemas temprano.
