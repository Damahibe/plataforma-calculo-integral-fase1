const modules = [
  ['Sumas de Riemann', 'Aproximaciones izquierda, derecha y punto medio mediante rectángulos.', 'riemann'],
  ['Regla del Trapecio', 'Una aproximación que une los puntos de la curva con segmentos.', 'trap'],
  ['Regla del Punto Medio', 'Rectángulos construidos desde el valor central de cada intervalo.', 'mid'],
  ['Regla de Simpson', 'Aproximación con parábolas; el número de subintervalos debe ser par.', 'simpson'],
  ['Integral definida y área', 'El Teorema Fundamental del Cálculo convierte acumulación en evaluación.', 'area'],
  ['Integración directa', 'Antiderivadas elementales y su interpretación gráfica.', 'direct'],
  ['Integración Trigonométrica', 'Potencias impares y pares de senos y cosenos mediante identidades pitagóricas.', 'trig'],
  ['Sustitución Trigonométrica', 'Resolución de integrales con radicales mediante triángulos rectángulos.', 'trigsub'],
  ['Sustitución Universal', 'Transformación de Weierstrass z = tan(x/2) para integrales racionales trigonométricas.', 'universal'],
  ['Áreas de Regiones Planas', 'Cálculo de área encerrada entre curvas respecto al eje X y respecto al eje Y.', 'planearea'],
  ['Sólidos con Sección Conocida', 'Cálculo del volumen sumando rebanadas transversales (triángulos, cuadrados).', 'crosssection'],
  ['Sólidos de Revolución · Discos', 'Volumen por rotación alrededor de rectas sin hueco interior (Método de Discos).', 'disks'],
  ['Sólidos de Revolución · Arandelas', 'Volumen por rotación con hueco interior respecto al eje (Método de Arandelas).', 'washers'],
  ['Sólidos de Revolución · Capas Cilíndricas', 'Volumen con franjas paralelas al eje de rotación (Cascarones cilíndricos).', 'shells']
];

let current = 0;
const $ = s => document.querySelector(s);
const f = x => x * x;

function nav() {
  $('#moduleNav').innerHTML = modules.map((m, i) => `
    <a class="module ${i === current ? 'active' : ''}" style="text-decoration:none" href="modulos/modulo-${i + 1}/index.html">
      ${i + 1}. ${m[0]}
      <small>Disponible</small>
    </a>
  `).join('');
}

function control(extra = '') {
  return `<div class="controls">
    <label>Subintervalos n<input id="n" type="number" min="2" max="60" step="1" value="${extra === 'simpson' ? 8 : 6}"></label>
    <label>Límite inferior a<input id="a" type="number" value="0"></label>
    <label>Límite superior b<input id="b" type="number" value="2"></label>
    <button id="go">Actualizar visualización</button>
  </div>`;
}

function values(a, b, n) {
  let h = (b - a) / n, x = Array.from({ length: n + 1 }, (_, i) => a + i * h);
  return {
    x, h,
    left: x.slice(0, -1).reduce((s, v) => s + f(v) * h, 0),
    right: x.slice(1).reduce((s, v) => s + f(v) * h, 0),
    mid: Array.from({ length: n }, (_, i) => f(a + (i + .5) * h) * h).reduce((s, v) => s + v, 0)
  };
}

function plotNumerical(type) {
  let a = +$('#a').value, b = +$('#b').value, n = +$('#n').value;
  if (!(b > a && n > 0)) return;
  if (type === 'simpson' && n % 2) { n++; $('#n').value = n; }
  let v = values(a, b, n),
      pts = Array.from({ length: 241 }, (_, i) => a + (b - a) * i / 240),
      data = [{ x: pts, y: pts.map(f), mode: 'lines', line: { color: '#0b3558', width: 3 }, name: 'f(x)=x²' }],
      shapes = [];
  for (let i = 0; i < n; i++) {
    let x0 = v.x[i], x1 = v.x[i + 1], m = (x0 + x1) / 2;
    if (type === 'riemann') {
      let y = f(m);
      shapes.push({ type: 'rect', x0, x1, y0: 0, y1: y, fillcolor: 'rgba(243,184,75,.38)', line: { color: '#c58b1b' } });
    } else if (type === 'mid') {
      let y = f(m);
      shapes.push({ type: 'rect', x0, x1, y0: 0, y1: y, fillcolor: 'rgba(14,107,115,.25)', line: { color: '#0e6b73' } });
    } else if (type === 'trap') {
      data.push({ x: [x0, x1], y: [f(x0), f(x1)], mode: 'lines', line: { color: '#f3b84b', width: 2 }, showlegend: false });
    } else {
      let coef = [f(x0), f(m), f(x1)];
      data.push({
        x: Array.from({ length: 15 }, (_, j) => x0 + (x1 - x0) * j / 14),
        y: Array.from({ length: 15 }, (_, j) => {
          let t = j / 14;
          return coef[0] * (2 * t * t - 3 * t + 1) + coef[1] * 4 * t * (1 - t) + coef[2] * (2 * t * t - t);
        }),
        mode: 'lines', line: { color: '#f3b84b', width: 2 }, showlegend: false
      });
    }
  }
  let approx = type === 'riemann' ? v.mid : type === 'mid' ? v.mid : type === 'trap'
    ? v.h * (.5 * f(a) + v.x.slice(1, -1).reduce((s, x) => s + f(x), 0) + .5 * f(b))
    : v.h / 3 * (f(a) + f(b) + v.x.slice(1, -1).reduce((s, x, i) => s + (i % 2 ? 4 : 2) * f(x), 0));
  $('#result').textContent = `Aproximación: ${approx.toFixed(6)} · valor exacto de ∫x² dx: ${((b ** 3 - a ** 3) / 3).toFixed(6)}`;
  Plotly.newPlot('plot', data, {
    margin: { t: 28, l: 48, r: 12, b: 42 },
    font: { color: '#f5f5f7' },
    xaxis: { title: 'x', gridcolor: '#3a3a3c' },
    yaxis: { title: 'f(x)', gridcolor: '#3a3a3c' },
    shapes, showlegend: true, paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e'
  }, { responsive: true });
}

function numerical(kind) {
  let names = { riemann: 'Sumas de Riemann', trap: 'Regla del Trapecio', mid: 'Regla del Punto Medio', simpson: 'Regla de Simpson' },
      theory = {
        riemann: 'Divide [a,b] en partes iguales. En esta demostración se usan rectángulos de punto medio; cambia n y observa cómo mejora la aproximación.',
        trap: 'Cada subintervalo se reemplaza por un trapecio. La suma pondera los valores interiores dos veces.',
        mid: 'Cada rectángulo tiene altura f((xᵢ₋₁+xᵢ)/2). Suele ser más preciso que los extremos para curvas suaves.',
        simpson: 'Simpson combina valores en extremos, índices pares e impares. Requiere n par y aproxima cada tramo mediante una parábola.'
      };
  let formula = kind === 'trap' ? '\\(T_n=\\frac{\\Delta x}{2}[f(x_0)+2\\sum f(x_i)+f(x_n)]\\)' : kind === 'simpson' ? '\\(S_n=\\frac{\\Delta x}{3}[f(x_0)+4\\sum_{i\\,impar}f(x_i)+2\\sum_{i\\,par}f(x_i)+f(x_n)]\\)' : '\\(M_n=\\Delta x\\sum f(\\bar{x}_i),\\;\\bar{x}_i=\\frac{x_{i-1}+x_i}{2}\\)';
  $('#content').innerHTML = `<div class="grid"><article class="card"><span class="tag">Idea clave</span><h3>${names[kind]}</h3><p>${theory[kind]}</p><div class="formula">${formula}</div><h3>Ejemplos resueltos</h3><ol class="steps"><li><strong>Ejemplo 1: \(\\int_0^2x^2dx\).</strong> Tome \(n=4\), \(\\Delta x=1/2\), evalúe los nodos (o puntos medios) y multiplique la suma por \(1/2\). Compare con el valor exacto \(8/3\).</li><li><strong>Ejemplo 2: \(\\int_0^1e^x dx\).</strong> Divida en \(n\) partes, construya la tabla \(x_i,f(x_i)\), aplique los pesos del método y contraste con \(e-1\).</li></ol></article><article class="card"><h3>Explorador: \(f(x)=x^2\)</h3>${control(kind)}<p class="result" id="result"></p></article><article class="card wide"><div id="plot" class="plot" aria-label="Gráfica interactiva"></div></article></div>`;
  $('#go').onclick = () => plotNumerical(kind);
  plotNumerical(kind);
}

