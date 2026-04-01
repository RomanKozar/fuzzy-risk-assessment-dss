// ══════════════════════════════════════════════
//  SNOWFALL ENGINE
// ══════════════════════════════════════════════
const canvas = document.getElementById('snow-canvas')
const ctx = canvas.getContext('2d')
let W,
	H,
	flakes = []

function resizeCanvas() {
	W = canvas.width = window.innerWidth
	H = canvas.height = window.innerHeight
}
resizeCanvas()
window.addEventListener('resize', resizeCanvas)

// Snow cannons shoot from sides
function createFlake(fromCannon) {
	const side = fromCannon || (Math.random() < 0.5 ? 'left' : 'right')
	const isLeft = side === 'left'
	return {
		x: isLeft ? -10 : W + 10,
		y: H - 20 - Math.random() * 120,
		vx: isLeft ? 1.5 + Math.random() * 2.5 : -(1.5 + Math.random() * 2.5),
		vy: -(2 + Math.random() * 3),
		gravity: 0.06 + Math.random() * 0.04,
		size: 1.5 + Math.random() * 3,
		opacity: 0.5 + Math.random() * 0.5,
		life: 1,
		decay: 0.003 + Math.random() * 0.003,
	}
}

// Initialize
for (let i = 0; i < 60; i++) {
	const f = createFlake()
	f.x = Math.random() * W
	f.y = Math.random() * H
	f.life = Math.random()
	flakes.push(f)
}

function animateSnow() {
	ctx.clearRect(0, 0, W, H)
	// shoot new flakes
	if (Math.random() < 0.3) flakes.push(createFlake('left'))
	if (Math.random() < 0.3) flakes.push(createFlake('right'))

	flakes = flakes.filter(f => f.life > 0 && f.y > -50 && f.y < H + 50)

	flakes.forEach(f => {
		f.x += f.vx
		f.y += f.vy
		f.vy += f.gravity
		f.vx *= 0.995
		f.life -= f.decay

		ctx.beginPath()
		ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2)
		ctx.fillStyle = `rgba(180, 220, 255, ${f.opacity * f.life})`
		ctx.fill()
	})

	requestAnimationFrame(animateSnow)
}
animateSnow()

// ══════════════════════════════════════════════
//  TERMS DATA
// ══════════════════════════════════════════════
const TERMS = [
	{ id: 'T1', name: 'Незначний ризик', a: 0, b: 20 },
	{ id: 'T2', name: 'Низький ризик', a: 20, b: 40 },
	{ id: 'T3', name: 'Середній ризик', a: 40, b: 60 },
	{ id: 'T4', name: 'Високий ризик', a: 60, b: 80 },
	{ id: 'T5', name: 'Граничний ризик', a: 80, b: 100 },
]
const A_MAX = 100

function renderTerms() {
	const c = document.getElementById('terms-container')
	c.innerHTML = TERMS.map(
		t => `
<div class="term-item">
  <div class="term-label">${t.id}</div>
  <div class="term-name">${t.name}</div>
  <div class="term-range">[${t.a};${t.b}]</div>
</div>
`,
	).join('')
}
renderTerms()

// ══════════════════════════════════════════════
//  OBJECTS DATA
// ══════════════════════════════════════════════
let objects = []

function addObject(name = '', termId = 'T3', delta = 0.5, weight = 7) {
	objects.push({ name, termId, delta, weight })
	renderObjects()
}

function removeObject(i) {
	objects.splice(i, 1)
	renderObjects()
}

function clearObjects() {
	objects = []
	renderObjects()
}

function renderObjects() {
	const tbody = document.getElementById('objects-body')
	if (objects.length === 0) {
		tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-dim);font-size:13px;">Натисніть «+ Додати об'єкт» або завантажте приклад</td></tr>`
		return
	}
	tbody.innerHTML = objects
		.map(
			(o, i) => `
<tr>
  <td style="color:var(--text-dim);font-family:'Orbitron',monospace;font-size:11px;">${i + 1}</td>
  <td><input class="inp obj-name-inp" value="${o.name}" oninput="objects[${i}].name=this.value" placeholder="Об'єкт ${i + 1}"></td>
  <td>
    <select class="inp" onchange="objects[${i}].termId=this.value" style="min-width:150px;">
      ${TERMS.map(t => `<option value="${t.id}" ${t.id === o.termId ? 'selected' : ''}>${t.id} — ${t.name}</option>`).join('')}
    </select>
  </td>
  <td>
    <div class="delta-wrap">
      <input type="range" min="0" max="1" step="0.01" value="${o.delta}"
        oninput="objects[${i}].delta=parseFloat(this.value);this.nextElementSibling.textContent=parseFloat(this.value).toFixed(2)">
      <div class="delta-val">${Number(o.delta).toFixed(2)}</div>
    </div>
  </td>
  <td>
    <input class="weight-inp" type="number" min="1" max="10" value="${o.weight}"
      oninput="objects[${i}].weight=Math.max(1,Math.min(10,parseInt(this.value)||1))">
  </td>
  <td>
    <button class="btn btn-danger btn-sm" onclick="removeObject(${i})">✕</button>
  </td>
</tr>
`,
		)
		.join('')
}
renderObjects()

