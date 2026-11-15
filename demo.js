// Marswalk Planner — cinematic self-playing demo. Open index.html?demo
// Uses the app's globals (map, LAYERS, STOPS, HAB, userPts, update, ...).
(() => {
const css = `
#dm-start{position:fixed;inset:0;z-index:5000;background:#000;display:grid;place-items:center;cursor:pointer;color:#f5eadf;font-family:'Space Grotesk',Inter,sans-serif;text-align:center}
#dm-start b{display:block;font-size:64px;letter-spacing:6px;color:#ff7a3d}
#dm-start small{color:#c9b3a2;font-size:16px;letter-spacing:2px}
.dm-bar{position:fixed;left:0;right:0;height:0;background:#000;z-index:4000;transition:height 1.2s ease}
#dm-top{top:0}#dm-bot{bottom:0}
body.dm-cine .dm-bar{height:9vh}
#dm-cap{position:fixed;left:50%;bottom:12vh;transform:translateX(-50%);z-index:4100;max-width:80vw;text-align:center;font:600 34px/1.25 Inter,sans-serif;color:#fff;text-shadow:0 2px 12px #000,0 0 30px #000;opacity:0;transition:opacity .4s}
#dm-cap.on{opacity:1}
#dm-chap{position:fixed;top:11vh;left:4vw;z-index:4100;font:700 16px 'JetBrains Mono',monospace;letter-spacing:4px;color:#ff7a3d;text-shadow:0 0 10px #000;opacity:0;transition:opacity .5s}
#dm-chap.on{opacity:1}
#dm-card{position:fixed;inset:0;z-index:4500;background:radial-gradient(ellipse at center,#2a1208 0%,#000 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 1s;overflow:hidden}
#dm-card.on{opacity:1}
#dm-card canvas{position:absolute;inset:0}
#dm-card .k{position:relative;font:700 18px 'JetBrains Mono',monospace;letter-spacing:8px;color:#ff7a3d}
#dm-card .t{position:relative;font:800 min(12vw,150px)/0.95 'Space Grotesk',Inter,sans-serif;color:#f5eadf;letter-spacing:4px;text-align:center}
#dm-card .t span{color:#ff7a3d}
#dm-card .s{position:relative;margin-top:24px;font:400 26px Inter,sans-serif;color:#c9b3a2;text-align:center;max-width:70vw}
.dm-glitch{animation:dmg .9s steps(2) 2}
@keyframes dmg{0%{transform:translate(0);text-shadow:4px 0 #ff2a6d,-4px 0 #05d9e8}25%{transform:translate(-6px,2px)}50%{transform:translate(5px,-3px);text-shadow:-4px 0 #ff2a6d,4px 0 #05d9e8}75%{transform:translate(-2px,4px)}100%{transform:translate(0);text-shadow:none}}
.dm-zoom{animation:dmz 1.4s cubic-bezier(.2,.9,.2,1) both}
@keyframes dmz{from{transform:scale(3);opacity:0;filter:blur(20px)}to{transform:scale(1);opacity:1;filter:blur(0)}}
#dm-stamp{position:fixed;left:50%;top:45%;z-index:4200;transform:translate(-50%,-50%) rotate(-8deg) scale(0);font:900 140px 'Space Grotesk',sans-serif;padding:10px 50px;border:12px solid;border-radius:20px;opacity:0;transition:transform .35s cubic-bezier(.3,1.6,.5,1),opacity .2s}
#dm-stamp.on{transform:translate(-50%,-50%) rotate(-8deg) scale(1);opacity:.95}
#dm-flash{position:fixed;inset:0;z-index:4150;pointer-events:none;background:#ff2020;opacity:0;transition:opacity .15s}
.dm-pulse{animation:dmp 1s ease-in-out 3;outline:3px solid #ff7a3d;outline-offset:4px;border-radius:8px}
@keyframes dmp{50%{box-shadow:0 0 0 12px #ff7a3d44,0 0 40px #ff7a3d}}
body.dm-run #left{display:none}
#dm-skip{position:fixed;right:10px;bottom:10px;z-index:5001;font:11px Inter;color:#666}
`;
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">`);
document.body.insertAdjacentHTML('beforeend', `
<div id="dm-start"><div><b>▶ MARSWALK</b><br><small>CLICK TO START THE CINEMATIC DEMO · TURN SOUND ON<br><br>Start recording first: Win + Alt + R (Xbox Game Bar), or Clipchamp screen recorder<br>Press F11 for full screen</small></div></div>
<div class="dm-bar" id="dm-top"></div><div class="dm-bar" id="dm-bot"></div>
<div id="dm-chap"></div><div id="dm-cap"></div><div id="dm-flash"></div><div id="dm-stamp"></div>
<div id="dm-card"><canvas id="dm-stars"></canvas><div class="k" id="dm-k"></div><div class="t" id="dm-t"></div><div class="s" id="dm-s"></div></div>`);

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let voice = null;
const pickVoice = () => { const v = speechSynthesis.getVoices(); voice = v.find(x=>/en-(US|GB)/.test(x.lang) && /Google|Natural|Aria|Guy|Jenny|Daniel/.test(x.name)) || v.find(x=>/^en/.test(x.lang)) || null; };
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

function speak(text){ return new Promise(res => {
  if (!('speechSynthesis' in window)) return res();
  const u = new SpeechSynthesisUtterance(text); if (voice) u.voice = voice; u.rate = 1.02; u.pitch = 0.9;
  const t = setTimeout(res, 400 + text.length * 75); u.onend = () => { clearTimeout(t); res(); };
  speechSynthesis.speak(u); }); }
async function say(text, minMs = 0){ const c = $('dm-cap'); c.textContent = text; c.classList.add('on'); await Promise.all([speak(text), sleep(minMs)]); await sleep(250); c.classList.remove('on'); await sleep(300); }
function chapter(t){ const c = $('dm-chap'); c.classList.remove('on'); setTimeout(()=>{ c.textContent = t; c.classList.add('on'); }, 300); }
const fly = (ll, z, s=4) => new Promise(r => { map.once('moveend', () => setTimeout(r, 200)); map.flyTo(ll, z, {duration:s, easeLinearity:.15}); });
const layer = k => LAYERS.find(l => l.key === k);
function setLayer(k, on, op){ const l = layer(k); const cb = $('L_'+k); if (op!=null) l.layer.setOpacity(op); if (on) l.layer.addTo(map); else map.removeLayer(l.layer); if (cb) cb.checked = on; }

// ---- starfield ----
function stars(){ const c = $('dm-stars'), x = c.getContext('2d'); let W, H, S;
  const rs = () => { W = c.width = innerWidth; H = c.height = innerHeight; S = Array.from({length:400}, () => ({x:Math.random()*W-W/2, y:Math.random()*H-H/2, z:Math.random()*W})); };
  rs(); addEventListener('resize', rs);
  (function f(){ x.fillStyle = '#00000040'; x.fillRect(0,0,W,H);
    for (const s of S){ s.z -= 6; if (s.z < 1){ s.z = W; s.x = Math.random()*W-W/2; s.y = Math.random()*H-H/2; }
      const k = 300/s.z, px = s.x*k+W/2, py = s.y*k+H/2, r = Math.max(.3, 2-s.z/W*2);
      x.fillStyle = `rgba(255,${180+Math.random()*60|0},150,${1-s.z/W})`; x.beginPath(); x.arc(px,py,r,0,7); x.fill(); }
    requestAnimationFrame(f); })(); }

async function card(k, t, s, ms, glitch){ $('dm-k').textContent = k; $('dm-t').innerHTML = t; $('dm-s').textContent = s || '';
  const T = $('dm-t'); T.className = 't'; void T.offsetWidth; T.className = 't dm-zoom' + (glitch ? ' dm-glitch' : '');
  $('dm-card').classList.add('on'); await sleep(ms); }
const uncard = async () => { $('dm-card').classList.remove('on'); await sleep(900); };

// ---- soundtrack: WebAudio synth drone + heartbeat ----
let AC, master;
function music(){ try{
  AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = 0; master.connect(AC.destination);
  master.gain.linearRampToValueAtTime(.22, AC.currentTime + 4);
  const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600; lp.Q.value = 6; lp.connect(master);
  const lfo = AC.createOscillator(), lg = AC.createGain(); lfo.frequency.value = .07; lg.gain.value = 400; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
  [55, 82.4, 110, 164.8].forEach((f,i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = i%2 ? 'sawtooth' : 'triangle'; o.frequency.value = f; o.detune.value = (Math.random()-.5)*14; g.gain.value = .18/(i+1); o.connect(g); g.connect(lp); o.start(); });
  setInterval(() => { const t = AC.currentTime; [0,.28].forEach((d,i) => { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(70-i*10, t+d); o.frequency.exponentialRampToValueAtTime(35, t+d+.25); g.gain.setValueAtTime(.0001, t+d); g.gain.exponentialRampToValueAtTime(.5, t+d+.01); g.gain.exponentialRampToValueAtTime(.0001, t+d+.3); o.connect(g); g.connect(master); o.start(t+d); o.stop(t+d+.35); }); }, 1600);
}catch(e){} }
function sting(freq = 880){ if (!AC) return; const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain(); o.type = 'square'; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq/4, t+.6); g.gain.setValueAtTime(.25, t); g.gain.exponentialRampToValueAtTime(.0001, t+.7); o.connect(g); g.connect(master); o.start(); o.stop(t+.8); }
function alarm(){ if (!AC) return; for (let i=0;i<3;i++){ const t = AC.currentTime + i*.32, o = AC.createOscillator(), g = AC.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(620, t); o.frequency.linearRampToValueAtTime(440, t+.25); g.gain.setValueAtTime(.2, t); g.gain.exponentialRampToValueAtTime(.0001, t+.3); o.connect(g); g.connect(master); o.start(t); o.stop(t+.31); } }

async function stamp(text, color){ const s = $('dm-stamp'); s.textContent = text; s.style.color = color; s.style.borderColor = color; s.classList.add('on'); await sleep(1800); s.classList.remove('on'); }

// ---- THE SHOW ----
async function run(){
  document.body.classList.add('dm-run');
  stars(); music();
  map.setView([18, 77], 3, {animate:false});
  ['ctx','hirise'].forEach(k => setLayer(k, false));
  ['oRoute','oHaz','oRing'].forEach(id => { $(id).checked = false; $(id).onchange({target:$(id)}); });

  // COLD OPEN
  await card('TEAM PRITHVI PRESENTS', '', '', 2200);
  await card('NASA SPACE APPS 2026', 'MARS<span>.</span>', '225 million kilometres from home. No GPS. No rescue. No second chances.', 600, true);
  await speak('Mars. Two hundred and twenty five million kilometres from home. No GPS. No rescue. No second chances.');
  sting(660);
  await card('INTRODUCING', 'MARSWALK<br><span>PLANNER</span>', 'The survival map for the first humans on Mars', 600, true);
  await speak('Introducing: Marswalk Planner. The survival map for the first humans on Mars.');
  await sleep(600);
  await uncard();
  document.body.classList.add('dm-cine');

  // ACT 1: descent
  chapter('01 // DESCENT · JEZERO CRATER');
  const descend = fly([18.45, 77.43], 8, 6);
  await say('Our target: Jezero Crater. An ancient lake, explored by NASA’s Perseverance rover.');
  await descend;
  setLayer('ctx', true); setLayer('hirise', true);
  const d2 = fly([18.452, 77.43], 13, 5);
  await say('We zoom from orbit down to twenty five centimetre per pixel HiRISE imagery.');
  await d2;

  // ACT 2: data layers
  chapter('02 // SEE THE INVISIBLE · NASA DATA LAYERS');
  setLayer('thnight', true, .85); sting(990);
  await say('THEMIS night infrared from Mars Odyssey. Bright means solid rock. Dark means loose sand. Where you can walk, and where you sink.', 1500);
  setLayer('thnight', false); setLayer('thday', true, .8); sting(990);
  await say('Daytime thermal infrared reveals warm, rocky ground.');
  setLayer('thday', false); setLayer('mola', true, .7); sting(990);
  await say('Laser altimetry from MOLA and HRSC maps every climb and every scarp.');
  setLayer('mola', false);

  // ACT 3: the EVA
  chapter('03 // THE MARSWALK · 4 SCIENCE STOPS');
  $('oRoute').checked = true; $('oRoute').onchange({target:$('oRoute')});
  $('oRing').checked = true; $('oRing').onchange({target:$('oRing')});
  await say('From the habitat, the crew walks a loop to four science stops. Each one with a goal, the data behind it, and the kit to carry.');
  const lines = ['Séítah. Olivine rock that dates the crater floor.', 'Máaz. Ancient lava, altered by water.', 'The delta front. Our best shot at finding signs of ancient life.', 'The upper fan. Boulders thrown here by giant floods.'];
  for (let i = 0; i < STOPS.length; i++){
    await fly(STOPS[i].ll, 16, 2.5); STOPS[i].marker.openPopup();
    await say(lines[i]); map.closePopup();
  }
  await fly([18.440, 77.436], 15, 2.5);

  // ACT 4: danger
  chapter('04 // SURVIVAL ENGINE · HAZARD CHECK');
  $('oHaz').checked = true; $('oHaz').onchange({target:$('oHaz')});
  await say('Now the danger. Red zones are dune fields, where a suit or a rover can sink.');
  await say('Watch what happens if an astronaut plans a shortcut through the dunes.');
  STOPS.forEach(s => routeLayer.removeLayer(s.marker));
  for (const p of [[18.4385, 77.4360], [18.4470, 77.4200]]) {
    const ll = L.latLng(p); userPts.push(ll); L.marker(ll, {icon: icon(userPts.length, 'wp')}).addTo(userLayer); update(); sting(1400); await sleep(900);
  }
  $('dm-flash').style.opacity = .45; alarm(); setTimeout(() => $('dm-flash').style.opacity = 0, 250);
  stamp('NO-GO', '#ff3b3b');
  $('goStatus').classList.add('dm-pulse');
  await say('No go. Instantly. The route is rejected before anyone steps outside.', 2000);
  $('goStatus').classList.remove('dm-pulse');
  bClear.click();
  await sleep(400); stamp('GO', '#5fd18b'); sting(520);
  await say('Back on the safe route: go. Walking time, oxygen margin and a walk-back radius, all computed on Mars’s real radius, not Earth’s.', 1500);

  // ACT 5: space weather
  chapter('05 // RADIATION · LIVE SPACE WEATHER');
  const wx = $('wx').closest('section'); wx.scrollIntoView({behavior:'smooth', block:'center'}); wx.classList.add('dm-pulse');
  await say('Mars has no magnetic shield. So we pull live solar flare and particle event data from NASA’s DONKI system. If a storm hits, the crew is told to shelter.', 1500);
  wx.classList.remove('dm-pulse');

  // ACT 6: HUD
  chapter('06 // HELMET HUD');
  bHud.click();
  const pan = fly([18.4555, 77.4010], 15, 7);
  await say('And out on the surface, the map becomes a helmet heads-up display. Next stop. Oxygen. Route. Radiation. All in view.');
  await pan; await sleep(800);
  bHud.click();

  // OUTRO
  document.body.classList.remove('dm-cine'); $('dm-chap').classList.remove('on');
  sting(440);
  await card('TEAM PRITHVI · NASA SPACE APPS 2026', 'MARSWALK<br><span>PLANNER</span>', '0xr4j.github.io/mars-walk-planner', 500, true);
  await speak('Marswalk Planner. NASA’s Mars archive, turned into a walk one astronaut can survive. By Team Prithvi.');
  await sleep(4000);
  if (master) master.gain.linearRampToValueAtTime(0, AC.currentTime + 3);
}

$('dm-start').onclick = async () => {
  $('dm-start').remove();
  try { document.documentElement.requestFullscreen().catch(()=>{}); } catch(e){}
  await sleep(800);
  run();
};
})();
