# Evaluación de Código - Prueba Técnica (Romario)

## Resumen General
El código de Romario presenta una estructura orientada a objetos (clases estáticas) y utiliza correctamente la sintaxis de módulos (ESM). A simple vista parece ordenado, pero contiene **errores lógicos severos** que harán que la mayoría de los endpoints fallen o se comporten incorrectamente.

## Fallos Críticos (Blockers)

### 1. Mapeo de Rutas Incorrecto (`src/routes/forex.js`)
- **Error**: Copiar y pegar indiscriminado. Todos los endpoints apuntan al mismo método del controlador.
  - `/forex/historical` -> llama a `getForexLatest`
  - `/forex/convert` -> llama a `getForexLatest`
- **Resultado**: Solo funciona el endpoint `latest`. Los otros dos ejecutarán la lógica equivocada.

### 2. Desajuste de Parámetros Controlador <-> Servicio
- **Definición**: En `FrankFurterService.getForexLatest`, se espera un *objeto* desestructurado: `static async getForexLatest({ base = "EUR", symbols })`.
- **Llamada**: Desde el controlador, se pasan argumentos *posicionales*: `FrankFurterService.getForexLatest(base, symbols)`.
- **Consecuencia**: El servicio recibirá `base` (string) donde espera un objeto, intentará hacer destructuring y fallará o usará valores por defecto incorrectos.

### 3. Uso Incorrecto de `res` en la Capa de Servicio
- **Violación de Capas**: Los servicios (`FrankFurterService`) intentan acceder al objeto `res` (respuesta HTTP) para enviar errores o respuestas JSON (`res.status(...)`, `res.json(...)`).
- **Crash**: El objeto `res` **no está definido** en el ámbito del servicio. Esto provocará un `ReferenceError` inmediato al invocar `getForexHistorical` o `convert`.
- **Corrección**: El servicio debe retornar datos o lanzar excepciones; el controlador es quien debe manejar `res`.

### 4. Controlador `convert` incompleto
- **Error**: El método `ForexController.convert` ejecuta la lógica y tiene un `return result;` al final, pero **nunca envía la respuesta** al cliente (falta `res.json(...)`).
- **Resultado**: La petición HTTP se quedará colgada (timeout) esperando respuesta.

## Otros Detalles

### Dependencies
- **Innecesarias**: Se incluyen paquetes como `npm` e `install` en `dependencies` del `package.json`. No afectan el funcionamiento pero demuestran falta de limpieza.

### Estructura
- El uso de un archivo `environment.js` para centralizar variables de entorno es una buena práctica.

---

## Puntuación Detallada

| Categoría | Criterio | Puntos Obtenidos (Máx) | Notas |
| :--- | :--- | :---: | :--- |
| **Funcional (80)** | Endpoint `/latest` | 10 / 30 | Funciona pero ignora parámetros por desajuste controlador-servicio. |
| | Endpoint `/historical` | 0 / 30 | Llama al método de `latest`. |
| | Endpoint `/convert` | 0 / 20 | Llama al método de `latest` y/o provoca crash por uso de variable indefinida. |
| **Técnico (20)** | Manejo de Errores | 0 / 10 | Provoca crashes no manejados (ReferenceError). |
| | Variables de Entorno | 5 / 5 | Implementado correctamente. |
| | Calidad de Código | 5 / 5 | Estructura visualmente limpia y uso de ESM. |
| **Bonus (20)** | Cache/Validación/Logs | 0 / 20 | No implementados. |
| **TOTAL** | | **20 / 120** | ❌ **No Aprobado** |

---

## Conclusión
Aunque la sintaxis es moderna y la estructura de archivos es correcta, la lógica interna está rota en casi todos los flujos. El candidato intentó modularizar pero falló en la comunicación entre estas capas (Controller vs Service) y en la configuración básica de Express.

### Pasos para Arreglarlo
1.  **Rutas**: Apuntar cada ruta a su método de controlador correspondiente.
2.  **Firmas de Métodos**: Alinear cómo el controlador llama al servicio (pasar objeto o cambiar servicio a argumentos posicionales).
3.  **Refactorizar Servicio**: Eliminar todas las referencias a `res` dentro de `FrankFurterService`. Retornar los datos puros.
4.  **Controlador**: Asegurar que todos los métodos envíen respuesta con `res.json()`.