function area() {
  $('#content').innerHTML = `<div class="grid"><article class="card"><span class="tag">Teorema Fundamental</span><h3>De antiderivada a área</h3><p>Si \(F'(x)=f(x)\), entonces \(\\int_a^b f(x)dx=F(b)-F(a)\). Cuando f es negativa, el área geométrica exige integrar \(|f(x)|\).</p><div class="formula">\(A=\\int_a^b|f(x)-g(x)|dx\)</div><h3>Ejemplos resueltos</h3><ol class="steps"><li><strong>Área bajo curva:</strong> \(\\int_0^2(3x^2-2x+1)dx=[x^3-x^2+x]_0^2=6\).</li><li><strong>Entre curvas:</strong> \(x^2=2x\\Rightarrow x=0,2\). En \([0,2]\), \(2x\\ge x^2\); por tanto \(A=\\int_0^2(2x-x^2)dx=4/3\).</li></ol></article><article class="card"><h3>Ajuste los límites</h3>${control()}<p class="result" id="result"></p></article><article class="card wide"><div id="plot" class="plot"></div></article></div>`;
  function go() {
    let a = +$('#a').value, b = +$('#b').value;
    if (b <= a) return;
    let xs = Array.from({ length: 240 }, (_, i) => a + (b - a) * i / 239);
    let exact = (b ** 3 - a ** 3) / 3;
    $('#result').textContent = `Integral firmada para f(x)=x²: ${exact.toFixed(6)}`;
    Plotly.newPlot('plot', [{ x: xs, y: xs.map(f), fill: 'tozeroy', line: { color: '#64d2ff' }, fillcolor: 'rgba(10,132,255,.32)', name: 'Área bajo x²' }], {
      margin: { t: 28, l: 48, r: 12, b: 42 },
      font: { color: '#f5f5f7' },
      xaxis: { title: 'x', gridcolor: '#3a3a3c' },
      yaxis: { title: 'f(x)', gridcolor: '#3a3a3c' },
      paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e'
    }, { responsive: true });
  }
  $('#go').onclick = go;
  go();
}

function direct() {
  $('#content').innerHTML = `<div class="grid"><article class="card"><span class="tag">Antiderivadas</span><h3>Integración directa</h3><p>Se integra término a término y se añade la constante C. Una verificación útil consiste en derivar el resultado.</p><div class="formula">\(\\int x^n dx=\\frac{x^{n+1}}{n+1}+C\), \(n\\ne-1\)<br>\(\\int dx/x=\\ln|x|+C\)</div><h3>Tres ejemplos resueltos</h3><ol class="steps"><li>\(\\int(3/x^2-9\\sqrt{x})dx=\\int(3x^{-2}-9x^{1/2})dx=-3/x-6x^{3/2}+C\).</li><li>\(\\int(x+4\\sqrt{x}-4/x)dx=x^2/2+(8/3)x^{3/2}-4\\ln|x|+C\).</li><li>\(\\int(x-1)(x+1)dx=\\int(x^2-1)dx=x^3/3-x+C\).</li></ol></article><article class="card"><h3>Función y antiderivada</h3><p>Selecciona un caso y compara \(f(x)\) con una antiderivada \(F(x)\).</p><div class="controls"><label>Ejemplo<select id="case"><option value="power">f(x)=x²</option><option value="linear">f(x)=2x+1</option><option value="root">f(x)=√x</option></select></label><button id="go">Mostrar gráficas</button></div><p class="result" id="result"></p></article><article class="card wide"><div id="plot" class="plot"></div></article></div>`;
  function go() {
    let c = $('#case').value, fun, F, text;
    c === 'power' ? (fun = x => x * x, F = x => x ** 3 / 3, text = 'F(x)=x³/3 + C') : c === 'linear' ? (fun = x => 2 * x + 1, F = x => x * x + x, text = 'F(x)=x²+x+C') : (fun = x => Math.sqrt(Math.max(0, x)), F = x => 2 * Math.max(0, x) ** 1.5 / 3, text = 'F(x)=2x³ᐟ²/3+C');
    let xs = Array.from({ length: 240 }, (_, i) => -1 + 4 * i / 239);
    $('#result').textContent = text;
    Plotly.newPlot('plot', [{ x: xs, y: xs.map(fun), name: 'f(x)', line: { color: '#64d2ff', width: 3 } }, { x: xs, y: xs.map(F), name: 'F(x)', line: { color: '#ffd60a', width: 3 } }], {
      margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' }, paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
    }, { responsive: true });
  }
  $('#go').onclick = go;
  go();
}

/* ==========================================================================
   MÓDULO 7: Integración Trigonométrica (Potencias de Seno y Coseno)
   ========================================================================== */
