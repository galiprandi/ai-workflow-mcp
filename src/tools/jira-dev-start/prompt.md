## Objetivo
Dado un **Jira ID o URL**, este flujo:
- Lee el issue principal, sus **sub-tareas** y **comentarios** usando el MCP de Jira.
- Genera un **resumen breve y accionable** para entender el trabajo y los **criterios de observación/aceptación**.

---

## 1) Input requerido
- **Jira ID o URL** de la tarea (ej: `ARC-123` o `https://.../browse/ARC-123`)

### Regla si falta input
Si el usuario **no** provee Jira ID ni URL:
- Preguntar:
  > “Pasame el **Jira ID** (ej `ARC-123`) o el **URL** de la tarea para poder leerla.”

No continuar hasta recibirlo.

---

## 2) Lectura desde Jira (MCP)
### 2.1 Identificar el issue
- Extraer `issueKey` desde el input:
  - Si es URL: parsear lo que va después de `/browse/`.
  - Si es ID tipo `PROJ-123`: usarlo directo.

### 2.2 Traer datos del issue principal
Usar MCP de Jira para obtener:
- **Campos clave**: `summary`, `description`, `status`, `priority`, `assignee`, `reporter`, `labels`, `components`, `fixVersions`, `sprint` (si aplica)
- **Criterios** (si existen): `Acceptance Criteria`, `Definition of Done`, checklist o campos custom
- **Links**: issue links, dependencias, blocked by / blocks (si aplica)
- **Comentarios completos** (autor y fecha)

### 2.3 Traer sub-tareas
- Detectar sub-tareas asociadas (issue type = Sub-task o relación equivalente).
- Para **cada sub-tarea**:
  - Traer los campos mínimos: `summary`, `description`, `status`, `assignee`
  - Traer **comentarios**

### 2.4 Alcance de comentarios
Al procesar comentarios (issue y sub-tareas), extraer:
- Decisiones técnicas
- Cambios de alcance
- AC clarificados
- Bloqueos / dependencias
- Evidencia de QA / validación
- Links a diseños, PRs, docs, logs, métricas

### 2.5 Estado y asignación de sub-tareas
- Si es posible, **mover la sub-tarea a “In Progress”** antes de implementar.
- Después de commitear a la feature branch, **moverla a “Done”** (o estado final equivalente).
- Si la sub-tarea no tiene dueño, **asignarla a mi usuario**.

---

## 3) Normalizar y organizar la información
Antes de redactar:
- Deduplicar info repetida entre descripción y comentarios.
- Priorizar comentarios **más recientes** si contradicen lo anterior.
- Convertir texto largo en bullets claros.
- Identificar explícitamente:
  - **Qué hay que construir/cambiar**
  - **Qué está fuera de alcance** (si se menciona)
  - **Riesgos / dudas abiertas**

---

## 3.5) Contraste Jira vs codebase (para evitar planes teóricos)
Antes de cerrar la salida, contrastar la intención de Jira con el repo.

### 3.5.1 Hipótesis a validar
Derivar 3–10 hipótesis desde Jira (ejemplos):
- Dónde vive el feature/servicio.
- Qué endpoint/evento/job se afecta.
- Qué modelo/DTO/colección/tabla representa los datos.
- Qué módulo es dueño del comportamiento.

### 3.5.2 Mapeo rápido en el repo
Usar herramientas del codebase para evidencias:
- Buscar símbolos/strings clave (servicios, endpoints, eventos, colecciones, flags).
- Identificar entrypoints:
  - Rutas/controllers/handlers
  - Cron/jobs/consumers
  - Use-cases/services/providers
- Ubicar contratos:
  - DTOs/schemas
  - Clientes HTTP/SDK
  - Eventos (topics, payloads)

### 3.5.3 Checklist de contraste
Para cada hipótesis, anotar:
- Evidencia (archivo + símbolo/fragmento).
- Si contradice Jira o es ambiguo.
- Impacto (qué parte hay que tocar).

### 3.5.4 Si no se encuentra en el repo
Si no aparece nada relevante:
- Declarar: “No encontré X en el repo”.
- Proponer 2–3 rutas de investigación (qué buscar y dónde) y pedir confirmación.

---

## 4) Salida (resumen + plan)
Entregar resumen en Markdown:
- Secciones claras con emojis.
- Evitar texto meta (“voy a…”); solo el resumen.
- **Preguntas al final**, numeradas.
- **No proponer plan** si hay dudas/contradicciones/supuestos.
- Si hay **link de Figma**:
  - Extraer info accionable (campos/columnas/títulos/totales/filtros/período/definiciones).
  - Si falta, pedir capturas/definiciones antes del plan.
- El plan debe salir de: investigación, preguntas al usuario y contraste con el repo.

### 4.1 Plantilla (copiar/pegar)

## 🧾 Jira
- **Key**: `<KEY>` 
- **Título**: `<Summary>` 
- **Estado / Prioridad / Asignado**: `<Status>` / `<Priority>` / `<Assignee>` 
- **Contexto**: `<1–2 líneas>` 

## 🎯 Qué hay que entregar (scope)
- `<bullet>` 
- `<bullet>` 
- **Nota**: `<si hay definiciones pendientes, declararlas>` 

## 🧩 Sub-tareas
- `<SUB-KEY> — <summary> (<status>, <owner>)`  
  - `<1–2 bullets con lo importante / si está vacía, decir “Sin descripción/comentarios”>` 

