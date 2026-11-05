const modules = [
  ['Sumas de Riemann', 'Aproximaciones izquierda, derecha y punto medio mediante rectángulos.', 'riemann'],
  ['Regla del Trapecio', 'Una aproximación que une los puntos de la curva con segmentos.', 'trap'],
  ['Regla del Punto Medio', 'Rectángulos construidos desde el valor central de cada intervalo.', 'mid'],
  ['Regla de Simpson', 'Aproximación con parábolas; el número de subintervalos debe ser par.', 'simpson'],
  ['Integral definida y área', 'El Teorema Fundamental del Cálculo convierte acumulación en evaluación.', 'area'],
  ['Integración directa', 'Antiderivadas elementales y su interpretación gráfica.', 'direct'],
  ['Integración Trigonométrica', 'Potencias de senos y cosenos: ejercicios del parcial y personalización.', 'trig'],
  ['Sustitución Trigonométrica', 'Resolución con radicales: ejercicios del parcial o define tu propia raíz.', 'trigsub'],
  ['Sustitución Universal', 'Transformación de Weierstrass: 6 casos del parcial o coeficientes propios.', 'universal'],
  ['Áreas de Regiones Planas', 'Áreas entre curvas respecto a X e Y: casos del parcial y modo personalizado.', 'planearea'],
  ['Sólidos con Sección Conocida', 'Cálculo de volumen transversal: taller del parcial y modelado 3D propio.', 'crosssection'],
  ['Sólidos de Revolución · Discos', 'Método de discos: problema del parcial y rotación 3D personalizada.', 'disks'],
  ['Sólidos de Revolución · Arandelas', 'Método de arandelas con hueco: ejercicio oficial y simulación 3D propia.', 'washers'],
  ['Sólidos de Revolución · Capas Cilíndricas', 'Cascarones cilíndricos: ejercicio oficial y eje vertical interactivo.', 'shells']
];

let current = 0;
const $ = s => document.querySelector(s);
const f = x => x * x;

