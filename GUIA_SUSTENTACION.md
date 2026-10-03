# Guía de explicación y uso de la plataforma

Esta guía sirve para una exposición o video de sustentación de 5 a 10 minutos. El propósito no es leer cada texto de la pantalla, sino mostrar que se comprende la relación entre el cálculo integral y el software.

## Antes de iniciar

1. Abra el proyecto con Live Server desde Visual Studio Code.
2. Use la dirección local que abre el navegador, no el archivo con ruta `file://`.
3. Compruebe que haya conexión a internet, pues KaTeX y Plotly cargan las fórmulas y gráficas.
4. Abra primero el módulo 1 para que la demostración comience con un ejemplo visible.

## Recorrido recomendado para la exposición

### 1. Presentación de la plataforma — 30 segundos

Puede decir:

> Esta plataforma corresponde a la Fase 1 del proyecto de Cálculo Integral. Está construida con HTML, CSS y JavaScript; utiliza KaTeX para fórmulas y Plotly para las gráficas interactivas.

Señale el título, el distintivo **Fase 1** y el menú lateral.

### 2. Explicar la organización — 1 minuto

1. Muestre el menú lateral.
2. Explique que existen **14 módulos**, uno por cada contenido del taller.
3. Indique que los módulos 1 a 6 están desarrollados en esta fase.
4. Haga clic en un módulo posterior, por ejemplo **Exponenciales**, para enseñar el mensaje “Próximamente — Fase 2”.
5. Regrese a **Módulo 1 — Sumas de Riemann**.

Puede decir:

> La arquitectura está preparada para crecer: cada módulo tiene su propia ruta y los contenidos posteriores ya están reservados sin romper la navegación.

### 3. Demostración principal: módulo 1 — 2 a 3 minutos

#### Contexto matemático

Lea o explique brevemente la fórmula mostrada. La idea central es aproximar una integral definida mediante rectángulos.

> Para aproximar el área bajo una curva, dividimos el intervalo en subintervalos. A mayor número de subintervalos, normalmente obtenemos una aproximación más cercana al valor exacto.

#### Ejemplo: aproximar \(\int_0^2 x^2\,dx\)

1. En el panel **Explorador: \(f(x)=x^2\)**, confirme los valores:
   - Subintervalos `n = 4`
   - Límite inferior `a = 0`
   - Límite superior `b = 2`
2. Pulse **Actualizar visualización**.
3. Señale los rectángulos y la curva azul de la gráfica.
4. Lea el resultado mostrado debajo de los controles.

Explicación sugerida:

> El programa usa \(f(x)=x^2\) en el intervalo de 0 a 2. Con cuatro subintervalos, el ancho es \(\Delta x=(2-0)/4=0.5\). El software evalúa los puntos medios, suma las áreas de los rectángulos y muestra la aproximación. También compara el resultado con el valor exacto \(8/3\), obtenido por integración directa.

5. Cambie `n` de `4` a `12` y pulse nuevamente **Actualizar visualización**.
6. Compare visualmente los rectángulos: ahora son más angostos y se ajustan mejor a la curva.

Conclusión sugerida:

> Este control permite observar la convergencia: al aumentar \(n\), la aproximación numérica se acerca al resultado de la integral definida.

### 4. Recorrido rápido por otros módulos — 1 a 2 minutos

Haga clic en los módulos 2, 4, 5 y 6, explicando una idea por pantalla:

- **Trapecio:** reemplaza los rectángulos por trapecios construidos sobre la curva.
- **Simpson:** usa parábolas y exige un número par de subintervalos.
- **Integral definida y área:** permite ajustar los límites de integración y visualizar el área bajo \(f(x)=x^2\). Mencione que el ejemplo explica además el área entre \(y=x^2\) y \(y=2x\).
- **Integración directa:** relaciona la función con una antiderivada; cambie el selector para mostrar un caso diferente.

### 5. Cierre técnico — 45 segundos

Puede decir:

> Separé la interfaz en HTML, los estilos responsive en CSS y los cálculos con gráficas en JavaScript. Plotly genera los visualizadores y KaTeX presenta las fórmulas. La plataforma está lista para continuar con los módulos de las Fases 2 y 3, y puede desplegarse con GitHub Pages.

## Recomendaciones para el video

- Aparezca en cámara durante la presentación inicial.
- Comparta pantalla con el navegador a una resolución legible.
- No memorice el texto literalmente: use esta guía como estructura.
- Muestre al menos un cambio real de valor, por ejemplo `n=4` a `n=12`.
- Explique qué representa el resultado matemático; no se limite a presionar botones.
- Cierre indicando cómo esta Fase 1 se conecta con los módulos futuros.

## Lista de comprobación previa

- [ ] Live Server abierto y URL local funcionando.
- [ ] Internet disponible para Plotly y KaTeX.
- [ ] Módulo 1 listo en pantalla.
- [ ] Ejemplo \(a=0\), \(b=2\), \(n=4\) preparado.
- [ ] README disponible para mostrar arquitectura y herramientas.
- [ ] Enlace de GitHub Pages preparado si ya existe el despliegue.

