# Plataforma de Cálculo Integral y Modelado Geométrico

Aplicación web interactiva para el análisis matemático, métodos numéricos de integración, resolución analítica paso a paso y modelado geométrico en 2D y 3D.

---

## Características Principales

- **14 Módulos Interactivos:** Cobertura desde aproximaciones numéricas básicas hasta sólidos de revolución tridimensionales.
- **Modo Personalizado en Tiempo Real:** Permite modificar funciones, coeficientes, límites de integración y ejes de rotación para recalcular y visualizar ejemplos propios de manera instantánea.
- **Modelado 3D Interactivo:** Gráficos tridimensionales rotables y escalables mediante WebGL (Plotly.js) para secciones transversales conocidas, discos, arandelas y capas cilíndricas.
- **Formulación Tipográfica Rigurosa:** Renderizado matemático de alta fidelidad con KaTeX para todas las demostraciones analíticas.
- **Arquitectura Ligera y Modular:** Frontend basado en estándares web nativos sin dependencias de compilación, optimizado para ejecución local o despliegue estático.

---

## Módulos de la Aplicación

| # | Módulo | Descripción / Capacidades | Visualización |
|:---:|---|---|:---:|
| **1** | **Sumas de Riemann** | Aproximaciones por extremos y punto medio con número variable de rectángulos \(n\). | 2D Dinámico |
| **2** | **Regla del Trapecio** | Integración numérica aproximando curvas con segmentos lineales. | 2D Dinámico |
| **3** | **Regla del Punto Medio** | Evaluación en centros de subintervalos para curvas suaves. | 2D Dinámico |
| **4** | **Regla de Simpson** | Ponderación parabólica de alta precisión para subintervalos pares. | 2D Dinámico |
| **5** | **Integral Definida y Área** | Teorema Fundamental del Cálculo y cálculo de áreas bajo la curva. | 2D Sombreado |
| **6** | **Integración Directa** | Comparación gráfica interactiva entre funciones elementales y sus antiderivadas. | 2D Doble Curva |
| **7** | **Integración Trigonométrica** | Resolución analítica de potencias \(\operatorname{sen}^m(kx)\cos^n(kx)\) y personalizador de exponentes. | 2D + Cálculo |
| **8** | **Sustitución Trigonométrica** | Transformaciones de formas radicales (\(\sqrt{a^2-x^2}\), \(\sqrt{x^2+a^2}\)) con generador de raíces. | 2D Comparativo |
| **9** | **Sustitución Universal** | Transformación de Weierstrass (\(z = \tan(x/2)\)) con calculadora de coeficientes propios. | 2D Funcional |
| **10** | **Áreas de Regiones Planas** | Delimitación de regiones e integración respecto a \(x\) y respecto a \(y\). | 2D Región |
| **11** | **Sólidos con Sección Conocida** | Modelado de volúmenes con secciones equiláteras o circulares perpendiculares a la base. | **3D Superficie** |
| **12** | **Sólidos de Revolución · Discos** | Generación de sólidos continuos mediante rotación alrededor de ejes horizontales. | **3D Rotatorio** |
| **13** | **Sólidos de Revolución · Arandelas** | Modelado de sólidos con cavidad interna mediante rotación con respecto a ejes externos. | **3D Doble Capa** |
| **14** | **Sólidos de Revolución · Capas** | Método de cascarones cilíndricos paralelos a un eje de revolución vertical. | **3D Cascarón** |

---

## Tecnologías

- **HTML5 & CSS3:** Arquitectura semántica, variables CSS para modo oscuro y diseño responsive.
- **JavaScript (ES6+):** Motor de cálculo numérico, derivación analítica y parametrización de superficies.
- **Plotly.js (WebGL):** Renderizado de superficies tridimensionales y gráficos analíticos interactivos.
- **KaTeX:** Renderizado rápido de expresiones matemáticas LaTeX.

---

## Estructura del Proyecto

```text
plataforma-calculo-integral-fase1/
├─ dist/
│  ├─ index.html                 # Interfaz principal unificada
│  ├─ styles.css                 # Estilos en modo oscuro y layout responsive
│  ├─ app.js                     # Motor de cálculo, rutas y renderizado 2D/3D
│  └─ modulos/
│     ├─ modulo-1/index.html     # Ruta directa Módulo 1
│     ├─ ...
│     └─ modulo-14/index.html    # Ruta directa Módulo 14
└─ README.md                     # Documentación técnica
```

---

## Ejecución Local

1. Clona o descarga el repositorio:
   ```bash
   git clone https://github.com/Damahibe/plataforma-calculo-integral-fase1.git
   ```
2. Inicia un servidor local en el directorio `dist`:
   ```bash
   python3 -m http.server 8080 --directory dist
   ```
3. Abre en tu navegador:
   ```text
   http://localhost:8080
   ```
   *(También compatible directamente con la extensión **Live Server** de VS Code).*