function nav() {
  $('#moduleNav').innerHTML = modules.map((m, i) => `
    <a class="module ${i === current ? 'active' : ''}" style="text-decoration:none" href="modulos/modulo-${i + 1}/index.html">
      ${i + 1}. ${m[0]}
      <small>Disponible · Interactivo</small>
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
        <span class="tag">Sección I — Taller y Personalizado</span>
        <h3 id="trigTitle">Demostración de Integral Trigonométrica</h3>
        <p id="trigDesc">Integrales de la forma \\(\\int \\operatorname{sen}^m(kx) \\cos^n(kx) dx\\).</p>
        <div class="formula" id="trigFormula">
          $$\\int \\operatorname{sen}^{3}(2x) \\cos^{4}(2x) \\, dx = -\\frac{\\cos^{5}(2x)}{10} + \\frac{\\cos^{7}(2x)}{14} + C$$
        </div>
        <div id="trigStepsBox">
          <h3>Procedimiento resuelto paso a paso</h3>
          <ol class="steps">
            <li><strong>Separar la potencia impar del seno:</strong><br>
              \\(\\int \\operatorname{sen}^{3}(2x) \\cos^{4}(2x) dx = \\int \\operatorname{sen}^{2}(2x) \\cos^{4}(2x) \\operatorname{sen}(2x) dx\\)
            </li>
            <li><strong>Aplicar identidad pitagórica (\\(\\operatorname{sen}^2(2x) = 1 - \\cos^2(2x)\\)):</strong><br>
              \\(= \\int (1 - \\cos^2(2x)) \\cos^4(2x) \\operatorname{sen}(2x) dx\\)
            </li>
            <li><strong>Sustitución simple:</strong><br>
              Sea \\(u = \\cos(2x) \\implies du = -2\\operatorname{sen}(2x) dx \\implies -\\frac{du}{2} = \\operatorname{sen}(2x) dx\\)<br>
              \\(= \\int (1 - u^2) u^4 \\left(-\\frac{du}{2}\\right) = -\\frac{1}{2} \\int (u^4 - u^6) du\\)
            </li>
            <li><strong>Integrar y regresar a \\(x\\):</strong><br>
              \\(= -\\frac{1}{2} \\left[ \\frac{u^5}{5} - \\frac{u^7}{7} \\right] + C = -\\frac{\\cos^5(2x)}{10} + \\frac{\\cos^7(2x)}{14} + C\\)
            </li>
          </ol>
        </div>
      </article>

      <article class="card">
        <span class="tag">Controles y Personalización</span>
        <h3>Selecciona o Crea tu Propio Ejemplo</h3>
        <div class="controls" style="margin-bottom:12px;">
          <label style="width:100%">Modo:
            <select id="trigMode" class="case-select">
              <option value="parcial">Ejemplo del Parcial: sen³(2x) cos⁴(2x)</option>
              <option value="custom">✨ Crear mi propio ejemplo: senᵐ(kx) cosⁿ(kx)</option>
            </select>
          </label>
        </div>

        <div id="trigCustomControls" style="display:none;" class="controls">
          <label>Potencia sen m<input id="tM" type="number" min="0" max="9" step="1" value="3"></label>
          <label>Potencia cos n<input id="tN" type="number" min="0" max="9" step="1" value="2"></label>
          <label>Argumento k<input id="tK" type="number" min="1" max="6" step="1" value="1"></label>
        </div>

        <div class="controls" style="margin-top:10px;">
          <label>Límite inferior a<input id="tA" type="number" step="0.1" value="0"></label>
          <label>Límite superior b<input id="tB" type="number" step="0.1" value="1.57"></label>
          <button id="trigGo">Calcular y Graficar</button>
        </div>
        <p class="result" id="trigRes"></p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot"></div>
      </article>
    </div>
  `;

  function update() {
    let isCustom = $('#trigMode').value === 'custom';
    $('#trigCustomControls').style.display = isCustom ? 'flex' : 'none';

    let m = isCustom ? +$('#tM').value : 3;
    let n = isCustom ? +$('#tN').value : 4;
    let k = isCustom ? +$('#tK').value : 2;
    let a = +$('#tA').value, b = +$('#tB').value;

    let fTrig = x => Math.pow(Math.sin(k * x), m) * Math.pow(Math.cos(k * x), n);

    if (isCustom) {
      $('#trigTitle').textContent = `Tu Ejemplo: sen^${m}(${k}x) cos^${n}(${k}x)`;
      $('#trigFormula').innerHTML = `$$\\int \\operatorname{sen}^{${m}}(${k}x) \\cos^{${n}}(${k}x) \\, dx$$`;
      $('#trigStepsBox').innerHTML = `
        <h3>Análisis de tu ejemplo personalizado</h3>
        <p>Configuración actual: <strong>Potencia del seno:</strong> \\(m = ${m}\\), <strong>Potencia del coseno:</strong> \\(n = ${n}\\), <strong>Frecuencia:</strong> \\(k = ${k}\\).</p>
        <p>${m % 2 !== 0 ? '💡 Como la potencia del seno es impar, se separa \\(\\operatorname{sen}(' + k + 'x)\\) y se usa \\(\\operatorname{sen}^2 = 1 - \\cos^2\\) con sustitución \\(u = \\cos(' + k + 'x)\\).' : n % 2 !== 0 ? '💡 Como la potencia del coseno es impar, se separa \\(\\cos(' + k + 'x)\\) y se usa \\(\\cos^2 = 1 - \\operatorname{sen}^2\\) con \\(u = \\operatorname{sen}(' + k + 'x)\\).' : '💡 Ambas potencias son pares: se recomienda usar identidades de ángulo medio \\(\\operatorname{sen}^2(u) = \\frac{1-\\cos(2u)}{2}\\) y \\(\\cos^2(u) = \\frac{1+\\cos(2u)}{2}\\).'}</p>
      `;
    } else {
      $('#trigTitle').textContent = 'Demostración de Integral Trigonométrica';
      $('#trigFormula').innerHTML = `$$\\int \\operatorname{sen}^{3}(2x) \\cos^{4}(2x) \\, dx = -\\frac{\\cos^{5}(2x)}{10} + \\frac{\\cos^{7}(2x)}{14} + C$$`;
      $('#trigStepsBox').innerHTML = `
        <h3>Procedimiento resuelto paso a paso</h3>
        <ol class="steps">
          <li><strong>Separar la potencia impar del seno:</strong> \\(\\int \\operatorname{sen}^{2}(2x) \\cos^{4}(2x) \\operatorname{sen}(2x) dx\\)</li>
          <li><strong>Identidad pitagórica:</strong> \\(\\int (1 - \\cos^2(2x)) \\cos^4(2x) \\operatorname{sen}(2x) dx\\)</li>
          <li><strong>Sustitución simple:</strong> Sea \\(u = \\cos(2x) \\implies -\\frac{du}{2} = \\operatorname{sen}(2x) dx\\)</li>
          <li><strong>Integrar:</strong> \\(-\\frac{1}{2} \\left[ \\frac{u^5}{5} - \\frac{u^7}{7} \\right] + C = -\\frac{\\cos^5(2x)}{10} + \\frac{\\cos^7(2x)}{14} + C\\)</li>
        </ol>
      `;
    }

    let nSteps = 100, h = (b - a) / nSteps;
    let sum = fTrig(a) + fTrig(b);
    for (let i = 1; i < nSteps; i++) {
      let xVal = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * fTrig(xVal);
    }
    let numArea = (h / 3) * sum;
    $('#trigRes').textContent = `Integral definida en [${a}, ${b}]: ${numArea.toFixed(6)}`;

    let xMin = Math.min(a, b) - 0.5, xMax = Math.max(a, b) + 0.5;
    let xs = Array.from({ length: 300 }, (_, i) => xMin + (xMax - xMin) * i / 299);
    let xArea = Array.from({ length: 150 }, (_, i) => a + (b - a) * i / 149);

    Plotly.newPlot('plot', [
      { x: xs, y: xs.map(fTrig), name: `f(x) = sen^${m}(${k}x)cos^${n}(${k}x)`, line: { color: '#64d2ff', width: 2.5 } },
      { x: xArea, y: xArea.map(fTrig), fill: 'tozeroy', fillcolor: 'rgba(100, 210, 255, 0.32)', mode: 'none', name: `Área en [${a}, ${b}] = ${numArea.toFixed(4)}` }
    ], {
      margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
      xaxis: { title: 'x (rad)', gridcolor: '#3a3a3c' },
      yaxis: { title: 'f(x)', gridcolor: '#3a3a3c' },
      paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
    }, { responsive: true });

    math();
  }

  $('#trigMode').onchange = update;
  $('#trigGo').onclick = update;
  update();
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
        '<strong>Simplificar e integrar:</strong> \\(\\int (2\\sec\\theta)(2\\sec^2\\theta d\\theta) = 4\\int \\sec^3\\theta d\\theta = 2\\sec\\theta\\tan\\theta + 2\\ln|\\sec\\theta + \\tan\\theta| + C_1\\).',
        '<strong>Retornar a x:</strong> Reemplazando \\(\\tan\\theta = x/2\\) y \\(\\sec\\theta = \\frac{\\sqrt{x^2+4}}{2}\\).'
      ],
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
        '<strong>Simplificar e integrar:</strong> \\(\\int \\frac{(a^2\\operatorname{sen}^2\\theta)(a\\cos\\theta d\\theta)}{a^3\\cos^3\\theta} = \\int \\tan^2\\theta d\\theta = \\tan\\theta - \\theta + C\\).',
        '<strong>Retornar a x:</strong> \\(\\theta = \\operatorname{arcsen}(x/a)\\) y \\(\\tan\\theta = \\frac{x}{\\sqrt{a^2-x^2}}\\).'
      ],
      f: x => (x * x) / Math.pow(9 - x * x, 1.5),
      F: x => x / Math.sqrt(9 - x * x) - Math.asin(x / 3),
      range: [-2.6, 2.6]
    }
  ];

  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Parte A: Tarea Inicial y Personalizado</span>
        <h3 id="exTitle"></h3>
        <div class="formula" id="exFormula"></div>
        <div id="exStepsBox">
          <h3>Desarrollo analítico completo</h3>
          <ol class="steps" id="exSteps"></ol>
        </div>
      </article>

      <article class="card">
        <span class="tag">Explorador y Creador</span>
        <h3>Selecciona o Diseña tu Raíz</h3>
        <div class="controls">
          <label style="width:100%">Modo / Ejercicio:
            <select id="exSelect" class="case-select">
              ${cases.map((c, i) => `<option value="${i}">${c.title}</option>`).join('')}
              <option value="custom">✨ Crear mi propio ejemplo: √(a² - x²) o √(x² + a²)</option>
            </select>
          </label>
        </div>

        <div id="subCustomControls" style="display:none; margin-top:12px;" class="controls">
          <label>Forma Radical:
            <select id="subForm">
              <option value="minus">√(a² - x²)</option>
              <option value="plus">√(x² + a²)</option>
            </select>
          </label>
          <label>Parámetro a<input id="subA" type="number" min="1" max="10" step="0.5" value="4"></label>
          <button id="btnSubCustom">Actualizar Mi Ejemplo</button>
        </div>

        <p class="result" id="exRes"></p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot"></div>
      </article>
    </div>
  `;

  function update() {
    let val = $('#exSelect').value;
    let isCustom = val === 'custom';
    $('#subCustomControls').style.display = isCustom ? 'flex' : 'none';

    if (isCustom) {
      let aVal = +$('#subA').value || 4;
      let form = $('#subForm').value;
      let isMinus = form === 'minus';

      $('#exTitle').textContent = `Tu Ejemplo: Radical ${isMinus ? `\\sqrt{${aVal}^2 - x^2}` : `\\sqrt{x^2 + ${aVal}^2}`}`;
      $('#exFormula').innerHTML = isMinus
        ? `$$\\int \\sqrt{${aVal * aVal} - x^2} \\, dx = \\frac{x\\sqrt{${aVal * aVal} - x^2}}{2} + \\frac{${aVal * aVal}}{2}\\operatorname{arcsen}\\left(\\frac{x}{${aVal}}\\right) + C$$`
        : `$$\\int \\sqrt{x^2 + ${aVal * aVal}} \\, dx = \\frac{x\\sqrt{x^2 + ${aVal * aVal}}}{2} + \\frac{${aVal * aVal}}{2}\\ln\\left(x + \\sqrt{x^2 + ${aVal * aVal}}\\right) + C$$`;

      $('#exStepsBox').innerHTML = `
        <h3>Procedimiento para tu ejemplo</h3>
        <p><strong>Sustitución recomendada:</strong> ${isMinus ? `\\(x = ${aVal}\\operatorname{sen}\\theta \\implies dx = ${aVal}\\cos\\theta d\\theta\\), con \\(\\sqrt{${aVal * aVal} - x^2} = ${aVal}\\cos\\theta\\).` : `\\(x = ${aVal}\\tan\\theta \\implies dx = ${aVal}\\sec^2\\theta d\\theta\\), con \\(\\sqrt{x^2 + ${aVal * aVal}} = ${aVal}\\sec\\theta\\).`}</p>
        <p><strong>Triángulo de referencia:</strong> ${isMinus ? `Cateto opuesto = \\(x\\), Hipotenusa = \\(${aVal}\\), Cateto adyacente = \\(\\sqrt{${aVal * aVal} - x^2}\\).` : `Cateto opuesto = \\(x\\), Cateto adyacente = \\(${aVal}\\), Hipotenusa = \\(\\sqrt{x^2 + ${aVal * aVal}}\\).`}</p>
      `;
      $('#exRes').textContent = `Graficando tu radical con parámetro a = ${aVal}`;

      let fCust = isMinus ? (x => Math.sqrt(Math.max(0, aVal * aVal - x * x))) : (x => Math.sqrt(x * x + aVal * aVal));
      let FCust = isMinus
        ? (x => (x * Math.sqrt(Math.max(0, aVal * aVal - x * x))) / 2 + (aVal * aVal / 2) * Math.asin(Math.max(-1, Math.min(1, x / aVal))))
        : (x => (x * Math.sqrt(x * x + aVal * aVal)) / 2 + (aVal * aVal / 2) * Math.log(x + Math.sqrt(x * x + aVal * aVal)));

      let limit = isMinus ? aVal * 0.95 : aVal * 1.5;
      let xs = Array.from({ length: 240 }, (_, i) => -limit + 2 * limit * i / 239);

      Plotly.newPlot('plot', [
        { x: xs, y: xs.map(fCust), name: 'f(x) Radical', line: { color: '#64d2ff', width: 2.5 } },
        { x: xs, y: xs.map(FCust), name: 'F(x) Primitiva', line: { color: '#ffd60a', width: 2.5 } }
      ], {
        margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
        xaxis: { title: 'x', gridcolor: '#3a3a3c' },
        yaxis: { title: 'y', gridcolor: '#3a3a3c' },
        paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
      }, { responsive: true });

    } else {
      let idx = +val;
      let item = cases[idx];
      $('#exTitle').textContent = item.title;
      $('#exFormula').innerHTML = item.formula;
      $('#exStepsBox').innerHTML = `
        <h3>Desarrollo analítico completo</h3>
        <ol class="steps">${item.steps.map(s => `<li>${s}</li>`).join('')}</ol>
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
    }

    math();
  }

  $('#exSelect').onchange = update;
  $('#btnSubCustom').onclick = update;
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
        '<strong>Sustituir y completar el cuadrado:</strong> Con \\(\\operatorname{sen}x = \\frac{2z}{1+z^2}\\) y \\(dx = \\frac{2dz}{1+z^2}\\):<br>\\(\\int \\frac{2dz}{z^2 - 4z + 1} = 2\\int \\frac{dz}{(z-2)^2 - (\\sqrt{3})^2}\\).',
        '<strong>Integrar y retornar a x:</strong> \\(\\frac{\\sqrt{3}}{3}\\ln\\left|\\frac{\\tan(x/2) - 2 - \\sqrt{3}}{\\tan(x/2) - 2 + \\sqrt{3}}\\right| + C\\).'
      ],
      f: x => 1 / (1 - 2 * Math.sin(x)),
      F: x => (Math.sqrt(3) / 3) * Math.log(Math.abs((Math.tan(x / 2) - 2 - Math.sqrt(3)) / (Math.tan(x / 2) - 2 + Math.sqrt(3)))),
      range: [-1.2, 0.4]
    },
    {
      id: 2,
      title: 'Ejercicio 2: ∫ dx / (2 - cos x)',
      formula: '$$\\int \\frac{dx}{2 - \\cos x} = \\frac{2}{\\sqrt{3}} \\arctan\\left(\\sqrt{3}\\tan\\frac{x}{2}\\right) + C$$',
      steps: [
        '<strong>Sustituir y simplificar:</strong> Con \\(\\cos x = \\frac{1-z^2}{1+z^2}\\):<br>\\(\\int \\frac{2dz}{2(1+z^2)-(1-z^2)} = \\int \\frac{2dz}{3z^2 + 1}\\).',
        '<strong>Integrar:</strong> \\(w = \\sqrt{3}z \\implies \\frac{2}{\\sqrt{3}}\\arctan\\left(\\sqrt{3}\\tan\\frac{x}{2}\\right) + C\\).'
      ],
      f: x => 1 / (2 - Math.cos(x)),
      F: x => (2 / Math.sqrt(3)) * Math.atan(Math.sqrt(3) * Math.tan(x / 2)),
      range: [-3, 3]
    },
    {
      id: 3,
      title: 'Ejercicio 3: ∫ dx / (3 + 5 sen x)',
      formula: '$$\\int \\frac{dx}{3 + 5\\operatorname{sen}x} = \\frac{1}{4} \\ln\\left|\\frac{3\\tan(x/2) + 1}{\\tan(x/2) + 3}\\right| + C$$',
      steps: [
        '<strong>Fracciones parciales en z:</strong> \\(\\int \\frac{2dz}{(3z+1)(z+3)} = \\int \\left(\\frac{3/4}{3z+1} - \\frac{1/4}{z+3}\\right) dz\\).',
        '<strong>Integrar:</strong> \\(\\frac{1}{4}\\ln\\left|\\frac{3\\tan(x/2)+1}{\\tan(x/2)+3}\\right| + C\\).'
      ],
      f: x => 1 / (3 + 5 * Math.sin(x)),
      F: x => 0.25 * Math.log(Math.abs((3 * Math.tan(x / 2) + 1) / (Math.tan(x / 2) + 3))),
      range: [-0.5, 2.5]
    },
    {
      id: 4,
      title: 'Ejercicio 4: ∫ dx / (5 + 3 sen x)',
      formula: '$$\\int \\frac{dx}{5 + 3\\operatorname{sen}x} = \\frac{1}{2} \\arctan\\left(\\frac{3 + 5\\tan(x/2)}{4}\\right) + C$$',
      steps: [
        '<strong>Sustituir y completar trinomio:</strong> \\(\\int \\frac{10dz}{(5z+3)^2 + 4^2}\\).',
        '<strong>Integrar:</strong> \\(\\frac{1}{2}\\arctan\\left(\\frac{3 + 5\\tan(x/2)}{4}\\right) + C\\).'
      ],
      f: x => 1 / (5 + 3 * Math.sin(x)),
      F: x => 0.5 * Math.atan((3 + 5 * Math.tan(x / 2)) / 4),
      range: [-3, 3]
    },
    {
      id: 5,
      title: 'Ejercicio 5: ∫ dx / (sen x - cos x - 1)',
      formula: '$$\\int \\frac{dx}{\\operatorname{sen}x - \\cos x - 1} = \\ln\\left|\\tan\\left(\\frac{x}{2}\\right) - 1\\right| + C$$',
      steps: [
        '<strong>Sustituir y simplificar denominador:</strong> \\(\\int \\frac{2dz}{2z - 2} = \\int \\frac{dz}{z-1}\\).',
        '<strong>Integrar:</strong> \\(\\ln\\left|\\tan(x/2) - 1\\right| + C\\).'
      ],
      f: x => 1 / (Math.sin(x) - Math.cos(x) - 1),
      F: x => Math.log(Math.abs(Math.tan(x / 2) - 1)),
      range: [-1.2, 1.4]
    },
    {
      id: 6,
      title: 'Ejercicio 6: ∫ sen x / (1 + sen² x) dx',
      formula: '$$\\int \\frac{\\operatorname{sen}x}{1 + \\operatorname{sen}^2 x} \\, dx = \\frac{\\sqrt{2}}{4} \\ln\\left|\\frac{\\tan^2(x/2) + 3 - 2\\sqrt{2}}{\\tan^2(x/2) + 3 + 2\\sqrt{2}}\\right| + C$$',
      steps: [
        '<strong>Reescribir denominador:</strong> \\(1 + \\operatorname{sen}^2 x = 2 - \\cos^2 x\\). Sustituir \\(u = \\cos x\\).',
        '<strong>Transformar a tan(x/2):</strong> \\(\\frac{\\sqrt{2}}{4}\\ln\\left|\\frac{\\tan^2(x/2) + 3 - 2\\sqrt{2}}{\\tan^2(x/2) + 3 + 2\\sqrt{2}}\\right| + C\\).'
      ],
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
        <div id="uStepsBox">
          <h3>Procedimiento detallado</h3>
          <ol class="steps" id="uSteps"></ol>
        </div>
      </article>

      <article class="card">
        <span class="tag">Explorador y Creador</span>
        <h3>Selecciona o Ingresa Coeficientes Propios</h3>
        <div class="controls">
          <label style="width:100%">Caso a visualizar:
            <select id="uSelect" class="case-select">
              ${cases.map((c, i) => `<option value="${i}">${c.title}</option>`).join('')}
              <option value="custom">✨ Crear mi propio ejemplo: ∫ dx / (A + B sen(x) + C cos(x))</option>
            </select>
          </label>
        </div>

        <div id="uCustomControls" style="display:none; margin-top:12px;" class="controls">
          <label>Coeficiente A<input id="uA" type="number" step="0.5" value="3"></label>
          <label>Coeficiente B (sen)<input id="uB" type="number" step="0.5" value="2"></label>
          <label>Coeficiente C (cos)<input id="uC" type="number" step="0.5" value="1"></label>
          <button id="btnUCustom">Actualizar Mi Integral</button>
        </div>

        <p class="result" id="uRes"></p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot"></div>
      </article>
    </div>
  `;

  function update() {
    let val = $('#uSelect').value;
    let isCustom = val === 'custom';
    $('#uCustomControls').style.display = isCustom ? 'flex' : 'none';

    if (isCustom) {
      let A = +$('#uA').value || 3;
      let B = +$('#uB').value || 0;
      let C = +$('#uC').value || 0;

      $('#uTitle').textContent = `Tu Ejemplo: ∫ dx / (${A} + ${B} sen x + ${C} cos x)`;
      $('#uFormula').innerHTML = `$$\\int \\frac{dx}{${A} + ${B}\\operatorname{sen}x + ${C}\\cos x}$$`;

      let polyQuad = A - C;
      let polyLin = 2 * B;
      let polyConst = A + C;

      $('#uStepsBox').innerHTML = `
        <h3>Transformación a variable z</h3>
        <p>Aplicando las identidades de Weierstrass al denominador:</p>
        <p>\\(${A} + ${B}\\left(\\frac{2z}{1+z^2}\\right) + ${C}\\left(\\frac{1-z^2}{1+z^2}\\right) = \\frac{(${A}-${C})z^2 + ${2 * B}z + (${A}+${C})}{1+z^2}\\)</p>
        <p>Multiplicando por \\(dx = \\frac{2dz}{1+z^2}\\), el integrando se transforma en:</p>
        <div class="formula">$$\\int \\frac{2 \\, dz}{${polyQuad}z^2 + ${polyLin}z + ${polyConst}}$$</div>
      `;
      $('#uRes').textContent = `Visualizando f(x) con coeficientes personalizados`;

      let fCust = x => 1 / (A + B * Math.sin(x) + C * Math.cos(x));
      let xs = Array.from({ length: 240 }, (_, i) => -3 + 6 * i / 239);

      Plotly.newPlot('plot', [
        { x: xs, y: xs.map(fCust), name: 'f(x) Personalizada', line: { color: '#64d2ff', width: 2.5 } }
      ], {
        margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
        xaxis: { title: 'x (rad)', gridcolor: '#3a3a3c' },
        yaxis: { title: 'f(x)', gridcolor: '#3a3a3c' },
        paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
      }, { responsive: true });

    } else {
      let idx = +val;
      let item = cases[idx];
      $('#uTitle').textContent = item.title;
      $('#uFormula').innerHTML = item.formula;
      $('#uStepsBox').innerHTML = `
        <h3>Procedimiento detallado</h3>
        <ol class="steps">${item.steps.map(s => `<li>${s}</li>`).join('')}</ol>
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
    }

    math();
  }

  $('#uSelect').onchange = update;
  $('#btnUCustom').onclick = update;
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
        '<strong>Intersecciones (con \\(y \\ge 0\\)):</strong> \\(\\sqrt{y} = 2 - y \\implies y = 1\\) (punto \\((1,1)\\)).',
        '<strong>Planteamiento respecto a y:</strong><br>\\(A = \\int_0^1 [(2 - y) - y^{1/2}] dy = \\left[ 2y - \\frac{y^2}{2} - \\frac{2}{3}y^{3/2} \\right]_0^1 = \\frac{5}{6} \\text{ u}^2\\).'
      ],
      plot: () => {
        let ys = Array.from({ length: 150 }, (_, i) => i / 149);
        let xRight = ys.map(y => 2 - y), xLeft = ys.map(y => Math.sqrt(y));
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
        '<strong>Intersecciones:</strong> \\(y^2 = 2 - y^2 \\implies y = \\pm 1\\). Cortes en \\((1, -1)\\) y \\((1, 1)\\).',
        '<strong>Integración por simetría:</strong> \\(A = 2\\int_0^1 (2 - 2y^2) dy = 2\\left[ 2y - \\frac{2y^3}{3} \\right]_0^1 = \\frac{8}{3} \\text{ u}^2\\).'
      ],
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
        '<strong>Intersecciones:</strong> \\(x^2 = \\frac{2}{x^2+1} \\implies x = \\pm 1\\).',
        '<strong>Integración:</strong> \\(A = 2\\int_0^1 \\left(\\frac{2}{x^2+1} - x^2\\right) dx = \\pi - \\frac{2}{3} \\approx 2.4749 \\text{ u}^2\\).'
      ],
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
        '<strong>Intersecciones:</strong> \\(3y^2 = 3 \\implies y = \\pm 1\\).',
        '<strong>Integración:</strong> \\(A = 2\\int_0^1 (3 - 3y^2) dy = 2(3 - 1) = 4 \\text{ u}^2\\).'
      ],
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
        '<strong>Ecuación y simetría:</strong> \\(x^2 + y^2 = R^2\\). En 4 cuadrantes: \\(A = 4\\int_0^R \\sqrt{R^2 - x^2} dx\\).',
        '<strong>Sustitución trigonométrica:</strong> \\(x = R\\operatorname{sen}\\theta \\implies A = \\pi R^2 \\text{ u}^2\\).'
      ],
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
        <span class="tag">Página 3: Áreas y Personalización</span>
        <h3 id="aTitle"></h3>
        <span class="badge-sol" id="aBadge"></span>
        <div id="aStepsBox">
          <h3>Planteamiento analítico e integración</h3>
          <ol class="steps" id="aSteps"></ol>
        </div>
      </article>

      <article class="card">
        <span class="tag">Explorador y Creador</span>
        <h3>Selecciona o Define Curvas Propias</h3>
        <div class="controls">
          <label style="width:100%">Ejercicio / Modo:
            <select id="aSelect" class="case-select">
              ${cases.map((c, i) => `<option value="${i}">${c.title}</option>`).join('')}
              <option value="custom">✨ Crear mi propio ejemplo: Área entre Parábolas y Rectas</option>
            </select>
          </label>
        </div>

        <div id="aCustomControls" style="display:none; margin-top:12px;" class="controls">
          <label>Altura H de parábola y = H - x²<input id="aH" type="number" step="0.5" value="4"></label>
          <label>Recta inferior y = C<input id="aC" type="number" step="0.5" value="0"></label>
          <button id="btnACustom">Calcular Área de Mi Ejemplo</button>
        </div>

        <p class="result" id="aRes"></p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot"></div>
      </article>
    </div>
  `;

  function update() {
    let val = $('#aSelect').value;
    let isCustom = val === 'custom';
    $('#aCustomControls').style.display = isCustom ? 'flex' : 'none';

    if (isCustom) {
      let H = +$('#aH').value || 4;
      let C = +$('#aC').value || 0;
      let root = Math.sqrt(Math.max(0, H - C));
      let areaVal = (4 / 3) * Math.pow(H - C, 1.5);

      $('#aTitle').textContent = `Tu Ejemplo: Área entre y = ${H} - x² e y = ${C}`;
      $('#aBadge').textContent = `Área calculada: ${areaVal.toFixed(4)} u²`;

      $('#aStepsBox').innerHTML = `
        <h3>Cálculo analítico de tu región</h3>
        <p><strong>Puntos de corte:</strong> \\(${H} - x^2 = ${C} \\implies x^2 = ${H - C} \\implies x = \\pm ${root.toFixed(2)}\\).</p>
        <p><strong>Planteamiento de la integral:</strong></p>
        <div class="formula">$$A = \\int_{-${root.toFixed(2)}}^{${root.toFixed(2)}} [(${H} - x^2) - ${C}] dx = 2\\int_0^{${root.toFixed(2)}} (${H - C} - x^2) dx = ${areaVal.toFixed(4)} \\text{ u}^2$$</div>
      `;
      $('#aRes').textContent = `Área exacta entre y = ${H} - x² e y = ${C}: ${areaVal.toFixed(4)} u²`;

      let xs = Array.from({ length: 200 }, (_, i) => -(root + 0.8) + 2 * (root + 0.8) * i / 199);
      let xB = Array.from({ length: 150 }, (_, i) => -root + 2 * root * i / 149);

      Plotly.newPlot('plot', [
        { x: xs, y: xs.map(x => H - x * x), name: `y = ${H} - x²`, line: { color: '#64d2ff', width: 2.5 } },
        { x: xs, y: xs.map(() => C), name: `y = ${C}`, line: { color: '#ffd60a', width: 2.5 } },
        { x: xB.concat(xB.slice().reverse()), y: xB.map(x => H - x * x).concat(xB.map(() => C).reverse()), fill: 'toself', fillcolor: 'rgba(10, 132, 255, 0.35)', mode: 'none', name: `Región A = ${areaVal.toFixed(2)} u²` }
      ], {
        margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
        xaxis: { title: 'x', gridcolor: '#3a3a3c' },
        yaxis: { title: 'y', gridcolor: '#3a3a3c' },
        paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
      }, { responsive: true });

    } else {
      let idx = +val;
      let item = cases[idx];
      $('#aTitle').textContent = item.title;
      $('#aBadge').textContent = item.badge;
      $('#aStepsBox').innerHTML = `
        <h3>Planteamiento analítico e integración</h3>
        <ol class="steps">${item.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      `;
      $('#aRes').textContent = `Visualización geométrica de la región delimitada`;

      let plotConfig = item.plot();
      Plotly.newPlot('plot', plotConfig.data, {
        margin: { t: 28, l: 48, r: 12, b: 42 }, font: { color: '#f5f5f7' },
        xaxis: { gridcolor: '#3a3a3c', ...plotConfig.xaxis },
        yaxis: { gridcolor: '#3a3a3c', ...plotConfig.yaxis },
        paper_bgcolor: '#1c1c1e', plot_bgcolor: '#1c1c1e', legend: { orientation: 'h' }
      }, { responsive: true });
    }

    math();
  }

  $('#aSelect').onchange = update;
  $('#btnACustom').onclick = update;
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
        '<strong>Base y lado transversal:</strong> Base circular \\(x^2 + y^2 = 1\\). Lado transversal: \\(L(x) = 2\\sqrt{1 - x^2}\\).',
        '<strong>Área transversal A(x):</strong> \\(A(x) = \\frac{\\sqrt{3}}{4}[L(x)]^2 = \\sqrt{3}(1 - x^2)\\).',
        '<strong>Cálculo del volumen:</strong> \\(V = 2\\sqrt{3}\\int_0^1 (1 - x^2) dx = \\frac{4\\sqrt{3}}{3} \\text{ u}^3\\).'
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
            rowX.push(u); rowY.push(v * semiW); rowZ.push(Math.sqrt(3) * (1 - Math.abs(v)) * semiW);
          }
          x.push(rowX); y.push(rowY); z.push(rowZ);
        }
        return [{ type: 'surface', x, y, z, colorscale: 'Viridis', showscale: false, name: 'Triángulos Equiláteros' }];
      }
    },
    {
      id: 2,
      title: 'Taller Final — Ejercicio 2: Base parabólica y secciones cuadradas',
      badge: 'Volumen = 16/15 u³ ≈ 1.0667 u³',
      steps: [
        '<strong>Límites:</strong> \\(1 - x^2/4 = 0 \\implies x \\in [0, 2]\\).',
        '<strong>Lado del cuadrado y área:</strong> \\(L(x) = 1 - x^2/4\\). \\(A(x) = 1 - x^2/2 + x^4/16\\).',
        '<strong>Cálculo del volumen:</strong> \\(V = \\int_0^2 (1 - x^2/2 + x^4/16) dx = \\frac{16}{15} \\text{ u}^3\\).'
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
            rowX.push(u); rowY.push(v * L); rowZ.push(L);
          }
          x.push(rowX); y.push(rowY); z.push(rowZ);
        }
        return [{ type: 'surface', x, y, z, colorscale: 'Plasma', showscale: false, name: 'Secciones Cuadradas' }];
      }
    }
  ];

  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 4: Sólidos Transversales</span>
        <h3 id="csTitle"></h3>
        <span class="badge-sol" id="csBadge"></span>
        <div class="formula">$$V = \\int_a^b A(x) \\, dx$$</div>
        <div id="csStepsBox">
          <h3>Procedimiento y cálculo de volumen</h3>
          <ol class="steps" id="csSteps"></ol>
        </div>
      </article>

      <article class="card">
        <span class="tag">Visualizador y Modelador 3D</span>
        <h3>Selecciona o Crea tu Sólido 3D</h3>
        <div class="controls">
          <label style="width:100%">Modo / Ejercicio:
            <select id="csSelect" class="case-select">
              ${cases.map((c, i) => `<option value="${i}">${c.title}</option>`).join('')}
              <option value="custom">✨ Crear mi propio ejemplo: Base Circular con Radio R</option>
            </select>
          </label>
        </div>

        <div id="csCustomControls" style="display:none; margin-top:12px;" class="controls">
          <label>Radio de la base R<input id="csR" type="number" min="0.5" max="5" step="0.5" value="2"></label>
          <label>Tipo de Sección:
            <select id="csType">
              <option value="tri">Triángulo Equilátero</option>
              <option value="semi">Semicírculo</option>
            </select>
          </label>
          <button id="btnCSCustom">Generar Sólido 3D</button>
        </div>

        <p class="result" id="csRes"></p>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:8px;">💡 Usa el ratón para rotar el sólido y apreciar las secciones transversales en 3D.</p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot" style="height:450px;"></div>
      </article>
    </div>
  `;

  function update() {
    let val = $('#csSelect').value;
    let isCustom = val === 'custom';
    $('#csCustomControls').style.display = isCustom ? 'flex' : 'none';

    if (isCustom) {
      let R = +$('#csR').value || 2;
      let type = $('#csType').value;
      let isTri = type === 'tri';
      let vol = isTri ? (4 * Math.sqrt(3) * Math.pow(R, 3) / 3) : (2 * Math.PI * Math.pow(R, 3) / 3);

      $('#csTitle').textContent = `Tu Sólido: Base Circular R = ${R} (${isTri ? 'Triángulos Equiláteros' : 'Semicírculos'})`;
      $('#csBadge').textContent = `Volumen = ${vol.toFixed(4)} u³`;

      $('#csStepsBox').innerHTML = `
        <h3>Formulación de tu sólido personalizado</h3>
        <p><strong>Base:</strong> Círculo \\(x^2 + y^2 = ${R * R}\\). Lado transversal: \\(L(x) = 2\\sqrt{${R * R} - x^2}\\).</p>
        <p><strong>Área transversal:</strong> ${isTri ? `\\(A(x) = \\frac{\\sqrt{3}}{4}L^2 = \\sqrt{3}(${R * R} - x^2)\\)` : `\\(A(x) = \\frac{\\pi}{8}L^2 = \\frac{\\pi}{2}(${R * R} - x^2)\\)`}.</p>
        <div class="formula">$$V = \\int_{-${R}}^{${R}} A(x) dx = ${vol.toFixed(4)} \\text{ u}^3$$</div>
      `;
      $('#csRes').textContent = `Renderizando modelo 3D con R = ${R}`;

      let nU = 35, nV = 35;
      let uVals = Array.from({ length: nU }, (_, i) => -R * 0.99 + 1.98 * R * i / (nU - 1));
      let vVals = Array.from({ length: nV }, (_, j) => -1 + 2 * j / (nV - 1));
      let x = [], y = [], z = [];
      for (let j = 0; j < nV; j++) {
        let rowX = [], rowY = [], rowZ = [];
        let v = vVals[j];
        for (let i = 0; i < nU; i++) {
          let u = uVals[i];
          let semiW = Math.sqrt(Math.max(0, R * R - u * u));
          rowX.push(u);
          rowY.push(v * semiW);
          rowZ.push(isTri ? Math.sqrt(3) * (1 - Math.abs(v)) * semiW : Math.sqrt(Math.max(0, 1 - v * v)) * semiW);
        }
        x.push(rowX); y.push(rowY); z.push(rowZ);
      }

      Plotly.newPlot('plot', [{ type: 'surface', x, y, z, colorscale: isTri ? 'Viridis' : 'Plasma', showscale: false }], {
        margin: { t: 20, l: 10, r: 10, b: 20 }, paper_bgcolor: '#1c1c1e',
        scene: {
          xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
          yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
          zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' }
        }
      }, { responsive: true });

    } else {
      let idx = +val;
      let item = cases[idx];
      $('#csTitle').textContent = item.title;
      $('#csBadge').textContent = item.badge;
      $('#csStepsBox').innerHTML = `
        <h3>Procedimiento y cálculo de volumen</h3>
        <ol class="steps">${item.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      `;
      $('#csRes').textContent = `Renderizando sólido geométrico del parcial`;

      Plotly.newPlot('plot', item.generate3D(), {
        margin: { t: 20, l: 10, r: 10, b: 20 }, paper_bgcolor: '#1c1c1e',
        scene: {
          xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
          yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
          zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' },
          camera: { eye: { x: 1.6, y: 1.5, z: 1.2 } }
        }
      }, { responsive: true });
    }

    math();
  }

  $('#csSelect').onchange = update;
  $('#btnCSCustom').onclick = update;
  update();
}