// ══════════════════════════════════════════════
//  EXAMPLE DATA (з лабораторної роботи)
// ══════════════════════════════════════════════
function loadExample() {
	const example = [
		{ name: 'R1 — Перерви послуг', termId: 'T5', delta: 0.9, weight: 10 },
		{ name: 'R2 — Конкуренція', termId: 'T3', delta: 0.7, weight: 8 },
		{ name: 'R3 — Стагнація ринку', termId: 'T2', delta: 0.5, weight: 7 },
		{ name: 'R4 — Стихійні лиха', termId: 'T1', delta: 0.3, weight: 7 },
		{
			name: 'R5 — Зміни регулятора',
			termId: 'T2',
			delta: 0.5,
			weight: 7,
		},
		{
			name: 'R6 — Політ./соц. кризи',
			termId: 'T4',
			delta: 0.6,
			weight: 8,
		},
		{
			name: 'R7 — Зміна ціни сировини',
			termId: 'T3',
			delta: 0.7,
			weight: 9,
		},
		{ name: 'R8 — Техн. інновації', termId: 'T2', delta: 0.5, weight: 7 },
		{ name: 'R9 — Кібер-загрози', termId: 'T3', delta: 0.7, weight: 9 },
		{ name: 'R10 — Тероризм', termId: 'T3', delta: 0.6, weight: 10 },
		{ name: 'R11 — Забруднення', termId: 'T3', delta: 0.5, weight: 7 },
		{
			name: 'R12 — Вибухонебезпека',
			termId: 'T1',
			delta: 0.3,
			weight: 6,
		},
	]
	objects = example
	renderObjects()
	switchTab('tab-objects')
}

// ══════════════════════════════════════════════
//  CALCULATION ENGINE
// ══════════════════════════════════════════════
function fuzzify(termId, delta) {
	const term = TERMS.find(t => t.id === termId)
	const a = term.a,
		b = term.b
	let chi
	if (delta <= 0.5) {
		chi = Math.sqrt(delta / 2) * (b - a) + a
	} else {
		chi = b - Math.sqrt((1 - delta) / 2) * (b - a)
	}
	const theta = chi / A_MAX
	return { chi: +chi.toFixed(4), theta: +theta.toFixed(4) }
}

function getLevelInfo(r) {
	if (r > 0.8)
		return { label: 'Низький ризик', color: '#00e676', bg: '#00e67620' }
	else if (r > 0.6)
		return {
			label: 'Нижче середнього',
			color: '#80ff80',
			bg: '#80ff8020',
		}
	else if (r > 0.4)
		return { label: 'Середній ризик', color: '#ffab40', bg: '#ffab4020' }
	else if (r > 0.2)
		return { label: 'Вище середнього', color: '#ff9944', bg: '#ff994420' }
	else return { label: 'Високий ризик', color: '#ff4444', bg: '#ff444420' }
}

