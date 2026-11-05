# Guía de Sustentación: Plataforma de Cálculo Integral (Hasta Sólidos de Revolución)

Esta guía sirve como guion para una exposición o video de sustentación de 5 a 10 minutos. Su propósito es evidenciar el dominio tanto del **componente matemático** (Docier Marino Ceballos) como del **componente de desarrollo de software y visualización interactiva**.

---

## 1. Introducción y Contexto (1 minuto)

> *"Buenas tardes profesor y compañeros. Presento la plataforma interactiva de Cálculo Integral desarrollada para el programa de Tecnología en Desarrollo de Software. El proyecto cubre de manera integral los 14 módulos de la materia, desde los métodos numéricos de aproximación e integración directa, pasando por técnicas avanzadas de integración trigonométrica y universal, hasta el cálculo de áreas y el modelado tridimensional de sólidos de revolución."*

**Puntos a señalar en pantalla:**
1. El encabezado con el distintivo **"Hasta Sólidos de Revolución"**.
2. El menú lateral que contiene los **14 módulos completamente desarrollados**.
3. La coherencia estética en modo oscuro, renderizado de fórmulas con **KaTeX** y gráficos dinámicos con **Plotly**.

---

## 2. Recorrido Rápido por Métodos Numéricos (Módulos 1 al 6) (1.5 minutos)

- **Módulo 1 (Sumas de Riemann):** Muestra cómo al variar \(n\) de 4 a 12 los rectángulos de punto medio convergen al valor exacto \(8/3 \approx 2.6667\).
- **Módulos 2 al 4 (Trapecio, Punto Medio y Simpson):** Explica brevemente la diferencia entre aproximación lineal y parabólica.
- **Módulos 5 y 6 (Área bajo la curva e Integración directa):** Aplicación directa del Teorema Fundamental del Cálculo.

---

## 3. Demostración de Técnicas Avanzadas de Integración (Módulos 7 al 9) (2 minutos)

### Módulo 7: Integración Trigonométrica
- Muestra la demostración de:
  $$\int \operatorname{sen}^{3}(2x)\cos^{4}(2x) dx = -\frac{\cos^5(2x)}{10} + \frac{\cos^7(2x)}{14} + C$$
- Explica los 4 pasos: separación de potencia impar, identidad pitagórica, cambio de variable \(u = \cos(2x)\) y retorno a \(x\).
- Muestra la gráfica comparativa y los comandos GeoGebra vinculados.

### Módulo 8: Sustitución Trigonométrica
- Muestra el selector con los 5 ejercicios del taller (formas \(\sqrt{a^2-x^2}\), \(\sqrt{x^2+a^2}\)).
- Destaca cómo el software dibuja tanto la curva original como la antiderivada.

### Módulo 9: Sustitución Universal (Weierstrass)
- Explica la utilidad de la transformación \(z = \tan(x/2)\) para convertir integrales racionales trigonométricas en fracciones algebraicas simples.
- Muestra cualquiera de los 6 ejercicios resueltos paso a paso.

---

## 4. Demostración Principal: Áreas y Sólidos de Revolución (Módulos 10 al 14) (3 minutos)

Esta es la sección más visual y de mayor impacto técnico:

### Módulo 10: Áreas de Regiones Planas
- Selecciona el **Ejercicio 2** (\(x = \sqrt{y}\), \(x = 2-y\), \(y = 0\)).
- Explica por qué es más sencillo integrar respecto a \(y\) (franjas horizontales) desde \(y = 0\) hasta \(y = 1\), obteniendo \(5/6 \text{ u}^2\).
- Señala el gráfico con la región delimitada sombreada en azul.

### Módulo 11: Sólidos con Sección Conocida (Visualización 3D)
- Selecciona el **Ejercicio 1** (base circular \(x^2+y^2=1\) con secciones transversales que son triángulos equiláteros).
- Rota el gráfico 3D con el ratón para mostrar la forma del prisma curvo.
- Explica la fórmula \(A(x) = \sqrt{3}(1-x^2)\) y el volumen obtenido: \(\frac{4\sqrt{3}}{3} \text{ u}^3\).

### Módulos 12, 13 y 14: Sólidos de Revolución (Discos, Arandelas y Capas Cilíndricas)
1. **Módulo 12 (Discos):**
   - Región \(y = 2-x^2\) girando alrededor de la recta \(y = 1\).
   - Volumen: \(\frac{16\pi}{15} \text{ u}^3\).
   - Muestra el modelo 3D de revolución completa rotando sobre el eje dorado \(y = 1\).
2. **Módulo 13 (Arandelas):**
   - Región \(y = 4-x^2\) girando alrededor de \(y = 7\).
   - Volumen: \(\frac{576\pi}{5} \text{ u}^3\).
   - Rota el modelo 3D para enseñar la superficie externa y la cavidad o túnel interno generado.
3. **Módulo 14 (Capas Cilíndricas):**
   - Misma región base girando alrededor del eje vertical \(x = 3\).
   - Volumen: \(64\pi \text{ u}^3\).
   - Explica cómo el método de capas cilíndricas evita despejar raíces complicadas integrando franjas verticales paralelas al eje de giro.

---

## 5. Cierre Técnico (30 segundos)

> *"Como conclusión, la plataforma no solo automatiza la verificación numérica de los ejercicios propuestos en el taller y parcial, sino que proporciona una herramienta didáctica e interactiva mediante modelos paramétricos 3D en WebGL y fórmulas tipográficas con KaTeX. Todo el código se encuentra versionado en Git y listo para su consulta y despliegue."*

---

## Lista de Comprobación para la Grabación

- [ ] Abrir el proyecto en el navegador vía Live Server (`http://127.0.0.1:5500/dist/index.html`).
- [ ] Verificar conexión a internet para cargar KaTeX y Plotly.
- [ ] Probar la rotación de los modelos 3D con el ratón antes de grabar.
- [ ] Mantener un tono claro, pausado y seguro.