/* ==========================================================================
   MÓDULO 12: Sólidos de Revolución · Método de Discos
   ========================================================================== */
function disks() {
  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 5: Discos y Personalización</span>
        <h3 id="diskTitle">Sólido de Revolución · Giro alrededor de y = 1</h3>
        <span class="badge-sol" id="diskBadge">Volumen = 16π / 15 u³ ≈ 3.3510 u³</span>
        <div class="formula">$$V = \\pi \\int_a^b [r(x)]^2 \\, dx$$</div>
        <div id="diskStepsBox">
          <h3>Procedimiento resuelto paso a paso</h3>
          <ol class="steps">
            <li><strong>Región y cortes:</strong> Parábola \\(y = 2 - x^2\\) y recta \\(y = 1\\). Cortes: \\(x = \\pm 1\\).</li>
            <li><strong>Radio respecto al eje:</strong> \\(r(x) = (2 - x^2) - 1 = 1 - x^2\\).</li>
            <li><strong>Cálculo del volumen:</strong> \\(V = 2\\pi \\int_0^1 (1 - 2x^2 + x^4) dx = \\frac{16\\pi}{15} \\text{ u}^3\\).</li>
          </ol>
        </div>
      </article>

      <article class="card">
        <span class="tag">Modelo y Personalización 3D</span>
        <h3>Selecciona o Configura tu Rotación</h3>
        <div class="controls">
          <label style="width:100%">Modo:
            <select id="diskSelect" class="case-select">
              <option value="parcial">Ejemplo del Parcial: y = 2 - x² alrededor de y = 1</option>
              <option value="custom">✨ Crear mi propio ejemplo: y = H - x² alrededor de y = y₀</option>
            </select>
          </label>
        </div>

        <div id="diskCustomControls" style="display:none; margin-top:12px;" class="controls">
          <label>Altura H de y = H - x²<input id="dH" type="number" step="0.5" value="3"></label>
          <label>Eje de rotación y₀<input id="dY0" type="number" step="0.5" value="1"></label>
          <button id="btnDiskCustom">Rotar Sólido 3D</button>
        </div>

        <p class="result" id="diskRes"></p>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:8px;">💡 Gira con el ratón en 3D para apreciar la superficie de revolución cerrada.</p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot" style="height:450px;"></div>
      </article>
    </div>
  `;

  function update() {
    let isCustom = $('#diskSelect').value === 'custom';
    $('#diskCustomControls').style.display = isCustom ? 'flex' : 'none';

    let H = isCustom ? (+($('#dH').value) || 3) : 2;
    let y0 = isCustom ? (+($('#dY0').value) || 1) : 1;
    let diff = Math.max(0.1, H - y0);
    let root = Math.sqrt(diff);

    let vol = 2 * Math.PI * (Math.pow(diff, 2) * root - (2 * diff * Math.pow(root, 3)) / 3 + Math.pow(root, 5) / 5);

    if (isCustom) {
      $('#diskTitle').textContent = `Tu Sólido: y = ${H} - x² rotado en y = ${y0}`;
      $('#diskBadge').textContent = `Volumen = ${vol.toFixed(4)} u³`;
      $('#diskStepsBox').innerHTML = `
        <h3>Cálculo de tu rotación personalizada</h3>
        <p><strong>Cortes con el eje de giro:</strong> \\(${H} - x^2 = ${y0} \\implies x = \\pm ${root.toFixed(2)}\\).</p>
        <p><strong>Radio del disco:</strong> \\(r(x) = (${H} - x^2) - ${y0} = ${diff.toFixed(2)} - x^2\\).</p>
        <div class="formula">$$V = \\pi \\int_{-${root.toFixed(2)}}^{${root.toFixed(2)}} (${diff.toFixed(2)} - x^2)^2 dx = ${vol.toFixed(4)} \\text{ u}^3$$</div>
      `;
      $('#diskRes').textContent = `Volumen exacto generado: ${vol.toFixed(4)} u³`;
    } else {
      $('#diskTitle').textContent = 'Sólido de Revolución · Giro alrededor de y = 1';
      $('#diskBadge').textContent = 'Volumen = 16π / 15 u³ ≈ 3.3510 u³';
      $('#diskStepsBox').innerHTML = `
        <h3>Procedimiento resuelto paso a paso</h3>
        <ol class="steps">
          <li><strong>Región y cortes:</strong> Parábola \\(y = 2 - x^2\\) y recta \\(y = 1\\). Cortes: \\(x = \\pm 1\\).</li>
          <li><strong>Radio respecto al eje:</strong> \\(r(x) = (2 - x^2) - 1 = 1 - x^2\\).</li>
          <li><strong>Cálculo del volumen:</strong> \\(V = 2\\pi \\int_0^1 (1 - 2x^2 + x^4) dx = \\frac{16\\pi}{15} \\text{ u}^3\\).</li>
        </ol>
      `;
      $('#diskRes').textContent = 'Sólido cerrado sin hueco interno (Método de Discos)';
    }

    let nU = 35, nV = 35;
    let uVals = Array.from({ length: nU }, (_, i) => -root + 2 * root * i / (nU - 1));
    let vVals = Array.from({ length: nV }, (_, j) => 2 * Math.PI * j / (nV - 1));
    let x = [], y = [], z = [];
    for (let j = 0; j < nV; j++) {
      let rowX = [], rowY = [], rowZ = [];
      let v = vVals[j];
      let cosV = Math.cos(v), sinV = Math.sin(v);
      for (let i = 0; i < nU; i++) {
        let u = uVals[i];
        let r = Math.max(0, diff - u * u);
        rowX.push(u); rowY.push(y0 + r * cosV); rowZ.push(r * sinV);
      }
      x.push(rowX); y.push(rowY); z.push(rowZ);
    }

    let axisX = [-(root + 0.4), root + 0.4], axisY = [y0, y0], axisZ = [0, 0];

    Plotly.newPlot('plot', [
      { type: 'surface', x, y, z, colorscale: 'Viridis', showscale: false, name: 'Sólido 3D' },
      { type: 'scatter3d', x: axisX, y: axisY, z: axisZ, mode: 'lines', line: { color: '#ffd60a', width: 6 }, name: `Eje y = ${y0}` }
    ], {
      margin: { t: 20, l: 10, r: 10, b: 20 }, paper_bgcolor: '#1c1c1e',
      scene: {
        xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        camera: { eye: { x: 1.4, y: 1.5, z: 1.1 } }
      }
    }, { responsive: true });

    math();
  }

  $('#diskSelect').onchange = update;
  $('#btnDiskCustom').onclick = update;
  update();
}

/* ==========================================================================
   MÓDULO 13: Sólidos de Revolución · Método de Arandelas
   ========================================================================== */
function washers() {
  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 6: Arandelas y Personalización</span>
        <h3 id="washTitle">Giro de Región Base en Torno a y = 7</h3>
        <span class="badge-sol" id="washBadge">Volumen = 576π / 5 u³ ≈ 361.9115 u³</span>
        <div class="formula">$$V = \\pi \\int_a^b \\left( [R_{ext}(x)]^2 - [r_{int}(x)]^2 \\right) dx$$</div>
        <div id="washStepsBox">
          <h3>Procedimiento resuelto paso a paso</h3>
          <ol class="steps">
            <li><strong>Región base:</strong> Acotada por \\(y = 4 - x^2\\) y \\(y = 0\\), cortes \\(x = \\pm 2\\).</li>
            <li><strong>Radios respecto a y = 7:</strong> \\(R_{ext} = 7 - 0 = 7\\), \\(r_{int} = 7 - (4 - x^2) = 3 + x^2\\).</li>
            <li><strong>Cálculo del volumen:</strong> \\(V = 2\\pi \\int_0^2 (40 - 6x^2 - x^4) dx = \\frac{576\\pi}{5} \\text{ u}^3\\).</li>
          </ol>
        </div>
      </article>

      <article class="card">
        <span class="tag">Modelo Tridimensional</span>
        <h3>Selecciona o Ajusta el Eje de Giro</h3>
        <div class="controls">
          <label style="width:100%">Modo:
            <select id="washSelect" class="case-select">
              <option value="parcial">Ejemplo del Parcial: y = 4 - x² en torno a y = 7</option>
              <option value="custom">✨ Crear mi propio ejemplo: Modificar Eje de Giro y = Y_eje</option>
            </select>
          </label>
        </div>

        <div id="washCustomControls" style="display:none; margin-top:12px;" class="controls">
          <label>Eje de giro exterior y =<input id="wAxis" type="number" min="4.5" max="15" step="0.5" value="6"></label>
          <button id="btnWashCustom">Actualizar Arandela 3D</button>
        </div>

        <p class="result" id="washRes"></p>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:8px;">💡 La superficie exterior translúcida permite ver la cavidad interna modelada en 3D.</p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot" style="height:450px;"></div>
      </article>
    </div>
  `;

  function update() {
    let isCustom = $('#washSelect').value === 'custom';
    $('#washCustomControls').style.display = isCustom ? 'flex' : 'none';

    let yAxis = isCustom ? (+($('#wAxis').value) || 6) : 7;
    let A = 8 * yAxis - 16;
    let B = 2 * (yAxis - 4);
    let vol = 2 * Math.PI * (A * 2 - (B * 8) / 3 - 32 / 5);

    if (isCustom) {
      $('#washTitle').textContent = `Tu Arandela: y = 4 - x² girando en y = ${yAxis}`;
      $('#washBadge').textContent = `Volumen = ${vol.toFixed(4)} u³`;
      $('#washStepsBox').innerHTML = `
        <h3>Análisis con eje y = ${yAxis}</h3>
        <p><strong>Radio Exterior:</strong> \\(R_{ext}(x) = ${yAxis} - 0 = ${yAxis}\\).</p>
        <p><strong>Radio Interior:</strong> \\(r_{int}(x) = ${yAxis} - (4 - x^2) = ${yAxis - 4} + x^2\\).</p>
        <div class="formula">$$V = 2\\pi \\int_0^2 \\left[ ${yAxis}^2 - (${yAxis - 4} + x^2)^2 \\right] dx = ${vol.toFixed(4)} \\text{ u}^3$$</div>
      `;
      $('#washRes').textContent = `Volumen de la arandela con eje y = ${yAxis}: ${vol.toFixed(4)} u³`;
    } else {
      $('#washTitle').textContent = 'Giro de Región Base en Torno a y = 7';
      $('#washBadge').textContent = 'Volumen = 576π / 5 u³ ≈ 361.9115 u³';
      $('#washStepsBox').innerHTML = `
        <h3>Procedimiento resuelto paso a paso</h3>
        <ol class="steps">
          <li><strong>Región base:</strong> Acotada por \\(y = 4 - x^2\\) y \\(y = 0\\), cortes \\(x = \\pm 2\\).</li>
          <li><strong>Radios respecto a y = 7:</strong> \\(R_{ext} = 7 - 0 = 7\\), \\(r_{int} = 7 - (4 - x^2) = 3 + x^2\\).</li>
          <li><strong>Cálculo del volumen:</strong> \\(V = 2\\pi \\int_0^2 (40 - 6x^2 - x^4) dx = \\frac{576\\pi}{5} \\text{ u}^3\\).</li>
        </ol>
      `;
      $('#washRes').textContent = 'Doble superficie: externa e interna con hueco';
    }

    let nU = 30, nV = 30;
    let uVals = Array.from({ length: nU }, (_, i) => -2 + 4 * i / (nU - 1));
    let vVals = Array.from({ length: nV }, (_, j) => 2 * Math.PI * j / (nV - 1));

    let xInt = [], yInt = [], zInt = [];
    let xExt = [], yExt = [], zExt = [];

    for (let j = 0; j < nV; j++) {
      let rowXI = [], rowYI = [], rowZI = [];
      let rowXE = [], rowYE = [], rowZE = [];
      let v = vVals[j];
      let cosV = Math.cos(v), sinV = Math.sin(v);
      for (let i = 0; i < nU; i++) {
        let u = uVals[i];
        let rI = (yAxis - 4) + u * u;
        let rE = yAxis;
        rowXI.push(u); rowYI.push(yAxis - rI * cosV); rowZI.push(rI * sinV);
        rowXE.push(u); rowYE.push(yAxis - rE * cosV); rowZE.push(rE * sinV);
      }
      xInt.push(rowXI); yInt.push(rowYI); zInt.push(rowZI);
      xExt.push(rowXE); yExt.push(rowYE); zExt.push(rowZE);
    }

    let axisX = [-2.5, 2.5], axisY = [yAxis, yAxis], axisZ = [0, 0];

    Plotly.newPlot('plot', [
      { type: 'surface', x: xInt, y: yInt, z: zInt, colorscale: 'Plasma', showscale: false, name: 'Cavidad Interior' },
      { type: 'surface', x: xExt, y: yExt, z: zExt, colorscale: 'Blues', opacity: 0.45, showscale: false, name: 'Cilindro Exterior' },
      { type: 'scatter3d', x: axisX, y: axisY, z: axisZ, mode: 'lines', line: { color: '#ffd60a', width: 6 }, name: `Eje y = ${yAxis}` }
    ], {
      margin: { t: 20, l: 10, r: 10, b: 20 }, paper_bgcolor: '#1c1c1e',
      scene: {
        xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        camera: { eye: { x: 1.5, y: 1.6, z: 1.2 } }
      }
    }, { responsive: true });

    math();
  }

  $('#washSelect').onchange = update;
  $('#btnWashCustom').onclick = update;
  update();
}