function trig() {
  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Sección I — Taller</span>
        <h3>Demostración de Integral Trigonométrica</h3>
        <p>Integrales de la forma \(\\int \\operatorname{sen}^m(kx) \\cos^n(kx) dx\) donde al menos una potencia es impar.</p>
        <div class="formula">
          $$\\int \\operatorname{sen}^{3}(2x) \\cos^{4}(2x) \\, dx = -\\frac{\\cos^{5}(2x)}{10} + \\frac{\\cos^{7}(2x)}{14} + C$$
        </div>
        <h3>Procedimiento resuelto paso a paso</h3>
        <ol class="steps">
          <li><strong>Separar la potencia impar del seno:</strong><br>
            \(\\int \\operatorname{sen}^{3}(2x) \\cos^{4}(2x) dx = \\int \\operatorname{sen}^{2}(2x) \\cos^{4}(2x) \\operatorname{sen}(2x) dx\)
          </li>
          <li><strong>Aplicar identidad pitagórica (\(\\operatorname{sen}^2(2x) = 1 - \\cos^2(2x)\)):</strong><br>
            \(= \\int (1 - \\cos^2(2x)) \\cos^4(2x) \\operatorname{sen}(2x) dx\)
          </li>
          <li><strong>Sustitución simple:</strong><br>
            Sea \(u = \\cos(2x) \\implies du = -2\\operatorname{sen}(2x) dx \\implies -\\frac{du}{2} = \\operatorname{sen}(2x) dx\)<br>
            \(= \\int (1 - u^2) u^4 \\left(-\\frac{du}{2}\\right) = -\\frac{1}{2} \\int (u^4 - u^6) du\)
          </li>
          <li><strong>Integrar y regresar a \(x\):</strong><br>
            \(= -\\frac{1}{2} \\left[ \\frac{u^5}{5} - \\frac{u^7}{7} \\right] + C = -\\frac{\\cos^5(2x)}{10} + \\frac{\\cos^7(2x)}{14} + C\)
          </li>
        </ol>
        <div class="geogebra-box">
          <span class="title">Comandos GeoGebra</span>
          <code>f(x) = (sin(2x))^3 * (cos(2x))^4</code>
          <code>F(x) = -(cos(2x))^5 / 10 + (cos(2x))^7 / 14</code>
        </div>
      </article>

      <article class="card">
        <span class="tag">Explorador Interactivo</span>
        <h3>Comportamiento de \(f(x)\) y su Antiderivada \(F(x)\)</h3>
        <p>Ajusta el rango para evaluar la integral definida \(\\int_a^b \\operatorname{sen}^3(2x)\\cos^4(2x) dx = F(b) - F(a)\).</p>
        <div class="controls">
          <label>Límite inferior a<input id="a" type="number" step="0.1" value="0"></label>
          <label>Límite superior b<input id="b" type="number" step="0.1" value="1.57"></label>
          <button id="go">Calcular y Graficar</button>
        </div>
        <p class="result" id="result"></p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot"></div>
      </article>
    </div>
  `;

  function go() {
    let a = +$('#a').value, b = +$('#b').value;
    let fTrig = x => Math.pow(Math.sin(2 * x), 3) * Math.pow(Math.cos(2 * x), 4);
    let FTrig = x => -Math.pow(Math.cos(2 * x), 5) / 10 + Math.pow(Math.cos(2 * x), 7) / 14;
    let xMin = Math.min(a, b) - 0.5, xMax = Math.max(a, b) + 0.5;
    let xs = Array.from({ length: 300 }, (_, i) => xMin + (xMax - xMin) * i / 299);
    let val = FTrig(b) - FTrig(a);
    $('#result').textContent = `Valor exacto ∫ f(x)dx en [${a}, ${b}]: ${val.toFixed(6)}`;
    
    let xArea = Array.from({ length: 150 }, (_, i) => a + (b - a) * i / 149);
    Plotly.newPlot('plot', [
      { x: xs, y: xs.map(fTrig), name: 'f(x) = sen³(2x)cos⁴(2x)', line: { color: '#64d2ff', width: 2.5 } },
      { x: xs, y: xs.map(FTrig), name: 'F(x) antiderivada', line: { color: '#ffd60a', width: 2.5 } },
      { x: xArea, y: xArea.map(fTrig), fill: 'tozeroy', fillcolor: 'rgba(100, 210, 255, 0.28)', mode: 'none', name: 'Área en [a,b]' }
    ], {
      margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
      xaxis: { title: 'x (rad)', gridcolor: '#3a3a3c' },
      yaxis: { title: 'y', gridcolor: '#3a3a3c' },
      paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
    }, { responsive: true });
  }

  $('#go').onclick = go;
  go();
}

/* ==========================================================================
   MÓDULO 8: Sustitución Trigonométrica (Radicales)
   ========================================================================== */
function trigsub() {
  const cases = [
    {
      id: 1,
      title: 'Ejercicio 1: Integral con (4 - x²)^(3/2)',
      formula: '$$\\int \\frac{dx}{(4 - x^2)^{3/2}} = \\frac{x}{4\\sqrt{4 - x^2}} + C$$',
      steps: [
        '<strong>Sustitución trigonométrica:</strong> Sea \\(x = 2\\operatorname{sen}\\theta \\implies dx = 2\\cos\\theta d\\theta\\), con \\((4-x^2)^{3/2} = (2\\cos\\theta)^3 = 8\\cos^3\\theta\\).',
        '<strong>Simplificar e integrar:</strong> \\(\\int \\frac{2\\cos\\theta d\\theta}{8\\cos^3\\theta} = \\frac{1}{4}\\int \\sec^2\\theta d\\theta = \\frac{1}{4}\\tan\\theta + C\\).',
        '<strong>Retorno a variable original x:</strong> Como \\(\\operatorname{sen}\\theta = x/2\\), por triángulo rectángulo el cateto adyacente es \\(\\sqrt{4-x^2}\\), luego \\(\\tan\\theta = \\frac{x}{\\sqrt{4-x^2}}\\). Resultado final: \\(\\frac{x}{4\\sqrt{4-x^2}} + C\\).'
      ],
      geogebra: ['f(x) = 1 / (4 - x^2)^(3/2)', 'F(x) = x / (4 * sqrt(4 - x^2))'],
      f: x => 1 / Math.pow(4 - x * x, 1.5),
      F: x => x / (4 * Math.sqrt(4 - x * x)),
      range: [-1.8, 1.8]
    },
    {
      id: 2,
      title: 'Ejercicio 2: Integral con √(25 - x²) / x',
      formula: '$$\\int \\frac{\\sqrt{25 - x^2}}{x} \\, dx = 5 \\ln\\left|\\frac{5 - \\sqrt{25 - x^2}}{x}\\right| + \\sqrt{25 - x^2} + C$$',
      steps: [
        '<strong>Sustitución trigonométrica:</strong> Sea \\(x = 5\\operatorname{sen}\\theta \\implies dx = 5\\cos\\theta d\\theta\\), y \\(\\sqrt{25 - x^2} = 5\\cos\\theta\\).',
        '<strong>Simplificar e integrar:</strong> \\(\\int \\frac{5\\cos\\theta}{5\\operatorname{sen}\\theta}(5\\cos\\theta d\\theta) = 5\\int \\frac{\\cos^2\\theta}{\\operatorname{sen}\\theta} d\\theta = 5\\int (\\csc\\theta - \\operatorname{sen}\\theta) d\\theta = 5\\ln|\\csc\\theta - \\cot\\theta| + 5\\cos\\theta + C\\).',
        '<strong>Retornar a x:</strong> Con \\(\\operatorname{sen}\\theta = x/5\\), \\(\\csc\\theta = 5/x\\), \\(\\cot\\theta = \\frac{\\sqrt{25-x^2}}{x}\\), y \\(5\\cos\\theta = \\sqrt{25-x^2}\\).'
      ],
      geogebra: ['f(x) = sqrt(25 - x^2) / x', 'F(x) = 5 * ln(abs((5 - sqrt(25 - x^2)) / x)) + sqrt(25 - x^2)'],
      f: x => Math.sqrt(25 - x * x) / x,
      F: x => 5 * Math.log(Math.abs((5 - Math.sqrt(25 - x * x)) / x)) + Math.sqrt(25 - x * x),
      range: [0.3, 4.8]
    },
    {
      id: 3,
      title: 'Ejercicio 3: Integral con 1 / (x² √(a² - x²)) (a = 3)',
      formula: '$$\\int \\frac{dx}{x^2\\sqrt{a^2 - x^2}} = -\\frac{\\sqrt{a^2 - x^2}}{a^2 x} + C$$',
      steps: [
        '<strong>Sustitución trigonométrica:</strong> Sea \\(x = a\\operatorname{sen}\\theta \\implies dx = a\\cos\\theta d\\theta\\), \\(\\sqrt{a^2-x^2} = a\\cos\\theta\\).',
        '<strong>Simplificar e integrar:</strong> \\(\\int \\frac{a\\cos\\theta d\\theta}{(a^2\\operatorname{sen}^2\\theta)(a\\cos\\theta)} = \\frac{1}{a^2}\\int \\csc^2\\theta d\\theta = -\\frac{1}{a^2}\\cot\\theta + C\\).',
        '<strong>Retorno a x:</strong> Como \\(\\operatorname{sen}\\theta = x/a\\), \\(\\cot\\theta = \\frac{\\sqrt{a^2-x^2}}{x}\\). Con \\(a = 3\\): \\(-\\frac{\\sqrt{9-x^2}}{9x} + C\\).'
      ],
      geogebra: ['a = 3', 'f(x) = 1 / (x^2 * sqrt(a^2 - x^2))', 'F(x) = -sqrt(a^2 - x^2) / (a^2 * x)'],
      f: x => 1 / (x * x * Math.sqrt(9 - x * x)),
      F: x => -Math.sqrt(9 - x * x) / (9 * x),
      range: [0.4, 2.8]
    },
    {
      id: 4,
      title: 'Ejercicio 4: Integral con √(x² + 4)',
      formula: '$$\\int \\sqrt{x^2 + 4} \\, dx = \\frac{x\\sqrt{x^2 + 4}}{2} + 2\\ln\\left(x + \\sqrt{x^2 + 4}\\right) + C$$',
      steps: [
        '<strong>Sustitución trigonométrica:</strong> Caso \\(\\sqrt{x^2 + a^2}\\). Sea \\(x = 2\\tan\\theta \\implies dx = 2\\sec^2\\theta d\\theta\\), y \\(\\sqrt{x^2+4} = 2\\sec\\theta\\).',
        '<strong>Simplificar e integrar:</strong> \\(\\int (2\\sec\\theta)(2\\sec^2\\theta d\\theta) = 4\\int \\sec^3\\theta d\\theta\\). Usando integración por partes para secante cúbica: \\(2\\sec\\theta\\tan\\theta + 2\\ln|\\sec\\theta + \\tan\\theta| + C_1\\).',
        '<strong>Retornar a x:</strong> Reemplazando \\(\\tan\\theta = x/2\\) y \\(\\sec\\theta = \\frac{\\sqrt{x^2+4}}{2}\\).'
      ],
      geogebra: ['f(x) = sqrt(x^2 + 4)', 'F(x) = (x * sqrt(x^2 + 4)) / 2 + 2 * ln(x + sqrt(x^2 + 4))'],
      f: x => Math.sqrt(x * x + 4),
      F: x => (x * Math.sqrt(x * x + 4)) / 2 + 2 * Math.log(x + Math.sqrt(x * x + 4)),
      range: [-4, 4]
    },
    {
      id: 5,
      title: 'Ejercicio 5: Integral con x² / (a² - x²)^(3/2) (a = 3)',
      formula: '$$\\int \\frac{x^2 \\, dx}{(a^2 - x^2)^{3/2}} = \\frac{x}{\\sqrt{a^2 - x^2}} - \\operatorname{arcsen}\\left(\\frac{x}{a}\\right) + C$$',
      steps: [
        '<strong>Sustitución trigonométrica:</strong> Sea \\(x = a\\operatorname{sen}\\theta \\implies dx = a\\cos\\theta d\\theta\\), \\((a^2 - x^2)^{3/2} = a^3\\cos^3\\theta\\).',
        '<strong>Simplificar e integrar:</strong> \\(\\int \\frac{(a^2\\operatorname{sen}^2\\theta)(a\\cos\\theta d\\theta)}{a^3\\cos^3\\theta} = \\int \\tan^2\\theta d\\theta = \\int (\\sec^2\\theta - 1) d\\theta = \\tan\\theta - \\theta + C\\).',
        '<strong>Retornar a x:</strong> Como \\(\\operatorname{sen}\\theta = x/a\\), \\(\\theta = \\operatorname{arcsen}(x/a)\\) y \\(\\tan\\theta = \\frac{x}{\\sqrt{a^2-x^2}}\\).'
      ],
      geogebra: ['a = 3', 'f(x) = x^2 / (a^2 - x^2)^(3/2)', 'F(x) = x / sqrt(a^2 - x^2) - asin(x / a)'],
      f: x => (x * x) / Math.pow(9 - x * x, 1.5),
      F: x => x / Math.sqrt(9 - x * x) - Math.asin(x / 3),
      range: [-2.6, 2.6]
    }
  ];

  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Parte A: Tarea Inicial</span>
        <h3 id="exTitle"></h3>
        <div class="formula" id="exFormula"></div>
        <h3>Desarrollo analítico completo</h3>
        <ol class="steps" id="exSteps"></ol>
        <div class="geogebra-box" id="exGeogebra"></div>
      </article>

      <article class="card">
        <span class="tag">Explorador Interactivo</span>
        <h3>Selecciona el Ejercicio del Parcial</h3>
        <div class="controls">
          <label style="width:100%">Ejercicio a explorar:
            <select id="exSelect" class="case-select">
              ${cases.map((c, i) => `<option value="${i}">${c.title}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="result" id="exRes"></p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot"></div>
      </article>
    </div>
  `;

  function update() {
    let idx = +$('#exSelect').value;
    let item = cases[idx];
    $('#exTitle').textContent = item.title;
    $('#exFormula').innerHTML = item.formula;
    $('#exSteps').innerHTML = item.steps.map(s => `<li>${s}</li>`).join('');
    $('#exGeogebra').innerHTML = `
      <span class="title">Comandos GeoGebra</span>
      ${item.geogebra.map(c => `<code>${c}</code>`).join('')}
    `;
    $('#exRes').textContent = `Gráfica comparativa de f(x) y antiderivada F(x)`;

    let [rMin, rMax] = item.range;
    let xs = Array.from({ length: 240 }, (_, i) => rMin + (rMax - rMin) * i / 239);
    Plotly.newPlot('plot', [
      { x: xs, y: xs.map(item.f), name: 'f(x) Integrando', line: { color: '#64d2ff', width: 2.5 } },
      { x: xs, y: xs.map(item.F), name: 'F(x) Antiderivada', line: { color: '#ffd60a', width: 2.5 } }
    ], {
      margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
      xaxis: { title: 'x', gridcolor: '#3a3a3c' },
      yaxis: { title: 'y', gridcolor: '#3a3a3c' },
      paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
    }, { responsive: true });

    math();
  }

  $('#exSelect').onchange = update;
  update();
}

/* ==========================================================================
   MÓDULO 9: Sustitución Universal (Método de Weierstrass)
   ========================================================================== */
function universal() {
  const cases = [
    {
      id: 1,
      title: 'Ejercicio 1: ∫ dx / (1 - 2 sen x)',
      formula: '$$\\int \\frac{dx}{1 - 2\\operatorname{sen}x} = \\frac{\\sqrt{3}}{3} \\ln\\left|\\frac{\\tan(x/2) - 2 - \\sqrt{3}}{\\tan(x/2) - 2 + \\sqrt{3}}\\right| + C$$',
      steps: [
        '<strong>Sustituir y completar el cuadrado:</strong> Con \\(\\operatorname{sen}x = \\frac{2z}{1+z^2}\\) y \\(dx = \\frac{2dz}{1+z^2}\\):<br>\\(\\int \\frac{\\frac{2dz}{1+z^2}}{1 - \\frac{4z}{1+z^2}} = \\int \\frac{2dz}{z^2 - 4z + 1} = 2\\int \\frac{dz}{(z-2)^2 - (\\sqrt{3})^2}\\).',
        '<strong>Integrar y retornar a x:</strong><br>\\(= 2\\cdot \\frac{1}{2\\sqrt{3}}\\ln\\left|\\frac{z - 2 - \\sqrt{3}}{z - 2 + \\sqrt{3}}\\right| + C = \\frac{\\sqrt{3}}{3}\\ln\\left|\\frac{\\tan(x/2) - 2 - \\sqrt{3}}{\\tan(x/2) - 2 + \\sqrt{3}}\\right| + C\\).'
      ],
      geogebra: ['f(x) = 1 / (1 - 2*sin(x))', 'F(x) = (sqrt(3)/3) * ln(abs((tan(x/2) - 2 - sqrt(3)) / (tan(x/2) - 2 + sqrt(3))))'],
      f: x => 1 / (1 - 2 * Math.sin(x)),
      F: x => (Math.sqrt(3) / 3) * Math.log(Math.abs((Math.tan(x / 2) - 2 - Math.sqrt(3)) / (Math.tan(x / 2) - 2 + Math.sqrt(3)))),
      range: [-1.2, 0.4]
    },
    {
      id: 2,
      title: 'Ejercicio 2: ∫ dx / (2 - cos x)',
      formula: '$$\\int \\frac{dx}{2 - \\cos x} = \\frac{2}{\\sqrt{3}} \\arctan\\left(\\sqrt{3}\\tan\\frac{x}{2}\\right) + C$$',
      steps: [
        '<strong>Sustituir y simplificar:</strong> Con \\(\\cos x = \\frac{1-z^2}{1+z^2}\\):<br>\\(\\int \\frac{\\frac{2dz}{1+z^2}}{2 - \\frac{1-z^2}{1+z^2}} = \\int \\frac{2dz}{2(1+z^2)-(1-z^2)} = \\int \\frac{2dz}{3z^2 + 1}\\).',
        '<strong>Integrar con cambio de variable:</strong> Sea \\(w = \\sqrt{3}z \\implies dw = \\sqrt{3}dz\\):<br>\\(= \\frac{2}{\\sqrt{3}}\\int \\frac{dw}{w^2+1} = \\frac{2}{\\sqrt{3}}\\arctan(w) + C = \\frac{2}{\\sqrt{3}}\\arctan\\left(\\sqrt{3}\\tan\\frac{x}{2}\\right) + C\\).'
      ],
      geogebra: ['f(x) = 1 / (2 - cos(x))', 'F(x) = (2 / sqrt(3)) * atan(sqrt(3) * tan(x/2))'],
      f: x => 1 / (2 - Math.cos(x)),
      F: x => (2 / Math.sqrt(3)) * Math.atan(Math.sqrt(3) * Math.tan(x / 2)),
      range: [-3, 3]
    },
    {
      id: 3,
      title: 'Ejercicio 3: ∫ dx / (3 + 5 sen x)',
      formula: '$$\\int \\frac{dx}{3 + 5\\operatorname{sen}x} = \\frac{1}{4} \\ln\\left|\\frac{3\\tan(x/2) + 1}{\\tan(x/2) + 3}\\right| + C$$',
      steps: [
        '<strong>Fracciones parciales en z:</strong> \\(\\int \\frac{2dz}{3z^2 + 10z + 3} = \\int \\frac{2dz}{(3z+1)(z+3)}\\).',
        'Descomposición: \\(\\frac{2}{(3z+1)(z+3)} = \\frac{3/4}{3z+1} - \\frac{1/4}{z+3}\\).',
        '<strong>Integrar:</strong> \\(= \\frac{1}{4}\\ln|3z+1| - \\frac{1}{4}\\ln|z+3| + C = \\frac{1}{4}\\ln\\left|\\frac{3\\tan(x/2)+1}{\\tan(x/2)+3}\\right| + C\\).'
      ],
      geogebra: ['f(x) = 1 / (3 + 5*sin(x))', 'F(x) = (1/4) * ln(abs((3*tan(x/2) + 1) / (tan(x/2) + 3)))'],
      f: x => 1 / (3 + 5 * Math.sin(x)),
      F: x => 0.25 * Math.log(Math.abs((3 * Math.tan(x / 2) + 1) / (Math.tan(x / 2) + 3))),
      range: [-0.5, 2.5]
    },
    {
      id: 4,
      title: 'Ejercicio 4: ∫ dx / (5 + 3 sen x)',
      formula: '$$\\int \\frac{dx}{5 + 3\\operatorname{sen}x} = \\frac{1}{2} \\arctan\\left(\\frac{3 + 5\\tan(x/2)}{4}\\right) + C$$',
      steps: [
        '<strong>Sustituir y completar trinomio:</strong> \\(\\int \\frac{2dz}{5z^2 + 6z + 5} = \\int \\frac{10dz}{25z^2 + 30z + 25} = \\int \\frac{10dz}{(5z+3)^2 + 4^2}\\).',
        '<strong>Integrar:</strong> Sea \\(u = 5z+3 \\implies du = 5dz\\):<br>\\(= \\int \\frac{2du}{u^2 + 4^2} = \\frac{2}{4}\\arctan\\left(\\frac{u}{4}\\right) + C = \\frac{1}{2}\\arctan\\left(\\frac{3 + 5\\tan(x/2)}{4}\\right) + C\\).'
      ],
      geogebra: ['f(x) = 1 / (5 + 3*sin(x))', 'F(x) = (1/2) * atan((3 + 5*tan(x/2)) / 4)'],
      f: x => 1 / (5 + 3 * Math.sin(x)),
      F: x => 0.5 * Math.atan((3 + 5 * Math.tan(x / 2)) / 4),
      range: [-3, 3]
    },
    {
      id: 5,
      title: 'Ejercicio 5: ∫ dx / (sen x - cos x - 1)',
      formula: '$$\\int \\frac{dx}{\\operatorname{sen}x - \\cos x - 1} = \\ln\\left|\\tan\\left(\\frac{x}{2}\\right) - 1\\right| + C$$',
      steps: [
        '<strong>Sustituir y simplificar denominador:</strong><br>\\(\\int \\frac{2dz}{2z - (1-z^2) - (1+z^2)} = \\int \\frac{2dz}{2z - 2} = \\int \\frac{dz}{z-1}\\).',
        '<strong>Integrar directamente:</strong> \\(= \\ln|z - 1| + C = \\ln\\left|\\tan(x/2) - 1\\right| + C\\).'
      ],
      geogebra: ['f(x) = 1 / (sin(x) - cos(x) - 1)', 'F(x) = ln(abs(tan(x/2) - 1))'],
      f: x => 1 / (Math.sin(x) - Math.cos(x) - 1),
      F: x => Math.log(Math.abs(Math.tan(x / 2) - 1)),
      range: [-1.2, 1.4]
    },
    {
      id: 6,
      title: 'Ejercicio 6: ∫ sen x / (1 + sen² x) dx',
      formula: '$$\\int \\frac{\\operatorname{sen}x}{1 + \\operatorname{sen}^2 x} \\, dx = \\frac{\\sqrt{2}}{4} \\ln\\left|\\frac{\\tan^2(x/2) + 3 - 2\\sqrt{2}}{\\tan^2(x/2) + 3 + 2\\sqrt{2}}\\right| + C$$',
      steps: [
        '<strong>Reescribir denominador:</strong> \\(1 + \\operatorname{sen}^2 x = 2 - \\cos^2 x\\). Sustituir \\(u = \\cos x \\implies du = -\\operatorname{sen}x dx\\):<br>\\(\\int \\frac{-du}{2 - u^2} = \\int \\frac{du}{u^2 - (\\sqrt{2})^2} = \\frac{\\sqrt{2}}{4}\\ln\\left|\\frac{\\sqrt{2}-\\cos x}{\\sqrt{2}+\\cos x}\\right| + C_1\\).',
        '<strong>Transformar a tan(x/2) con \\(\\cos x = \\frac{1-z^2}{1+z^2}\\):</strong><br>Reemplazando y absorbiendo la constante se obtiene: \\(\\frac{\\sqrt{2}}{4}\\ln\\left|\\frac{z^2 + 3 - 2\\sqrt{2}}{z^2 + 3 + 2\\sqrt{2}}\\right| + C\\).'
      ],
      geogebra: ['f(x) = sin(x) / (1 + (sin(x))^2)', 'F(x) = (sqrt(2)/4) * ln(abs(((tan(x/2))^2 + 3 - 2*sqrt(2)) / ((tan(x/2))^2 + 3 + 2*sqrt(2))))'],
      f: x => Math.sin(x) / (1 + Math.sin(x) * Math.sin(x)),
      F: x => (Math.sqrt(2) / 4) * Math.log(Math.abs((Math.pow(Math.tan(x / 2), 2) + 3 - 2 * Math.sqrt(2)) / (Math.pow(Math.tan(x / 2), 2) + 3 + 2 * Math.sqrt(2)))),
      range: [-2.8, 2.8]
    }
  ];

  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Parte B: Sustitución Universal</span>
        <h3 id="uTitle"></h3>
        <div class="formula">
          $$z = \\tan\\left(\\frac{x}{2}\\right), \\quad \\operatorname{sen}x = \\frac{2z}{1+z^2}, \\quad \\cos x = \\frac{1-z^2}{1+z^2}, \\quad dx = \\frac{2dz}{1+z^2}$$
        </div>
        <div class="formula" id="uFormula"></div>
        <h3>Procedimiento detallado</h3>
        <ol class="steps" id="uSteps"></ol>
        <div class="geogebra-box" id="uGeogebra"></div>
      </article>

      <article class="card">
        <span class="tag">Explorador Interactivo</span>
        <h3>Selecciona el Ejercicio (1 al 6)</h3>
        <div class="controls">
          <label style="width:100%">Caso a visualizar:
            <select id="uSelect" class="case-select">
              ${cases.map((c, i) => `<option value="${i}">${c.title}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="result" id="uRes"></p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot"></div>
      </article>
    </div>
  `;

  function update() {
    let idx = +$('#uSelect').value;
    let item = cases[idx];
    $('#uTitle').textContent = item.title;
    $('#uFormula').innerHTML = item.formula;
    $('#uSteps').innerHTML = item.steps.map(s => `<li>${s}</li>`).join('');
    $('#uGeogebra').innerHTML = `
      <span class="title">Comandos GeoGebra</span>
      ${item.geogebra.map(c => `<code>${c}</code>`).join('')}
    `;
    $('#uRes').textContent = `Gráfica interactiva del integrando y su solución analítica`;

    let [rMin, rMax] = item.range;
    let xs = Array.from({ length: 240 }, (_, i) => rMin + (rMax - rMin) * i / 239);
    Plotly.newPlot('plot', [
      { x: xs, y: xs.map(item.f), name: 'f(x)', line: { color: '#64d2ff', width: 2.5 } },
      { x: xs, y: xs.map(item.F), name: 'F(x)', line: { color: '#ffd60a', width: 2.5 } }
    ], {
      margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
      xaxis: { title: 'x (rad)', gridcolor: '#3a3a3c' },
      yaxis: { title: 'y', gridcolor: '#3a3a3c' },
      paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
    }, { responsive: true });

    math();
  }

  $('#uSelect').onchange = update;
  update();
}

/* ==========================================================================
   MÓDULO 10: Áreas de Regiones Planas
   ========================================================================== */
function planearea() {
  const cases = [
    {
      id: 2,
      title: 'Ejercicio 2: Área entre x = √y, x = 2 - y y el eje X',
      badge: 'Respuesta: 5/6 u²',
      steps: [
        '<strong>Intersecciones (con \\(y \\ge 0\\)):</strong><br>\\(\\sqrt{y} = 2 - y \\implies y = (2-y)^2 = y^2 - 4y + 4 \\implies y^2 - 5y + 4 = 0\\).<br>Raíces \\(y = 1\\) y \\(y = 4\\). Al verificar en \\(\\sqrt{y} = 2-y\\), solo cumple \\(y = 1\\) (punto \\((1,1)\\)). Con el eje X (\\(y=0\\)), las curvas cortan en \\(x=0\\) y \\(x=2\\).',
        '<strong>Planteamiento respecto a y:</strong><br>Curva derecha \\(x_D = 2 - y\\), curva izquierda \\(x_I = y^{1/2}\\) desde \\(y = 0\\) hasta \\(y = 1\\):<br>\\(A = \\int_0^1 [(2 - y) - y^{1/2}] dy = \\left[ 2y - \\frac{y^2}{2} - \\frac{2}{3}y^{3/2} \\right]_0^1 = 2 - \\frac{1}{2} - \\frac{2}{3} = \\frac{5}{6} \\text{ u}^2\\).'
      ],
      geogebra: ['f(x) = Si(x >= 0, x^2)', 'g(x) = 2 - x', 'Región: (y >= 0) && (x >= sqrt(y)) && (x <= 2 - y)'],
      plot: () => {
        let ys = Array.from({ length: 150 }, (_, i) => i / 149);
        let xRight = ys.map(y => 2 - y);
        let xLeft = ys.map(y => Math.sqrt(y));
        return {
          data: [
            { x: xRight, y: ys, name: 'x = 2 - y', line: { color: '#ffd60a', width: 2.5 } },
            { x: xLeft, y: ys, name: 'x = √y', line: { color: '#64d2ff', width: 2.5 } },
            { x: xLeft.concat(xRight.reverse()), y: ys.concat(ys.slice().reverse()), fill: 'toself', fillcolor: 'rgba(10, 132, 255, 0.35)', mode: 'none', name: 'Región R (5/6 u²)' }
          ],
          xaxis: { title: 'x', range: [-0.2, 2.5] },
          yaxis: { title: 'y', range: [-0.2, 1.5] }
        };
      }
    },
    {
      id: 4,
      title: 'Ejercicio 4: Área entre x = y² y x = 2 - y²',
      badge: 'Respuesta: 8/3 u²',
      steps: [
        '<strong>Intersecciones:</strong> \\(y^2 = 2 - y^2 \\implies 2y^2 = 2 \\implies y = -1, \\; y = 1\\). Los puntos de corte son \\((1, -1)\\) y \\((1, 1)\\).',
        '<strong>Planteamiento e integración (simetría par):</strong><br>Curva derecha \\(x = 2 - y^2\\), curva izquierda \\(x = y^2\\):<br>\\(A = \\int_{-1}^1 [(2 - y^2) - y^2] dy = 2\\int_0^1 (2 - 2y^2) dy = 2\\left[ 2y - \\frac{2y^3}{3} \\right]_0^1 = 2\\left(2 - \\frac{2}{3}\\right) = \\frac{8}{3} \\text{ u}^2\\).'
      ],
      geogebra: ['ec1: x = y^2', 'ec2: x = 2 - y^2', 'Región: y^2 <= x <= 2 - y^2'],
      plot: () => {
        let ys = Array.from({ length: 200 }, (_, i) => -1.3 + 2.6 * i / 199);
        let yBounded = Array.from({ length: 150 }, (_, i) => -1 + 2 * i / 149);
        return {
          data: [
            { x: ys.map(y => y * y), y: ys, name: 'x = y²', line: { color: '#64d2ff', width: 2.5 } },
            { x: ys.map(y => 2 - y * y), y: ys, name: 'x = 2 - y²', line: { color: '#ffd60a', width: 2.5 } },
            { x: yBounded.map(y => y * y).concat(yBounded.slice().reverse().map(y => 2 - y * y)), y: yBounded.concat(yBounded.slice().reverse()), fill: 'toself', fillcolor: 'rgba(10, 132, 255, 0.35)', mode: 'none', name: 'Área (8/3 u²)' }
          ],
          xaxis: { title: 'x', range: [-0.3, 2.5] },
          yaxis: { title: 'y', range: [-1.4, 1.4] }
        };
      }
    },
    {
      id: 6,
      title: 'Ejercicio 6: Área entre y = x² y y = 2/(x² + 1)',
      badge: 'Respuesta: π - 2/3 ≈ 2.4749 u²',
      steps: [
        '<strong>Intersecciones:</strong><br>\\(x^2 = \\frac{2}{x^2 + 1} \\implies x^4 + x^2 - 2 = 0 \\implies (x^2 + 2)(x^2 - 1) = 0 \\implies x = -1, \\; x = 1\\).',
        '<strong>Planteamiento e integración (simetría par):</strong><br>\\(A = \\int_{-1}^1 \\left(\\frac{2}{x^2 + 1} - x^2\\right) dx = 2\\int_0^1 \\left(\\frac{2}{x^2 + 1} - x^2\\right) dx\\)<br>\\(= 2\\left[ 2\\arctan(x) - \\frac{x^3}{3} \\right]_0^1 = 2\\left(2\\cdot\\frac{\\pi}{4} - \\frac{1}{3}\\right) = \\pi - \\frac{2}{3} \\approx 2.4749 \\text{ u}^2\\).'
      ],
      geogebra: ['f(x) = x^2', 'g(x) = 2 / (x^2 + 1)', 'Área = IntegralEntre(g, f, -1, 1)'],
      plot: () => {
        let xs = Array.from({ length: 200 }, (_, i) => -1.8 + 3.6 * i / 199);
        let xBounded = Array.from({ length: 150 }, (_, i) => -1 + 2 * i / 149);
        return {
          data: [
            { x: xs, y: xs.map(x => x * x), name: 'y = x²', line: { color: '#64d2ff', width: 2.5 } },
            { x: xs, y: xs.map(x => 2 / (x * x + 1)), name: 'y = 2/(x²+1)', line: { color: '#ffd60a', width: 2.5 } },
            { x: xBounded.concat(xBounded.slice().reverse()), y: xBounded.map(x => x * x).concat(xBounded.slice().reverse().map(x => 2 / (x * x + 1))), fill: 'toself', fillcolor: 'rgba(10, 132, 255, 0.35)', mode: 'none', name: 'Área (π - 2/3 u²)' }
          ],
          xaxis: { title: 'x', range: [-2, 2] },
          yaxis: { title: 'y', range: [-0.2, 2.5] }
        };
      }
    },
    {
      id: 8,
      title: 'Ejercicio 8: Área entre x = y² y x = 3 - 2y²',
      badge: 'Respuesta: 4 u²',
      steps: [
        '<strong>Intersecciones:</strong> \\(y^2 = 3 - 2y^2 \\implies 3y^2 = 3 \\implies y = -1, \\; y = 1\\). Cortes en \\((1,-1)\\) y \\((1,1)\\).',
        '<strong>Planteamiento respecto a y:</strong><br>\\(A = \\int_{-1}^1 [(3 - 2y^2) - y^2] dy = 2\\int_0^1 (3 - 3y^2) dy = 2\\left[ 3y - y^3 \\right]_0^1 = 2(3 - 1) = 4 \\text{ u}^2\\).'
      ],
      geogebra: ['ec1: x = y^2', 'ec2: x = 3 - 2y^2', 'Región: y^2 <= x <= 3 - 2y^2'],
      plot: () => {
        let ys = Array.from({ length: 200 }, (_, i) => -1.4 + 2.8 * i / 199);
        let yBounded = Array.from({ length: 150 }, (_, i) => -1 + 2 * i / 149);
        return {
          data: [
            { x: ys.map(y => y * y), y: ys, name: 'x = y²', line: { color: '#64d2ff', width: 2.5 } },
            { x: ys.map(y => 3 - 2 * y * y), y: ys, name: 'x = 3 - 2y²', line: { color: '#ffd60a', width: 2.5 } },
            { x: yBounded.map(y => y * y).concat(yBounded.slice().reverse().map(y => 3 - 2 * y * y)), y: yBounded.concat(yBounded.slice().reverse()), fill: 'toself', fillcolor: 'rgba(10, 132, 255, 0.35)', mode: 'none', name: 'Área (4 u²)' }
          ],
          xaxis: { title: 'x', range: [-0.2, 3.5] },
          yaxis: { title: 'y', range: [-1.5, 1.5] }
        };
      }
    },
    {
      id: 10,
      title: 'Ejercicio 10: Área de un Círculo de Radio R',
      badge: 'Respuesta: π R²',
      steps: [
        '<strong>Ecuación y simetría:</strong> De \\(x^2 + y^2 = R^2 \\implies y = \\sqrt{R^2 - x^2}\\). Multiplicando por 4 el primer cuadrante:<br>\\(A = 4\\int_0^R \\sqrt{R^2 - x^2} dx\\).',
        '<strong>Sustitución trigonométrica:</strong> Sea \\(x = R\\operatorname{sen}\\theta \\implies dx = R\\cos\\theta d\\theta\\), con \\(\\theta \\in [0, \\pi/2]\\):<br>\\(A = 4\\int_0^{\\pi/2} (R\\cos\\theta)(R\\cos\\theta d\\theta) = 4R^2\\int_0^{\\pi/2} \\frac{1 + \\cos(2\\theta)}{2} d\\theta\\)<br>\\(= 2R^2 \\left[ \\theta + \\frac{\\operatorname{sen}(2\\theta)}{2} \\right]_0^{\\pi/2} = 2R^2 \\left(\\frac{\\pi}{2} + 0\\right) = \\pi R^2 \\text{ u}^2\\).'
      ],
      geogebra: ['R = 3', 'f(x) = sqrt(R^2 - x^2)', 'g(x) = -sqrt(R^2 - x^2)', 'Área = IntegralEntre(f, g, -R, R)'],
      plot: () => {
        let R = 3;
        let ts = Array.from({ length: 200 }, (_, i) => 2 * Math.PI * i / 199);
        return {
          data: [
            { x: ts.map(t => R * Math.cos(t)), y: ts.map(t => R * Math.sin(t)), fill: 'toself', fillcolor: 'rgba(10, 132, 255, 0.35)', line: { color: '#64d2ff', width: 2.5 }, name: 'Círculo R=3 (Área = 9π ≈ 28.27 u²)' }
          ],
          xaxis: { title: 'x', range: [-3.8, 3.8] },
          yaxis: { title: 'y', range: [-3.8, 3.8] }
        };
      }
    }
  ];

  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 3: Áreas de Regiones Planas</span>
        <h3 id="aTitle"></h3>
        <span class="badge-sol" id="aBadge"></span>
        <h3>Planteamiento analítico e integración</h3>
        <ol class="steps" id="aSteps"></ol>
        <div class="geogebra-box" id="aGeogebra"></div>
      </article>

      <article class="card">
        <span class="tag">Explorador Interactivo</span>
        <h3>Selecciona el Ejercicio del Parcial</h3>
        <div class="controls">
          <label style="width:100%">Ejercicio:
            <select id="aSelect" class="case-select">
              ${cases.map((c, i) => `<option value="${i}">${c.title}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="result" id="aRes"></p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot"></div>
      </article>
    </div>
  `;

  function update() {
    let idx = +$('#aSelect').value;
    let item = cases[idx];
    $('#aTitle').textContent = item.title;
    $('#aBadge').textContent = item.badge;
    $('#aSteps').innerHTML = item.steps.map(s => `<li>${s}</li>`).join('');
    $('#aGeogebra').innerHTML = `
      <span class="title">Comandos GeoGebra</span>
      ${item.geogebra.map(c => `<code>${c}</code>`).join('')}
    `;
    $('#aRes').textContent = `Visualización geométrica de la región delimitada`;

    let plotConfig = item.plot();
    Plotly.newPlot('plot', plotConfig.data, {
      margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
      xaxis: { gridcolor: '#3a3a3c', ...plotConfig.xaxis },
      yaxis: { gridcolor: '#3a3a3c', ...plotConfig.yaxis },
      paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
    }, { responsive: true });

    math();
  }

  $('#aSelect').onchange = update;
  update();
}

/* ==========================================================================
   MÓDULO 11: Volumen de Sólidos con Sección Conocida
   ========================================================================== */
function crosssection() {
  const cases = [
    {
      id: 1,
      title: 'Taller Final — Ejercicio 1: Base circular y secciones equiláteras',
      badge: 'Volumen = 4√3 / 3 u³ ≈ 2.3094 u³',
      steps: [
        '<strong>Base y lado transversal:</strong> Base circular \\(x^2 + y^2 = 1 \\implies y = \\pm\\sqrt{1 - x^2}\\) con \\(x \\in [-1, 1]\\).<br>El lado transversal perpendicular al eje X es \\(L(x) = 2\\sqrt{1 - x^2}\\).',
        '<strong>Área transversal A(x):</strong> Para un triángulo equilátero de lado \\(L\\):<br>\\(A(x) = \\frac{\\sqrt{3}}{4}[L(x)]^2 = \\frac{\\sqrt{3}}{4}\\left(2\\sqrt{1 - x^2}\\right)^2 = \\sqrt{3}(1 - x^2)\\).',
        '<strong>Cálculo del volumen por integración:</strong><br>\\(V = \\int_{-1}^1 \\sqrt{3}(1 - x^2) dx = 2\\sqrt{3}\\int_0^1 (1 - x^2) dx = 2\\sqrt{3}\\left[ x - \\frac{x^3}{3} \\right]_0^1 = 2\\sqrt{3}\\left(\\frac{2}{3}\\right) = \\frac{4\\sqrt{3}}{3} \\text{ u}^3\\).'
      ],
      geogebra: [
        'Curva(cos(t), sin(t), 0, t, 0, 2*pi)',
        'Superficie(u, v*sqrt(1 - u^2), sqrt(3)*(1 - abs(v))*sqrt(1 - u^2), u, -1, 1, v, -1, 1)'
      ],
      generate3D: () => {
        let nU = 35, nV = 35;
        let uVals = Array.from({ length: nU }, (_, i) => -0.99 + 1.98 * i / (nU - 1));
        let vVals = Array.from({ length: nV }, (_, j) => -1 + 2 * j / (nV - 1));
        let x = [], y = [], z = [];
        for (let j = 0; j < nV; j++) {
          let rowX = [], rowY = [], rowZ = [];
          let v = vVals[j];
          for (let i = 0; i < nU; i++) {
            let u = uVals[i];
            let semiW = Math.sqrt(Math.max(0, 1 - u * u));
            rowX.push(u);
            rowY.push(v * semiW);
            rowZ.push(Math.sqrt(3) * (1 - Math.abs(v)) * semiW);
          }
          x.push(rowX); y.push(rowY); z.push(rowZ);
        }
        return [{ type: 'surface', x, y, z, colorscale: 'Viridis', showscale: false, name: 'Sólido Triángulos Equiláteros' }];
      }
    },
    {
      id: 2,
      title: 'Taller Final — Ejercicio 2: Base parabólica y secciones cuadradas',
      badge: 'Volumen = 16/15 u³ ≈ 1.0667 u³',
      steps: [
        '<strong>Límites en el primer cuadrante:</strong> \\(1 - \\frac{x^2}{4} = 0 \\implies x = 2\\), con \\(x \\in [0, 2]\\).',
        '<strong>Lado del cuadrado y área transversal A(x):</strong> El lado transversal es \\(L(x) = 1 - \\frac{x^2}{4}\\). El área del cuadrado es:<br>\\(A(x) = \\left(1 - \\frac{x^2}{4}\\right)^2 = 1 - \\frac{x^2}{2} + \\frac{x^4}{16}\\).',
        '<strong>Cálculo del volumen:</strong><br>\\(V = \\int_0^2 \\left(1 - \\frac{x^2}{2} + \\frac{x^4}{16}\\right) dx = \\left[ x - \\frac{x^3}{6} + \\frac{x^5}{80} \\right]_0^2 = 2 - \\frac{4}{3} + \\frac{2}{5} = \\frac{16}{15} \\text{ u}^3\\).'
      ],
      geogebra: [
        'Curva(t, 1 - t^2/4, 0, t, 0, 2)',
        'Superficie(u, v*(1 - u^2/4), 1 - u^2/4, u, 0, 2, v, 0, 1)',
        'Superficie(u, 1 - u^2/4, w*(1 - u^2/4), u, 0, 2, w, 0, 1)'
      ],
      generate3D: () => {
        let nU = 35, nV = 35;
        let uVals = Array.from({ length: nU }, (_, i) => 2 * i / (nU - 1));
        let vVals = Array.from({ length: nV }, (_, j) => j / (nV - 1));
        let x = [], y = [], z = [];
        for (let j = 0; j < nV; j++) {
          let rowX = [], rowY = [], rowZ = [];
          let v = vVals[j];
          for (let i = 0; i < nU; i++) {
            let u = uVals[i];
            let L = Math.max(0, 1 - u * u / 4);
            rowX.push(u);
            rowY.push(v * L);
            rowZ.push(L);
          }
          x.push(rowX); y.push(rowY); z.push(rowZ);
        }
        return [{ type: 'surface', x, y, z, colorscale: 'Plasma', showscale: false, name: 'Sólido Secciones Cuadradas' }];
      }
    }
  ];

  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 4: Sólidos con Sección Conocida</span>
        <h3 id="csTitle"></h3>
        <span class="badge-sol" id="csBadge"></span>
        <div class="formula">
          $$V = \\int_a^b A(x) \\, dx$$
        </div>
        <h3>Procedimiento y cálculo de volumen</h3>
        <ol class="steps" id="csSteps"></ol>
        <div class="geogebra-box" id="csGeogebra"></div>
      </article>

      <article class="card">
        <span class="tag">Visualizador 3D Interactivo</span>
        <h3>Selecciona el Ejercicio</h3>
        <div class="controls">
          <label style="width:100%">Caso 3D:
            <select id="csSelect" class="case-select">
              ${cases.map((c, i) => `<option value="${i}">${c.title}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="result" id="csRes"></p>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:8px;">💡 Puedes rotar y hacer zoom en el modelo 3D usando el ratón.</p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot" style="height:450px;"></div>
      </article>
    </div>
  `;

  function update() {
    let idx = +$('#csSelect').value;
    let item = cases[idx];
    $('#csTitle').textContent = item.title;
    $('#csBadge').textContent = item.badge;
    $('#csSteps').innerHTML = item.steps.map(s => `<li>${s}</li>`).join('');
    $('#csGeogebra').innerHTML = `
      <span class="title">Comandos GeoGebra (Vista 3D)</span>
      ${item.geogebra.map(c => `<code>${c}</code>`).join('')}
    `;
    $('#csRes').textContent = `Renderizando sólido geométrico tridimensional`;

    let data = item.generate3D();
    Plotly.newPlot('plot', data, {
      margin: { t: 20, l: 10, r: 10, b: 20 },
      paper_bgcolor: '#1c1c1e',
      scene: {
        xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        camera: { eye: { x: 1.6, y: 1.5, z: 1.2 } }
      }
    }, { responsive: true });

    math();
  }

  $('#csSelect').onchange = update;
  update();
}

/* ==========================================================================
   MÓDULO 12: Sólidos de Revolución · Método de Discos
   ========================================================================== */
function disks() {
  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 5: Primer Taller — Inciso B</span>
        <h3>Sólido de Revolución · Giro alrededor de y = 1</h3>
        <span class="badge-sol">Volumen = 16π / 15 u³ ≈ 3.3510 u³</span>
        <div class="formula">
          $$V = \\pi \\int_a^b [r(x)]^2 \\, dx$$
        </div>
        <h3>Procedimiento resuelto paso a paso</h3>
        <ol class="steps">
          <li><strong>Región y puntos de intersección:</strong><br>
            Región acotada por la parábola \\(y = 2 - x^2\\) y la recta \\(y = 1\\).<br>
            Cortes: \\(2 - x^2 = 1 \\implies x^2 = 1 \\implies x = -1, \\; x = 1\\).
          </li>
          <li><strong>Radio del disco (respecto al eje de giro \\(y = 1\\)):</strong><br>
            \\(r(x) = (2 - x^2) - 1 = 1 - x^2\\).
          </li>
          <li><strong>Cálculo del volumen por integración de discos:</strong><br>
            \\(V = \\pi \\int_{-1}^1 (1 - x^2)^2 dx = 2\\pi \\int_0^1 (1 - 2x^2 + x^4) dx\\)<br>
            \\(= 2\\pi \\left[ x - \\frac{2x^3}{3} + \\frac{x^5}{5} \\right]_0^1 = 2\\pi \\left(1 - \\frac{2}{3} + \\frac{1}{5}\\right) = 2\\pi\\left(\\frac{8}{15}\\right) = \\frac{16\\pi}{15} \\text{ u}^3\\).
          </li>
        </ol>
        <div class="geogebra-box">
          <span class="title">Comandos GeoGebra (Vista 2D y 3D)</span>
          <code>f(x) = Si(-1 <= x <= 1, 2 - x^2)</code>
          <code>Región = IntegralEntre(f, 1, -1, 1)</code>
          <code>Superficie(u, 1 + (1 - u^2)*cos(v), (1 - u^2)*sin(v), u, -1, 1, v, 0, 2*pi)</code>
        </div>
      </article>

      <article class="card">
        <span class="tag">Modelo Tridimensional</span>
        <h3>Visualizador 3D de Revolución Completa</h3>
        <p>Observa cómo la región plana genera un huso simétrico al rotar 360° en torno a la recta horizontal \\(y = 1\\).</p>
        <p class="result">Sólido cerrado sin hueco interno (Método de Discos)</p>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:8px;">💡 Gira con el ratón en 3D para apreciar las secciones transversales circulares.</p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot" style="height:450px;"></div>
      </article>
    </div>
  `;

  let nU = 35, nV = 35;
  let uVals = Array.from({ length: nU }, (_, i) => -1 + 2 * i / (nU - 1));
  let vVals = Array.from({ length: nV }, (_, j) => 2 * Math.PI * j / (nV - 1));
  let x = [], y = [], z = [];
  for (let j = 0; j < nV; j++) {
    let rowX = [], rowY = [], rowZ = [];
    let v = vVals[j];
    let cosV = Math.cos(v), sinV = Math.sin(v);
    for (let i = 0; i < nU; i++) {
      let u = uVals[i];
      let r = 1 - u * u;
      rowX.push(u);
      rowY.push(1 + r * cosV);
      rowZ.push(r * sinV);
    }
    x.push(rowX); y.push(rowY); z.push(rowZ);
  }

  // Eje de giro y=1
  let axisX = [-1.3, 1.3], axisY = [1, 1], axisZ = [0, 0];

  Plotly.newPlot('plot', [
    { type: 'surface', x, y, z, colorscale: 'Viridis', showscale: false, name: 'Sólido de Revolución' },
    { type: 'scatter3d', x: axisX, y: axisY, z: axisZ, mode: 'lines', line: { color: '#ffd60a', width: 6 }, name: 'Eje de giro y = 1' }
  ], {
    margin: { t: 20, l: 10, r: 10, b: 20 },
    paper_bgcolor: '#1c1c1e',
    scene: {
      xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      camera: { eye: { x: 1.4, y: 1.5, z: 1.1 } }
    }
  }, { responsive: true });

  math();
}

