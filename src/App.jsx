import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

// ─── SAMPLE GAMES ─────────────────────────────────────────────────────────────
const SAMPLE_GAMES = [
  { id: "g1",  away: "Pittsburgh",      home: "Stanford",        time: "TBD",      spread: { away: "+4.5",  home: "-4.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g2",  away: "Alcorn State",    home: "Prairie View",    time: "11:00 AM", spread: { away: "+6.5",  home: "-6.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g3",  away: "Utah",            home: "Cincinnati",      time: "12:00 PM", spread: { away: "+12.5", home: "-12.5" }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g4",  away: "Syracuse",        home: "SMU",             time: "1:30 PM",  spread: { away: "+4.5",  home: "-4.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g5",  away: "Maryland",        home: "Oregon",          time: "2:00 PM",  spread: { away: "+3.5",  home: "-3.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g6",  away: "UMass Lowell",    home: "UMBC",            time: "3:00 PM",  spread: { away: "+7.5",  home: "-7.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g7",  away: "Missouri St",     home: "FIU",             time: "3:30 PM",  spread: { away: "+1.5",  home: "-1.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g8",  away: "Lakers",          home: "Long Island",     time: "4:00 PM",  spread: { away: "+5.5",  home: "-5.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g9",  away: "N.J.I.T.",        home: "Vermont",         time: "4:00 PM",  spread: { away: "+10.5", home: "-10.5" }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g10", away: "Wake Forest",     home: "VA Tech",         time: "4:00 PM",  spread: { away: "+2.5",  home: "-2.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g11", away: "K State",         home: "BYU",             time: "4:00 PM",  spread: { away: "+10.5", home: "-10.5" }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g12", away: "Texas A&M-CC",    home: "SFA",             time: "4:00 PM",  spread: { away: "+7.5",  home: "-7.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g13", away: "Monmouth",        home: "Hofstra",         time: "4:00 PM",  spread: { away: "+4.5",  home: "-4.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g14", away: "Detroit",         home: "Wright State",    time: "4:00 PM",  spread: { away: "+4.5",  home: "-4.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g15", away: "Penn State",      home: "Northwestern",    time: "4:30 PM",  spread: { away: "+6.5",  home: "-6.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g16", away: "Grambling St",    home: "Jackson St",      time: "4:30 PM",  spread: { away: "+6.5",  home: "-6.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g17", away: "N. Mexico St",    home: "Jax State",       time: "5:30 PM",  spread: { away: "-1.5",  home: "+1.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g18", away: "Siena",           home: "Merrimack",       time: "6:00 PM",  spread: { away: "+3.5",  home: "-3.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g19", away: "Montana",         home: "Portland State",  time: "6:00 PM",  spread: { away: "+2.5",  home: "-2.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g20", away: "Santa Clara",     home: "Gonzaga",         time: "6:00 PM",  spread: { away: "+7.5",  home: "-7.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g21", away: "OK State",        home: "Colorado",        time: "6:00 PM",  spread: { away: "+1.5",  home: "-1.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g22", away: "UT Grande Valley",home: "McNeese St",      time: "6:30 PM",  spread: { away: "+7.5",  home: "-7.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g23", away: "Idaho",           home: "E. Washington",   time: "6:30 PM",  spread: { away: "-1.5",  home: "+1.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
  { id: "g24", away: "Baylor",          home: "Arizona St",      time: "8:30 PM",  spread: { away: "-5.5",  home: "+5.5"  }, total: "N/A", ml: { away: "N/A", home: "N/A" } },
];

const BET_TYPES = {
  spread_away:    (g) => ({ label: g.away, line: g.spread.away }),
  spread_home:    (g) => ({ label: g.home, line: g.spread.home }),
  over:           (g) => ({ label: "Over",  line: g.total }),
  under:          (g) => ({ label: "Under", line: g.total }),
  ml_away:        (g) => ({ label: g.away,  line: `ML ${g.ml.away}` }),
  ml_home:        (g) => ({ label: g.home,  line: `ML ${g.ml.home}` }),
  h1_spread_away: (g) => ({ label: g.away, line: g.h1?.spread?.away || "N/A" }),
  h1_spread_home: (g) => ({ label: g.home, line: g.h1?.spread?.home || "N/A" }),
  h1_over:        (g) => ({ label: "1H Over",  line: g.h1?.total || "N/A" }),
  h1_under:       (g) => ({ label: "1H Under", line: g.h1?.total || "N/A" }),
};

const OPPOSITES = {
  spread_away: "spread_home", spread_home: "spread_away",
  over: "under", under: "over",
  ml_away: "ml_home", ml_home: "ml_away",
  h1_spread_away: "h1_spread_home", h1_spread_home: "h1_spread_away",
  h1_over: "h1_under", h1_under: "h1_over",
};

const TODAY_LABEL = new Date().toLocaleDateString("en-US", {
  weekday: "long", month: "long", day: "numeric", year: "numeric",
});

// Use Eastern time for date so cache key is consistent all day in US
const TODAY_DATE = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" }); // YYYY-MM-DD

const ADMIN_PASSWORD = "football4";


// ─── WIN CELEBRATION ──────────────────────────────────────────────────────────
function WinCelebration({ wins, phase, onDismiss }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timersRef = useRef([]);

  function T(fn, ms) { timersRef.current.push(setTimeout(fn, ms)); }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    // Target - upper right quadrant
    const tgtX = W * 0.72, tgtY = H * 0.28;
    // Missile start - lower left
    const msX0 = W * 0.10, msY0 = H * 0.82;

    let animPhase = "hunt";
    let rX = tgtX + W * 0.15, rY = tgtY + H * 0.12;
    let rSize = 60, lockProgress = 0;
    let lockedAt = 0, fireAt = 0;
    let trail = [], particles = [], rings = [];
    let shakeAmt = 0, flashAlpha = 0, flashColor = [255,255,255];
    let lockedFired = false, impactFired = false;
    let overlayAlpha = 0, showSettle = false;

    function lerp(a,b,t){ return a+(b-a)*t; }
    function ease(t){ return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2; }

    function triggerFlash(r,g,b,a){ flashAlpha=a; flashColor=[r,g,b]; }
    function triggerShake(amt){ shakeAmt=Math.max(shakeAmt,amt); }

    function spawnExplosion(x, y) {
      const COLORS = ["#facc15","#fb923c","#f87171","#ffffff","#fde68a","#ff6600","#4ade80","#60a5fa","#fcd34d"];
      // 200 particles from impact point
      for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 6 + Math.random() * 22;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 8,
          size: 2 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 1,
          decay: 0.008 + Math.random() * 0.012,
          gravity: 0.22 + Math.random() * 0.15,
          rotSpeed: (Math.random() - 0.5) * 0.35,
          rotation: Math.random() * Math.PI * 2,
          isRect: Math.random() > 0.38,
          w: 3 + Math.random() * 10,
          h: 6 + Math.random() * 16,
          trail: [],
        });
      }
      // Big shockwave rings from impact
      const maxR = Math.max(W, H) * 1.1;
      rings = [
        { x, y, r:0, maxR: maxR*0.9, alpha:1.0, color:[255,220,60],  lw:5,  spd:28, delay:0   },
        { x, y, r:0, maxR: maxR*0.75,alpha:0.8, color:[255,140,30],  lw:10, spd:20, delay:60  },
        { x, y, r:0, maxR: maxR*0.6, alpha:0.6, color:[255,80,0],    lw:7,  spd:24, delay:100 },
        { x, y, r:0, maxR: maxR*0.5, alpha:0.4, color:[255,255,255], lw:3,  spd:32, delay:140 },
        { x, y, r:0, maxR: maxR*0.4, alpha:0.3, color:[255,220,60],  lw:2,  spd:18, delay:200 },
      ];
      rings.forEach(r=>{ r.started=false; r.startT=null; });
    }

    function drawMissile(cx, cy, angleDeg) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleDeg * Math.PI / 180);
      const s = 1.1;
      ctx.fillStyle="#c8d0d8";
      ctx.beginPath();
      ctx.moveTo(0,-20*s); ctx.lineTo(7*s,-7*s); ctx.lineTo(7*s,12*s); ctx.lineTo(-7*s,12*s); ctx.lineTo(-7*s,-7*s);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle="#e8edf2";
      ctx.beginPath();
      ctx.moveTo(0,-20*s); ctx.lineTo(7*s,-7*s); ctx.lineTo(-7*s,-7*s);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle="#a0a8b4";
      ctx.beginPath(); ctx.moveTo(7*s,5*s); ctx.lineTo(16*s,16*s); ctx.lineTo(7*s,12*s); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-7*s,5*s); ctx.lineTo(-16*s,16*s); ctx.lineTo(-7*s,12*s); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#fb923c"; ctx.beginPath(); ctx.ellipse(0,14*s,5*s,5*s,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#facc15"; ctx.beginPath(); ctx.ellipse(0,17*s,3*s,6*s,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="rgba(255,255,255,0.8)"; ctx.beginPath(); ctx.ellipse(0,19*s,1.5*s,3.5*s,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#60a5fa"; ctx.beginPath(); ctx.arc(0,-9*s,3*s,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    function drawReticle(x, y, sz, locked, lockProg) {
      const col = locked ? "#f87171" : lockProg > 0.5 ? "#facc15" : "#4ade80";
      ctx.save();
      ctx.globalAlpha = 0.95;
      // outer dashed ring
      ctx.beginPath(); ctx.arc(x,y,sz,0,Math.PI*2);
      ctx.setLineDash([8,5]); ctx.strokeStyle=col; ctx.lineWidth=1.5; ctx.stroke(); ctx.setLineDash([]);
      // corner brackets closing in
      const br = sz * 0.65;
      const blen = sz * 0.38;
      const bOff = sz * 0.28 * (1 - lockProg);
      [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{
        const bx=x+sx*(br+bOff), by=y+sy*(br+bOff);
        ctx.beginPath(); ctx.moveTo(bx+sx*blen,by); ctx.lineTo(bx,by); ctx.lineTo(bx,by+sy*blen);
        ctx.strokeStyle=col; ctx.lineWidth=2.5; ctx.stroke();
      });
      // crosshair lines
      ctx.strokeStyle=col; ctx.lineWidth=1.5;
      const g2=10;
      [[x,y-g2,x,y-sz*0.72],[x,y+g2,x,y+sz*0.72],[x-g2,y,x-sz*0.72,y],[x+g2,y,x+sz*0.72,y]].forEach(([x1,y1,x2,y2])=>{
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
      });
      // center dot
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fillStyle=col; ctx.fill();
      // lock progress arc
      if(lockProg>0){
        ctx.beginPath(); ctx.arc(x,y,sz+8,-Math.PI/2,-Math.PI/2+lockProg*Math.PI*2);
        ctx.strokeStyle="#f87171"; ctx.lineWidth=4; ctx.stroke();
      }
      // Iran flag circle
      ctx.save();
      ctx.beginPath(); ctx.arc(x,y,sz*0.52,0,Math.PI*2); ctx.clip();
      ctx.fillStyle="#239f40"; ctx.fillRect(x-sz*0.52,y-sz*0.52,sz*1.04,sz*0.35);
      ctx.fillStyle="#fff";    ctx.fillRect(x-sz*0.52,y-sz*0.17,sz*1.04,sz*0.34);
      ctx.fillStyle="#da0000"; ctx.fillRect(x-sz*0.52,y+sz*0.17,sz*1.04,sz*0.35);
      ctx.restore();
      ctx.beginPath(); ctx.arc(x,y,sz*0.52,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,255,255,0.25)`; ctx.lineWidth=1; ctx.stroke();
      if(locked){
        ctx.font=`bold 11px 'Courier New'`; ctx.fillStyle="#f87171"; ctx.textAlign="center";
        ctx.globalAlpha=0.5+0.5*Math.sin(Date.now()*0.025);
        ctx.fillText("LOCKED",x,y+sz+20);
      }
      ctx.restore();
    }

    const startTime = performance.now();

    function tick(now) {
      const el = now - startTime;
      ctx.clearRect(0,0,W,H);

      const sx = shakeAmt>0.3?(Math.random()-0.5)*shakeAmt:0;
      const sy = shakeAmt>0.3?(Math.random()-0.5)*shakeAmt:0;
      shakeAmt *= 0.8;
      ctx.save(); ctx.translate(sx,sy);

      // flash
      if(flashAlpha>0.01){
        const [fr,fg,fb]=flashColor;
        ctx.fillStyle=`rgba(${fr},${fg},${fb},${flashAlpha})`;
        ctx.fillRect(-50,-50,W+100,H+100);
        flashAlpha*=0.72;
      }

      // shockwave rings
      rings.forEach(ring=>{
        if(ring.delay && el < ring.delay+1000) {
          const re = el - 1000;
          if(re < ring.delay) return;
        }
        if(!ring.started){ ring.started=true; ring.startT=now; }
        ring.r=Math.min(ring.r+ring.spd,ring.maxR);
        const a=ring.alpha*(1-ring.r/ring.maxR);
        if(a>0.008){
          ctx.beginPath(); ctx.arc(ring.x,ring.y,ring.r,0,Math.PI*2);
          ctx.strokeStyle=`rgba(${ring.color[0]},${ring.color[1]},${ring.color[2]},${a})`;
          ctx.lineWidth=ring.lw; ctx.stroke();
          // secondary glow ring
          ctx.beginPath(); ctx.arc(ring.x,ring.y,ring.r,0,Math.PI*2);
          ctx.strokeStyle=`rgba(${ring.color[0]},${ring.color[1]},${ring.color[2]},${a*0.3})`;
          ctx.lineWidth=ring.lw*4; ctx.stroke();
        }
      });

      // particles
      let alive=0;
      for(const p of particles){
        if(p.alpha<=0.015) continue; alive++;
        p.trail.push({x:p.x,y:p.y});
        if(p.trail.length>5) p.trail.shift();
        for(let ti=1;ti<p.trail.length;ti++){
          const pr=p.trail[ti-1],qr=p.trail[ti];
          const prog=ti/p.trail.length;
          ctx.beginPath();ctx.moveTo(pr.x,pr.y);ctx.lineTo(qr.x,qr.y);
          ctx.strokeStyle=p.color; ctx.globalAlpha=p.alpha*prog*0.3; ctx.lineWidth=p.size*0.5; ctx.stroke();
          ctx.globalAlpha=1;
        }
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rotation); ctx.globalAlpha=p.alpha; ctx.fillStyle=p.color;
        if(p.isRect){ ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); }
        else{ ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill(); }
        ctx.restore();
        p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=0.985;
        p.rotation+=p.rotSpeed; p.alpha-=p.decay;
      }

      // HUNT phase
      if(animPhase==="hunt"){
        const huntT=Math.min(el/1000,1);
        const wobble=1-huntT;
        rX=lerp(rX,tgtX+Math.sin(el*0.003)*40*wobble,0.035+huntT*0.04);
        rY=lerp(rY,tgtY+Math.cos(el*0.0025)*30*wobble,0.035+huntT*0.04);
        rSize=lerp(rSize,36,0.025);
        drawReticle(rX,rY,rSize,false,0);
        if(huntT>=1){ animPhase="locking"; lockedAt=now; }

      } else if(animPhase==="locking"){
        const lt=Math.min((now-lockedAt)/700,1);
        lockProgress=lt;
        rX=lerp(rX,tgtX,0.10+lt*0.12);
        rY=lerp(rY,tgtY,0.10+lt*0.12);
        rSize=lerp(rSize,32,0.05);
        drawReticle(rX,rY,rSize,lt>0.95,lt);
        if(lt>0.45&&lt<0.5){ triggerFlash(248,113,113,0.4); triggerShake(8); }
        if(lt>0.78&&lt<0.83){ triggerFlash(248,113,113,0.6); triggerShake(10); }
        if(lt>=1){
          animPhase="locked"; lockedFired=true;
          fireAt=now+500;
          triggerFlash(255,80,80,0.7); triggerShake(14);
        }

      } else if(animPhase==="locked"){
        drawReticle(tgtX,tgtY,32,true,1);
        if(now>=fireAt){ animPhase="fire"; }

      } else if(animPhase==="fire"){
        drawReticle(tgtX,tgtY,32,true,1);
        const ft=Math.min((now-fireAt)/700,1);
        const et=ease(ft);
        const cpX=tgtX-W*0.18, cpY=Math.min(msY0,tgtY)-H*0.35;
        const mx=(1-et)*(1-et)*msX0+2*(1-et)*et*cpX+et*et*tgtX;
        const my=(1-et)*(1-et)*msY0+2*(1-et)*et*cpY+et*et*tgtY;
        const ft2=Math.min(ft+0.015,1); const et2=ease(ft2);
        const nx=(1-et2)*(1-et2)*msX0+2*(1-et2)*et2*cpX+et2*et2*tgtX;
        const ny=(1-et2)*(1-et2)*msY0+2*(1-et2)*et2*cpY+et2*et2*tgtY;
        const angle=Math.atan2(ny-my,nx-mx)*(180/Math.PI)+90;
        trail.push({x:mx,y:my});
        if(trail.length>55) trail.shift();
        for(let ti=1;ti<trail.length;ti++){
          const p=trail[ti-1],q=trail[ti];
          const prog=ti/trail.length;
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(250,180,30,${prog*0.9})`; ctx.lineWidth=1.5+prog*4.5; ctx.stroke();
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(255,255,200,${prog*0.55})`; ctx.lineWidth=prog*2; ctx.stroke();
        }
        drawMissile(mx,my,angle);
        if(ft>=1 && !impactFired){
          impactFired=true; animPhase="exploding";
          spawnExplosion(tgtX,tgtY);
          triggerFlash(255,255,220,1.0); triggerShake(28);
          // big fireball glow at impact point
          T(()=>{ triggerFlash(255,180,30,0.7); triggerShake(20); },100);
          T(()=>{ triggerFlash(255,100,0,0.5); triggerShake(14); },220);
          T(()=>{ triggerFlash(255,220,60,0.3); },380);
          // transition to settle after explosion settles
          T(()=>{ overlayAlpha=0; showSettle=true; },1200);
        }
      } else if(animPhase==="exploding"){
        // fireball at impact
        const fbt=Math.min((now-fireAt-700)/800,1);
        if(fbt<1){
          const fbSize=(1-fbt)*Math.min(W,H)*0.45;
          const grad=ctx.createRadialGradient(tgtX,tgtY,0,tgtX,tgtY,fbSize);
          grad.addColorStop(0,`rgba(255,255,255,${(1-fbt)*0.9})`);
          grad.addColorStop(0.15,`rgba(255,240,100,${(1-fbt)*0.8})`);
          grad.addColorStop(0.35,`rgba(255,140,20,${(1-fbt)*0.7})`);
          grad.addColorStop(0.6,`rgba(220,60,0,${(1-fbt)*0.5})`);
          grad.addColorStop(1,"transparent");
          ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
        }
      }

      // dark overlay fade-in for settle screen
      if(showSettle && overlayAlpha<0.82){
        overlayAlpha=Math.min(overlayAlpha+0.02,0.82);
        ctx.fillStyle=`rgba(0,0,0,${overlayAlpha})`;
        ctx.fillRect(0,0,W,H);
      } else if(showSettle){
        ctx.fillStyle="rgba(0,0,0,0.82)";
        ctx.fillRect(0,0,W,H);
      }

      ctx.restore();
      if(alive>0||flashAlpha>0.01||rings.some(r=>r.r<r.maxR)||animPhase==="hunt"||animPhase==="locking"||animPhase==="locked"||animPhase==="fire"||animPhase==="exploding"){
        animRef.current=requestAnimationFrame(tick);
      }
    }

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if(animRef.current) cancelAnimationFrame(animRef.current);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, cursor:"pointer" }} onClick={onDismiss}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, pointerEvents:"none" }} />
      {phase === "settle" && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
          <div style={{ textAlign:"center", maxWidth:400, width:"100%", animation:"cel-settle 0.6s cubic-bezier(0.34,1.4,0.64,1) forwards" }}>
            <div style={{ fontSize:72, lineHeight:1, marginBottom:12, filter:"drop-shadow(0 0 24px rgba(250,204,21,0.9))" }}>
              {wins.length > 1 ? "🏆" : "✅"}
            </div>
            <div style={{ fontSize: wins.length > 1 ? 28 : 36, fontWeight:800, color:"#facc15", letterSpacing:-1, marginBottom:4, textShadow:"0 0 40px rgba(250,204,21,0.5)" }}>
              {wins.length === 1 ? "CASH IT" : `${wins.length}× WINNER`}
            </div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:28, letterSpacing:0.5 }}>
              GROUP PLAY{wins.length > 1 ? "S" : ""} GRADED
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {wins.map((w, i) => (
                <div key={w.key} style={{
                  background:"linear-gradient(135deg, rgba(74,222,128,0.18), rgba(74,222,128,0.08))",
                  border:"1px solid rgba(74,222,128,0.45)",
                  borderRadius:16, padding:"16px 22px",
                  animation:`cel-card 0.45s cubic-bezier(0.34,1.2,0.64,1) ${0.1+i*0.12}s both`,
                  boxShadow:"0 4px 24px rgba(74,222,128,0.15)",
                  display:"flex", alignItems:"center", gap:14
                }}>
                  <div style={{ fontSize:22, flexShrink:0 }}>💰</div>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#86efac", lineHeight:1.3 }}>{w.label}</div>
                    <div style={{ fontSize:11, color:"rgba(134,239,172,0.5)", marginTop:3, letterSpacing:0.3 }}>WINNER</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:28, fontSize:11, color:"rgba(255,255,255,0.18)", letterSpacing:1, textTransform:"uppercase" }}>
              Tap to continue
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── LOGO SVG ─────────────────────────────────────────────────────────────────
function LogoIcon({ isAdmin, size = 32 }) {
  const blue = "#1E90FF";
  const dot = isAdmin ? "#f59e0b" : "#facc15";
  const ring1 = isAdmin ? "#f59e0b" : blue;
  const ring2 = isAdmin ? "rgba(245,158,11,0.45)" : `rgba(30,144,255,0.45)`;
  const ring3 = isAdmin ? "rgba(245,158,11,0.22)" : `rgba(30,144,255,0.22)`;
  const tick  = isAdmin ? `rgba(245,158,11,0.6)` : `rgba(30,144,255,0.6)`;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display:"block" }}>
      <circle cx="40" cy="40" r="34" fill="none" stroke={ring1} strokeWidth="2.2"/>
      <circle cx="40" cy="40" r="22" fill="none" stroke={ring2} strokeWidth="1"/>
      <circle cx="40" cy="40" r="11" fill="none" stroke={ring3} strokeWidth="0.7"/>
      <line x1="40" y1="2"  x2="40" y2="16" stroke={ring1} strokeWidth="3"   strokeLinecap="square"/>
      <line x1="40" y1="64" x2="40" y2="78" stroke={ring1} strokeWidth="3"   strokeLinecap="square"/>
      <line x1="2"  y1="40" x2="16" y2="40" stroke={ring1} strokeWidth="3"   strokeLinecap="square"/>
      <line x1="64" y1="40" x2="78" y2="40" stroke={ring1} strokeWidth="3"   strokeLinecap="square"/>
      <line x1="40" y1="27" x2="40" y2="32" stroke={tick}  strokeWidth="1.8" strokeLinecap="square"/>
      <line x1="40" y1="48" x2="40" y2="53" stroke={tick}  strokeWidth="1.8" strokeLinecap="square"/>
      <line x1="27" y1="40" x2="32" y2="40" stroke={tick}  strokeWidth="1.8" strokeLinecap="square"/>
      <line x1="48" y1="40" x2="53" y2="40" stroke={tick}  strokeWidth="1.8" strokeLinecap="square"/>
      <circle cx="40" cy="40" r="3.2" fill={dot}/>
    </svg>
  );
}


// ─── RECORD DETAIL MODAL ──────────────────────────────────────────────────────
function RecordDetailModal({ scope, allPicks, playResults, allTimeHistory, onClose }) {
  const OPPOSITES = {
    spread_away:"spread_home", spread_home:"spread_away",
    over:"under", under:"over", ml_away:"ml_home", ml_home:"ml_away"
  };

  // Build tiers from today's playResults + allPicks
  function buildTodayTiers() {
    const tiers = {};
    const gradedKeys = Object.entries(playResults).filter(([k, r]) => r && !k.startsWith("__"));
    gradedKeys.forEach(([key, result]) => {
      const bt = key.split("__")[1];
      const agreers = Object.values(allPicks).filter(p => p.selections?.[key]).length;
      if (agreers < 2) return;
      if (!tiers[agreers]) tiers[agreers] = { wins:0, losses:0, pushes:0 };
      if (result === "win") tiers[agreers].wins++;
      else if (result === "loss") tiers[agreers].losses++;
      else if (result === "push") tiers[agreers].pushes++;
    });
    return tiers;
  }

  // Build tiers from all-time pick_history
  // Group by pick_key + date, count unique users per play, use stored result
  function buildAllTimeTiers() {
    const tiers = {};
    if (!allTimeHistory || allTimeHistory.length === 0) return tiers;
    // Group by date+pick_key to count agreers
    const playMap = {};
    allTimeHistory.forEach(h => {
      if (!h.result) return;
      const pk = `${h.date}__${h.pick_key}`;
      if (!playMap[pk]) playMap[pk] = { result: h.result, count: 0 };
      playMap[pk].count++;
    });
    Object.values(playMap).forEach(({ result, count }) => {
      if (count < 2) return;
      if (!tiers[count]) tiers[count] = { wins:0, losses:0, pushes:0 };
      if (result === "win") tiers[count].wins++;
      else if (result === "loss") tiers[count].losses++;
      else if (result === "push") tiers[count].pushes++;
    });
    return tiers;
  }

  const tiers = scope === "alltime" ? buildAllTimeTiers() : buildTodayTiers();
  const tierSummary = Object.entries(tiers)
    .map(([tier, s]) => ({ tier: Number(tier), ...s }))
    .sort((a, b) => b.tier - a.tier);

  const isToday = scope === "today";
  const title = isToday ? "Today" : "All Time";

  return (
    <div style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d0b1e",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:660,maxHeight:"88vh",overflowY:"auto",paddingBottom:32}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.15)"}} />
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <div>
              <div style={{fontSize:20,fontWeight:800,color:"#fff",letterSpacing:-0.3}}>{title} Breakdown</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:3}}>Record by agreement level</div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(255,255,255,0.4)",fontSize:18,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
          </div>

          {tierSummary.length === 0 && (
            <div style={{textAlign:"center",color:"rgba(255,255,255,0.25)",padding:"40px 0",fontSize:13}}>No graded plays yet</div>
          )}

          {tierSummary.map(({ tier, wins, losses, pushes }) => {
            const total = wins + losses + pushes;
            const pct = total > 0 ? Math.round((wins / (wins + losses || 1)) * 100) : null;
            const tierColor = tier >= 5 ? "#facc15" : tier >= 3 ? "#fb923c" : "#bae6fd";
            return (
              <div key={tier} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 18px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:26,fontWeight:800,color:tierColor,lineHeight:1,minWidth:28}}>{tier}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:tierColor}}>agree{tier !== 1?"s":""}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{total} play{total!==1?"s":""}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                    <span style={{fontSize:24,fontWeight:800,color:"#fff",letterSpacing:-0.5}}>{wins}-{losses}{pushes>0?`-${pushes}`:""}</span>
                    {pct!==null&&<span style={{fontSize:13,fontWeight:600,color:wins>losses?"#4ade80":losses>wins?"#f87171":"rgba(255,255,255,0.4)"}}>{pct}%</span>}
                  </div>
                </div>
                <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,0.07)",overflow:"hidden",display:"flex"}}>
                  <div style={{width:`${total>0?(wins/total)*100:0}%`,background:"linear-gradient(90deg,#4ade80,#86efac)",transition:"width 0.4s"}} />
                  <div style={{width:`${total>0?(pushes/total)*100:0}%`,background:"rgba(255,255,255,0.2)"}} />
                  <div style={{width:`${total>0?(losses/total)*100:0}%`,background:"linear-gradient(90deg,#f87171,#fca5a5)"}} />
                </div>
                <div style={{display:"flex",gap:12,marginTop:10}}>
                  {[["W",wins,"rgba(74,222,128,0.15)","#4ade80"],["L",losses,"rgba(248,113,113,0.15)","#f87171"],["P",pushes,"rgba(255,255,255,0.08)","rgba(255,255,255,0.4)"]].map(([lbl,val,bg,col])=>(
                    <div key={lbl} style={{background:bg,borderRadius:8,padding:"6px 14px",textAlign:"center",minWidth:44}}>
                      <div style={{fontSize:16,fontWeight:800,color:col,lineHeight:1}}>{val}</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",letterSpacing:1.5,marginTop:2}}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ username, history, loading, isOwn, profilePublic, onTogglePublic, onClose, tab, setTab }) {
  const now = new Date();
  const weekAgo = new Date(now - 7*24*60*60*1000).toISOString().slice(0,10);
  const monthAgo = new Date(now.getFullYear(), now.getMonth()-1, now.getDate()).toISOString().slice(0,10);
  const filtered = history.filter(h => tab==="week"?h.date>=weekAgo:tab==="month"?h.date>=monthAgo:true);

  let wins=0, losses=0, pushes=0, unitsNet=0;
  const sportMap = {};
  filtered.forEach(h => {
    if (h.result==="win"){ wins++; unitsNet+=(h.units_result??h.units??1); }
    else if (h.result==="loss"){ losses++; unitsNet+=(h.units_result??-(h.units??1)); }
    else if (h.result==="push") pushes++;
    const sp = h.sport||"ncaab";
    if (!sportMap[sp]) sportMap[sp]={wins:0,losses:0,pushes:0,units:0};
    if (h.result==="win"){ sportMap[sp].wins++; sportMap[sp].units+=(h.units_result??h.units??1); }
    else if (h.result==="loss"){ sportMap[sp].losses++; sportMap[sp].units+=(h.units_result??-(h.units??1)); }
    else if (h.result==="push") sportMap[sp].pushes++;
  });

  const total=wins+losses+pushes;
  const winPct=total>0?Math.round((wins/(wins+losses||1))*100):null;
  let streak=0,streakType=null;
  for (const h of [...history].sort((a,b)=>b.date.localeCompare(a.date))) {
    if (!h.result||h.result==="push") break;
    if (!streakType) streakType=h.result;
    if (h.result===streakType) streak++; else break;
  }
  const rc=(r)=>r==="win"?"#4ade80":r==="loss"?"#f87171":"rgba(255,255,255,0.3)";
  const rb=(r)=>r==="win"?"rgba(74,222,128,0.1)":r==="loss"?"rgba(248,113,113,0.1)":"rgba(255,255,255,0.04)";
  const show=isOwn||profilePublic;

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0d0b1e",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:660,maxHeight:"92vh",overflowY:"auto",paddingBottom:32}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 0"}}>
          <div style={{width:40,height:4,borderRadius:2,background:"rgba(255,255,255,0.15)"}} />
        </div>
        <div style={{padding:"20px 24px 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#1E90FF,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#fff"}}>
                {username[0].toUpperCase()}
              </div>
              <div>
                <div style={{fontSize:20,fontWeight:800,color:"#fff",letterSpacing:-0.3}}>{username}</div>
                {isOwn&&streak>1&&<div style={{fontSize:11,color:streakType==="win"?"#4ade80":"#f87171",marginTop:3}}>{streakType==="win"?"🔥":"❄️"} {streak} {streakType} streak</div>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
              <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"rgba(255,255,255,0.4)",fontSize:18,width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              {isOwn&&(
                <button onClick={()=>onTogglePublic(!profilePublic)} style={{fontSize:10,fontWeight:600,letterSpacing:1,padding:"5px 10px",borderRadius:8,border:`1px solid ${profilePublic?"rgba(30,144,255,0.4)":"rgba(255,255,255,0.12)"}`,background:profilePublic?"rgba(30,144,255,0.15)":"rgba(255,255,255,0.04)",color:profilePublic?"#bae6fd":"rgba(255,255,255,0.3)",cursor:"pointer",fontFamily:"Outfit,sans-serif",textTransform:"uppercase"}}>
                  {profilePublic?"🌐 Public":"🔒 Private"}
                </button>
              )}
            </div>
          </div>
          {!show&&(
            <div style={{textAlign:"center",padding:"40px 20px 60px"}}>
              <div style={{fontSize:40,marginBottom:16}}>🔒</div>
              <div style={{fontSize:16,fontWeight:700,color:"rgba(255,255,255,0.5)",marginBottom:8}}>Private profile</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.25)"}}>This player keeps their stats private.</div>
            </div>
          )}
          {show&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 18px"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Record</div>
                <div style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:-1}}>{wins}-{losses}{pushes>0?`-${pushes}`:""}</div>
                {winPct!==null&&<div style={{fontSize:12,color:wins>losses?"#4ade80":losses>wins?"#f87171":"rgba(255,255,255,0.4)",marginTop:3}}>{winPct}% win rate</div>}
              </div>
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 18px"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Units</div>
                <div style={{fontSize:28,fontWeight:800,color:unitsNet>0?"#4ade80":unitsNet<0?"#f87171":"rgba(255,255,255,0.5)",letterSpacing:-1}}>{unitsNet>0?"+":""}{Number(unitsNet.toFixed(1))}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginTop:3}}>{filtered.filter(h=>h.result).length} graded · {filtered.filter(h=>!h.result).length} pending</div>
              </div>
            </div>
          )}
          {show&&(
            <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:10,padding:3,gap:2,marginBottom:20}}>
              {[["all","All Time"],["month","This Month"],["week","This Week"],["sport","By Sport"]].map(([t,label])=>(
                <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"7px 4px",background:tab===t?"rgba(30,144,255,0.3)":"transparent",border:tab===t?"1px solid rgba(30,144,255,0.4)":"1px solid transparent",borderRadius:8,color:tab===t?"#e0f2fe":"rgba(255,255,255,0.35)",fontSize:10,fontWeight:tab===t?700:400,cursor:"pointer",fontFamily:"Outfit,sans-serif",whiteSpace:"nowrap"}}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        {show&&(
          <div style={{padding:"0 24px"}}>
            {loading&&<div style={{textAlign:"center",color:"rgba(255,255,255,0.3)",padding:40,fontSize:13}}>Loading...</div>}
            {!loading&&filtered.length===0&&<div style={{textAlign:"center",color:"rgba(255,255,255,0.25)",padding:40,fontSize:13}}>No picks yet{tab!=="all"?" for this period":""}</div>}
            {tab==="sport"&&!loading&&Object.entries(sportMap).map(([sport,s])=>(
              <div key={sport} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 16px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#fff",textTransform:"uppercase",letterSpacing:1}}>{sport}</div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{s.wins}-{s.losses}{s.pushes>0?`-${s.pushes}`:""}</span>
                    <span style={{fontSize:12,fontWeight:600,color:s.units>0?"#4ade80":s.units<0?"#f87171":"rgba(255,255,255,0.4)"}}>{s.units>0?"+":""}{Number(s.units.toFixed(1))}u</span>
                  </div>
                </div>
              </div>
            ))}
            {tab!=="sport"&&!loading&&filtered.map(h=>(
              <div key={h.id} style={{padding:"12px 16px",background:rb(h.result),border:`1px solid ${h.result?rc(h.result)+"30":"rgba(255,255,255,0.07)"}`,borderLeft:`3px solid ${rc(h.result)}`,borderRadius:12,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#e0f2fe"}}>{h.label}</div>
                    {h.matchup&&<div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:2}}>{h.matchup}</div>}
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:4}}>{h.date} · {h.sport?.toUpperCase()}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,marginLeft:12}}>
                    <div style={{fontSize:11,fontWeight:700,color:rc(h.result),background:rb(h.result),border:`1px solid ${rc(h.result)}40`,borderRadius:6,padding:"3px 8px"}}>
                      {h.result?h.result.toUpperCase():"PENDING"}
                    </div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>
                      {h.units||1}u{h.units_result!=null?` -> ${h.units_result>0?"+":""}${Number(h.units_result.toFixed(1))}`:""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// ─── PLAYER PICKS MODAL ───────────────────────────────────────────────────────
function PlayerModal({ player, allPicks, games, onClose }) {
  const picks = allPicks[player];
  if (!picks) return null;
  const isPrivate = !picks.is_public;
  const keys = Object.keys(picks.selections || {});

  function getLabel(key) {
    const [gid, bt] = key.split("__");
    const g = games.find(x => x.id === gid);
    if (!g) return key;
    const BET_TYPES_LOCAL = {
      spread_away: (g) => ({ label: g.away, line: g.spread.away }),
      spread_home: (g) => ({ label: g.home, line: g.spread.home }),
      over:        (g) => ({ label: "Over",  line: g.total }),
      under:       (g) => ({ label: "Under", line: g.total }),
      ml_away:     (g) => ({ label: g.away,  line: `ML ${g.ml.away}` }),
      ml_home:     (g) => ({ label: g.home,  line: `ML ${g.ml.home}` }),
    };
    const { label, line } = BET_TYPES_LOCAL[bt](g);
    return { label, line, game: g };
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card pop" onClick={e => e.stopPropagation()} style={{ borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 400, maxHeight: "80vh", overflowY: "auto", border: "1px solid rgba(30,144,255,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.3 }}>{player}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
              {keys.length} pick{keys.length !== 1 ? "s" : ""} · {isPrivate ? "🔒 Private" : "🌐 Public"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.4)", fontSize: 18, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {keys.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 13, padding: "20px 0" }}>No picks submitted</div>
        ) : isPrivate ? (
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 14, fontStyle: "italic" }}>This player's picks are private - you can see which games they bet but not which side.</div>
            {keys.map(key => {
              const stored = picks.selections[key];
              const matchup = stored?.matchup || (() => {
                const [gid] = key.split("__");
                const g = games.find(x => x.id === gid);
                return g ? `${g.away} @ ${g.home}` : null;
              })();
              return matchup ? (
                <div key={key} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{matchup}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>Pick hidden</div>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          keys.map(key => {
            const stored = picks.selections[key];
            let displayLabel, matchup;
            if (stored?.label) {
              displayLabel = `${stored.label} ${stored.line}`;
              matchup = stored.matchup || null;
            } else {
              const info = getLabel(key);
              if (typeof info === "object" && info?.label) {
                displayLabel = `${info.label} ${info.line}`;
                matchup = info.game ? `${info.game.away} @ ${info.game.home}` : null;
              } else {
                displayLabel = typeof info === "string" ? info : key;
                matchup = null;
              }
            }
            return (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "rgba(30,144,255,0.08)", border: "1px solid rgba(30,144,255,0.15)", borderRadius: 10, marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e0f2fe" }}>{displayLabel}</div>
                  {matchup && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{matchup}</div>}
                  {stored?.note && <div style={{ fontSize: 11, color: "rgba(250,204,21,0.7)", marginTop: 4, fontStyle: "italic" }}>"{stored.note}"</div>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── CELEBRATION CSS (appended to main CSS string) ──
const CELEBRATION_CSS = `
  @keyframes cel-fadein { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cel-settle { 0% { opacity: 0; transform: translateY(32px) scale(0.92); } 60% { opacity: 1; transform: translateY(-4px) scale(1.02); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes cel-card { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
  @keyframes cel-pulse { 0%,100% { box-shadow: 0 0 30px rgba(74,222,128,0.3); } 50% { box-shadow: 0 0 60px rgba(74,222,128,0.6), 0 0 100px rgba(74,222,128,0.2); } }
`;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { background: #0d0b1e; font-family: 'Outfit', sans-serif; }
  .orb1 { position: fixed; top: -180px; left: -120px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(30,144,255,0.32) 0%, transparent 68%); pointer-events: none; z-index: 0; }
  .orb2 { position: fixed; bottom: -140px; right: -80px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 68%); pointer-events: none; z-index: 0; }
  .orb3 { position: fixed; top: 40%; left: 60%; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 68%); pointer-events: none; z-index: 0; }
  .glass-nav { background: rgba(13,11,30,0.88); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(255,255,255,0.07); }
  .glass-card { background: rgba(255,255,255,0.045); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.09); }
  .glass-card-open { background: rgba(255,255,255,0.06); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(30,144,255,0.3); }
  .glass-input { background: rgba(255,255,255,0.06); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; }
  .glass-input:focus { border-color: rgba(30,144,255,0.7) !important; box-shadow: 0 0 0 3px rgba(30,144,255,0.15), 0 0 20px rgba(30,144,255,0.1) !important; outline: none; }
  .glass-bottom { background: rgba(13,11,30,0.92); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(255,255,255,0.08); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .game-row { transition: all 0.18s cubic-bezier(0.4,0,0.2,1); cursor: pointer; }
  .game-row:hover { background: rgba(255,255,255,0.04) !important; }
  .pick-btn { transition: all 0.14s cubic-bezier(0.4,0,0.2,1); cursor: pointer; }
  .pick-btn:hover:not(.active) { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; transform: translateY(-1px); }
  .pick-btn.active { transform: scale(1.01); }
  .sub-btn { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
  .sub-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(30,144,255,0.55) !important; }
  .sub-btn:active:not(:disabled) { transform: translateY(0); }
  .nav-btn { transition: all 0.15s; }
  .nav-btn:hover { color: rgba(255,255,255,0.9) !important; }
  .logo-btn { cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; }
  .toggle-track { transition: background 0.2s; cursor: pointer; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.3s ease forwards; }
  @keyframes expandDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .expand { animation: expandDown 0.22s ease forwards; }
  @keyframes popIn { 0% { transform: scale(0.94); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .pop { animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(30,144,255,0.3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(30,144,255,0.5); }
`;

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  // Auth
  const [session, setSession]           = useState(null);
  const [username, setUsername]         = useState("");
  const [authLoading, setAuthLoading]   = useState(true);
  const [authMode, setAuthMode]         = useState("login"); // "login" | "signup"
  const [authUser, setAuthUser]         = useState("");
  const [authPass, setAuthPass]         = useState("");
  const [authPass2, setAuthPass2]       = useState("");
  const [authError, setAuthError]       = useState("");
  const [authWorking, setAuthWorking]   = useState(false);
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lockin_accounts") || "[]"); } catch { return []; }
  });
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [viewerMode, setViewerMode] = useState(false);
  const [celebrationWins, setCelebrationWins] = useState([]); // plays to celebrate
  const [showCelebration, setShowCelebration] = useState(false);
  const [pickNotes, setPickNotes] = useState({}); // { [key]: noteText }
  const [celebrationPhase, setCelebrationPhase] = useState("explode"); // explode | settle

  // App
  const [page, setPage]                     = useState("group");
  const [viewingPlayer, setViewingPlayer]   = useState(null); // username string or null
  const [games, setGames]                   = useState([]); // empty until cache loads
  const [oddsLoading, setOddsLoading]       = useState(false);
  const [oddsError, setOddsError]           = useState(null);
  const [allPicks, setAllPicks]             = useState({});   // { username: { selections, is_public } }
  const [myPicks, setMyPicks]               = useState(null); // null = not submitted today
  const [selectedPicks, setSelectedPicks]   = useState({});
  const [isPublic, setIsPublic]             = useState(true);
  const [loading, setLoading]               = useState(false);
  const [expandedGame, setExpandedGame]     = useState(null);
  const [search, setSearch]                 = useState("");
  const [record, setRecord]                 = useState({ wins: 0, losses: 0, pushes: 0 });
  const [allTimeRecord, setAllTimeRecord]   = useState({ wins: 0, losses: 0, pushes: 0 });
  const [playResults, setPlayResults]       = useState({});

  // Profile
  const [showProfile, setShowProfile]       = useState(false);
  const [profileUser, setProfileUser]       = useState(null); // username to view
  const [pickHistory, setPickHistory]       = useState([]); // own history
  const [profileHistory, setProfileHistory] = useState([]); // viewed user history
  const [historyLoading, setHistoryLoading] = useState(false);
  const [profilePublic, setProfilePublic]   = useState(false); // own public toggle
  const [pickUnits, setPickUnits]           = useState({}); // { [key]: units }
  const [profileTab, setProfileTab]         = useState("all"); // all|month|week|sport
  const [showRecordDetail, setShowRecordDetail] = useState(false);
  const [recordDetailScope, setRecordDetailScope] = useState("alltime"); // today|alltime

  // Admin
  const [isAdmin, setIsAdmin]               = useState(false);
  const [logoTaps, setLogoTaps]             = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput]         = useState("");
  const [adminError, setAdminError]         = useState(false);

  // ── Auth init ────────────────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Read username directly from session metadata - no network call needed
        const uname = session.user?.user_metadata?.username || null;
        if (uname) {
          setUsername(uname);
        } else {
          supabase.auth.signOut();
        }
      }
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadUsername(userId) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error)

    return user?.user_metadata?.username || null;
  }

  async function handleSignup() {
    if (!authUser.trim() || !authPass.trim()) return setAuthError("Fill in all fields.");
    if (authPass !== authPass2) return setAuthError("Passwords don't match.");
    if (authUser.trim().length < 2) return setAuthError("Username must be at least 2 characters.");
    setAuthWorking(true); setAuthError("");
    // Check username taken (case-insensitive)
    const { data: existing } = await supabase.from("profiles").select("id").ilike("username", authUser.trim()).maybeSingle();
    if (existing) { setAuthError("Username already taken."); setAuthWorking(false); return; }
    const fakeEmail = `${authUser.trim().toLowerCase().replace(/\s+/g, "_")}@lockin.app`;
    const { data, error } = await supabase.auth.signUp({
      email: fakeEmail,
      password: authPass,
      options: { data: { username: authUser.trim() } }
    });
    if (error) { setAuthError(error.message); setAuthWorking(false); return; }
    // Also insert into profiles for group play name display
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, username: authUser.trim() });
    }
    setUsername(authUser.trim());
    // Save credentials locally for quick switch
    const updated = [
      { username: authUser.trim(), password: authPass },
      ...savedAccounts.filter(a => a.username !== authUser.trim())
    ].slice(0, 6);
    setSavedAccounts(updated);
    localStorage.setItem("lockin_accounts", JSON.stringify(updated));
    setAuthWorking(false);
  }

  async function handleLogin() {
    if (!authUser.trim() || !authPass.trim()) return setAuthError("Fill in all fields.");
    setAuthWorking(true); setAuthError("");
    // Construct fake email directly - no DB lookup needed
    const fakeEmail = `${authUser.trim().toLowerCase().replace(/\s+/g, "_")}@lockin.app`;
    console.log("[LockIn] attempting login with email:", fakeEmail);
    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password: authPass });
    console.log("[LockIn] login result:", error ? error.message : "success", signInData?.user?.id);
    if (error) { setAuthError("Username or password is incorrect."); setAuthWorking(false); return; }
    // Get display username from metadata (set at signup)
    const displayUsername = signInData.user?.user_metadata?.username || authUser.trim();
    setUsername(displayUsername);
    // Save credentials locally for quick switch
    const updated = [
      { username: authUser.trim(), password: authPass },
      ...savedAccounts.filter(a => a.username !== authUser.trim())
    ].slice(0, 6);
    setSavedAccounts(updated);
    localStorage.setItem("lockin_accounts", JSON.stringify(updated));
    setAuthWorking(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null); setUsername(""); setMyPicks(null);
    setSelectedPicks({}); setPage("picks"); setIsAdmin(false);
  }

  async function switchAccount(acct) {
    setShowAccountMenu(false);
    await supabase.auth.signOut();
    setMyPicks(null); setSelectedPicks({}); setPage("group"); setIsAdmin(false);
    setAuthWorking(true);
    const fakeEmail = `${acct.username.toLowerCase().replace(/\s+/g, "_")}@lockin.app`;
    const { error } = await supabase.auth.signInWithPassword({ email: fakeEmail, password: acct.password });
    if (error) {
      // Remove bad saved account
      const updated = savedAccounts.filter(a => a.username !== acct.username);
      setSavedAccounts(updated);
      localStorage.setItem("lockin_accounts", JSON.stringify(updated));
    }
    setAuthWorking(false);
  }

  // ── Fetch odds ───────────────────────────────────────────────────────────
  // Load from cache on session start - admin can manually refresh via button
  const oddsFetchedRef = useRef(false);
  useEffect(() => {
    if (!session && !viewerMode) return;
    if (oddsFetchedRef.current) return;
    oddsFetchedRef.current = true;
    loadOddsFromCache();
  }, [session, viewerMode]);

  async function loadOddsFromCache() {
    try {
      const { data: cached } = await supabase
        .from("group_results")
        .select("result")
        .eq("key", `__odds_cache__${TODAY_DATE}`)
        .eq("date", TODAY_DATE)
        .maybeSingle();
      if (cached?.result) {
        const cachedGames = JSON.parse(cached.result);
        if (cachedGames?.length > 0) {
          console.log("[LockIn] loaded", cachedGames.length, "games from cache");
          setGames(cachedGames);
        }
      } else {
        console.log("[LockIn] no cache for today yet - admin can refresh odds");
      }
    } catch (err) {
      console.error("[LockIn] cache load error:", err);
    }
  }

  async function fetchOdds() {
    const apiKey = import.meta.env.VITE_ODDS_API_KEY;
    if (!apiKey) { setOddsError("No API key configured."); return; }
    setOddsLoading(true); setOddsError(null);
    try {
      console.log("[LockIn] admin triggered odds refresh - hitting API");
      const sports = ["basketball_ncaab"];
      const allGames = [];
      for (const sport of sports) {
        const res = await fetch(
          `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=spreads,totals,h2h,spreads_h1,totals_h1&oddsFormat=american&dateFormat=iso`
        );
        if (!res.ok) continue;
        const data = await res.json();
        const todayGames = data.filter(g => g.commence_time.startsWith(TODAY_DATE));
        todayGames.forEach((g) => {
          const h2h = g.bookmakers?.[0]?.markets?.find(m => m.key === "h2h");
          const spreads = g.bookmakers?.[0]?.markets?.find(m => m.key === "spreads");
          const totals = g.bookmakers?.[0]?.markets?.find(m => m.key === "totals");
          const spreads_h1 = g.bookmakers?.[0]?.markets?.find(m => m.key === "spreads_h1");
          const totals_h1 = g.bookmakers?.[0]?.markets?.find(m => m.key === "totals_h1");
          const awayTeam = g.away_team;
          const homeTeam = g.home_team;
          const time = new Date(g.commence_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" });
          const awaySpread = spreads?.outcomes?.find(o => o.name === awayTeam);
          const homeSpread = spreads?.outcomes?.find(o => o.name === homeTeam);
          const over = totals?.outcomes?.find(o => o.name === "Over");
          const awayML = h2h?.outcomes?.find(o => o.name === awayTeam);
          const homeML = h2h?.outcomes?.find(o => o.name === homeTeam);
          const awayH1Spread = spreads_h1?.outcomes?.find(o => o.name === awayTeam);
          const homeH1Spread = spreads_h1?.outcomes?.find(o => o.name === homeTeam);
          const overH1 = totals_h1?.outcomes?.find(o => o.name === "Over");
          allGames.push({
            id: g.id,
            away: awayTeam,
            home: homeTeam,
            time: `${time} ET`,
            spread: {
              away: awaySpread ? (awaySpread.point > 0 ? `+${awaySpread.point}` : `${awaySpread.point}`) : "N/A",
              home: homeSpread ? (homeSpread.point > 0 ? `+${homeSpread.point}` : `${homeSpread.point}`) : "N/A",
            },
            total: over ? `${over.point}` : "N/A",
            ml: {
              away: awayML ? (awayML.price > 0 ? `+${awayML.price}` : `${awayML.price}`) : "N/A",
              home: homeML ? (homeML.price > 0 ? `+${homeML.price}` : `${homeML.price}`) : "N/A",
            },
            h1: spreads_h1 || totals_h1 ? {
              spread: {
                away: awayH1Spread ? (awayH1Spread.point > 0 ? `+${awayH1Spread.point}` : `${awayH1Spread.point}`) : null,
                home: homeH1Spread ? (homeH1Spread.point > 0 ? `+${homeH1Spread.point}` : `${homeH1Spread.point}`) : null,
              },
              total: overH1 ? `${overH1.point}` : null,
            } : null,
          });
        });
      }

      if (allGames.length > 0) {
        // Merge with existing cache - keep games that already have picks against them
        const { data: existing } = await supabase
          .from("group_results")
          .select("result")
          .eq("key", `__odds_cache__${TODAY_DATE}`)
          .eq("date", TODAY_DATE)
          .maybeSingle();

        let mergedGames = allGames;
        if (existing?.result) {
          try {
            const cachedGames = JSON.parse(existing.result);
            // Find all game IDs that have active picks today
            const pickedIds = new Set();
            Object.values(allPicks).forEach(p => {
              Object.keys(p.selections || {}).forEach(key => {
                pickedIds.add(key.split("__")[0]);
              });
            });
            // Keep cached games that have picks but aren't in new fetch (stale lines)
            const preservedGames = cachedGames.filter(cg =>
              pickedIds.has(cg.id) && !allGames.find(ng => ng.id === cg.id)
            );
            mergedGames = [...allGames, ...preservedGames];
          } catch(e) { /* ignore parse errors */ }
        }

        setGames(mergedGames);
        await supabase.from("group_results").upsert(
          { key: `__odds_cache__${TODAY_DATE}`, result: JSON.stringify(mergedGames), date: TODAY_DATE },
          { onConflict: "key,date" }
        );
      }
    } catch (err) {
      console.error("Odds fetch error:", err);
      setOddsError("Could not load live odds - showing default games.");
    } finally {
      setOddsLoading(false);
    }
  }

  // ── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (viewerMode) { loadData(null); return; }
    if (!session || !username) return;
    loadData(username);
  }, [session, username, viewerMode]);

  async function loadData(activeUsername) {
    const uname = activeUsername || username;
    if (!uname && !viewerMode) { setLoading(false); return; }
    setLoading(true);
    try {
    const { data: picksRows } = await supabase
      .from("picks")
      .select("username, selections, is_public, user_id")
      .eq("date", TODAY_DATE);

    if (picksRows) {
      const built = {};
      let mine = null;
      picksRows.forEach(row => {
        // Always include all picks — is_public flag controls UI display only
        built[row.username] = { selections: row.selections, is_public: row.is_public, user_id: row.user_id };
        if (row.username === uname) mine = row;
      });
      setAllPicks(built);
      if (mine) {
        setMyPicks({ selections: mine.selections, is_public: mine.is_public });
        setSelectedPicks(mine.selections);
        setIsPublic(mine.is_public);
      }
    }

    // Load results for today
    const { data: resultsRows } = await supabase
      .from("group_results")
      .select("key, result")
      .eq("date", TODAY_DATE);

    if (resultsRows) {
      const built = {};
      resultsRows.forEach(row => { built[row.key] = row.result; });
      setPlayResults(built);
      recomputeRecord(built);
      checkForNewWins(built, games);
    }

    // Load all-time record - only rows with graded results
    const { data: allResultsRows } = await supabase
      .from("group_results")
      .select("result")
      .in("result", ["win", "loss", "push"]);
    if (allResultsRows) {
      const atRec = { wins: 0, losses: 0, pushes: 0 };
      allResultsRows.forEach(row => {
        if (row.result === "win") atRec.wins++;
        else if (row.result === "loss") atRec.losses++;
        else if (row.result === "push") atRec.pushes++;
      });
      setAllTimeRecord(atRec);
    }
    } catch (err) {
      console.error("loadData error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadPickHistory(uname) {
    setHistoryLoading(true);
    // Load history
    const { data } = await supabase
      .from("pick_history")
      .select("*")
      .eq("username", uname)
      .order("date", { ascending: false });
    if (data) setPickHistory(data);
    // Load public setting from profiles table (source of truth)
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_public")
      .eq("username", uname)
      .maybeSingle();
    setProfilePublic(profile?.is_public ?? false);
    setHistoryLoading(false);
  }

  async function loadProfileHistory(uname) {
    setHistoryLoading(true);
    // Check if profile is public from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_public")
      .eq("username", uname)
      .maybeSingle();
    const isPublic = profile?.is_public ?? false;
    setProfilePublic(isPublic);
    if (isPublic) {
      const { data } = await supabase
        .from("pick_history")
        .select("*")
        .eq("username", uname)
        .order("date", { ascending: false });
      if (data) setProfileHistory(data);
    } else {
      setProfileHistory([]);
    }
    setHistoryLoading(false);
  }

  async function toggleProfilePublic(isNowPublic) {
    setProfilePublic(isNowPublic);
    // Update profiles table (source of truth for visibility)
    await supabase.from("profiles")
      .update({ is_public: isNowPublic })
      .eq("username", username);
    // Also sync to pick_history rows so RLS works correctly
    await supabase.from("pick_history")
      .update({ is_public: isNowPublic })
      .eq("username", username);
  }

  function recomputeRecord(results) {
    const rec = { wins: 0, losses: 0, pushes: 0 };
    Object.values(results).forEach(r => {
      if (r === "win") rec.wins++;
      else if (r === "loss") rec.losses++;
      else if (r === "push") rec.pushes++;
    });
    setRecord(rec);
  }

  // Auto-advance celebration - missile sequence takes ~3.2s before settle
  useEffect(() => {
    if (showCelebration && celebrationPhase === "explode") {
      const t = setTimeout(() => setCelebrationPhase("settle"), 3200);
      return () => clearTimeout(t);
    }
  }, [showCelebration, celebrationPhase]);

  function checkForNewWins(results, currentGames) {
    const seenKey = `lockin_seen_wins_${TODAY_DATE}`;
    const seen = new Set(JSON.parse(localStorage.getItem(seenKey) || "[]"));
    const newWins = Object.entries(results)
      .filter(([key, result]) => result === "win" && !seen.has(key) && !key.startsWith("__"))
      .map(([key]) => {
        const [gid, bt] = key.split("__");

        // First try to get label from stored picks (most reliable - saved at submit time)
        let label = null;
        const allPicksEntries = Object.values(allPicks);
        for (const p of allPicksEntries) {
          const stored = p.selections?.[key];
          if (stored?.label) {
            label = `${stored.label} ${stored.line}`;
            break;
          }
        }

        // Fall back to live game lookup
        if (!label) {
          const game = currentGames.find(g => g.id === gid);
          if (game) {
            const BT = {
              spread_away:    (g) => `${g.away} ${g.spread.away}`,
              spread_home:    (g) => `${g.home} ${g.spread.home}`,
              over:           (g) => `Over ${g.total}`,
              under:          (g) => `Under ${g.total}`,
              ml_away:        (g) => `${g.away} ML`,
              ml_home:        (g) => `${g.home} ML`,
              h1_spread_away: (g) => `${g.away} 1H ${g.h1?.spread?.away || ""}`,
              h1_spread_home: (g) => `${g.home} 1H ${g.h1?.spread?.home || ""}`,
              h1_over:        (g) => `1H Over ${g.h1?.total || ""}`,
              h1_under:       (g) => `1H Under ${g.h1?.total || ""}`,
            };
            label = BT[bt]?.(game) || key;
          } else {
            label = key;
          }
        }

        return { key, label };
      });
    if (newWins.length > 0 && !isAdmin) {
      const updatedSeen = [...seen, ...newWins.map(w => w.key)];
      localStorage.setItem(seenKey, JSON.stringify(updatedSeen));
      setCelebrationWins(newWins);
      setCelebrationPhase("explode");
      setShowCelebration(true);
    }
  }

  // ── Realtime ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    const picksSub = supabase.channel("picks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "picks" }, () => {
        supabase.from("picks").select("username, selections, is_public, user_id").eq("date", TODAY_DATE).then(({ data }) => {
          if (data) {
            const built = {};
            data.forEach(row => {
              built[row.username] = { selections: row.selections, is_public: row.is_public, user_id: row.user_id };
            });
            setAllPicks(built);
          }
        });
      }).subscribe();

    const resultsSub = supabase.channel("results-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "group_results" }, () => {
        supabase.from("group_results").select("key, result").eq("date", TODAY_DATE).then(({ data }) => {
          if (data) {
            const built = {};
            data.forEach(row => { built[row.key] = row.result; });
            setPlayResults(built);
            recomputeRecord(built);
          }
        });
      }).subscribe();

    return () => {
      supabase.removeChannel(picksSub);
      supabase.removeChannel(resultsSub);
    };
  }, [session, username]);

  // ── Admin ─────────────────────────────────────────────────────────────────
  function handleLogoTap() {
    if (isAdmin) { setIsAdmin(false); return; }
    const next = logoTaps + 1;
    setLogoTaps(next);
    if (next >= 3) {
      setLogoTaps(0);
      setShowAdminModal(true);
      setAdminInput(""); setAdminError(false);
    }
  }

  function submitAdminPassword() {
    if (adminInput === ADMIN_PASSWORD) {
      setIsAdmin(true); setShowAdminModal(false); setAdminError(false);
    } else {
      setAdminError(true);
    }
  }

  // ── Picks ─────────────────────────────────────────────────────────────────
  const filteredGames = games.filter(g =>
    g.away.toLowerCase().includes(search.toLowerCase()) ||
    g.home.toLowerCase().includes(search.toLowerCase())
  );

  function togglePick(gameId, betType) {
    const key = `${gameId}__${betType}`;
    const oppKey = `${gameId}__${OPPOSITES[betType]}`;
    setSelectedPicks(prev => {
      const next = { ...prev };
      delete next[oppKey];
      if (next[key]) delete next[key]; else next[key] = true;
      return next;
    });
    // Clean up notes for removed keys so they don't bleed into other picks
    setPickNotes(prev => {
      const next = { ...prev };
      delete next[oppKey]; // always remove the opposite's note
      // if toggling off, also remove this key's note
      if (selectedPicks[key]) delete next[key];
      return next;
    });
  }

  async function submitPicks() {
    if (!Object.keys(selectedPicks).length) return;
    // Enrich selections with human-readable labels so display never depends on current game list
    const enriched = {};
    Object.keys(selectedPicks).forEach(key => {
      const [gid, bt] = key.split("__");
      const game = games.find(g => g.id === gid);
      const BT = {
        spread_away:    (g) => ({ label: g.away, line: g.spread.away, matchup: `${g.away} @ ${g.home}` }),
        spread_home:    (g) => ({ label: g.home, line: g.spread.home, matchup: `${g.away} @ ${g.home}` }),
        over:           (g) => ({ label: "Over",  line: g.total,        matchup: `${g.away} @ ${g.home}` }),
        under:          (g) => ({ label: "Under", line: g.total,        matchup: `${g.away} @ ${g.home}` }),
        ml_away:        (g) => ({ label: g.away,  line: `ML ${g.ml.away}`, matchup: `${g.away} @ ${g.home}` }),
        ml_home:        (g) => ({ label: g.home,  line: `ML ${g.ml.home}`, matchup: `${g.away} @ ${g.home}` }),
        h1_spread_away: (g) => ({ label: `${g.away} 1H`, line: g.h1?.spread?.away || "N/A", matchup: `${g.away} @ ${g.home}` }),
        h1_spread_home: (g) => ({ label: `${g.home} 1H`, line: g.h1?.spread?.home || "N/A", matchup: `${g.away} @ ${g.home}` }),
        h1_over:        (g) => ({ label: "1H Over",  line: g.h1?.total || "N/A", matchup: `${g.away} @ ${g.home}` }),
        h1_under:       (g) => ({ label: "1H Under", line: g.h1?.total || "N/A", matchup: `${g.away} @ ${g.home}` }),
      };
      const base = game ? BT[bt]?.(game) || {} : {};
      enriched[key] = { ...base, ...(pickNotes[key] ? { note: pickNotes[key].trim() } : {}), units: pickUnits[key] || 1 };
    });
    const payload = {
      username,
      user_id: session.user.id,
      selections: enriched,
      is_public: isPublic,
      date: TODAY_DATE,
    };
    const { error } = await supabase.from("picks").upsert(payload, { onConflict: "username,date" });
    if (!error) {
      setPickNotes({});
      setPickUnits({});
      setMyPicks({ selections: enriched, is_public: isPublic });
      setAllPicks(prev => ({
        ...prev,
        [username]: { selections: enriched, is_public: isPublic },
      }));
    } else {
      alert("Something went wrong saving your picks. Try again.");
    }
  }

  // ── Results ───────────────────────────────────────────────────────────────
  async function markResult(key, result) {
    if (!isAdmin) return;
    const prev = playResults[key];
    const isClear = result === null || prev === result;
    if (isClear) {
      await supabase.from("group_results").delete().eq("key", key).eq("date", TODAY_DATE);
      // Clear result in pick_history for all users who had this pick
      await supabase.from("pick_history").update({ result: null, units_result: null }).eq("pick_key", key).eq("date", TODAY_DATE);
      const next = { ...playResults };
      delete next[key];
      setPlayResults(next);
      recomputeRecord(next);
    } else {
      await supabase.from("group_results").upsert({ key, result, date: TODAY_DATE }, { onConflict: "key,date" });
      const next = { ...playResults, [key]: result };
      setPlayResults(next);
      recomputeRecord(next);

      // Archive to pick_history for every user who had this pick
      const historyRows = [];
      Object.entries(allPicks).forEach(([uname, pickData]) => {
        const stored = pickData.selections?.[key];
        if (stored) {
          const units = stored.units || 1;
          const unitsResult = result === "win" ? units : result === "loss" ? -units : 0;
          historyRows.push({
            user_id: null, // will be resolved server-side via username lookup - we set it below
            username: uname,
            date: TODAY_DATE,
            pick_key: key,
            label: stored.label ? `${stored.label} ${stored.line}` : key,
            matchup: stored.matchup || null,
            sport: "ncaab",
            units,
            result,
            units_result: unitsResult,
            is_public: false, // default private, user can toggle
          });
        }
      });

      // Use user_id already stored in allPicks (from picks table)

      if (historyRows.length > 0) {
        const rowsWithIds = historyRows.map(r => ({
          ...r,
          user_id: allPicks[r.username]?.user_id || r.user_id || null
        })).filter(r => r.user_id);

        if (rowsWithIds.length > 0) {
          const { error: histErr } = await supabase.from("pick_history").upsert(rowsWithIds, { onConflict: "user_id,date,pick_key" });
          if (histErr) console.error("[LockIn] pick_history upsert error:", histErr.message);
          else {

            // Refresh profile history if it's currently open
            if (showProfile) {
              const viewingUser = profileUser || username;
              if (viewingUser === username) loadPickHistory(username);
              else if (profilePublic) loadProfileHistory(viewingUser);
            }
          }
        }
      }
    }
    // Refresh all-time record
    const { data: allResultsRows } = await supabase
      .from("group_results")
      .select("result")
      .in("result", ["win", "loss", "push"]);
    if (allResultsRows) {
      const atRec = { wins: 0, losses: 0, pushes: 0 };
      allResultsRows.forEach(row => {
        if (row.result === "win") atRec.wins++;
        else if (row.result === "loss") atRec.losses++;
        else if (row.result === "push") atRec.pushes++;
      });
      setAllTimeRecord(atRec);
    }
  }

  async function deletePicker(personUsername) {
    if (!isAdmin) return;
    await supabase.from("picks").delete().eq("username", personUsername).eq("date", TODAY_DATE);
    const next = { ...allPicks };
    delete next[personUsername];
    setAllPicks(next);
  }

  // ── Player profile opener ───────────────────────────────────────────────────
  function openPlayerProfile(uname) {
    if (uname === username) {
      setProfileUser(null);
      setProfileTab("all");
      loadPickHistory(username);
    } else {
      setProfileUser(uname);
      setProfileTab("all");
      loadProfileHistory(uname);
    }
    setShowProfile(true);
  }

  // ── Group play helpers ────────────────────────────────────────────────────
  function getLabel(key) {
    const [gid, bt] = key.split("__");
    const g = games.find(x => x.id === gid);
    if (!g) return key;
    const { label, line } = BET_TYPES[bt](g);
    return `${label} ${line}`;
  }

  function isConsensusPlay(agreers, dissenters) {
    const a = agreers, d = dissenters;
    if (a < 2) return false;
    if (d === 0) return true;
    if (d === 1 && a >= 4) return true;
    if (d === 2 && a >= 6) return true;
    if (d === 3 && a >= 8) return true;
    if (d === 4 && a >= 10) return true;
    return false;
  }

  function getGroupPlays() {
    const allPicksEntries = Object.entries(allPicks);
    const tally = {};
    allPicksEntries.forEach(([person, { selections }]) =>
      Object.keys(selections).forEach(key => {
        if (!tally[key]) tally[key] = [];
        tally[key].push(person);
      })
    );
    const seen = new Set();
    const plays = Object.entries(tally)
      .filter(([key, people]) => {
        if (people.length < 2) return false;
        const [gid, bt] = key.split("__");
        const oppKey = `${gid}__${OPPOSITES[bt]}`;
        const oppCount = tally[oppKey]?.length || 0;
        if (oppCount > people.length) return false;
        const dedupe = [key, oppKey].sort().join("|");
        if (seen.has(dedupe)) return false;
        seen.add(dedupe);
        return true;
      })
      .sort((a, b) => b[1].length - a[1].length);

    return plays.map(([key, people]) => {
      const [gid, bt] = key.split("__");
      const oppKey = `${gid}__${OPPOSITES[bt]}`;
      const dissenters = allPicksEntries
        .filter(([, { selections }]) => selections[oppKey])
        .map(([person]) => person);
      const consensus = isConsensusPlay(people.length, dissenters.length);
      return [key, people, dissenters, consensus];
    });
  }

  const allPlays    = getGroupPlays();
  const groupPlays  = allPlays.filter(([,,,c]) => c);
  const otherPlays  = allPlays.filter(([,,,c]) => !c);
  const submitters  = Object.keys(allPicks);
  const pickCount   = Object.keys(selectedPicks).length;
  const canSubmit   = pickCount > 0;
  const hasSubmitted = myPicks !== null;

  // ── Play card renderer ───────────────────────────────────────────────────
  function PlayCard({ key: _key, playKey, people, dissenters, index, dimmed, onPlayerClick }) {
    const [gid, bt] = playKey.split("__");
    const game = games.find(g => g.id === gid);
    const label = getLabel(playKey);
    const oppLabel = getLabel(`${gid}__${OPPOSITES[bt]}`);
    const heat = !dimmed
      ? people.length >= 5
        ? { color: "#facc15", glow: "rgba(250,204,21,0.4)", border: "rgba(250,204,21,0.5)" }
        : people.length >= 3
        ? { color: "#fb923c", glow: "rgba(251,146,60,0.4)", border: "rgba(251,146,60,0.4)" }
        : { color: "#bae6fd", glow: "rgba(30,144,255,0.4)", border: "rgba(30,144,255,0.5)" }
      : { color: "rgba(255,255,255,0.3)", glow: "none", border: "rgba(255,255,255,0.12)" };
    const result = playResults[playKey] || null;
    const leftBorder = result === "win" ? "#4ade80" : result === "loss" ? "#f87171" : result === "push" ? "rgba(255,255,255,0.3)" : heat.border;

    return (
      <div className="glass-card fade-up" style={{ borderRadius: 16, marginBottom: 10, animationDelay: `${index * 0.06}s`, borderLeft: `3px solid ${leftBorder}`, overflow: "hidden", opacity: dimmed ? 0.7 : 1 }}>
        <div style={{ padding: dimmed ? "16px 20px 14px" : "20px 20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: dimmed ? 15 : 18, fontWeight: 700, color: dimmed ? "rgba(255,255,255,0.6)" : "#fff", marginBottom: 5, letterSpacing: -0.2 }}>{label}</div>
              {game && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{game.away} @ {game.home} · {game.time}</div>}
            </div>
            <div style={{ textAlign: "center", minWidth: 54 }}>
              <div style={{ fontSize: dimmed ? 26 : 36, fontWeight: 800, color: heat.color, lineHeight: 1, textShadow: dimmed ? "none" : `0 0 20px ${heat.glow}` }}>{people.length}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase" }}>agree</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {people.map(p => (
              <span key={p} onClick={() => onPlayerClick && onPlayerClick(p)} style={{ background: dimmed ? "rgba(255,255,255,0.07)" : "rgba(30,144,255,0.18)", border: `1px solid ${dimmed ? "rgba(255,255,255,0.12)" : "rgba(30,144,255,0.35)"}`, borderRadius: 20, padding: "4px 13px", fontSize: 11, color: dimmed ? "rgba(255,255,255,0.4)" : "#bae6fd", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>{p}</span>
            ))}
          </div>
          {/* Notes from players on this play */}
          {people.filter(p => allPicks[p]?.selections?.[playKey]?.note).map(p => (
            <div key={p} style={{ marginBottom: 6, padding: "7px 12px", background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.15)", borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 11, color: "rgba(250,204,21,0.5)", fontWeight: 600, whiteSpace: "nowrap" }}>{p}:</span>
              <span style={{ fontSize: 11, color: "rgba(250,204,21,0.75)", fontStyle: "italic" }}>"{allPicks[p].selections[playKey].note}"</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1, textTransform: "uppercase", marginRight: 4 }}>Result:</span>
            {isAdmin ? (
              <>
                {[["W","win","#4ade80","rgba(74,222,128,0.18)","rgba(74,222,128,0.4)"],["L","loss","#f87171","rgba(248,113,113,0.18)","rgba(248,113,113,0.4)"],["P","push","rgba(255,255,255,0.6)","rgba(255,255,255,0.1)","rgba(255,255,255,0.3)"]].map(([lbl,val,color,bg,border]) => (
                  <button key={val} onClick={() => markResult(playKey, val)} style={{ padding: "5px 13px", borderRadius: 8, border: `1px solid ${result===val?border:"rgba(255,255,255,0.1)"}`, background: result===val?bg:"transparent", color: result===val?color:"rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.15s", boxShadow: result===val?`0 0 10px ${bg}`:"none" }}>{lbl}</button>
                ))}
                {result && <button onClick={() => markResult(playKey, null)} style={{ marginLeft: 4, padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.2)", fontSize: 11, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>clear</button>}
              </>
            ) : result ? (
              <span style={{ padding: "4px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: result==="win"?"rgba(74,222,128,0.18)":result==="loss"?"rgba(248,113,113,0.18)":"rgba(255,255,255,0.1)", color: result==="win"?"#4ade80":result==="loss"?"#f87171":"rgba(255,255,255,0.6)", border: `1px solid ${result==="win"?"rgba(74,222,128,0.4)":result==="loss"?"rgba(248,113,113,0.4)":"rgba(255,255,255,0.3)"}` }}>
                {result==="win"?"✓ Win":result==="loss"?"✗ Loss":"~ Push"}
              </span>
            ) : (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", fontStyle: "italic" }}>Pending</span>
            )}
          </div>
        </div>
        {dissenters.length > 0 && (
          <div style={{ borderTop: `1px solid rgba(251,113,133,${dimmed?0.1:0.2})`, background: `rgba(251,113,133,${dimmed?0.04:0.07})`, padding: "11px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: dimmed?"rgba(253,164,175,0.5)":"#fda4af", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 14 }}>⚠</span> Disagrees:
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {dissenters.map(p => (
                <span key={p} onClick={() => onPlayerClick && onPlayerClick(p)} style={{ background: `rgba(251,113,133,${dimmed?0.08:0.15})`, border: `1px solid rgba(251,113,133,${dimmed?0.2:0.35})`, borderRadius: 20, padding: "3px 11px", fontSize: 11, color: dimmed?"rgba(253,164,175,0.5)":"#fda4af", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>{p}</span>
              ))}
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>on {oppLabel}</span>
          </div>
        )}
      </div>
    );
  }

  // ─── AUTH SCREEN ──────────────────────────────────────────────────────────
  if (authLoading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0b1e" }}>
      <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Loading...</div>
    </div>
  );

  if (!session && !viewerMode) return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "Outfit, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{CSS}{CELEBRATION_CSS}</style>
      <div className="orb1" /><div className="orb2" /><div className="orb3" />
      <div className="glass-card pop" style={{ borderRadius: 24, padding: "40px 32px", width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><LogoIcon isAdmin={false} size={52} /></div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Lock In</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{authMode === "login" ? "Welcome back" : "Create your account"}</div>
        </div>

        <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 4, gap: 4, marginBottom: 24, border: "1px solid rgba(255,255,255,0.07)" }}>
          {[["login","Log In"],["signup","Sign Up"]].map(([m, label]) => (
            <button key={m} onClick={() => { setAuthMode(m); setAuthError(""); }} style={{ flex: 1, padding: "9px", background: authMode===m?"rgba(30,144,255,0.35)":"transparent", border: authMode===m?"1px solid rgba(30,144,255,0.5)":"1px solid transparent", borderRadius: 9, color: authMode===m?"#e0f2fe":"rgba(255,255,255,0.38)", fontSize: 13, fontWeight: authMode===m?600:400, cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.15s" }}>{label}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input className="glass-input" value={authUser} onChange={e => { setAuthUser(e.target.value); setAuthError(""); }} placeholder="Username" onKeyDown={e => e.key==="Enter" && (authMode==="login"?handleLogin():handleSignup())} style={{ borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "Outfit, sans-serif", width: "100%" }} />
          <input className="glass-input" type="password" value={authPass} onChange={e => { setAuthPass(e.target.value); setAuthError(""); }} placeholder="Password" onKeyDown={e => e.key==="Enter" && (authMode==="login"?handleLogin():handleSignup())} style={{ borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "Outfit, sans-serif", width: "100%" }} />
          {authMode === "signup" && (
            <input className="glass-input" type="password" value={authPass2} onChange={e => { setAuthPass2(e.target.value); setAuthError(""); }} placeholder="Confirm password" onKeyDown={e => e.key==="Enter" && handleSignup()} style={{ borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, fontFamily: "Outfit, sans-serif", width: "100%" }} />
          )}
        </div>

        {authError && <div style={{ fontSize: 12, color: "#f87171", marginTop: 10, textAlign: "center" }}>{authError}</div>}

        <button onClick={authMode==="login"?handleLogin:handleSignup} disabled={authWorking} style={{ width: "100%", marginTop: 18, padding: "14px", background: authWorking?"rgba(255,255,255,0.08)":"linear-gradient(135deg, #1E90FF, #0ea5e9)", border: "none", borderRadius: 12, color: authWorking?"rgba(255,255,255,0.3)":"#fff", fontSize: 14, fontWeight: 700, cursor: authWorking?"not-allowed":"pointer", fontFamily: "Outfit, sans-serif", boxShadow: authWorking?"none":"0 4px 20px rgba(30,144,255,0.4)" }}>
          {authWorking ? "..." : authMode==="login" ? "Log In" : "Create Account"}
        </button>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 16 }} />
          <button onClick={() => { oddsFetchedRef.current = false; setViewerMode(true); setPage("group"); loadOddsFromCache(); loadData(null); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "Outfit, sans-serif", letterSpacing: 0.3 }}>
            👀 Watch without an account
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0b1e" }}>
      <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Loading...</div>
    </div>
  );

  // ─── MAIN APP ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "Outfit, sans-serif", paddingBottom: page==="picks" && !hasSubmitted ? 100 : 0 }}>
      <style>{CSS}</style>
      <div className="orb1" /><div className="orb2" /><div className="orb3" />


      {/* ── RECORD DETAIL MODAL ── */}
      {showRecordDetail && (
        <RecordDetailModal
          scope={recordDetailScope}
          allPicks={allPicks}
          playResults={playResults}
          games={games}
          onClose={() => setShowRecordDetail(false)}
        />
      )}

      {/* ── WIN CELEBRATION ── */}
      {showCelebration && <WinCelebration wins={celebrationWins} phase={celebrationPhase} onDismiss={() => setShowCelebration(false)} />}

      {/* ── PROFILE PAGE ── */}
      {showProfile && (
        <ProfilePage
          username={profileUser || username}
          history={profileUser && profileUser !== username ? profileHistory : pickHistory}
          loading={historyLoading}
          isOwn={!profileUser || profileUser === username}
          profilePublic={profilePublic}
          onTogglePublic={toggleProfilePublic}
          onClose={() => { setShowProfile(false); setProfileUser(null); }}
          tab={profileTab}
          setTab={setProfileTab}
        />
      )}

      {/* ── PLAYER MODAL ── */}
      {viewingPlayer && (
        <PlayerModal
          player={viewingPlayer}
          allPicks={allPicks}
          games={games}
          onClose={() => setViewingPlayer(null)}
        />
      )}

      {/* ── ADMIN MODAL ── */}
      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="glass-card pop" onClick={e => e.stopPropagation()} style={{ borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 340, border: "1px solid rgba(30,144,255,0.3)" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🔒</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Admin Access</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Enter your password to grade results</div>
            <input className="glass-input" type="password" value={adminInput} onChange={e => { setAdminInput(e.target.value); setAdminError(false); }} onKeyDown={e => e.key==="Enter" && submitAdminPassword()} placeholder="Password" autoFocus style={{ width: "100%", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "Outfit, sans-serif", marginBottom: 10, borderColor: adminError?"rgba(248,113,113,0.6)":undefined }} />
            {adminError && <div style={{ fontSize: 12, color: "#f87171", marginBottom: 10 }}>Wrong password</div>}
            <button onClick={submitAdminPassword} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #1E90FF, #0ea5e9)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>Unlock</button>
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <div className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 14px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div className="logo-btn" onClick={handleLogoTap} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <LogoIcon isAdmin={isAdmin} size={30} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: -0.3, whiteSpace: "nowrap" }}>Lock In</div>
              {isAdmin && <div style={{ fontSize: 8, color: "rgba(251,191,36,0.7)", letterSpacing: 0.8, marginTop: 2 }}>ADMIN</div>}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "3px", gap: 2, border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              {[["picks","Picks"],["group","Group"],["players","Players"]].filter(([p]) => !viewerMode || p !== "picks").map(([p, label]) => (
                <button key={p} className="nav-btn" onClick={() => setPage(p)} style={{ padding: "7px 10px", background: page===p?"rgba(30,144,255,0.35)":"transparent", border: page===p?"1px solid rgba(30,144,255,0.5)":"1px solid transparent", borderRadius: 8, color: page===p?"#e0f2fe":"rgba(255,255,255,0.38)", fontSize: 11, fontWeight: page===p?600:400, cursor: "pointer", fontFamily: "Outfit, sans-serif", position: "relative", whiteSpace: "nowrap" }}>
                  {label}
                  {p==="group" && groupPlays.length>0 && <span style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, background: "#0ea5e9", borderRadius: "50%", boxShadow: "0 0 6px #0ea5e9" }} />}
                </button>
              ))}
            </div>
            {/* Account switcher / sign in */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {viewerMode ? (
                <button onClick={() => setViewerMode(false)} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(30,144,255,0.2)", border: "1px solid rgba(30,144,255,0.5)", borderRadius: 16, padding: "5px 12px", cursor: "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#bae6fd" }}>Sign In</span>
                </button>
              ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setProfileUser(null); setProfileTab("all"); loadPickHistory(username); setShowProfile(true); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, background: "rgba(30,144,255,0.15)", border: "1px solid rgba(30,144,255,0.3)", borderRadius: "50%", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 800, color: "#bae6fd" }}>
                  {username[0]?.toUpperCase()}
                </button>
                <button onClick={() => setShowAccountMenu(v => !v)} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(30,144,255,0.15)", border: "1px solid rgba(30,144,255,0.3)", borderRadius: 16, padding: "5px 10px 5px 10px", cursor: "pointer", fontFamily: "Outfit, sans-serif", maxWidth: 110 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#bae6fd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{username}</span>
                  <span style={{ fontSize: 8, color: "rgba(186,230,253,0.5)", flexShrink: 0 }}>▾</span>
                </button>
              </div>
              )}
              {showAccountMenu && (
                <div className="glass-card pop" style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", borderRadius: 14, minWidth: 180, padding: "8px", zIndex: 300, border: "1px solid rgba(30,144,255,0.25)" }} onClick={e => e.stopPropagation()}>
                  {savedAccounts.filter(a => a.username !== username).length > 0 && (
                    <>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 8px 6px" }}>Switch to</div>
                      {savedAccounts.filter(a => a.username !== username).map(acct => (
                        <button key={acct.username} onClick={() => switchAccount(acct)} style={{ width: "100%", display: "block", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "none", borderRadius: 9, color: "#e0f2fe", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", textAlign: "left", marginBottom: 3, transition: "background 0.15s" }}
                          onMouseEnter={e => e.target.style.background="rgba(30,144,255,0.2)"}
                          onMouseLeave={e => e.target.style.background="rgba(255,255,255,0.04)"}>
                          {acct.username}
                        </button>
                      ))}
                      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "6px 0" }} />
                    </>
                  )}
                  <button onClick={() => { setShowAccountMenu(false); handleLogout(); }} style={{ width: "100%", display: "block", padding: "9px 12px", background: "none", border: "none", borderRadius: 9, color: "rgba(252,165,165,0.8)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "Outfit, sans-serif", textAlign: "left", transition: "background 0.15s" }}
                    onMouseEnter={e => e.target.style.background="rgba(248,113,113,0.1)"}
                    onMouseLeave={e => e.target.style.background="none"}>
                    Log out
                  </button>
                </div>
              )}
              {showAccountMenu && <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setShowAccountMenu(false)} />}
              )}
            </div>
          </div>
        </div>

        {submitters.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "7px 22px" }}>
            <div style={{ maxWidth: 660, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, overflowX: "auto", flexWrap: "nowrap", paddingBottom: 2, scrollbarWidth: "none" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", flexShrink: 0 }}>Filed:</span>
              {submitters.map(s => (
                <span key={s} onClick={() => openPlayerProfile(s)} style={{ background: s===username?"rgba(30,144,255,0.25)":"rgba(30,144,255,0.12)", border: `1px solid ${s===username?"rgba(30,144,255,0.5)":"rgba(30,144,255,0.25)"}`, borderRadius: 20, padding: "2px 10px", fontSize: 11, color: "#bae6fd", fontWeight: s===username?700:400, cursor: "pointer", transition: "all 0.15s" }}>
                  {s}{!allPicks[s]?.is_public ? " 🔒" : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "24px 22px", position: "relative", zIndex: 1 }}>

        {/* ═══ MY PICKS PAGE ═══ */}
        {page === "picks" && viewerMode && (
          <div className="fade-up" style={{ padding: "0 0 40px" }}>
            <div className="glass-card" style={{ borderRadius: 20, padding: "40px 28px", textAlign: "center", margin: "0 0 16px" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Sign in to file picks</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 24, lineHeight: 1.6 }}>You're watching as a guest. Create a free account to submit your picks and join the group.</div>
              <button onClick={() => setViewerMode(false)} style={{ padding: "13px 32px", background: "linear-gradient(135deg, #1E90FF, #0ea5e9)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: "0 4px 20px rgba(30,144,255,0.4)" }}>Sign In / Create Account</button>
            </div>
          </div>
        )}
        {page === "picks" && !viewerMode && (
          <div className="fade-up">
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>{TODAY_LABEL}</div>

            {/* Odds status */}
            {oddsLoading && (
              <div style={{ textAlign: "center", padding: "12px", fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>⏳ Fetching live odds...</div>
            )}
            {oddsError && (
              <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#fbbf24", marginBottom: 12 }}>⚠ {oddsError}</div>
            )}

            {/* Already submitted - show their picks */}
            {hasSubmitted && (
              <div style={{ marginBottom: 20 }}>
                <div className="glass-card" style={{ borderRadius: 16, padding: "16px 20px", marginBottom: 14, border: "1px solid rgba(30,144,255,0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Your picks are in ✓</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
                        {Object.keys(myPicks.selections).length} play{Object.keys(myPicks.selections).length!==1?"s":""} · {myPicks.is_public ? "🌐 Public" : "🔒 Private"}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(30,144,255,0.65)", marginTop: 5 }}>Want to add or change picks? Hit Edit</div>
                    </div>
                    <button onClick={() => setMyPicks(null)} style={{ padding: "8px 18px", background: "rgba(30,144,255,0.2)", border: "1px solid rgba(30,144,255,0.45)", borderRadius: 10, color: "#7dd3fc", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>Edit</button>
                  </div>
                </div>

                {/* Show their picks summary */}
                {Object.keys(myPicks.selections).map(key => {
                  const stored = myPicks.selections[key];
                  // Use stored label if available, fall back to live game lookup
                  const displayLabel = stored?.label
                    ? `${stored.label} ${stored.line}`
                    : getLabel(key);
                  const matchup = stored?.matchup || (() => {
                    const [gid] = key.split("__");
                    const game = games.find(g => g.id === gid);
                    return game ? `${game.away} @ ${game.home}` : null;
                  })();
                  const note = stored?.note || null;
                  const units = stored?.units || 1;
                  return (
                    <div key={key} style={{ padding: "10px 16px", background: "rgba(30,144,255,0.08)", border: "1px solid rgba(30,144,255,0.15)", borderRadius: 10, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e0f2fe" }}>{displayLabel}</div>
                        {matchup && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{matchup}</div>}
                        {note && <div style={{ fontSize: 11, color: "rgba(250,204,21,0.7)", marginTop: 4, fontStyle: "italic" }}>"{note}"</div>}
                      </div>
                      {units > 1 && <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(30,144,255,0.8)", background: "rgba(30,144,255,0.12)", borderRadius: 6, padding: "2px 8px", marginLeft: 8, flexShrink: 0 }}>{units}u</div>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pick entry form */}
            {!hasSubmitted && (
              <>
                {games.length === 0 && !oddsLoading && (
                  <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🕐</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Lines aren't up yet for today</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                      When you get a chance, could you let the admin know<br />so they can refresh the odds? Thanks! 🙏
                    </div>
                  </div>
                )}
                {games.length > 0 && <div style={{ position: "relative", marginBottom: 16 }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "rgba(255,255,255,0.25)", pointerEvents: "none" }}>🔍</div>
                  <input className="glass-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams..." style={{ width: "100%", borderRadius: 12, padding: "11px 14px 11px 40px", color: "#fff", fontSize: 13, fontFamily: "Outfit, sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>}
                </div>}

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ background: "linear-gradient(135deg, rgba(30,144,255,0.4), rgba(14,165,233,0.4))", border: "1px solid rgba(30,144,255,0.4)", borderRadius: 6, padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#bae6fd", textTransform: "uppercase" }}>NCAAB</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{filteredGames.length} game{filteredGames.length!==1?"s":""}{search?" found":" today"}</span>
                </div>

                {filteredGames.map(game => {
                  const isOpen = expandedGame === game.id;
                  const gamePicks = Object.keys(selectedPicks).filter(k => k.startsWith(game.id));
                  return (
                    <div key={game.id} className={isOpen?"glass-card-open":"glass-card"} style={{ borderRadius: 16, marginBottom: 10, overflow: "hidden", transition: "border-color 0.2s, background 0.2s" }}>
                      <div className="game-row" onClick={() => setExpandedGame(isOpen ? null : game.id)} style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: isOpen?"1px solid rgba(255,255,255,0.06)":"none" }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: -0.2 }}>{game.away} <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>@</span> {game.home}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{game.time}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {gamePicks.length > 0 && <span style={{ background: "linear-gradient(135deg, rgba(30,144,255,0.35), rgba(14,165,233,0.35))", border: "1px solid rgba(30,144,255,0.4)", borderRadius: 20, padding: "3px 11px", fontSize: 11, color: "#bae6fd", fontWeight: 600 }}>{gamePicks.length} pick{gamePicks.length!==1?"s":""}</span>}
                          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, display: "inline-block", transform: isOpen?"rotate(180deg)":"rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)" }}>▾</span>
                        </div>
                      </div>
                      {isOpen && (
                        <div style={{ padding: "16px 18px 18px" }} className="expand">
                          {[["Spread",["spread_away","spread_home"]],["Total",["over","under"]],["Moneyline",["ml_away","ml_home"]],["1H Spread",["h1_spread_away","h1_spread_home"]],["1H Total",["h1_over","h1_under"]]].filter(([, types]) => types.every(bt => { const v = BET_TYPES[bt](game); return v.line && v.line !== "N/A"; })).map(([catLabel, types]) => (
                            <div key={catLabel} style={{ marginBottom: 14 }}>
                              <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(30,144,255,0.8)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{catLabel}</div>
                              <div style={{ display: "flex", gap: 8 }}>
                                {types.map(bt => {
                                  const { label: l, line } = BET_TYPES[bt](game);
                                  const key = `${game.id}__${bt}`;
                                  const active = !!selectedPicks[key];
                                  return (
                                    <button key={bt} className={`pick-btn${active?" active":""}`} onClick={() => togglePick(game.id, bt)} style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: `1px solid ${active?"rgba(30,144,255,0.7)":"rgba(255,255,255,0.09)"}`, background: active?"rgba(30,144,255,0.22)":"rgba(255,255,255,0.04)", cursor: "pointer", fontFamily: "Outfit, sans-serif", textAlign: "center", boxShadow: active?"0 0 16px rgba(30,144,255,0.2)":"none" }}>
                                      <div style={{ fontSize: 13, fontWeight: active?700:500, color: active?"#e0f2fe":"rgba(255,255,255,0.75)" }}>{l}</div>
                                      <div style={{ fontSize: 13, color: active?"#bae6fd":"rgba(255,255,255,0.3)", marginTop: 3, fontWeight: active?600:400 }}>{line}</div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          {/* Note field - only show if this game has an active pick */}
                          {(() => {
                            const activeKey = ["spread_away","spread_home","over","under","ml_away","ml_home","h1_spread_away","h1_spread_home","h1_over","h1_under"]
                              .map(bt => `${game.id}__${bt}`)
                              .find(k => selectedPicks[k]);
                            if (!activeKey) return null;
                            return (
                              <>
                              <div style={{ marginTop: 4 }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Note <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none", color: "rgba(255,255,255,0.15)" }}>(optional)</span></div>
                                <input
                                  type="text"
                                  maxLength={80}
                                  placeholder="e.g. got -3 instead of -3.5"
                                  value={pickNotes[activeKey] || ""}
                                  onChange={e => setPickNotes(prev => ({ ...prev, [activeKey]: e.target.value }))}
                                  style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "Outfit, sans-serif", outline: "none", boxSizing: "border-box" }}
                                />
                              </div>
                              <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Units</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                  {[1,2,3,4,5].map(u => {
                                    const active = (pickUnits[activeKey] || 1) === u;
                                    return (
                                      <button key={u} onClick={() => setPickUnits(prev => ({ ...prev, [activeKey]: u }))} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${active ? "rgba(30,144,255,0.6)" : "rgba(255,255,255,0.08)"}`, background: active ? "rgba(30,144,255,0.2)" : "rgba(255,255,255,0.03)", color: active ? "#bae6fd" : "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: active ? 700 : 400, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                                        {u}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{ height: 16 }} />
                }
              </>
            )}
          </div>
        )}

        {/* ═══ GROUP PLAYS PAGE ═══ */}
        {page === "group" && (
          <div className="fade-up">
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{TODAY_LABEL}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Group Plays</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Plays where 2 or more people agree</div>
                  {!hasSubmitted && !viewerMode && <div style={{ fontSize: 12, color: "rgba(30,144,255,0.7)", marginTop: 6 }}>👈 Head to My Picks to add your plays</div>}
                </div>
                {isAdmin && <div style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, padding: "6px 12px", fontSize: 11, color: "#fbbf24", fontWeight: 600 }}>⚡ Admin</div>}
              </div>
            </div>

            {/* Record */}
            {(() => {
              const total = record.wins + record.losses + record.pushes;
              const pct = total > 0 ? Math.round((record.wins / (record.wins + record.losses || 1)) * 100) : null;
              const winW = total > 0 ? (record.wins / total) * 100 : 0;
              const lossW = total > 0 ? (record.losses / total) * 100 : 0;
              const pushW = total > 0 ? (record.pushes / total) * 100 : 0;
              const atTotal = allTimeRecord.wins + allTimeRecord.losses + allTimeRecord.pushes;
              const atPct = atTotal > 0 ? Math.round((allTimeRecord.wins / (allTimeRecord.wins + allTimeRecord.losses || 1)) * 100) : null;
              return (
                <div className="glass-card" style={{ borderRadius: 16, padding: "18px 20px", marginBottom: 20, cursor: "pointer" }} onClick={() => { setRecordDetailScope("today"); setShowRecordDetail(true); }}>
                  {/* Today */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Today</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>{record.wins}-{record.losses}{record.pushes>0?`-${record.pushes}`:""}</span>
                        {pct !== null && <span style={{ fontSize: 13, fontWeight: 600, color: record.wins>record.losses?"#86efac":record.losses>record.wins?"#fca5a5":"rgba(255,255,255,0.4)" }}>{pct}%</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, textAlign: "center" }}>
                      {[["W",record.wins,"#86efac","rgba(134,239,172,0.15)"],["L",record.losses,"#fca5a5","rgba(252,165,165,0.15)"],["P",record.pushes,"rgba(255,255,255,0.4)","rgba(255,255,255,0.06)"]].map(([lbl,val,color,bg]) => (
                        <div key={lbl} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 10, padding: "8px 12px", minWidth: 40 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, marginTop: 3 }}>{lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden", display: "flex", marginBottom: 16 }}>
                    {total > 0 && <>
                      <div style={{ width: `${winW}%`, background: "linear-gradient(90deg, #4ade80, #86efac)", transition: "width 0.4s ease" }} />
                      <div style={{ width: `${pushW}%`, background: "rgba(255,255,255,0.2)", transition: "width 0.4s ease" }} />
                      <div style={{ width: `${lossW}%`, background: "linear-gradient(90deg, #f87171, #fca5a5)", transition: "width 0.4s ease" }} />
                    </>}
                  </div>

                  {/* All-time */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); setRecordDetailScope("alltime"); setShowRecordDetail(true); supabase.from("pick_history").select("date,pick_key,result").not("result","is",null).then(({data})=>{ if(data) setAllTimeHistory(data); }); }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>All Time</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <span style={{ fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: -0.5 }}>{allTimeRecord.wins}-{allTimeRecord.losses}{allTimeRecord.pushes>0?`-${allTimeRecord.pushes}`:""}</span>
                          {atPct !== null && <span style={{ fontSize: 12, fontWeight: 600, color: allTimeRecord.wins>allTimeRecord.losses?"rgba(134,239,172,0.7)":allTimeRecord.losses>allTimeRecord.wins?"rgba(252,165,165,0.7)":"rgba(255,255,255,0.3)" }}>{atPct}%</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, textAlign: "center" }}>
                        {[["W",allTimeRecord.wins,"rgba(134,239,172,0.8)","rgba(134,239,172,0.1)"],["L",allTimeRecord.losses,"rgba(252,165,165,0.8)","rgba(252,165,165,0.1)"],["P",allTimeRecord.pushes,"rgba(255,255,255,0.3)","rgba(255,255,255,0.05)"]].map(([lbl,val,color,bg]) => (
                          <div key={lbl} style={{ background: bg, border: `1px solid ${color}50`, borderRadius: 8, padding: "5px 10px", minWidth: 34, textAlign: "center" }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
                            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1.5, marginTop: 2 }}>{lbl}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {atTotal > 0 && (
                      <div style={{ height: 4, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden", display: "flex" }}>
                        <div style={{ width: `${(allTimeRecord.wins/atTotal)*100}%`, background: "linear-gradient(90deg, #4ade80, #86efac)", transition: "width 0.4s ease" }} />
                        <div style={{ width: `${(allTimeRecord.pushes/atTotal)*100}%`, background: "rgba(255,255,255,0.2)", transition: "width 0.4s ease" }} />
                        <div style={{ width: `${(allTimeRecord.losses/atTotal)*100}%`, background: "linear-gradient(90deg, #f87171, #fca5a5)", transition: "width 0.4s ease" }} />
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", marginTop: 6 }}>
                      {atTotal} graded play{atTotal !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>
                    {isAdmin ? "Tap W / L / P on each play to grade results" : "Results graded by admin after games finish"}
                  </div>
                </div>
              );
            })()}

            {/* Admin: refresh odds */}
            {isAdmin && (
              <div className="glass-card" style={{ borderRadius: 16, padding: "14px 20px", marginBottom: 14, border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24" }}>⚡ Refresh Today's Odds</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>Pulls fresh lines from the API and updates the slate for everyone</div>
                </div>
                <button onClick={() => {
                  const ungradedCount = allPlays.filter(([key]) => !playResults[key]).length;
                  const msg = ungradedCount > 0
                    ? `⚠️ You have ${ungradedCount} ungraded play${ungradedCount !== 1 ? "s" : ""}. Grade them before refreshing or they'll be lost. Refresh anyway?`
                    : "No ungraded plays. Refresh today's odds?";
                  if (window.confirm(msg)) fetchOdds();
                }} disabled={oddsLoading} style={{ padding: "8px 18px", background: oddsLoading ? "rgba(255,255,255,0.06)" : "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 10, color: oddsLoading ? "rgba(255,255,255,0.2)" : "#fbbf24", fontSize: 12, fontWeight: 700, cursor: oddsLoading ? "not-allowed" : "pointer", fontFamily: "Outfit, sans-serif", whiteSpace: "nowrap" }}>
                  {oddsLoading ? "Fetching..." : "Refresh"}
                </button>
              </div>
            )}

            {/* Admin: manage pickers */}
            {isAdmin && submitters.length > 0 && (
              <div className="glass-card" style={{ borderRadius: 16, padding: "16px 20px", marginBottom: 16, border: "1px solid rgba(245,158,11,0.2)" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,158,11,0.7)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>⚡ Manage Pickers</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {submitters.map(s => (
                    <div key={s} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ background: "rgba(30,144,255,0.18)", border: "1px solid rgba(30,144,255,0.35)", borderRadius: 20, padding: "4px 13px", fontSize: 12, color: "#bae6fd", fontWeight: 500 }}>
                        {s} {!allPicks[s]?.is_public ? "🔒" : ""}
                      </span>
                      <button onClick={() => deletePicker(s)} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.1)", color: "#fca5a5", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>🗑 Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {groupPlays.length === 0 && otherPlays.length === 0 && (
              <div className="glass-card" style={{ borderRadius: 16, padding: "60px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 42, marginBottom: 14 }}>🤝</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>No group plays yet</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>Need at least 2 people on the same public side.</div>
              </div>
            )}

            {/* Consensus plays */}
            {groupPlays.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(30,144,255,0.7)", letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 10 }}>🔒 Consensus Plays</div>
                {groupPlays.map(([key, people, dissenters], i) => (
                  <PlayCard key={key} playKey={key} people={people} dissenters={dissenters} index={i} dimmed={false} onPlayerClick={openPlayerProfile} />
                ))}
              </>
            )}

            {/* Other plays */}
            {otherPlays.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 10, marginTop: groupPlays.length>0?24:0 }}>Other Plays</div>
                {otherPlays.map(([key, people, dissenters], i) => (
                  <PlayCard key={key} playKey={key} people={people} dissenters={dissenters} index={i} dimmed={true} onPlayerClick={openPlayerProfile} />
                ))}
              </>
            )}
          </div>
        )}

        {/* ═══ PLAYERS PAGE ═══ */}
        {page === "players" && (
          <div className="fade-up">
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{TODAY_LABEL}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Players</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{submitters.length} player{submitters.length !== 1 ? "s" : ""} filed picks today</div>
            </div>

            {submitters.length === 0 ? (
              <div className="glass-card" style={{ borderRadius: 16, padding: "60px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 42, marginBottom: 14 }}>👀</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>Nobody's filed yet</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>Check back once people submit their picks.</div>
              </div>
            ) : submitters.map((s, i) => {
              const playerPicks = allPicks[s] || {};
              const isPrivate = !playerPicks.is_public;
              const isMe = s === username;
              const keys = Object.keys(playerPicks.selections || {});
              return (
                <div key={s} className="glass-card fade-up" style={{ borderRadius: 16, marginBottom: 10, overflow: "hidden", animationDelay: `${i * 0.05}s`, border: isMe ? "1px solid rgba(30,144,255,0.3)" : undefined }} >
                  <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: isMe ? "linear-gradient(135deg, #1E90FF, #0ea5e9)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: isMe ? "#fff" : "rgba(255,255,255,0.5)", flexShrink: 0 }}>
                        {s.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 7 }}>
                          {s}
                          {isMe && <span style={{ fontSize: 10, background: "rgba(30,144,255,0.25)", border: "1px solid rgba(30,144,255,0.4)", borderRadius: 6, padding: "2px 7px", color: "#bae6fd", fontWeight: 600, letterSpacing: 0.5 }}>YOU</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                          {keys.length} pick{keys.length !== 1 ? "s" : ""} · {isPrivate ? "🔒 Private" : "🌐 Public"}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => openPlayerProfile(s)} style={{ padding: "8px 16px", background: "rgba(30,144,255,0.15)", border: "1px solid rgba(30,144,255,0.3)", borderRadius: 10, color: "#bae6fd", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.15s" }}>
                      View ->
                    </button>
                  </div>
                  {/* Preview picks - public only */}
                  {!isPrivate && keys.length > 0 && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 20px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {keys.slice(0, 4).map(key => {
                        const stored = playerPicks.selections[key];
                        if (!stored?.label) return null;
                        return (
                          <span key={key} style={{ background: "rgba(30,144,255,0.1)", border: "1px solid rgba(30,144,255,0.2)", borderRadius: 20, padding: "3px 11px", fontSize: 11, color: "#bae6fd" }}>
                            {stored.label} {stored.line}
                          </span>
                        );
                      })}
                      {keys.length > 4 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", padding: "3px 6px" }}>+{keys.length - 4} more</span>}
                    </div>
                  )}
                  {isPrivate && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 20px 12px" }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>Picks are private</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── STICKY SUBMIT BAR ── */}
      {page === "picks" && !hasSubmitted && (
        <div className="glass-bottom" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200 }}>
          <div style={{ maxWidth: 660, margin: "0 auto", padding: "12px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: pickCount>0?"#fff":"rgba(255,255,255,0.3)" }}>
                  {pickCount>0?`${pickCount} play${pickCount!==1?"s":""} selected`:"No picks yet"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>Submitting as {username}</div>
              </div>
              {/* Public / Private toggle */}
              {pickCount > 0 && (
                <div onClick={() => setIsPublic(p => !p)} className="toggle-track" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 12px", cursor: "pointer", userSelect: "none" }}>
                  <span style={{ fontSize: 13 }}>{isPublic ? "🌐" : "🔒"}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: isPublic?"#bae6fd":"rgba(255,255,255,0.4)" }}>{isPublic ? "Public" : "Private"}</span>
                </div>
              )}
            </div>
            <button className="sub-btn" disabled={!canSubmit} onClick={submitPicks} style={{ padding: "13px 28px", background: canSubmit?"linear-gradient(135deg, #1E90FF, #0ea5e9)":"rgba(255,255,255,0.07)", border: "none", borderRadius: 13, color: canSubmit?"#fff":"rgba(255,255,255,0.2)", fontSize: 14, fontWeight: 700, cursor: canSubmit?"pointer":"not-allowed", fontFamily: "Outfit, sans-serif", letterSpacing: 0.2, boxShadow: canSubmit?"0 4px 20px rgba(30,144,255,0.4)":"none" }}>
              Lock In ->
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