/* ==========================================================================
   MÓDULO 14: Sólidos de Revolución · Capas Cilíndricas (Cascarones)
   ========================================================================== */
function shells() {
  $('#content').innerHTML = `
    <div class="grid">
      <article class="card">
        <span class="tag">Página 6: Capas Cilíndricas y Personalización</span>
        <h3 id="shellTitle">Giro de Región Base en Torno a x = 3</h3>
        <span class="badge-sol" id="shellBadge">Volumen = 64π u³ ≈ 201.0619 u³</span>
        <div class="formula">$$V = 2\\pi \\int_a^b r(x) \\, h(x) \\, dx$$</div>
        <div id="shellStepsBox">
          <h3>Procedimiento resuelto paso a paso</h3>
          <ol class="steps">
            <li><strong>Región base:</strong> Acotada por \\(y = 4 - x^2\\) y \\(y = 0\\), cortes \\(x = \\pm 2\\).</li>
            <li><strong>Elementos de la capa:</strong> Radio \\(r(x) = 3 - x\\), Altura \\(h(x) = 4 - x^2\\).</li>
            <li><strong>Cálculo del volumen:</strong> \\(V = 2\\pi \\int_{-2}^2 (3 - x)(4 - x^2) dx = 64\\pi \\text{ u}^3\\).</li>
          </ol>
        </div>
      </article>

      <article class="card">
        <span class="tag">Modelo y Personalización 3D</span>
        <h3>Selecciona o Ajusta el Eje Vertical</h3>
        <div class="controls">
          <label style="width:100%">Modo:
            <select id="shellSelect" class="case-select">
              <option value="parcial">Ejemplo del Parcial: Giro alrededor de x = 3</option>
              <option value="custom">✨ Crear mi propio ejemplo: Eje vertical x = x₀</option>
            </select>
          </label>
        </div>

        <div id="shellCustomControls" style="display:none; margin-top:12px;" class="controls">
          <label>Eje de giro vertical x₀<input id="sAxis" type="number" min="2.2" max="10" step="0.5" value="4"></label>
          <button id="btnShellCustom">Actualizar Capas 3D</button>
        </div>

        <p class="result" id="shellRes"></p>
        <p style="color:var(--muted);font-size:0.85rem;margin-top:8px;">💡 La línea vertical dorada indica el eje de revolución elegido.</p>
      </article>

      <article class="card wide">
        <div id="plot" class="plot" style="height:450px;"></div>
      </article>
    </div>
  `;

  function update() {
    let isCustom = $('#shellSelect').value === 'custom';
    $('#shellCustomControls').style.display = isCustom ? 'flex' : 'none';

    let xAxis = isCustom ? (+($('#sAxis').value) || 4) : 3;
    let vol = 2 * Math.PI * xAxis * (32 / 3);

    if (isCustom) {
      $('#shellTitle').textContent = `Tus Capas: y = 4 - x² girando en torno a x = ${xAxis}`;
      $('#shellBadge').textContent = `Volumen = ${vol.toFixed(4)} u³`;
      $('#shellStepsBox').innerHTML = `
        <h3>Cálculo analítico con eje x = ${xAxis}</h3>
        <p><strong>Radio de la capa cilíndrica:</strong> \\(r(x) = ${xAxis} - x\\).</p>
        <p><strong>Altura de la capa cilíndrica:</strong> \\(h(x) = 4 - x^2\\).</p>
        <p>Por simetría, la integral del término impar se anula en \\([-2, 2]\\):</p>
        <div class="formula">$$V = 2\\pi \\int_{-2}^2 (${xAxis} - x)(4 - x^2) dx = 2\\pi (${xAxis}) \\int_{-2}^2 (4 - x^2) dx = \\frac{64\\pi (${xAxis})}{3} \\approx ${vol.toFixed(4)} \\text{ u}^3$$</div>
      `;
      $('#shellRes').textContent = `Volumen por capas con eje x = ${xAxis}: ${vol.toFixed(4)} u³`;
    } else {
      $('#shellTitle').textContent = 'Giro de Región Base en Torno a x = 3';
      $('#shellBadge').textContent = 'Volumen = 64π u³ ≈ 201.0619 u³';
      $('#shellStepsBox').innerHTML = `
        <h3>Procedimiento resuelto paso a paso</h3>
        <ol class="steps">
          <li><strong>Región base:</strong> Acotada por \\(y = 4 - x^2\\) y \\(y = 0\\), cortes \\(x = \\pm 2\\).</li>
          <li><strong>Elementos de la capa:</strong> Radio \\(r(x) = 3 - x\\), Altura \\(h(x) = 4 - x^2\\).</li>
          <li><strong>Cálculo del volumen:</strong> \\(V = 2\\pi \\int_{-2}^2 (3 - x)(4 - x^2) dx = 64\\pi \\text{ u}^3\\).</li>
        </ol>
      `;
      $('#shellRes').textContent = 'Sólido generado alrededor de x = 3';
    }

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
        let radius = xAxis - u;
        rowX.push(xAxis - radius * cosV);
        rowY.push(Math.max(0, 4 - u * u));
        rowZ.push(radius * sinV);
      }
      x.push(rowX); y.push(rowY); z.push(rowZ);
    }

    let axisX = [xAxis, xAxis], axisY = [-0.5, 5], axisZ = [0, 0];

    Plotly.newPlot('plot', [
      { type: 'surface', x, y, z, colorscale: 'Viridis', showscale: false, name: 'Capas Cilíndricas' },
      { type: 'scatter3d', x: axisX, y: axisY, z: axisZ, mode: 'lines', line: { color: '#ffd60a', width: 6 }, name: `Eje x = ${xAxis}` }
    ], {
      margin: { t: 20, l: 10, r: 10, b: 20 }, paper_bgcolor: '#1c1c1e',
      scene: {
        xaxis: { title: 'X', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        yaxis: { title: 'Y', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        zaxis: { title: 'Z', color: '#f5f5f7', gridcolor: '#3a3a3c' },
        camera: { eye: { x: 1.6, y: 1.5, z: 1.3 } }
      }
    }, { responsive: true });

    math();
  }

  $('#shellSelect').onchange = update;
  $('#btnShellCustom').onclick = update;
  update();
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
