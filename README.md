# Plataforma web de Cálculo Integral — Fase 1

Plataforma web interactiva desarrollada como apoyo para la evaluación parcial de Cálculo Integral del programa de Tecnología en Desarrollo de Software. Esta primera fase articula métodos numéricos, área bajo la curva e integración directa mediante explicaciones, ejemplos y visualizaciones.

> Importante: el taller de cálculo debe resolverse manualmente. Esta plataforma corresponde únicamente al componente de desarrollo de software.

## Objetivo

Construir una base modular de 14 contenidos que pueda crecer durante el semestre. En esta entrega se desarrollan los módulos 1 a 6 y se reservan los módulos 7 a 14 para las siguientes fases.

## Módulos

| Módulo | Tema | Estado en Fase 1 |
|---:|---|---|
| 1 | Sumas de Riemann | Desarrollado |
| 2 | Regla del Trapecio | Desarrollado |
| 3 | Regla del Punto Medio | Desarrollado |
| 4 | Regla de Simpson | Desarrollado |
| 5 | Integral definida y área bajo la curva | Desarrollado |
| 6 | Integración directa | Desarrollado |
| 7–10 | Sustitución, exponenciales, logarítmicas y trigonométricas | Próximamente — Fase 2 |
| 11–14 | Trigonométricas inversas, hiperbólicas inversas, trinomios y partes | Próximamente — Fase 3 |

## Funcionalidades implementadas

- Navegación a los 14 módulos mediante rutas independientes.
- Diseño adaptable para computador, tableta y celular.
- Renderizado de expresiones matemáticas con KaTeX.
- Visualizadores interactivos de Riemann, trapecio, punto medio y Simpson.
- Ajuste de límites y gráfica del área bajo la curva.
- Ejemplos resueltos paso a paso para los módulos de Fase 1.
- Gráficas comparativas de una función y su antiderivada.
- Páginas placeholder para los módulos aún no desarrollados.

## Arquitectura del proyecto

```text
plataforma-calculo-fase1/
├─ dist/
│  ├─ index.html                 # Interfaz principal
│  ├─ styles.css                 # Estilos responsive en modo oscuro
│  ├─ app.js                     # Lógica, cálculos y visualizaciones
│  └─ modulos/
│     ├─ modulo-1/index.html     # Sumas de Riemann
│     ├─ ...
│     └─ modulo-14/index.html    # Integración por partes
├─ .openai/hosting.json          # Configuración de sitio estático
└─ README.md
```

Las rutas de cada módulo cargan la interfaz principal con el contenido correspondiente. Esta decisión mantiene una experiencia visual consistente mientras permite ampliar cada módulo sin alterar la navegación general.

## Tecnologías utilizadas

| Herramienta | Uso en el proyecto |
|---|---|
| HTML5 | Estructura y contenido de la interfaz |
| CSS3 | Diseño responsive, modo oscuro y accesibilidad visual |
| JavaScript | Navegación, cálculos y actualización dinámica de resultados |
| Plotly.js | Gráficas y visualizaciones interactivas |
| KaTeX | Renderizado de fórmulas matemáticas |
| Google Colab | Espacio sugerido para documentar pruebas numéricas con Python |
| GitHub / GitHub Pages | Control de versiones y despliegue propuesto |

## Ejecución local

1. Abra esta carpeta en Visual Studio Code.
2. Instale la extensión **Live Server**.
3. Abra `dist/index.html`.
4. Seleccione **Go Live** o **Open with Live Server**.
5. Visite la dirección local indicada por la extensión, normalmente `http://127.0.0.1:5500/dist/index.html`.

Se requiere conexión a internet para cargar Plotly.js y KaTeX desde sus CDN.

## Despliegue en GitHub Pages

1. Cree un repositorio en GitHub y suba el contenido de esta carpeta.
2. En GitHub, abra **Settings → Pages**.
3. Elija la rama `main` y la carpeta `/dist` como origen de publicación.
4. Guarde los cambios y espere la URL pública de GitHub Pages.
5. Incluya esa URL en la entrega de Google Classroom.

## Contribución y mantenimiento

1. Cree una rama por módulo o mejora.
2. Mantenga la lógica matemática documentada en `app.js`.
3. Pruebe los controles, la visualización y el diseño responsive antes de integrar cambios.
4. Conserve las fórmulas en notación KaTeX cuando se añadan nuevos contenidos.
5. Actualice esta documentación cuando se desarrolle un módulo de Fase 2 o Fase 3.

## Uso de IA y trazabilidad

La evaluación permite el uso de IA en el componente de software, siempre que se documente. Para esta plataforma se utilizaron herramientas de asistencia de programación para estructurar HTML, CSS, JavaScript, visualizaciones y documentación. Antes de entregar, el estudiante debe revisar el código, comprender los cálculos y registrar cualquier herramienta adicional utilizada.

## Entregables asociados

- Enlace al repositorio GitHub.
- Enlace a la aplicación desplegada en GitHub Pages u otra plataforma.
- README con arquitectura y guía de contribución.
- Video de sustentación de 5 a 10 minutos, mostrando la navegación, los módulos desarrollados y las decisiones técnicas.