/* ==========================================================================
   MÓDULO 13: Sólidos de Revolución · Método de Arandelas
   ========================================================================== */
function washers() {
  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 6: Miscelánea — Inciso C</span>
        <h3>Giro de Región Base en Torno a y = 7</h3>
        <span class="badge-sol">Volumen = 576π / 5 u³ ≈ 361.9115 u³</span>
        <div class="formula">
          $$V = \\pi \\int_a^b \\left( [R_{ext}(x)]^2 - [r_{int}(x)]^2 \\right) dx$$
        </div>
        <h3>Procedimiento resuelto paso a paso</h3>
        <ol class="steps">
          <li><strong>Región base:</strong> Acotada por \\(y = 4 - x^2\\) y \\(y = 0\\), con cortes en \\(x = -2\\) y \\(x = 2\\).</li>
          <li><strong>Radios de la arandela (respecto al eje \\(y = 7\\)):</strong><br>
            ○ Radio exterior (distancia al borde inferior \\(y = 0\\)):<br>
            \\(R_{ext}(x) = 7 - 0 = 7\\).<br>
            ○ Radio interior (distancia al borde superior \\(y = 4 - x^2\\)):<br>
            \\(r_{int}(x) = 7 - (4 - x^2) = 3 + x^2\\).
          </li>
          <li><strong>Planteamiento y cálculo del volumen:</strong><br>
            \\(V = \\pi \\int_{-2}^2 \\left[ 7^2 - (3 + x^2)^2 \\right] dx = \\pi \\int_{-2}^2 (40 - 6x^2 - x^4) dx\\)<br>
            \\(= 2\\pi \\int_0^2 (40 - 6x^2 - x^4) dx = 2\\pi \\left[ 40x - 2x^3 - \\frac{x^5}{5} \\right]_0^2\\)<br>
            \\(= 2\\pi \\left(80 - 16 - \\frac{32}{5}\\right) = 2\\pi\\left(\\frac{288}{5}\\right) = \\frac{576\\pi}{5} \\text{ u}^3\\).
          </li>
        </ol>
        <div class="geogebra-box">
          <span class="title">Comandos GeoGebra (Vista 2D y 3D)</span>
          <code>f(x) = Si(-2 <= x <= 2, 4 - x^2)</code>
          <code>EjeGiro: y = 7</code>
          <code>Superficie(u, 7 - (3 + u^2)*cos(v), (3 + u^2)*sin(v), u, -2, 2, v, 0, 2*pi)</code>
          <code>Superficie(u, 7 - 7*cos(v), 7*sin(v), u, -2, 2, v, 0, 2*pi)</code>
        </div>
      </article>

      <article class="card">
        <span class="tag">Modelo Tridimensional</span>
        <h3>Visualizador 3D de Arandela con Hueco Interior</h3>
        <p>Al girar en torno a \\(y = 7\\), el sólido forma una pared externa cilíndrica de radio 7 y un núcleo hueco acotado por la parábola.</p>
        <p class="result">Doble superficie: externa e interna</p>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:8px;">💡 La superficie translúcida exterior permite ver la cavidad interior generada por la rotación.</p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot" style="height:450px;"></div>
      </article>
    </div>
  `;

  let nU = 30, nV = 30;
  let uVals = Array.from({ length: nU }, (_, i) => -2 + 4 * i / (nU - 1));
  let vVals = Array.from({ length: nV }, (_, j) => 2 * Math.PI * j / (nV - 1));

  // Superficie interior: r_int = 3 + u²
  let xInt = [], yInt = [], zInt = [];
  // Superficie exterior: R_ext = 7
  let xExt = [], yExt = [], zExt = [];

  for (let j = 0; j < nV; j++) {
    let rowXI = [], rowYI = [], rowZI = [];
    let rowXE = [], rowYE = [], rowZE = [];
    let v = vVals[j];
    let cosV = Math.cos(v), sinV = Math.sin(v);
    for (let i = 0; i < nU; i++) {
      let u = uVals[i];
      let rI = 3 + u * u;
      let rE = 7;
      rowXI.push(u);
      rowYI.push(7 - rI * cosV);
      rowZI.push(rI * sinV);

      rowXE.push(u);
      rowYE.push(7 - rE * cosV);
      rowZE.push(rE * sinV);
    }
    xInt.push(rowXI); yInt.push(rowYI); zInt.push(rowZI);
    xExt.push(rowXE); yExt.push(rowYE); zExt.push(rowZE);
  }

  let axisX = [-2.5, 2.5], axisY = [7, 7], axisZ = [0, 0];

  Plotly.newPlot('plot', [
    { type: 'surface', x: xInt, y: yInt, z: zInt, colorscale: 'Plasma', showscale: false, name: 'Cavidad Interior' },
    { type: 'surface', x: xExt, y: yExt, z: zExt, colorscale: 'Blues', opacity: 0.45, showscale: false, name: 'Cilindro Exterior' },
    { type: 'scatter3d', x: axisX, y: axisY, z: axisZ, mode: 'lines', line: { color: '#ffd60a', width: 6 }, name: 'Eje de giro y = 7' }
  ], {
    margin: { t: 20, l: 10, r: 10, b: 20 },
    paper_bgcolor: '#1c1c1e',
    scene: {
      xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      camera: { eye: { x: 1.5, y: 1.6, z: 1.2 } }
    }
  }, { responsive: true });

  math();
}

/* ==========================================================================
   MÓDULO 14: Sólidos de Revolución · Capas Cilíndricas (Cascarones)
   ========================================================================== */
function shells() {
  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 6: Miscelánea — Inciso D</span>
        <h3>Giro de Región Base en Torno a x = 3</h3>
        <span class="badge-sol">Volumen = 64π u³ ≈ 201.0619 u³</span>
        <div class="formula">
          $$V = 2\\pi \\int_a^b r(x) \\, h(x) \\, dx$$
        </div>
        <h3>Procedimiento resuelto paso a paso</h3>
        <ol class="steps">
          <li><strong>Región base:</strong> Acotada por \\(y = 4 - x^2\\) y \\(y = 0\\), con cortes en \\(x = -2\\) y \\(x = 2\\).</li>
          <li><strong>Elementos de la capa cilíndrica (respecto al eje vertical \\(x = 3\\)):</strong><br>
            ○ Radio de la capa: \\(r(x) = 3 - x\\).<br>
            ○ Altura de la capa: \\(h(x) = 4 - x^2\\).
          </li>
          <li><strong>Planteamiento y cálculo del volumen:</strong><br>
            \\(V = 2\\pi \\int_{-2}^2 (3 - x)(4 - x^2) dx = 2\\pi \\int_{-2}^2 (12 - 3x^2 - 4x + x^3) dx\\)<br>
            \\(V = 2\\pi \\left[ 12x - x^3 - 2x^2 + \\frac{x^4}{4} \\right]_{-2}^2\\)<br>
            Evaluando en \\(x = 2\\): \\(24 - 8 - 8 + 4 = 12\\).<br>
            Evaluando en \\(x = -2\\): \\(-24 + 8 - 8 + 4 = -20\\).<br>
            \\(V = 2\\pi [12 - (-20)] = 2\\pi(32) = 64\\pi \\text{ u}^3\\).
          </li>
        </ol>
        <div class="geogebra-box">
          <span class="title">Comandos GeoGebra (Vista 2D y 3D)</span>
          <code>f(x) = Si(-2 <= x <= 2, 4 - x^2)</code>
          <code>EjeGiro: x = 3</code>
          <code>Superficie(3 - (3 - u)*cos(v), 4 - u^2, (3 - u)*sin(v), u, -2, 2, v, 0, 2*pi)</code>
          <code>Superficie(3 - r*cos(v), 0, r*sin(v), r, 1, 5, v, 0, 2*pi)</code>
        </div>
      </article>

      <article class="card">
        <span class="tag">Modelo Tridimensional</span>
        <h3>Visualizador 3D de Cascarones Cilíndricos</h3>
        <p>Giro alrededor del eje vertical \\(x = 3\\). Las franjas paralelas al eje forman capas cilíndricas concéntricas que se suman para llenar el volumen total.</p>
        <p class="result">Sólido generado alrededor de x = 3</p>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:8px;">💡 La línea vertical dorada señala el eje de rotación x = 3.</p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot" style="height:450px;"></div>
      </article>
    </div>
  `;

  let nU = 35, nV = 35;
  let uVals = Array.from({ length: nU }, (_, i) => -2 + 4 * i / (nU - 1));
  let vVals = Array.from({ length: nV }, (_, j) => 2 * Math.PI * j / (nV - 1));

  let x = [], y = [], z = [];
  for (let j = 0; j < nV; j++) {
    let rowX = [], rowY = [], rowZ = [];
    let v = vVals[j];
    let cosV = Math.cos(v), sinV = Math.sin(v);
    for (let i = 0; i < nU; i++) {
      let u = uVals[i];
      let radius = 3 - u;
      rowX.push(3 - radius * cosV);
      rowY.push(Math.max(0, 4 - u * u));
      rowZ.push(radius * sinV);
    }
    x.push(rowX); y.push(rowY); z.push(rowZ);
  }

  // Eje de giro vertical en x = 3, z = 0, y de 0 a 5
  let axisX = [3, 3], axisY = [-0.5, 5], axisZ = [0, 0];

  Plotly.newPlot('plot', [
    { type: 'surface', x, y, z, colorscale: 'Viridis', showscale: false, name: 'Sólido por Capas Cilíndricas' },
    { type: 'scatter3d', x: axisX, y: axisY, z: axisZ, mode: 'lines', line: { color: '#ffd60a', width: 6 }, name: 'Eje de giro x = 3' }
  ], {
    margin: { t: 20, l: 10, r: 10, b: 20 },
    paper_bgcolor: '#1c1c1e',
    scene: {
      xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' },
      camera: { eye: { x: 1.6, y: 1.5, z: 1.3 } }
    }
  }, { responsive: true });

  math();
}