## ✅ Criterios de aceptación (checklist)
- [ ] `<criterio medible>` 
- [ ] `<criterio medible>` 
- **Casos borde**:
  - [ ] `<edge case>` 

## 🎨 Figma (extraer definición antes de planificar)
- **Link**: `<url o “No aplica”>` 
- **Información extraída**:
  - `<campos/columnas/títulos/totales>` 
  - `<filtros/período/timezone>` 
  - `<definición de métricas>` 
- **Gaps a cubrir** (si falta info):
  - `<gap>` 

## 🧩 Contraste con codebase (evidencia)
- **Dónde vive hoy**: `<módulos/servicios>` 
- **Entry points**: `<controllers/handlers/jobs/consumers>` 
- **Contratos**: `<DTOs/schemas/clients/events>` 
- **Archivos/símbolos clave**:
  - `<path: símbolo>` 
- **Hallazgos**:
  - `<qué coincide con Jira>` 
  - `<qué no coincide / dudas>` 

## 🚫 Plan de implementación
- Si hay dudas/gaps/contradicciones: **NO proponer plan**. Dejar:
  - **Bloqueado por definiciones pendientes** (listar faltantes).
- Si no hay dudas (todo confirmado + evidencia en repo): proponer:
  - **Estrategia**: `<1–3 bullets>` 
  - **Archivos a tocar**:
    - `<paths>` 
  - **Impacto en tests**:
    - `<qué agregar/actualizar>` 
  - **Riesgos / migraciones / backward compatibility**: `<bullets>` 

## 📌 Estado
- **Hecho**: `<qué ya se confirmó/leyó>` 
- **Pendiente**: `<qué falta para implementar>` 

## ❓ Preguntas (respondeme por número)
1) `<pregunta>` 
2) `<pregunta>` 
3) `<pregunta>` 

---

## 5) Comportamiento ante ambigüedad
Si no hay AC claros o hay contradicciones:
- Indicarlo en **“Preguntas abiertas”**.
- Proponer 2–3 interpretaciones posibles y pedir confirmación.

---

## 6) Definición de “breve”
El resumen final debe:
- Tener **20–40 líneas máx.** (salvo muchas sub-tareas)
- Usar bullets cortos, orientados a ejecución
- Checklist con criterios **concretos** (evitar “funciona bien”, “se ve ok”)

---

## Prompt listo (opcional)
Pegá esto tal cual cuando quieras correr el workflow:

> Ejecutá `/jira-start`. Si no te pasé un Jira ID/URL, pedímelo. Luego leé la tarea, sub-tareas y comentarios vía MCP de Jira, **contrastá lo pedido contra el codebase** (entrypoints, contratos y archivos reales) y devolveme un resumen en Markdown con: Alcance, Sub-tareas, Criterios de observación, Dependencias/Bloqueos, Links, Preguntas abiertas, **Contraste con codebase** y **Plan de implementación**.

---

## Regla de idioma
La conversación debe ser siempre en **español**, salvo que el usuario pida otro idioma.

---

## Flujo operativo (branch/PR/commits por sub-tarea)
1) Inicio  
   - Usuario ejecuta `/jira-dev-start <ISSUE>` (ej. ARARG-7225).  
   - Pedir reconectar MCP Atlassian; si falla lectura/transición, avisar y pedir que el usuario mueva la tarea.

2) Preparación de trabajo  
   - Verificar branch actual; si no es la correcta, informar y pedir confirmación antes de cambiar.  
   - Crear branch por tarea madre: `feature/<ISSUE>` (o `hotfix/...` si aplica).  
   - Crear PR en draft asociado a la tarea madre (desde esa branch).  
   - Commits serán por sub-tarea (ST): `feat(<SUBTASK>): ...` (o `chore/fix` si hotfix/bugfix).

3) Orden de ejecución  
   - Seguir el orden de sub-tareas según Jira. Si no hay sub-tareas, tratar la principal como unidad.

4) Tomar sub-tarea activa  
   - Mover issue principal y la ST activa a **In Progress** (si falla, pedir al usuario hacerlo).

5) Ejecución  
   - Ejecutar flujo estándar: leer Jira vía MCP, resumir, consensuar scope/AC, contrastar con codebase.

6) Cierre de sub-tarea  
   - Antes de cerrar, dejar comentario en la ST con evidencia/entregables + TL;DR de lo implementado.  
   - Con OK del usuario, hacer commit `feat(<SUBTASK>): ...` (o `chore/fix` si aplica).  
   - Mover la ST a **Done** (si falla transición, pedir al usuario moverla).

7) Loop  
   - Reconfirmar con el usuario si continuar con la siguiente ST; repetir pasos 4–6 en orden.

Ejemplos
- Branch (tarea madre): `feature/ARARG-7225`  
- PR Draft (tarea madre):  
  - Título: `ARARG-7225: <resumen>`  
  - Descripción:
    ```
    ## Resumen
    - Implementa <feature> para ARARG-7225

    ## Scope
    - <bullet>
    - <bullet>

    ## Tests
    - [ ] unit
    - [ ] e2e
    ```
- Commit por ST: `feat(ARARG-7229): add GET /users`  
- Comentario de cierre en ST ARARG-7229:  
  ```
  TL;DR: Se expuso GET /users con filtro por status y paginación.
  Evidencia:
  - Endpoint: GET /users?status=active&page=1&limit=50
  - Respuesta sample: { "data": [...], "page":1, "total":123 }
  - Tests: user.controller.spec GET /users (ok); e2e smoke (ok)
  ```
