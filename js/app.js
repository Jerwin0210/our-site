// ── Theme Data ──
const themes = {
  'Sky Blue':   { bg1:'#e0f2f7',bg2:'#87ceeb',bg3:'#5dade2',title:'#1976d2',subtitle:'#3a7ca5',text:'#1a3a4a',heading:'#1565c0',tag1:'#b3e5fc',tag2:'#4fc3f7','tag-hover':'#1e88e5',accent:'#42a5f5','accent-dark':'#1976d2',border:'#87ceeb',swatch:'#87ceeb' },
  'Rose Pink':  { bg1:'#fce4ec',bg2:'#f8bbd0',bg3:'#f48fb1',title:'#c2185b',subtitle:'#8e4162',text:'#4a2040',heading:'#ad1457',tag1:'#f8bbd0',tag2:'#f48fb1','tag-hover':'#e91e63',accent:'#e91e63','accent-dark':'#c2185b',border:'#f8bbd0',swatch:'#f48fb1' },
  'Lavender':   { bg1:'#f3e5f5',bg2:'#ce93d8',bg3:'#ab47bc',title:'#7b1fa2',subtitle:'#8e6b99',text:'#3a1a4a',heading:'#6a1b9a',tag1:'#e1bee7',tag2:'#ce93d8','tag-hover':'#9c27b0',accent:'#ba68c8','accent-dark':'#7b1fa2',border:'#ce93d8',swatch:'#ce93d8' },
  'Mint Green': { bg1:'#e8f5e9',bg2:'#a5d6a7',bg3:'#66bb6a',title:'#2e7d32',subtitle:'#5a8a5e',text:'#1b3a1e',heading:'#388e3c',tag1:'#c8e6c9',tag2:'#81c784','tag-hover':'#43a047',accent:'#66bb6a','accent-dark':'#2e7d32',border:'#a5d6a7',swatch:'#81c784' },
  'Sunset':     { bg1:'#fff3e0',bg2:'#ffcc80',bg3:'#ffa726',title:'#e65100',subtitle:'#a67040',text:'#4a2800',heading:'#ef6c00',tag1:'#ffe0b2',tag2:'#ffb74d','tag-hover':'#f57c00',accent:'#ffa726','accent-dark':'#e65100',border:'#ffcc80',swatch:'#ffb74d' },
  'Cherry Red': { bg1:'#ffebee',bg2:'#ef9a9a',bg3:'#ef5350',title:'#c62828',subtitle:'#a05050',text:'#4a1a1a',heading:'#d32f2f',tag1:'#ffcdd2',tag2:'#ef9a9a','tag-hover':'#e53935',accent:'#ef5350','accent-dark':'#c62828',border:'#ef9a9a',swatch:'#ef5350' },
};

const themeHearts = {
  'Sky Blue':'💙','Rose Pink':'💗','Lavender':'💜','Mint Green':'💚','Sunset':'🧡','Cherry Red':'❤️'
};

const themeEmojis = {
  'Sky Blue':   { sparkles: ['💙','✨','🩵','⭐'], floats: ['💙','🩵','💎','🫧','☁️'] },
  'Rose Pink':  { sparkles: ['💗','✨','💕','⭐'], floats: ['💕','💗','💖','♥','🩷'] },
  'Lavender':   { sparkles: ['💜','✨','🔮','⭐'], floats: ['💜','🪻','🔮','☁️','✨'] },
  'Mint Green': { sparkles: ['💚','✨','🍀','⭐'], floats: ['💚','🌿','🍃','🌱','✨'] },
  'Sunset':     { sparkles: ['🧡','✨','🌟','⭐'], floats: ['🧡','🌅','☀️','✨','🌻'] },
  'Cherry Red': { sparkles: ['❤️','✨','♥','⭐'], floats: ['❤️','♥','🌹','✨','❣️'] },
};

let currentSparkles = themeEmojis['Sky Blue'].sparkles;

// ── Floating Hearts ──
const heartsContainer = document.getElementById('hearts');
const defaultFloats = themeEmojis['Sky Blue'].floats;

for (let i = 0; i < 20; i++) {
  const s = document.createElement('span');
  s.className = 'heart';
  s.textContent = defaultFloats[i % defaultFloats.length];
  s.style.left = Math.random() * 100 + '%';
  s.style.animationDuration = 6 + Math.random() * 8 + 's';
  s.style.animationDelay = Math.random() * 10 + 's';
  heartsContainer.appendChild(s);
}

function updateFloats(name) {
  const e = themeEmojis[name]?.floats || defaultFloats;
  heartsContainer.querySelectorAll('.heart').forEach((h, i) => h.textContent = e[i % e.length]);
  currentSparkles = themeEmojis[name]?.sparkles || themeEmojis['Sky Blue'].sparkles;
}

// ── Theme Switcher ──
function applyTheme(name) {
  const t = themes[name]; if (!t) return;
  const r = document.documentElement.style;
  Object.keys(t).forEach(k => { if (k !== 'swatch') r.setProperty('--' + k, t[k]); });
  localStorage.setItem('theme', name);
  document.querySelectorAll('.palette-option').forEach(el => el.classList.toggle('active', el.dataset.name === name));
  updateFloats(name);
  const h = themeHearts[name] || '💙';
  document.getElementById('titleHeart').textContent = h;
  document.getElementById('footerHeart').textContent = h;
  document.title = 'Kirsty & Jet ' + h;
  document.getElementById('addBucketBtn').textContent = 'Add ' + h;
  document.getElementById('addEventBtn').textContent = 'Add ' + h;
  document.querySelector('.loader-heart').textContent = h;
}