/* ==========================================================================
   RENDERIZADO GENERAL Y CONTROLADOR DE RUTAS
   ========================================================================== */
function math() {
  if (window.renderMathInElement) {
    renderMathInElement($('#content'), {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true }
      ]
    });
  }
}

function render(i) {
  current = i;
  nav();
  let m = modules[i];
  $('#title').textContent = `${i + 1}. ${m[0]}`;
  $('#lead').textContent = m[1];

  switch (m[2]) {
    case 'riemann':
    case 'trap':
    case 'mid':
    case 'simpson':
      numerical(m[2]);
      break;
    case 'area':
      area();
      break;
    case 'direct':
      direct();
      break;
    case 'trig':
      trig();
      break;
    case 'trigsub':
      trigsub();
      break;
    case 'universal':
      universal();
      break;
    case 'planearea':
      planearea();
      break;
    case 'crosssection':
      crosssection();
      break;
    case 'disks':
      disks();
      break;
    case 'washers':
      washers();
      break;
    case 'shells':
      shells();
      break;
    default:
      direct();
  }

  setTimeout(math, 50);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('.menu').onclick = () => document.querySelector('aside').classList.toggle('open');
render(Math.max(0, Math.min(13, (Number(new URLSearchParams(location.search).get('mod')) || 1) - 1)));
window.addEventListener('load', math);
