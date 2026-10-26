(()=>{
const c=document.getElementById('c'),x=c.getContext('2d');let W,H,D=devicePixelRatio||1;
function rs(){W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0)}addEventListener('resize',rs);rs();
const FR=[['#e63946','#ffb3b3'],['#f4a261','#ffe0b8'],['#8ac926','#e6ffb3'],['#ffca3a','#fff3b0'],['#9b5de5','#e3ccff'],['#ff70a6','#ffd1e3']];
let objs=[],halves=[],parts=[],trail=[],pops=[],score=0,lives=3,run=false,spawnT=0,diff=0,flash=0,down=false,hits=0;
let best=+localStorage.getItem('runeSliceBest')||0;const $=i=>document.getElementById(i);
function upd(){const l=Math.max(lives,0);$('score').textContent=score;$('lives').textContent='♥'.repeat(l)+'♡'.repeat(3-l)}
$('bestStart').textContent=best?'Best score: '+best:'';
let ac;function snd(f,d,t,v){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.type=t||'sine';o.frequency.value=f;g.gain.value=v||.12;g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
function spawn(){const n=1+Math.floor(Math.random()*(1+diff/4));for(let i=0;i<n;i++){const bomb=Math.random()<Math.min(.12+diff*.01,.25),r=bomb?26:28+Math.random()*10;
objs.push({x:W*(.2+Math.random()*.6),y:H+r,vx:(Math.random()-.5)*4,vy:-(Math.sqrt(H)*0.55+Math.random()*2+3),r,bomb,col:FR[Math.floor(Math.random()*FR.length)],rot:0,vr:(Math.random()-.5)*.1})}}
function start(){objs=[];halves=[];parts=[];pops=[];score=0;lives=3;diff=0;spawnT=0;run=true;$('start').classList.add('hidden');$('over').classList.add('hidden');upd()}
function end(){if(!run)return;run=false;if(score>best){best=score;localStorage.setItem('runeSliceBest',best)}
$('final').textContent='Score: '+score+'  ·  Best: '+best;$('over').classList.remove('hidden');
const u=encodeURIComponent(location.href),m='I scored '+score+' in RUNE SLICE. Can you beat me?',t=encodeURIComponent(m);
$('share').innerHTML='<a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u='+u+'">Facebook</a><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text='+t+'&url='+u+'">X</a><a target="_blank" rel="noopener" href="https://www.reddit.com/submit?url='+u+'&title='+t+'">Reddit</a><button id="cp">Copy link</button>'+(navigator.share?'<button id="ns">Share…</button>':'');
$('cp').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(m+' '+location.href);$('cp').textContent='Copied!'};
if($('ns'))$('ns').onclick=()=>navigator.share({title:'RUNE SLICE',text:m,url:location.href}).catch(()=>{})}
$('play').onclick=start;$('again').onclick=start;
function P(e){return{x:e.clientX,y:e.clientY}}
c.addEventListener('pointerdown',e=>{down=true;hits=0;trail=[{...P(e),l:12}]});
addEventListener('pointerup',()=>{down=false;if(hits>=3&&run){const b=hits*2;score+=b;pops.push({x:W/2,y:H/3,s:hits+'x COMBO +'+b,l:60});snd(880,.3,'triangle')}hits=0;upd()});
c.addEventListener('pointermove',e=>{if(!down||!run)return;const p=P(e),q=trail[trail.length-1];trail.push({...p,l:12});if(q)cut(q,p)});
function sd(a,b,p){const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy||1;let t=((p.x-a.x)*dx+(p.y-a.y)*dy)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(a.x+t*dx-p.x,a.y+t*dy-p.y)}
function cut(a,b){for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(sd(a,b,o)<o.r){objs.splice(i,1);
if(o.bomb){flash=1;snd(70,.6,'sawtooth',.3);for(let k=0;k<40;k++)parts.push({x:o.x,y:o.y,vx:(Math.random()-.5)*14,vy:(Math.random()-.5)*14,l:40,col:'#ff7a1a'});lives=0;upd();setTimeout(end,500);return}
score++;hits++;snd(500+hits*90,.12,'square',.06);const ang=Math.atan2(b.y-a.y,b.x-a.x);
for(const s of[-1,1])halves.push({x:o.x,y:o.y,vx:o.vx+Math.cos(ang+s*Math.PI/2)*3,vy:o.vy*.3+Math.sin(ang+s*Math.PI/2)*3,r:o.r,col:o.col,a:ang,s,rot:0});
for(let k=0;k<14;k++)parts.push({x:o.x,y:o.y,vx:(Math.random()-.5)*9,vy:(Math.random()-.5)*9,l:30,col:o.col[0]});upd()}}}
function drawFruit(o){x.save();x.translate(o.x,o.y);x.rotate(o.rot);
if(o.bomb){x.fillStyle='#222';x.beginPath();x.arc(0,0,o.r,0,7);x.fill();x.strokeStyle='#ff3b30';x.lineWidth=3;x.stroke();x.fillStyle='#ff3b30';x.font='bold 26px Georgia';x.textAlign='center';x.textBaseline='middle';x.fillText('ᛉ',0,1);x.fillStyle='#ffb000';x.beginPath();x.arc(0,-o.r-6,4+Math.random()*3,0,7);x.fill()}
else{const g=x.createRadialGradient(-o.r/3,-o.r/3,2,0,0,o.r);g.addColorStop(0,o.col[1]);g.addColorStop(1,o.col[0]);x.fillStyle=g;x.beginPath();x.arc(0,0,o.r,0,7);x.fill();x.fillStyle='#3a5a1a';x.fillRect(-2,-o.r-6,4,8)}x.restore()}
function loop(){requestAnimationFrame(loop);const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1d1814');g.addColorStop(1,'#0c0a08');x.fillStyle=g;x.fillRect(0,0,W,H);
x.fillStyle='rgba(232,181,74,.05)';x.font='bold 120px Georgia';x.textAlign='center';x.textBaseline='alphabetic';x.fillText('ᚱᚢᚾᛖ',W/2,H/2+40);
if(run){spawnT--;if(spawnT<=0){spawn();spawnT=Math.max(35,90-diff*3);diff+=.25}}
const gr=.22;for(let i=objs.length-1;i>=0;i--){const o=objs[i];o.x+=o.vx;o.y+=o.vy;o.vy+=gr;o.rot+=o.vr;drawFruit(o);if(o.y>H+60&&o.vy>0){objs.splice(i,1);if(!o.bomb&&run){lives--;upd();snd(160,.3,'triangle');if(lives<=0)end()}}}
for(let i=halves.length-1;i>=0;i--){const h=halves[i];h.x+=h.vx;h.y+=h.vy;h.vy+=gr;h.rot+=.05*h.s;x.save();x.translate(h.x,h.y);x.rotate(h.a+h.rot);x.fillStyle=h.col[0];x.beginPath();x.arc(0,0,h.r,h.s>0?0:Math.PI,h.s>0?Math.PI:Math.PI*2);x.fill();x.fillStyle=h.col[1];x.fillRect(-h.r,-1.5,h.r*2,3);x.restore();if(h.y>H+80)halves.splice(i,1)}
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.2;p.l--;x.globalAlpha=Math.max(p.l/40,0);x.fillStyle=p.col;x.fillRect(p.x,p.y,4,4);if(p.l<=0)parts.splice(i,1)}x.globalAlpha=1;
trail.forEach(t=>t.l--);trail=trail.filter(t=>t.l>0);if(trail.length>1){x.strokeStyle='#ffe9a8';x.shadowColor='#ff7a1a';x.shadowBlur=14;x.lineCap='round';for(let i=1;i<trail.length;i++){x.lineWidth=trail[i].l/2;x.beginPath();x.moveTo(trail[i-1].x,trail[i-1].y);x.lineTo(trail[i].x,trail[i].y);x.stroke()}x.shadowBlur=0}
for(let i=pops.length-1;i>=0;i--){const p=pops[i];p.l--;p.y-=.6;x.globalAlpha=Math.max(p.l/60,0);x.fillStyle='#e8b54a';x.font='bold 32px Georgia';x.textAlign='center';x.fillText(p.s,p.x,p.y);if(p.l<=0)pops.splice(i,1)}x.globalAlpha=1;
if(flash>0){x.fillStyle='rgba(255,255,255,'+flash+')';x.fillRect(0,0,W,H);flash-=.04}}
loop();})();
