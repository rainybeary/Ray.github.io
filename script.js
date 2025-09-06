/* ---------- Галерея ---------- */
const track = document.getElementById('track');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');
function step(){ const s = track?.querySelector('.slide'); return s ? s.getBoundingClientRect().width + 16 : 320; }
function scrollSlides(n){ track?.scrollBy({ left: n * step(), behavior: 'smooth' }); }
prev?.addEventListener('click', ()=>scrollSlides(-1));
next?.addEventListener('click', ()=>scrollSlides(1));
track?.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight'){e.preventDefault();scrollSlides(1)} if(e.key==='ArrowLeft'){e.preventDefault();scrollSlides(-1)} });

/* ---------- Typewriter + режим ВВОДА ---------- */
const WORDS = ['rainybeary','frontend','creative','velocity','interface','motion','clarity','insight','focus','resonance'];

const el      = document.getElementById('logoTarget');
const caret   = document.querySelector('.logo-wrap .caret');
const shadow  = document.querySelector('.logo-shadow');
const inputEl = document.getElementById('logoInput');
const toggle  = document.getElementById('toggleMode');

const TYPE_DELAY = 80;
const ERASE_DELAY = 50;
const HOLD_DONE  = 1500;
const HOLD_EMPTY = 400;

shadow.textContent = WORDS.reduce((a,b)=> a.length>b.length?a:b, '');

let inputMode = false;

toggle?.addEventListener('click', ()=>{
  inputMode = !inputMode;
  toggle.setAttribute('aria-pressed', String(inputMode));
  toggle.textContent = inputMode ? 'Анимация' : 'Ввод';

  // Включаем/выключаем поле ввода
  if (inputMode){
    inputEl.style.pointerEvents = 'auto';
    inputEl.focus();
    el.textContent = '';
  } else {
    inputEl.style.pointerEvents = 'none';
    inputEl.blur();
  }
});

/* Эхо ввода: отрисовываем текст с градиентом и синхронизируем каретку */
inputEl?.addEventListener('input', ()=>{
  el.textContent = inputEl.value;
});
inputEl?.addEventListener('focus', ()=> caret.style.display = 'inline-block');
inputEl?.addEventListener('blur',  ()=> caret.style.display = 'none');

/* Печать/стирание (когда НЕ ввод) */
async function typeWord(word){
  el.textContent = '';
  caret.style.display = 'inline-block';
  await sleep(HOLD_EMPTY);
  for (let i=0;i<word.length && !inputMode;i++){
    el.textContent = word.slice(0, i+1);
    await sleep(TYPE_DELAY);
  }
}
async function eraseWord(){
  const text = el.textContent;
  for (let i=text.length; i>0 && !inputMode; i--){
    el.textContent = text.slice(0, i-1);
    await sleep(ERASE_DELAY);
  }
  caret.style.display = 'none';
}
function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

(async function loop(){
  let i = 0;
  while (true){
    if (inputMode) { await sleep(150); continue; }
    const word = WORDS[i % WORDS.length];
    await typeWord(word);
    await sleep(HOLD_DONE);
    await eraseWord();
    i++;
  }
})();