function calculate() {
	if (objects.length === 0) {
		alert("Додайте хоча б один об'єкт дослідження!")
		return
	}

	// Step 1: fuzzify each object
	const step1 = objects.map(o => fuzzify(o.termId, o.delta))
	const chiVals = step1.map(s => s.chi)
	const thetaVals = step1.map(s => s.theta)

	// Step 2: aggregate (since each object = 1 criterion, phi = theta)
	// If objects had sub-criteria we'd average; here phi_i = theta_i
	const phiVals = thetaVals.slice()

	// Step 3: normalized weights
	const weights = objects.map(o => o.weight)
	const sumW = weights.reduce((a, b) => a + b, 0)
	const vVals = weights.map(w => +(w / sumW).toFixed(4))

	// Step 4: defuzzify
	const R = vVals.reduce((acc, v, i) => acc + v * (1 - phiVals[i]), 0)
	const Rval = +R.toFixed(4)

	const level = getLevelInfo(Rval)
	const sysName = document.getElementById('system-name').value || 'Система'

	// ── RENDER RESULT ──
	const rs = document.getElementById('result-section')
	rs.style.display = 'block'
	document.getElementById('result-placeholder').style.display = 'none'

	const fillAngle = Math.round(Rval * 283) // circumference ≈ 283

	rs.innerHTML = `
<div class="panel">
  <div class="section-title">🎯 Підсумкова оцінка — ${sysName}</div>
  <div class="result-gauge-wrap">
    <div class="gauge-ring">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#0a1f3c" stroke-width="8"/>
        <circle cx="50" cy="50" r="45" fill="none"
          stroke="${level.color}" stroke-width="8"
          stroke-dasharray="${fillAngle} 283"
          stroke-dashoffset="70.75"
          stroke-linecap="round"
          style="transition:stroke-dasharray 1s ease;filter:drop-shadow(0 0 6px ${level.color})"/>
      </svg>
      <div class="gauge-value">
        <div class="gauge-number">${Rval.toFixed(3)}</div>
        <div class="gauge-label">R(S)</div>
      </div>
    </div>
    <div class="result-level">
      <div class="level-badge" style="background:${level.bg};color:${level.color};border:1.5px solid ${level.color}33;">
        ${level.label}
      </div>
      <div class="level-desc">Рівень керованості: ${level.label.toLowerCase()} для ${sysName}</div>
    </div>
  </div>
</div>

<div class="steps-grid">
  <div class="step-card">
    <div class="step-num">КРОК 1 — ФАЗИФІКАЦІЯ</div>
    <div class="step-vals">
      χ = [${chiVals.map(v => v.toFixed(2)).join('; ')}]<br>
      <span>θ = [${thetaVals.map(v => v.toFixed(3)).join('; ')}]</span>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">КРОК 2 — АГРЕГУВАННЯ</div>
    <div class="step-vals">
      <span>φ = [${phiVals.map(v => v.toFixed(3)).join('; ')}]</span>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">КРОК 3 — ВАГОВІ КОЕ-ТИ</div>
    <div class="step-vals">
      w = [${weights.join('; ')}]<br>
      <span>v = [${vVals.join('; ')}]</span>
    </div>
  </div>
  <div class="step-card">
    <div class="step-num">КРОК 4 — ДЕФАЗИФІКАЦІЯ</div>
    <div class="step-vals">
      <span>R₃(S) = ${Rval}</span><br>
      Рівень: <span>${level.label}</span>
    </div>
  </div>
</div>

<div class="panel">
  <div class="section-title">📊 Діаграма θ по об'єктах</div>
  <div class="chart-wrap">
    ${objects
			.map((o, i) => {
				const pct = Math.round(thetaVals[i] * 100)
				const barColor =
					thetaVals[i] < 0.35
						? '#00e676'
						: thetaVals[i] < 0.5
							? '#80ff80'
							: thetaVals[i] < 0.65
								? '#ffab40'
								: '#ff4444'
				return `
      <div class="bar-row">
        <div class="bar-label" title="${o.name}">${o.name.substring(0, 12)}</div>
        <div class="bar-track">
          <div class="bar-fill" data-val="${thetaVals[i].toFixed(3)}"
            style="width:${pct}%;background:linear-gradient(90deg,${barColor}88,${barColor});"></div>
        </div>
      </div>`
			})
			.join('')}
  </div>
</div>

<div class="panel">
  <div class="section-title">📋 Шкала рівнів керованості</div>
  <table class="levels-table">
    <tr>
      <td>R ∈ (0.8; 1]</td>
      <td style="color:#00e676">✅ Низький ризик — висока керованість</td>
      <td>${Rval > 0.8 ? '◀ Ваш результат' : ''}</td>
    </tr>
    <tr style="${Rval > 0.6 && Rval <= 0.8 ? 'background:#80ff8010;' : ''}">
      <td>R ∈ (0.6; 0.8]</td>
      <td style="color:#80ff80">🟢 Нижче середнього</td>
      <td style="color:#80ff80">${Rval > 0.6 && Rval <= 0.8 ? '◀ Ваш результат' : ''}</td>
    </tr>
    <tr style="${Rval > 0.4 && Rval <= 0.6 ? 'background:#ffab4010;' : ''}">
      <td>R ∈ (0.4; 0.6]</td>
      <td style="color:#ffab40">🟡 Середній</td>
      <td style="color:#ffab40">${Rval > 0.4 && Rval <= 0.6 ? '◀ Ваш результат' : ''}</td>
    </tr>
    <tr style="${Rval > 0.2 && Rval <= 0.4 ? 'background:#ff994410;' : ''}">
      <td>R ∈ (0.2; 0.4]</td>
      <td style="color:#ff9944">🟠 Вище середнього</td>
      <td style="color:#ff9944">${Rval > 0.2 && Rval <= 0.4 ? '◀ Ваш результат' : ''}</td>
    </tr>
    <tr style="${Rval <= 0.2 ? 'background:#ff444410;' : ''}">
      <td>R ∈ [0; 0.2]</td>
      <td style="color:#ff4444">🔴 Високий ризик — низька керованість</td>
      <td style="color:#ff4444">${Rval <= 0.2 ? '◀ Ваш результат' : ''}</td>
    </tr>
  </table>
</div>
`

	switchTab('tab-result')
}

// ══════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════
function switchTab(id) {
	document
		.querySelectorAll('.tab-content')
		.forEach(el => el.classList.remove('active'))
	document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'))
	document.getElementById(id).classList.add('active')
	const idx = ['tab-config', 'tab-objects', 'tab-result', 'tab-theory'].indexOf(
		id,
	)
	document.querySelectorAll('.tab')[idx].classList.add('active')
}
