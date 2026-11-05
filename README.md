# Plataforma de Cálculo Integral y Modelado Geométrico

Plataforma interactiva desarrollada para el análisis y evaluación de Cálculo Integral en el programa de Tecnología en Desarrollo de Software (Universidad Tecnológica de Pereira). El proyecto articula métodos numéricos, integración analítica, cálculo de áreas y volúmenes de sólidos tridimensionales mediante formulación rigurosa, desarrollo analítico y visualizaciones interactivas en 2D y 3D.

> **Nota:** La resolución manual sigue siendo indispensable. Esta plataforma corresponde al componente de software, visualización y análisis computacional.

---

## Módulos Desarrollados (14 de 14)

Todos los 14 módulos se encuentran completamente implementados y funcionales:

| Módulo | Tema | Enfoque y Contenido | Estado |
|---:|---|---|:---:|
| 1 | Sumas de Riemann | Aproximaciones izquierda, derecha y punto medio con rectángulos | **Completo** |
| 2 | Regla del Trapecio | Integración numérica aproximando curvas con segmentos lineales | **Completo** |
| 3 | Regla del Punto Medio | Evaluación en centros de subintervalos para curvas suaves | **Completo** |
| 4 | Regla de Simpson | Ponderación parabólica con número de intervalos par | **Completo** |
| 5 | Integral definida y área | Teorema Fundamental del Cálculo y área bajo la curva | **Completo** |
| 6 | Integración directa | Antiderivadas polinomiales, racionales y radicales | **Completo** |
| 7 | Integración Trigonométrica | Potencias impares/pares de senos y cosenos (\(\int \operatorname{sen}^3(2x)\cos^4(2x)dx\)) | **Completo** |
| 8 | Sustitución Trigonométrica | Formas radicales (\(\sqrt{a^2-x^2}, \sqrt{x^2+a^2}\)) con 5 ejercicios del taller | **Completo** |
| 9 | Sustitución Universal | Transformación de Weierstrass (\(z = \tan(x/2)\)) con 6 ejercicios resueltos | **Completo** |
| 10 | Áreas de Regiones Planas | Integración respecto a \(x\) y respecto a \(y\), intersecciones y simetría | **Completo** |
| 11 | Sólidos con Sección Conocida | Secciones perpendiculares equiláteras y cuadradas con **visualizador 3D** | **Completo** |
| 12 | Sólidos de Revolución · Discos | Rotación de \(y = 2-x^2\) alrededor de \(y = 1\) con **gráfico 3D rotatorio** | **Completo** |
| 13 | Sólidos de Revolución · Arandelas | Rotación de \(y = 4-x^2\) alrededor de \(y = 7\) con hueco interior en 3D | **Completo** |
| 14 | Sólidos de Revolución · Capas | Método de cascarones cilíndricos con giro en torno al eje vertical \(x = 3\) | **Completo** |

---

## Funcionalidades Principales

- **Cobertura completa del taller y parcial (Docier Marino Ceballos):** Cada módulo incluye los enunciados exactos, demostraciones algebraicas paso a paso y resultados analíticos finales.
- **Comandos GeoGebra 2D y 3D:** Códigos listos para copiar y ejecutar en GeoGebra Classic / GeoGebra 3D (`Curva`, `Superficie`, `IntegralEntre`, etc.).
- **Visualizadores 3D interactivos:** Superficies tridimensionales rotables en tiempo real generadas con Plotly (WebGL) para secciones transversales y sólidos de revolución (Discos, Arandelas, Capas Cilíndricas).
- **Renderizado de fórmulas con KaTeX:** Notación matemática tipográfica de alta fidelidad.
- **Diseño responsive con modo oscuro:** Adaptado a pantallas móviles, tabletas y ordenadores de escritorio.

---

## Arquitectura del Proyecto

```text
plataforma-calculo-integral-fase1/
├─ dist/
│  ├─ index.html                 # Interfaz principal unificada
│  ├─ styles.css                 # Estilos en modo oscuro, cajas GeoGebra y diseño responsive
│  ├─ app.js                     # Controlador general, cálculos, lógica analítica y visualizaciones 2D/3D
│  └─ modulos/
│     ├─ modulo-1/index.html     # Ruta directa Módulo 1 (Sumas de Riemann)
│     ├─ ...
│     └─ modulo-14/index.html    # Ruta directa Módulo 14 (Capas Cilíndricas)
├─ .openai/hosting.json          # Configuración de sitio estático
└─ README.md                     # Documentación técnica
```

---

## Tecnologías Utilizadas

| Herramienta | Aplicación |
|---|---|
| HTML5 / CSS3 | Interfaz semántica, layout responsive y diseño moderno |
| JavaScript (ES6+) | Lógica de cálculo, transformaciones paramétricas y parametrización de superficies 3D |
| Plotly.js | Renderizado de gráficas interactivas 2D y superficies 3D (WebGL) |
| KaTeX | Renderizado dinámico de fórmulas matemáticas y demostraciones |
| Git & GitHub | Control de versiones y despliegue continuo en GitHub Pages |

---

## Ejecución Local

1. Abre esta carpeta en Visual Studio Code.
2. Inicia con la extensión **Live Server** abriendo el archivo `dist/index.html`.
3. Navega por los 14 módulos directamente desde el menú lateral o seleccionando cada tema.

---

## Despliegue en GitHub Pages

1. Sube los cambios a la rama principal (`main`).
2. En GitHub ve a **Settings → Pages**.
3. Selecciona la rama `main` y la carpeta `/dist`.
4. La plataforma quedará pública automáticamente en la URL proporcionada por GitHub.