const panel = document.getElementById('palettePanel');
Object.keys(themes).forEach(name => {
  const b = document.createElement('button');
  b.className = 'palette-option';
  b.dataset.name = name;
  b.innerHTML = `<span class="palette-swatch" style="background:${themes[name].swatch}"></span>${name}`;
  b.onclick = () => applyTheme(name);
  panel.appendChild(b);
});

document.getElementById('paletteBtn').addEventListener('click', () => panel.classList.toggle('open'));
applyTheme(localStorage.getItem('theme') || 'Sky Blue');

// ── Bucket List ──
const defaults = [
  'Watch the Northern Lights together',
  'Travel to Japan during cherry blossom season',
  'Learn to cook a new dish every month',
  'Go stargazing in the mountains',
  'Build a blanket fort and binge-watch our fave series',
  'Ride a hot air balloon',
  'Write letters to our future selves',
  'Adopt a pet together'
];
let bucketData = JSON.parse(localStorage.getItem('bucketList')) ||
  defaults.map(t => ({ text: t, done: false }));

function saveBucket() { localStorage.setItem('bucketList', JSON.stringify(bucketData)); }

function renderBucket() {
  const ul = document.getElementById('bucketList');
  ul.innerHTML = '';
  bucketData.forEach((item, i) => {
    const li = document.createElement('li');
    if (item.done) li.classList.add('done');
    li.innerHTML = `<button class="heart-btn" onclick="toggleDone(${i})">${item.done ? '❤️' : '🤍'}</button><span>${item.text}</span><button class="action-btn" onclick="editItem(${i})" title="Edit">✏️</button><button class="action-btn" onclick="deleteItem(${i})" title="Delete">🗑️</button>`;
    ul.appendChild(li);
  });
}

function toggleDone(i) { bucketData[i].done = !bucketData[i].done; saveBucket(); renderBucket(); }

function addItem() {
  const input = document.getElementById('newItem');
  const text = input.value.trim();
  if (!text) return;
  bucketData.push({ text, done: false });
  input.value = '';
  saveBucket(); renderBucket();
}

function editItem(i) {
  const newText = prompt('Edit this dream:', bucketData[i].text);
  if (newText !== null && newText.trim()) {
    bucketData[i].text = newText.trim();
    saveBucket(); renderBucket();
  }
}

function deleteItem(i) {
  if (confirm('Remove "' + bucketData[i].text + '" from the list?')) {
    bucketData.splice(i, 1);
    saveBucket(); renderBucket();
  }
}

document.getElementById('newItem').addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });
renderBucket();

// ── Calendar ──
let calDate = new Date();
let selectedDate = null;
let calEvents = JSON.parse(localStorage.getItem('calEvents')) || {};

function saveEvents() { localStorage.setItem('calEvents', JSON.stringify(calEvents)); }

function renderCal() {
  const y = calDate.getFullYear(), m = calDate.getMonth();
  document.getElementById('calMonth').textContent = calDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    const el = document.createElement('div'); el.className = 'day-label'; el.textContent = d; grid.appendChild(el);
  });
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  for (let i = 0; i < first; i++) { const el = document.createElement('div'); el.className = 'day empty'; grid.appendChild(el); }
  for (let d = 1; d <= days; d++) {
    const el = document.createElement('div');
    const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    el.className = 'day';
    if (d === today.getDate() && m === today.getMonth() && y === today.getFullYear()) el.classList.add('today');
    if (calEvents[key]?.length) el.classList.add('has-event');
    el.textContent = d;
    el.onclick = () => { selectedDate = key; renderEvents(); };
    grid.appendChild(el);
  }
  if (selectedDate) renderEvents();
}

function renderEvents() {
  const el = document.getElementById('eventList');
  if (!selectedDate) { el.innerHTML = ''; return; }
  const evts = calEvents[selectedDate] || [];
  el.innerHTML = `<h3>${selectedDate}</h3>` +
    (evts.length ? evts.map((e, i) => `<div class="event-item"><span>${e}</span><button class="action-btn" onclick="deleteEvent('${selectedDate}',${i})" title="Delete">🗑️</button></div>`).join('') : '<div style="font-size:.85rem;opacity:.6">No events yet</div>');
}

function addEvent() {
  if (!selectedDate) { alert('Pick a date on the calendar first!'); return; }
  const input = document.getElementById('newEvent');
  const text = input.value.trim();
  if (!text) return;
  if (!calEvents[selectedDate]) calEvents[selectedDate] = [];
  calEvents[selectedDate].push(text);
  input.value = '';
  saveEvents(); renderCal();
}

function deleteEvent(key, i) {
  calEvents[key].splice(i, 1);
  if (!calEvents[key].length) delete calEvents[key];
  saveEvents(); renderCal();
}

function changeMonth(dir) { calDate.setMonth(calDate.getMonth() + dir); selectedDate = null; renderCal(); }

document.getElementById('newEvent').addEventListener('keydown', e => { if (e.key === 'Enter') addEvent(); });
renderCal();

// ── Loader ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    setTimeout(() => document.querySelector('.container').classList.add('visible'), 400);
  }, 1500);
});

// ── Cursor Sparkle ──
document.addEventListener('mousemove', e => {
  const s = document.createElement('span');
  s.className = 'sparkle';
  s.textContent = currentSparkles[Math.random() * 4 | 0];
  s.style.left = e.pageX + 'px';
  s.style.top = e.pageY + 'px';
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

// ── Music Toggle ──
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let playing = false;
musicBtn.addEventListener('click', () => {
  if (playing) { audio.pause(); musicBtn.textContent = '🎵'; }
  else { audio.play(); musicBtn.textContent = '⏸'; }
  playing = !playing;
});
