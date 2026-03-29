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
const TODAY_DATE = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" }); // YYYY-MM-DD in ET

const ADMIN_PASSWORD = "a";


// ─── WIN CELEBRATION ──────────────────────────────────────────────────────────
// ─── LOSS CELEBRATION (SYSTEM FAILURE) ───────────────────────────────────────
function LossCelebration({ losses, onDismiss }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const timersRef = useRef([]);
  function T(fn, ms) { timersRef.current.push(setTimeout(fn, ms)); }

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !stage) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const TX = W * 0.72, TY = H * 0.26;
    const MX0 = W * 0.10, MY0 = H * 0.82;

    let animPhase = "hunt";
    let rX = TX + W * 0.15, rY = TY + H * 0.11, rSize = 58;
    let lockedAt = 0, fireAt = 0, trail = [], missedFired = false;
    let shakeAmt = 0, flashAlpha = 0, flashColor = [255, 255, 255];

    function doFlash(r, g, b, a) { flashAlpha = a; flashColor = [r, g, b]; }
    function doShake(a) { shakeAmt = Math.max(shakeAmt, a); }
    function shake(big) {
      stage.style.animation = `${big ? "lossShakeBig" : "lossShake"} ${big ? 0.65 : 0.32}s ease-out forwards`;
      T(() => stage.style.animation = "none", big ? 650 : 320);
    }

    function lerp(a, b, t) { return a + (b - a) * t; }
    function ease(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; }

    function spawnConfettiRain() {
      const COLORS = ["#facc15","#fb923c","#f87171","#ffffff","#fde68a","#4ade80","#60a5fa","#fcd34d","#a78bfa"];
      for (let i = 0; i < 220; i++) {
        particles.push({
          x: Math.random() * W,         // spread across full width
          y: -20 - Math.random() * 200, // start above screen at staggered heights
          vx: (Math.random()-0.5) * 2,  // gentle sideways drift
          vy: 2 + Math.random() * 5,    // falling downward
          size:3+Math.random()*6, color:COLORS[Math.floor(Math.random()*COLORS.length)],
          alpha:1, decay:0.004+Math.random()*0.006, gravity:0.04+Math.random()*0.06,
          rotSpeed:(Math.random()-0.5)*0.2, rotation:Math.random()*Math.PI*2,
          isRect:Math.random()>0.3, w:4+Math.random()*10, h:8+Math.random()*16, trail:[],
        });
      }
    }

    function spawnNuke() {
      nukeActive = true;
      nukeStart = performance.now();
      whiteoutPhase = 'rising';
      whiteoutAlpha = 0;

      // Shockwaves that expand from bottom center outward
      nukeShockwaves = [
        {r:0, maxR:W*1.8, spd:26, alpha:1.0, lw:8,  color:[255,240,180]},
        {r:0, maxR:W*1.4, spd:18, alpha:0.8, lw:14, color:[255,180,60]},
        {r:0, maxR:W*1.0, spd:12, alpha:0.6, lw:10, color:[255,100,10]},
      ];

      // Debris rains upward from ground
      for (let i = 0; i < 100; i++) {
        const ang = -Math.PI*0.1 - Math.random()*Math.PI*0.8; // mostly upward
        const spd = 5+Math.random()*15;
        nukeDebris.push({
          x: nukeGroundX + (Math.random()-0.5)*W*0.3,
          y: H - 10,
          vx: Math.cos(ang)*spd,
          vy: Math.sin(ang)*spd,
          size: 2+Math.random()*6,
          alpha: 1,
          color: Math.random()>0.5?'#fb923c':Math.random()>0.5?'#facc15':'#fff',
          rot: Math.random()*Math.PI*2,
          rotSpd: (Math.random()-0.5)*0.4,
          life: 0.6+Math.random()*0.5,
        });
      }
    }

    function drawNuke(nt) {
      if (nt <= 0) return;
      const gx = nukeGroundX;
      const gy = nukeGroundY; // below screen
      const maxStemH = H * 1.6; // stem goes way off top

      // How far the stem has risen (0 = at ground, 1 = full height)
      const riseT = easeOut(Math.min(nt * 1.4, 1));
      const sH = lerp(0, maxStemH, riseT);
      const sW = lerp(0, 30, easeOut(Math.min(nt*0.7, 1)));
      const sBaseW = lerp(0, 80, easeOut(Math.min(nt*0.85, 1)));
      const stemTop = gy - sH; // this goes negative (above screen) = good

      // Stem glow — massive ambient light from below
      const ambientRadius = lerp(0, W*1.2, easeOut(Math.min(nt*1.2,1)));
      const ambGrad = ctx.createRadialGradient(gx, H, 0, gx, H, ambientRadius);
      ambGrad.addColorStop(0, `rgba(255,200,80,${Math.min(nt*2,0.6)})`);
      ambGrad.addColorStop(0.3, `rgba(255,120,20,${Math.min(nt*2,0.4)})`);
      ambGrad.addColorStop(0.6, `rgba(200,50,0,${Math.min(nt*1.5,0.2)})`);
      ambGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ambGrad;
      ctx.fillRect(0, 0, W, H);

      // Stem body — draw even if top is above canvas
      const drawStemTop = Math.max(stemTop, -50);
      const drawStemH = gy - drawStemTop;
      if (drawStemH > 0 && sW > 0) {
        const stemGrad = ctx.createLinearGradient(gx, gy, gx, drawStemTop);
        stemGrad.addColorStop(0, `rgba(255,200,60,${riseT*0.95})`);
        stemGrad.addColorStop(0.25, `rgba(255,140,25,${riseT*0.88})`);
        stemGrad.addColorStop(0.6, `rgba(200,80,10,${riseT*0.78})`);
        stemGrad.addColorStop(1, `rgba(140,45,5,${riseT*0.65})`);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(gx - sBaseW/2, gy);
        ctx.bezierCurveTo(gx - sBaseW/2, gy - drawStemH*0.2, gx - sW/2, drawStemTop + drawStemH*0.15, gx - sW/2, drawStemTop);
        ctx.lineTo(gx + sW/2, drawStemTop);
        ctx.bezierCurveTo(gx + sW/2, drawStemTop + drawStemH*0.15, gx + sBaseW/2, gy - drawStemH*0.2, gx + sBaseW/2, gy);
        ctx.closePath();
        ctx.fillStyle = stemGrad;
        ctx.fill();
        // Inner hot glow streak
        const ig = ctx.createLinearGradient(gx-sW*0.3, 0, gx+sW*0.3, 0);
        ig.addColorStop(0, 'rgba(255,230,100,0)');
        ig.addColorStop(0.5, `rgba(255,245,160,${riseT*0.6})`);
        ig.addColorStop(1, 'rgba(255,230,100,0)');
        ctx.fillStyle = ig;
        ctx.fill();
        ctx.restore();
      }

      // Cap — appears when stem is tall enough, rises with it
      const capAppear = Math.max(0, (nt - 0.18) / 0.82);
      if (capAppear > 0) {
        const capT = easeOut(Math.min(capAppear, 1));
        // Cap center tracks stem top but clamped — we want it visible on screen
        const capCY = Math.max(stemTop + 60, H * 0.05);
        const capCX = gx;
        const cR = lerp(0, 130, capT); // huge cap
        const cRv = lerp(0, 80, capT);

        // Outer atmospheric glow around cap
        ctx.save();
        ctx.scale(1, cRv/cR);
        const atmG = ctx.createRadialGradient(capCX, capCY*(cR/cRv), 0, capCX, capCY*(cR/cRv), cR*1.6);
        atmG.addColorStop(0, `rgba(255,160,30,${capT*0.55})`);
        atmG.addColorStop(0.45, `rgba(200,70,8,${capT*0.32})`);
        atmG.addColorStop(0.8, `rgba(120,25,0,${capT*0.15})`);
        atmG.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = atmG;
        ctx.beginPath();ctx.arc(capCX, capCY*(cR/cRv), cR*1.6, 0, Math.PI*2);ctx.fill();
        ctx.restore();

        // Puffball cap
        const puffs = [
          {ox:0, oy:0, r:cR},
          {ox:-cR*0.56, oy:cR*0.25, r:cR*0.72},
          {ox:cR*0.56, oy:cR*0.25, r:cR*0.72},
          {ox:-cR*0.82, oy:cR*0.56, r:cR*0.54},
          {ox:cR*0.82, oy:cR*0.56, r:cR*0.54},
          {ox:0, oy:cR*0.46, r:cR*0.64},
          {ox:-cR*0.35, oy:-cR*0.3, r:cR*0.60},
          {ox:cR*0.35, oy:-cR*0.3, r:cR*0.60},
          {ox:-cR*0.65, oy:-cR*0.1, r:cR*0.48},
          {ox:cR*0.65, oy:-cR*0.1, r:cR*0.48},
        ];
        ctx.save();
        ctx.scale(1, cRv/cR);
        const yS = capCY*(cR/cRv);
        puffs.forEach(p => {
          const pg = ctx.createRadialGradient(capCX+p.ox, yS+p.oy, 0, capCX+p.ox, yS+p.oy, p.r);
          pg.addColorStop(0, `rgba(255,185,65,${capT*0.96})`);
          pg.addColorStop(0.3, `rgba(220,105,22,${capT*0.88})`);
          pg.addColorStop(0.62, `rgba(160,58,8,${capT*0.76})`);
          pg.addColorStop(0.85, `rgba(90,22,2,${capT*0.5})`);
          pg.addColorStop(1, 'rgba(40,8,0,0)');
          ctx.fillStyle = pg;
          ctx.beginPath();ctx.arc(capCX+p.ox, yS+p.oy, p.r, 0, Math.PI*2);ctx.fill();
        });
        // Blazing hot white core
        const hc = ctx.createRadialGradient(capCX, yS-cR*0.08, 0, capCX, yS-cR*0.08, cR*0.5);
        hc.addColorStop(0, `rgba(255,255,230,${capT*0.96})`);
        hc.addColorStop(0.35, `rgba(255,225,100,${capT*0.78})`);
        hc.addColorStop(0.7, `rgba(255,145,20,${capT*0.4})`);
        hc.addColorStop(1, 'rgba(255,100,0,0)');
        ctx.fillStyle = hc;
        ctx.beginPath();ctx.arc(capCX, yS-cR*0.08, cR*0.5, 0, Math.PI*2);ctx.fill();
        ctx.restore();

        // Skirt ring
        if (capAppear > 0.35) {
          const skirtT = easeOut(Math.min((capAppear-0.35)/0.4, 1));
          ctx.save();
          ctx.globalAlpha = capT*0.7*skirtT;
          const skR = cR*1.12*skirtT;
          const skG = ctx.createRadialGradient(capCX, capCY+cRv*0.84, 0, capCX, capCY+cRv*0.84, skR);
          skG.addColorStop(0, 'rgba(255,150,30,0.7)');
          skG.addColorStop(0.55, 'rgba(200,70,8,0.35)');
          skG.addColorStop(1, 'rgba(100,20,0,0)');
          ctx.fillStyle = skG;
          ctx.scale(1, 22/Math.max(skR,1));
          ctx.beginPath();ctx.arc(capCX, (capCY+cRv*0.84)*(Math.max(skR,1)/22), skR, 0, Math.PI*2);ctx.fill();
          ctx.restore();
        }
      }
    }

    function drawWhiteout() {
      if (whiteoutPhase === 'none' || whiteoutAlpha <= 0) return;
      // Full screen blinding white with warm tint at edges
      ctx.save();
      // White core
      ctx.fillStyle = `rgba(255,255,240,${whiteoutAlpha})`;
      ctx.fillRect(0, 0, W, H);
      // Warm orange vignette at edges during peak
      if (whiteoutAlpha > 0.5) {
        const vg = ctx.createRadialGradient(W/2, H/2, W*0.2, W/2, H/2, W*0.9);
        vg.addColorStop(0, 'rgba(255,255,255,0)');
        vg.addColorStop(0.7, `rgba(255,180,30,${(whiteoutAlpha-0.5)*0.6})`);
        vg.addColorStop(1, `rgba(255,120,0,${(whiteoutAlpha-0.5)*0.9})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
    }

    function drawMissile(cx, cy, angleDeg) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(angleDeg * Math.PI / 180);
      const s = 1.1;
      ctx.fillStyle = "#c8d0d8"; ctx.beginPath(); ctx.moveTo(0,-20*s); ctx.lineTo(7*s,-7*s); ctx.lineTo(7*s,12*s); ctx.lineTo(-7*s,12*s); ctx.lineTo(-7*s,-7*s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#e8edf2"; ctx.beginPath(); ctx.moveTo(0,-20*s); ctx.lineTo(7*s,-7*s); ctx.lineTo(-7*s,-7*s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#a0a8b4";
      ctx.beginPath(); ctx.moveTo(7*s,5*s); ctx.lineTo(16*s,16*s); ctx.lineTo(7*s,12*s); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-7*s,5*s); ctx.lineTo(-16*s,16*s); ctx.lineTo(-7*s,12*s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#fb923c"; ctx.beginPath(); ctx.ellipse(0,14*s,5*s,5*s,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.ellipse(0,17*s,3*s,7*s,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = "#60a5fa"; ctx.beginPath(); ctx.arc(0,-9*s,3*s,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    function drawReticle(x, y, sz, locked, lp) {
      const col = locked ? "#f87171" : lp > 0.5 ? "#facc15" : "#4ade80";
      ctx.save(); ctx.globalAlpha = 0.92;
      ctx.beginPath(); ctx.arc(x,y,sz,0,Math.PI*2); ctx.setLineDash([8,5]); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
      const br = sz*0.64, blen = sz*0.37, bOff = sz*0.27*(1-lp);
      [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy]) => {
        const bx = x+sx*(br+bOff), by = y+sy*(br+bOff);
        ctx.beginPath(); ctx.moveTo(bx+sx*blen,by); ctx.lineTo(bx,by); ctx.lineTo(bx,by+sy*blen); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke();
      });
      ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fillStyle = col; ctx.fill();
      if (lp > 0) { ctx.beginPath(); ctx.arc(x,y,sz+8,-Math.PI/2,-Math.PI/2+lp*Math.PI*2); ctx.strokeStyle="#f87171"; ctx.lineWidth=4; ctx.stroke(); }
      // Iran flag in reticle
      ctx.save(); ctx.beginPath(); ctx.arc(x,y,sz*0.5,0,Math.PI*2); ctx.clip();
      ctx.fillStyle="#239f40"; ctx.fillRect(x-sz*0.5,y-sz*0.5,sz,sz*0.34);
      ctx.fillStyle="#fff"; ctx.fillRect(x-sz*0.5,y-sz*0.16,sz,sz*0.32);
      ctx.fillStyle="#da0000"; ctx.fillRect(x-sz*0.5,y+sz*0.16,sz,sz*0.34);
      ctx.restore();
      ctx.beginPath(); ctx.arc(x,y,sz*0.5,0,Math.PI*2); ctx.strokeStyle="rgba(255,255,255,0.18)"; ctx.lineWidth=1; ctx.stroke();
      if (locked) { ctx.font="bold 11px 'Courier New'"; ctx.fillStyle="#f87171"; ctx.textAlign="center"; ctx.globalAlpha=0.5+0.5*Math.sin(Date.now()*0.025); ctx.fillText("LOCKED",x,y+sz+20); }
      ctx.restore();
    }

    const t0 = performance.now();
    let rafId;

    // HUD timers
    T(() => { stage.querySelector(".lc-scanbg").style.opacity = "1"; stage.querySelector(".lc-scanbar").style.animation = "lcScan 1.8s linear infinite"; stage.querySelector(".lc-hud").style.opacity = "1"; }, 120);
    T(() => { stage.querySelector(".lc-flag").style.opacity = "1"; stage.querySelector(".lc-htr").textContent = "TARGET: DETECTED"; stage.querySelector(".lc-htr").style.color = "#facc15"; }, 380);
    T(() => { stage.querySelector(".lc-hbl").textContent = "WARHEAD: HOT"; stage.querySelector(".lc-hbl").style.color = "#facc15"; }, 980);

    function tick(now) {
      const el = now - t0;
      ctx.clearRect(0, 0, W, H);
      const sx = shakeAmt > 0.3 ? (Math.random()-0.5)*shakeAmt : 0;
      const sy = shakeAmt > 0.3 ? (Math.random()-0.5)*shakeAmt : 0;
      shakeAmt *= 0.78;
      ctx.save(); ctx.translate(sx, sy);
      if (flashAlpha > 0.01) { const [r,g,b] = flashColor; ctx.fillStyle = `rgba(${r},${g},${b},${flashAlpha})`; ctx.fillRect(-50,-50,W+100,H+100); flashAlpha *= 0.7; }

      if (animPhase === "hunt") {
        const ht = Math.min(el/1000, 1), w = 1-ht;
        rX = lerp(rX, TX+Math.sin(el*0.003)*38*w, 0.034+ht*0.038);
        rY = lerp(rY, TY+Math.cos(el*0.0025)*26*w, 0.034+ht*0.038);
        rSize = lerp(rSize, 34, 0.022);
        drawReticle(rX, rY, rSize, false, 0);
        if (ht >= 1) { animPhase = "locking"; lockedAt = now; }

      } else if (animPhase === "locking") {
        const lt = Math.min((now-lockedAt)/680, 1);
        rX = lerp(rX, TX, 0.09+lt*0.11); rY = lerp(rY, TY, 0.09+lt*0.11); rSize = lerp(rSize, 30, 0.05);
        drawReticle(rX, rY, rSize, lt > 0.95, lt);
        if (lt > 0.44 && lt < 0.49) { doFlash(248,113,113,0.35); doShake(8); }
        if (lt > 0.77 && lt < 0.82) { doFlash(248,113,113,0.55); doShake(10); }
        if (lt >= 1) {
          animPhase = "locked"; fireAt = now + 460;
          doFlash(255,80,80,0.75); doShake(16);
          stage.querySelector(".lc-htr").textContent = "TARGET: LOCKED"; stage.querySelector(".lc-htr").style.color = "#f87171";
          stage.querySelector(".lc-hbr").textContent = "STATUS: LOCKED"; stage.querySelector(".lc-hbr").style.color = "#f87171";
          T(() => { stage.querySelector(".lc-hbr").textContent = "STATUS: FIRING"; doFlash(255,200,30,0.4); doShake(10); }, 420);
        }

      } else if (animPhase === "locked") {
        drawReticle(TX, TY, 30, true, 1);
        if (now >= fireAt) animPhase = "fire";

      } else if (animPhase === "fire") {
        drawReticle(TX, TY, 30, true, 1);
        const ft = Math.min((now-fireAt)/680, 1), et = ease(ft);
        const cpX = TX-W*0.17, cpY = Math.min(MY0,TY)-H*0.33;
        let mx, my;
        if (ft < 0.73) {
          mx = (1-et)*(1-et)*MX0+2*(1-et)*et*cpX+et*et*TX;
          my = (1-et)*(1-et)*MY0+2*(1-et)*et*cpY+et*et*TY;
        } else {
          const vt=(ft-0.73)/0.27, ve=vt*vt;
          const e73=ease(0.73);
          const midX=(1-e73)*(1-e73)*MX0+2*(1-e73)*e73*cpX+e73*e73*TX;
          const midY=(1-e73)*(1-e73)*MY0+2*(1-e73)*e73*cpY+e73*e73*TY;
          mx=lerp(midX,W+80,ve); my=lerp(midY,TY+H*0.38,vt*0.65);
        }
        const ft2=Math.min(ft+0.015,1),et2=ease(ft2);
        let nx=mx+18,ny=my+12;
        if (ft2<0.73) { nx=(1-et2)*(1-et2)*MX0+2*(1-et2)*et2*cpX+et2*et2*TX; ny=(1-et2)*(1-et2)*MY0+2*(1-et2)*et2*cpY+et2*et2*TY; }
        const angle=Math.atan2(ny-my,nx-mx)*(180/Math.PI)+90;
        trail.push({x:mx,y:my}); if(trail.length>55) trail.shift();
        for(let i=1;i<trail.length;i++){
          const p=trail[i-1],q=trail[i],pr=i/trail.length;
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(250,175,25,${pr*0.88})`;ctx.lineWidth=1.5+pr*4.5;ctx.stroke();
        }
        drawMissile(mx, my, angle);

        if (ft >= 0.73 && !missedFired) {
          missedFired = true;
          // Flag wiggle + smoke
          const sm = stage.querySelector(".lc-smoke");
          sm.style.left=(TX+52)+"px"; sm.style.top=(TY-8)+"px"; sm.style.opacity="1";
          T(()=>{ sm.style.opacity="0"; }, 900);
          const fi = stage.querySelector(".lc-flaginner");
          fi.style.animation="none";
          T(()=>{ fi.style.animation="lcWiggle 0.7s ease-out forwards"; }, 40);
          T(()=>{ stage.querySelector(".lc-flagmoji").textContent="😂"; stage.querySelector(".lc-flagmoji").style.opacity="1"; }, 90);
          stage.querySelector(".lc-hbr").textContent="STATUS: MISS"; stage.querySelector(".lc-hbr").style.color="#fca5a5";
          stage.querySelector(".lc-hbl").textContent="TARGET: SURVIVED"; stage.querySelector(".lc-hbl").style.color="#f87171";
          doFlash(255,80,80,0.5); doShake(14);
        }

        if (ft >= 1) {
          animPhase = "chaos";
          stage.querySelector(".lc-hud").style.opacity="0";
          stage.querySelector(".lc-scanbg").style.opacity="0";

          // 1. Red flash + shake
          T(()=>{ doFlash(248,113,113,1); doShake(26); shake(true); stage.style.background="#050008"; },280);

          // 2. Flash + glitch bars appear
          T(()=>{
            stage.querySelector(".lc-flash").style.opacity="1";
            T(()=>stage.querySelector(".lc-flash").style.opacity="0", 90);
            stage.querySelector(".lc-noise").style.opacity="1";
            // Glitch bars
            const bars = stage.querySelector(".lc-bars");
            bars.innerHTML="";
            for(let i=0;i<10;i++){
              const d=document.createElement("div");
              const top=Math.random()*H, h=3+Math.random()*18;
              d.style.cssText=`position:absolute;top:${top}px;left:0;right:0;height:${h}px;background:${Math.random()>0.5?"rgba(248,113,113,0.35)":"rgba(96,165,250,0.2)"};transform:translateX(${(Math.random()-0.5)*20}px)`;
              bars.appendChild(d);
            }
            T(()=>bars.innerHTML="", 500);
            doFlash(248,113,113,0.4);
          },400);

          // 3. ERROR text crashes in
          T(()=>{
            const err = stage.querySelector(".lc-error");
            err.style.animation="lcGlitchSlam 0.5s ease-out forwards";
            err.style.opacity="1";
            // Rain
            const rain=stage.querySelector(".lc-rain");
            rain.innerHTML="";
            const items=["ERROR","L","LOSS","😭","0xDEAD","L","null","L","💀"];
            for(let i=0;i<45;i++){
              const d=document.createElement("div");
              d.style.cssText=`position:absolute;left:${Math.random()*100}%;top:-20px;font-size:${11+Math.random()*18}px;font-weight:900;color:#f87171;opacity:${0.5+Math.random()*0.5};animation:lcDrop ${1.3+Math.random()*1.8}s ease-in ${Math.random()*0.5}s forwards;font-family:'Courier New',monospace`;
              d.textContent=items[Math.floor(Math.random()*items.length)];
              rain.appendChild(d);
            }
            doFlash(248,113,113,0.45);
          },580);

          // 4. Subtext
          T(()=>{
            const sub=stage.querySelector(".lc-sub");
            sub.textContent="FATAL ERROR. ACCOUNT DELETED.";
            sub.style.opacity="1"; sub.style.animation="lcSubIn 0.45s cubic-bezier(0.15,1.6,0.4,1) forwards";
          },1100);

          // 5. Melt out
          T(()=>{
            stage.querySelector(".lc-error").style.animation="lcMelt 0.5s ease-in forwards";
            stage.querySelector(".lc-sub").style.transition="opacity 0.3s"; stage.querySelector(".lc-sub").style.opacity="0";
            stage.querySelector(".lc-rain").innerHTML=""; stage.querySelector(".lc-noise").style.opacity="0";
            stage.querySelector(".lc-flag").style.opacity="0"; stage.querySelector(".lc-flagmoji").style.opacity="0";
          },2400);

          // 6. Settle
          T(()=>{
            stage.querySelector(".lc-settle").style.display="block";
            stage.querySelector(".lc-settle").style.animation="lcSettleIn 0.5s cubic-bezier(0.34,1.4,0.64,1) forwards";
            stage.style.background="#050008";
          },2750);
        }
      }

      ctx.restore();
      if (["hunt","locking","locked","fire"].includes(animPhase) || flashAlpha > 0.01 || shakeAmt > 0.2) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); timersRef.current.forEach(clearTimeout); };
  }, []);

  const lossCards = losses.map((l, i) => (
    <div key={l.key} style={{ background:"rgba(248,113,113,0.08)", borderLeft:"4px solid #f87171", borderRadius:10, padding:"13px 16px", display:"flex", alignItems:"center", gap:12, marginBottom:10, animation:`lcCardIn 0.35s cubic-bezier(0.2,1.5,0.4,1) ${0.05+i*0.14}s both` }}>
      <div style={{ fontSize:20 }}>😭</div>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:"#f87171" }}>{l.label}</div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginTop:2 }}>GRADED LOSS</div>
      </div>
    </div>
  ));

  return (
    <div ref={stageRef} onClick={onDismiss} style={{ position:"fixed", inset:0, zIndex:1000, background:"#000", cursor:"pointer", overflow:"hidden" }}>
      <style>{`
        @keyframes lcScan{0%{top:-40px}100%{top:110%}}
        @keyframes lcBlink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes lcWiggle{0%,100%{transform:rotate(0)scale(1)}20%{transform:rotate(-18deg)scale(1.25)}45%{transform:rotate(14deg)scale(1.18)}65%{transform:rotate(-10deg)scale(1.1)}82%{transform:rotate(6deg)scale(1.05)}}
        @keyframes lossShake{0%{transform:translate(0,0)}10%{transform:translate(-10px,7px)}25%{transform:translate(8px,-8px)}40%{transform:translate(-6px,5px)}60%{transform:translate(4px,-3px)}100%{transform:translate(0,0)}}
        @keyframes lossShakeBig{0%{transform:translate(0,0)}8%{transform:translate(-18px,12px)}20%{transform:translate(15px,-15px)}35%{transform:translate(-12px,10px)}55%{transform:translate(8px,-6px)}75%{transform:translate(-4px,3px)}100%{transform:translate(0,0)}}
        @keyframes lcGlitchSlam{0%{clip-path:inset(0 100% 0 0);opacity:0}20%{clip-path:inset(0 45% 0 0);opacity:1}40%{clip-path:inset(0 65% 0 0)}60%{clip-path:inset(0 20% 0 0)}80%{clip-path:inset(0 5% 0 0)}100%{clip-path:inset(0 0% 0 0);opacity:1}}
        @keyframes lcRgbSplit{0%{text-shadow:4px 0 #f87171,-4px 0 #60a5fa,0 0 20px rgba(248,113,113,0.5)}25%{text-shadow:-6px 0 #f87171,6px 0 #60a5fa,0 4px #facc15}50%{text-shadow:5px 2px #f87171,-5px -2px #60a5fa}75%{text-shadow:-4px 0 #facc15,4px 0 #f87171}100%{text-shadow:4px 0 #f87171,-4px 0 #60a5fa}}
        @keyframes lcMelt{0%{transform:translateX(-50%) scaleY(1);opacity:1}100%{transform:translateX(-50%) scaleY(2.8);opacity:0;filter:blur(10px)}}
        @keyframes lcDrop{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}
        @keyframes lcSubIn{0%{transform:translateX(-50%) translateY(24px);opacity:0}55%{transform:translateX(-50%) translateY(-4px);opacity:1}100%{transform:translateX(-50%) translateY(0);opacity:1}}
        @keyframes lcSettleIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.85)}65%{transform:translate(-50%,-50%) scale(1.04)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes lcCardIn{0%{transform:translateX(60px);opacity:0}55%{transform:translateX(-4px)}100%{transform:translateX(0);opacity:1}}
      `}</style>

      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, zIndex:3, pointerEvents:"none" }} />

      {/* Scan lines */}
      <div className="lc-scanbg" style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)", zIndex:2, opacity:0, pointerEvents:"none" }} />
      <div className="lc-scanbar" style={{ position:"absolute", width:"100%", height:36, background:"linear-gradient(transparent,rgba(255,255,255,0.03),transparent)", zIndex:2, top:-40, pointerEvents:"none" }} />

      {/* HUD */}
      <div className="lc-hud" style={{ position:"absolute", inset:0, opacity:0, zIndex:4, pointerEvents:"none", fontFamily:"'Courier New',monospace", fontSize:10, color:"#4ade80", letterSpacing:1 }}>
        <div style={{ position:"absolute", top:12, left:12, width:24, height:24, borderTop:"1.5px solid #4ade80", borderLeft:"1.5px solid #4ade80" }} />
        <div style={{ position:"absolute", top:12, right:12, width:24, height:24, borderTop:"1.5px solid #4ade80", borderRight:"1.5px solid #4ade80" }} />
        <div style={{ position:"absolute", bottom:12, left:12, width:24, height:24, borderBottom:"1.5px solid #4ade80", borderLeft:"1.5px solid #4ade80" }} />
        <div style={{ position:"absolute", bottom:12, right:12, width:24, height:24, borderBottom:"1.5px solid #4ade80", borderRight:"1.5px solid #4ade80" }} />
        <div className="lc-htr" style={{ position:"absolute", top:14, left:44 }}>SCANNING...</div>
        <div className="lc-hbl" style={{ position:"absolute", bottom:14, left:44 }}>WARHEAD: ARMED</div>
        <div className="lc-hbr" style={{ position:"absolute", bottom:14, right:44, textAlign:"right" }}>STATUS: --</div>
      </div>

      {/* Flag */}
      <div className="lc-flag" style={{ position:"absolute", top:"20%", right:"18%", opacity:0, zIndex:5, pointerEvents:"none" }}>
        <div className="lc-flaginner" style={{ animation:"lcBlink 0.7s ease-in-out infinite" }}>
          <svg width="52" height="52" viewBox="0 0 52 52">
            <clipPath id="lcfc"><circle cx="26" cy="26" r="24"/></clipPath>
            <rect x="2" y="2" width="48" height="16" fill="#239f40" clipPath="url(#lcfc)"/>
            <rect x="2" y="18" width="48" height="16" fill="#fff" clipPath="url(#lcfc)"/>
            <rect x="2" y="34" width="48" height="16" fill="#da0000" clipPath="url(#lcfc)"/>
            <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
          </svg>
        </div>
        <div style={{ fontSize:7, color:"#f87171", letterSpacing:"2.5px", textAlign:"center", marginTop:3, fontWeight:800 }}>TARGET</div>
      </div>
      <div className="lc-flagmoji" style={{ position:"absolute", top:"20%", right:"18%", opacity:0, zIndex:7, fontSize:22, transform:"translate(12px,-26px)", pointerEvents:"none" }} />

      {/* Flash + noise */}
      <div className="lc-flash" style={{ position:"absolute", inset:0, background:"rgba(248,113,113,0.8)", opacity:0, zIndex:20, pointerEvents:"none", transition:"opacity 0.07s" }} />
      <div className="lc-noise" style={{ position:"absolute", inset:0, zIndex:7, pointerEvents:"none", opacity:0, background:"repeating-linear-gradient(45deg,rgba(248,113,113,0.07) 0px,transparent 2px,rgba(96,165,250,0.05) 4px,transparent 6px)" }} />
      <div className="lc-bars" style={{ position:"absolute", inset:0, zIndex:10, pointerEvents:"none", overflow:"hidden" }} />
      <div className="lc-smoke" style={{ position:"absolute", opacity:0, zIndex:6, fontSize:38, transform:"translate(-50%,-50%)", pointerEvents:"none" }}>💨</div>

      {/* Rain */}
      <div className="lc-rain" style={{ position:"absolute", inset:0, zIndex:8, pointerEvents:"none" }} />

      {/* ERROR text */}
      <div className="lc-error" style={{ position:"absolute", top:"28%", left:"50%", transform:"translateX(-50%)", opacity:0, zIndex:9, pointerEvents:"none", textAlign:"center", fontFamily:"'Courier New',monospace" }}>
        <div style={{ fontSize:10, color:"#f87171", letterSpacing:3, marginBottom:6 }}>SYSTEM ERROR 0x4C4F5353</div>
        <div style={{ fontSize:"clamp(60px,12vw,90px)", fontWeight:900, color:"#f87171", lineHeight:1, animation:"lcRgbSplit 0.12s linear infinite" }}>LOSS</div>
        <div style={{ fontSize:9, color:"rgba(248,113,113,0.5)", letterSpacing:2, marginTop:4 }}>FATAL · UNRECOVERABLE</div>
      </div>

      {/* Subtext */}
      <div className="lc-sub" style={{ position:"absolute", bottom:"22%", left:"50%", transform:"translateX(-50%) translateY(24px)", opacity:0, fontFamily:"'Courier New',monospace", fontSize:11, fontWeight:900, color:"#fca5a5", letterSpacing:3, textTransform:"uppercase", whiteSpace:"nowrap", zIndex:12, pointerEvents:"none" }} />

      {/* Settle */}
      <div className="lc-settle" style={{ display:"none", position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:15, textAlign:"center", width:320 }}>
        <div style={{ fontSize:48, marginBottom:10 }}>⚠️😭</div>
        <div style={{ fontSize:28, fontWeight:900, color:"#f87171", letterSpacing:-0.5, marginBottom:4, fontFamily:"'Courier New',monospace", textShadow:"0 0 30px rgba(248,113,113,0.5)" }}>SYSTEM FAILURE</div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginBottom:22, letterSpacing:2 }}>GROUP PLAYS GRADED</div>
        {lossCards}
        <div style={{ marginTop:20, fontSize:10, color:"rgba(255,255,255,0.2)", letterSpacing:1, textTransform:"uppercase" }}>Tap to continue</div>
      </div>
    </div>
  );
}

function WinCelebration({ wins, phase, onDismiss }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const tgtX = W * 0.68, tgtY = H * 0.26;
    const msX0 = W * 0.09, msY0 = H * 0.84;
    const nukeGroundX = W * 0.5;
    const nukeGroundY = H + 20;

    let animPhase = 'hunt';
    let rX = tgtX + W*0.14, rY = tgtY + H*0.11, rSize = 58, lockProgress = 0;
    let lockedAt = 0, fireAt = 0, impactAt = 0;
    let trail = [], particles = [], rings = [];
    let shakeAmt = 0, flashAlpha = 0, flashColor = [255,255,255];
    let impactFired = false;
    let nukeStart = 0, nukeActive = false, nukeAlpha = 1, nukeFadingOut = false;
    let nukeShockwaves = [], nukeDebris = [];
    let whiteoutAlpha = 0, whiteoutPhase = 'none';
    let overlayAlpha = 0, doSettle = false;

    function T(fn, ms) { timersRef.current.push(setTimeout(fn, ms)); }
    function lerp(a,b,t){return a+(b-a)*t}
    function ease(t){return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
    function easeOut(t){return 1-Math.pow(1-t,3)}
    function triggerFlash(r,g,b,a){flashAlpha=a;flashColor=[r,g,b];}
    function triggerShake(a){shakeAmt=Math.max(shakeAmt,a);}

    function spawnConfettiRain() {
    const COLORS = ["#facc15","#fb923c","#f87171","#ffffff","#fde68a","#4ade80","#60a5fa","#fcd34d","#a78bfa"];
    for (let i = 0; i < 220; i++) {
      particles.push({
        x: Math.random() * W,         // spread across full width
        y: -20 - Math.random() * 200, // start above screen at staggered heights
        vx: (Math.random()-0.5) * 2,  // gentle sideways drift
        vy: 2 + Math.random() * 5,    // falling downward
        size:3+Math.random()*6, color:COLORS[Math.floor(Math.random()*COLORS.length)],
        alpha:1, decay:0.004+Math.random()*0.006, gravity:0.04+Math.random()*0.06,
        rotSpeed:(Math.random()-0.5)*0.2, rotation:Math.random()*Math.PI*2,
        isRect:Math.random()>0.3, w:4+Math.random()*10, h:8+Math.random()*16, trail:[],
      });
    }
  }

    function spawnExplosion(x, y) {
    const COLORS = ["#facc15","#fb923c","#f87171","#ffffff","#fde68a","#ff6600","#fcd34d"];
    for (let i = 0; i < 200; i++) {
      const ang = Math.random()*Math.PI*2, spd = 6+Math.random()*22;
      particles.push({
        x, y, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd-Math.random()*8,
        size:2+Math.random()*7, color:COLORS[Math.floor(Math.random()*COLORS.length)],
        alpha:1, decay:0.008+Math.random()*0.012, gravity:0.22+Math.random()*0.15,
        rotSpeed:(Math.random()-0.5)*0.35, rotation:Math.random()*Math.PI*2,
        isRect:Math.random()>0.38, w:3+Math.random()*10, h:6+Math.random()*16, trail:[],
      });
    }
    const maxR = Math.max(W,H)*1.1;
    rings = [
      {x,y,r:0,maxR:maxR*0.9,alpha:1.0,color:[255,220,60],lw:5,spd:28,delay:0,started:false,startT:null},
      {x,y,r:0,maxR:maxR*0.75,alpha:0.8,color:[255,140,30],lw:10,spd:20,delay:60,started:false,startT:null},
      {x,y,r:0,maxR:maxR*0.6,alpha:0.6,color:[255,80,0],lw:7,spd:24,delay:100,started:false,startT:null},
    ];
  }

    function spawnNuke() {
    nukeActive = true;
    nukeStart = performance.now();
    whiteoutPhase = 'rising';
    whiteoutAlpha = 0;

    // Shockwaves that expand from bottom center outward
    nukeShockwaves = [
      {r:0, maxR:W*1.8, spd:26, alpha:1.0, lw:8,  color:[255,240,180]},
      {r:0, maxR:W*1.4, spd:18, alpha:0.8, lw:14, color:[255,180,60]},
      {r:0, maxR:W*1.0, spd:12, alpha:0.6, lw:10, color:[255,100,10]},
    ];

    // Debris rains upward from ground
    for (let i = 0; i < 100; i++) {
      const ang = -Math.PI*0.1 - Math.random()*Math.PI*0.8; // mostly upward
      const spd = 5+Math.random()*15;
      nukeDebris.push({
        x: nukeGroundX + (Math.random()-0.5)*W*0.3,
        y: H - 10,
        vx: Math.cos(ang)*spd,
        vy: Math.sin(ang)*spd,
        size: 2+Math.random()*6,
        alpha: 1,
        color: Math.random()>0.5?'#fb923c':Math.random()>0.5?'#facc15':'#fff',
        rot: Math.random()*Math.PI*2,
        rotSpd: (Math.random()-0.5)*0.4,
        life: 0.6+Math.random()*0.5,
      });
    }
  }

    function drawMissile(cx,cy,angleDeg){
    ctx.save();ctx.translate(cx,cy);ctx.rotate(angleDeg*Math.PI/180);
    const s=1.1;
    ctx.fillStyle="#c8d0d8";ctx.beginPath();ctx.moveTo(0,-20*s);ctx.lineTo(7*s,-7*s);ctx.lineTo(7*s,12*s);ctx.lineTo(-7*s,12*s);ctx.lineTo(-7*s,-7*s);ctx.closePath();ctx.fill();
    ctx.fillStyle="#e8edf2";ctx.beginPath();ctx.moveTo(0,-20*s);ctx.lineTo(7*s,-7*s);ctx.lineTo(-7*s,-7*s);ctx.closePath();ctx.fill();
    ctx.fillStyle="#a0a8b4";
    ctx.beginPath();ctx.moveTo(7*s,5*s);ctx.lineTo(16*s,16*s);ctx.lineTo(7*s,12*s);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(-7*s,5*s);ctx.lineTo(-16*s,16*s);ctx.lineTo(-7*s,12*s);ctx.closePath();ctx.fill();
    ctx.fillStyle="#fb923c";ctx.beginPath();ctx.ellipse(0,14*s,5*s,5*s,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#facc15";ctx.beginPath();ctx.ellipse(0,17*s,3*s,6*s,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.8)";ctx.beginPath();ctx.ellipse(0,19*s,1.5*s,3.5*s,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#60a5fa";ctx.beginPath();ctx.arc(0,-9*s,3*s,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

    function drawReticle(x,y,sz,locked,lp){
    const col=locked?"#f87171":lp>0.5?"#facc15":"#4ade80";
    ctx.save();ctx.globalAlpha=0.95;
    ctx.beginPath();ctx.arc(x,y,sz,0,Math.PI*2);ctx.setLineDash([8,5]);ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);
    const br=sz*0.65,blen=sz*0.38,bOff=sz*0.28*(1-lp);
    [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sy])=>{
      const bx=x+sx*(br+bOff),by=y+sy*(br+bOff);
      ctx.beginPath();ctx.moveTo(bx+sx*blen,by);ctx.lineTo(bx,by);ctx.lineTo(bx,by+sy*blen);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();
    });
    ctx.strokeStyle=col;ctx.lineWidth=1.5;
    [[x,y-10,x,y-sz*0.72],[x,y+10,x,y+sz*0.72],[x-10,y,x-sz*0.72,y],[x+10,y,x+sz*0.72,y]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
    ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
    if(lp>0){ctx.beginPath();ctx.arc(x,y,sz+8,-Math.PI/2,-Math.PI/2+lp*Math.PI*2);ctx.strokeStyle="#f87171";ctx.lineWidth=4;ctx.stroke();}
    ctx.save();ctx.beginPath();ctx.arc(x,y,sz*0.52,0,Math.PI*2);ctx.clip();
    ctx.fillStyle="#239f40";ctx.fillRect(x-sz*0.52,y-sz*0.52,sz*1.04,sz*0.35);
    ctx.fillStyle="#fff";ctx.fillRect(x-sz*0.52,y-sz*0.17,sz*1.04,sz*0.34);
    ctx.fillStyle="#da0000";ctx.fillRect(x-sz*0.52,y+sz*0.17,sz*1.04,sz*0.35);
    ctx.restore();
    ctx.beginPath();ctx.arc(x,y,sz*0.52,0,Math.PI*2);ctx.strokeStyle="rgba(255,255,255,0.25)";ctx.lineWidth=1;ctx.stroke();
    if(locked){ctx.font="bold 11px 'Courier New'";ctx.fillStyle="#f87171";ctx.textAlign="center";ctx.globalAlpha=0.5+0.5*Math.sin(Date.now()*0.025);ctx.fillText("LOCKED",x,y+sz+20);}
    ctx.restore();
  }

    function drawNuke(nt) {
    if (nt <= 0) return;
    const gx = nukeGroundX;
    const gy = nukeGroundY; // below screen
    const maxStemH = H * 1.6; // stem goes way off top

    // How far the stem has risen (0 = at ground, 1 = full height)
    const riseT = easeOut(Math.min(nt * 1.4, 1));
    const sH = lerp(0, maxStemH, riseT);
    const sW = lerp(0, 30, easeOut(Math.min(nt*0.7, 1)));
    const sBaseW = lerp(0, 80, easeOut(Math.min(nt*0.85, 1)));
    const stemTop = gy - sH; // this goes negative (above screen) = good

    // Stem glow — massive ambient light from below
    const ambientRadius = lerp(0, W*1.2, easeOut(Math.min(nt*1.2,1)));
    const ambGrad = ctx.createRadialGradient(gx, H, 0, gx, H, ambientRadius);
    ambGrad.addColorStop(0, `rgba(255,200,80,${Math.min(nt*2,0.6)})`);
    ambGrad.addColorStop(0.3, `rgba(255,120,20,${Math.min(nt*2,0.4)})`);
    ambGrad.addColorStop(0.6, `rgba(200,50,0,${Math.min(nt*1.5,0.2)})`);
    ambGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ambGrad;
    ctx.fillRect(0, 0, W, H);

    // Stem body — draw even if top is above canvas
    const drawStemTop = Math.max(stemTop, -50);
    const drawStemH = gy - drawStemTop;
    if (drawStemH > 0 && sW > 0) {
      const stemGrad = ctx.createLinearGradient(gx, gy, gx, drawStemTop);
      stemGrad.addColorStop(0, `rgba(255,200,60,${riseT*0.95})`);
      stemGrad.addColorStop(0.25, `rgba(255,140,25,${riseT*0.88})`);
      stemGrad.addColorStop(0.6, `rgba(200,80,10,${riseT*0.78})`);
      stemGrad.addColorStop(1, `rgba(140,45,5,${riseT*0.65})`);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(gx - sBaseW/2, gy);
      ctx.bezierCurveTo(gx - sBaseW/2, gy - drawStemH*0.2, gx - sW/2, drawStemTop + drawStemH*0.15, gx - sW/2, drawStemTop);
      ctx.lineTo(gx + sW/2, drawStemTop);
      ctx.bezierCurveTo(gx + sW/2, drawStemTop + drawStemH*0.15, gx + sBaseW/2, gy - drawStemH*0.2, gx + sBaseW/2, gy);
      ctx.closePath();
      ctx.fillStyle = stemGrad;
      ctx.fill();
      // Inner hot glow streak
      const ig = ctx.createLinearGradient(gx-sW*0.3, 0, gx+sW*0.3, 0);
      ig.addColorStop(0, 'rgba(255,230,100,0)');
      ig.addColorStop(0.5, `rgba(255,245,160,${riseT*0.6})`);
      ig.addColorStop(1, 'rgba(255,230,100,0)');
      ctx.fillStyle = ig;
      ctx.fill();
      ctx.restore();
    }

    // Cap — appears when stem is tall enough, rises with it
    const capAppear = Math.max(0, (nt - 0.18) / 0.82);
    if (capAppear > 0) {
      const capT = easeOut(Math.min(capAppear, 1));
      // Cap center tracks stem top but clamped — we want it visible on screen
      const capCY = Math.max(stemTop + 60, H * 0.05);
      const capCX = gx;
      const cR = lerp(0, 130, capT); // huge cap
      const cRv = lerp(0, 80, capT);

      // Outer atmospheric glow around cap
      ctx.save();
      ctx.scale(1, cRv/cR);
      const atmG = ctx.createRadialGradient(capCX, capCY*(cR/cRv), 0, capCX, capCY*(cR/cRv), cR*1.6);
      atmG.addColorStop(0, `rgba(255,160,30,${capT*0.55})`);
      atmG.addColorStop(0.45, `rgba(200,70,8,${capT*0.32})`);
      atmG.addColorStop(0.8, `rgba(120,25,0,${capT*0.15})`);
      atmG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = atmG;
      ctx.beginPath();ctx.arc(capCX, capCY*(cR/cRv), cR*1.6, 0, Math.PI*2);ctx.fill();
      ctx.restore();

      // Puffball cap
      const puffs = [
        {ox:0, oy:0, r:cR},
        {ox:-cR*0.56, oy:cR*0.25, r:cR*0.72},
        {ox:cR*0.56, oy:cR*0.25, r:cR*0.72},
        {ox:-cR*0.82, oy:cR*0.56, r:cR*0.54},
        {ox:cR*0.82, oy:cR*0.56, r:cR*0.54},
        {ox:0, oy:cR*0.46, r:cR*0.64},
        {ox:-cR*0.35, oy:-cR*0.3, r:cR*0.60},
        {ox:cR*0.35, oy:-cR*0.3, r:cR*0.60},
        {ox:-cR*0.65, oy:-cR*0.1, r:cR*0.48},
        {ox:cR*0.65, oy:-cR*0.1, r:cR*0.48},
      ];
      ctx.save();
      ctx.scale(1, cRv/cR);
      const yS = capCY*(cR/cRv);
      puffs.forEach(p => {
        const pg = ctx.createRadialGradient(capCX+p.ox, yS+p.oy, 0, capCX+p.ox, yS+p.oy, p.r);
        pg.addColorStop(0, `rgba(255,185,65,${capT*0.96})`);
        pg.addColorStop(0.3, `rgba(220,105,22,${capT*0.88})`);
        pg.addColorStop(0.62, `rgba(160,58,8,${capT*0.76})`);
        pg.addColorStop(0.85, `rgba(90,22,2,${capT*0.5})`);
        pg.addColorStop(1, 'rgba(40,8,0,0)');
        ctx.fillStyle = pg;
        ctx.beginPath();ctx.arc(capCX+p.ox, yS+p.oy, p.r, 0, Math.PI*2);ctx.fill();
      });
      // Blazing hot white core
      const hc = ctx.createRadialGradient(capCX, yS-cR*0.08, 0, capCX, yS-cR*0.08, cR*0.5);
      hc.addColorStop(0, `rgba(255,255,230,${capT*0.96})`);
      hc.addColorStop(0.35, `rgba(255,225,100,${capT*0.78})`);
      hc.addColorStop(0.7, `rgba(255,145,20,${capT*0.4})`);
      hc.addColorStop(1, 'rgba(255,100,0,0)');
      ctx.fillStyle = hc;
      ctx.beginPath();ctx.arc(capCX, yS-cR*0.08, cR*0.5, 0, Math.PI*2);ctx.fill();
      ctx.restore();

      // Skirt ring
      if (capAppear > 0.35) {
        const skirtT = easeOut(Math.min((capAppear-0.35)/0.4, 1));
        ctx.save();
        ctx.globalAlpha = capT*0.7*skirtT;
        const skR = cR*1.12*skirtT;
        const skG = ctx.createRadialGradient(capCX, capCY+cRv*0.84, 0, capCX, capCY+cRv*0.84, skR);
        skG.addColorStop(0, 'rgba(255,150,30,0.7)');
        skG.addColorStop(0.55, 'rgba(200,70,8,0.35)');
        skG.addColorStop(1, 'rgba(100,20,0,0)');
        ctx.fillStyle = skG;
        ctx.scale(1, 22/Math.max(skR,1));
        ctx.beginPath();ctx.arc(capCX, (capCY+cRv*0.84)*(Math.max(skR,1)/22), skR, 0, Math.PI*2);ctx.fill();
        ctx.restore();
      }
    }
  }

    function drawWhiteout() {
    if (whiteoutPhase === 'none' || whiteoutAlpha <= 0) return;
    // Full screen blinding white with warm tint at edges
    ctx.save();
    // White core
    ctx.fillStyle = `rgba(255,255,240,${whiteoutAlpha})`;
    ctx.fillRect(0, 0, W, H);
    // Warm orange vignette at edges during peak
    if (whiteoutAlpha > 0.5) {
      const vg = ctx.createRadialGradient(W/2, H/2, W*0.2, W/2, H/2, W*0.9);
      vg.addColorStop(0, 'rgba(255,255,255,0)');
      vg.addColorStop(0.7, `rgba(255,180,30,${(whiteoutAlpha-0.5)*0.6})`);
      vg.addColorStop(1, `rgba(255,120,0,${(whiteoutAlpha-0.5)*0.9})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

    const startTime = performance.now();
    let lastTime = startTime;

    function tick(now) {
      const dt = Math.min((now-lastTime)/1000, 0.05);
      lastTime = now;
      const el = now - startTime;

      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);

      const sx=shakeAmt>0.3?(Math.random()-0.5)*shakeAmt:0;
      const sy=shakeAmt>0.3?(Math.random()-0.5)*shakeAmt:0;
      shakeAmt*=0.8;
      ctx.save();ctx.translate(sx,sy);

      if(flashAlpha>0.01){
        const[fr,fg,fb]=flashColor;
        ctx.fillStyle=`rgba(${fr},${fg},${fb},${flashAlpha})`;
        ctx.fillRect(-50,-50,W+100,H+100);
        flashAlpha*=0.72;
      }

      rings.forEach(ring=>{
        if(ring.delay&&el<ring.delay+1000){const re=el-1000;if(re<ring.delay)return;}
        if(!ring.started){ring.started=true;}
        ring.r=Math.min(ring.r+ring.spd,ring.maxR);
        const a=ring.alpha*(1-ring.r/ring.maxR);
        if(a>0.008){
          ctx.beginPath();ctx.arc(ring.x,ring.y,ring.r,0,Math.PI*2);
          ctx.strokeStyle=`rgba(${ring.color[0]},${ring.color[1]},${ring.color[2]},${a})`;
          ctx.lineWidth=ring.lw;ctx.stroke();
          ctx.lineWidth=ring.lw*3;
          ctx.strokeStyle=`rgba(${ring.color[0]},${ring.color[1]},${ring.color[2]},${a*0.3})`;
          ctx.stroke();
        }
      });

      particles.forEach(p=>{
        if(p.alpha<=0.015)return;
        p.trail.push({x:p.x,y:p.y});
        if(p.trail.length>5)p.trail.shift();
        for(let ti=1;ti<p.trail.length;ti++){
          const pr2=p.trail[ti-1],qr=p.trail[ti],prog=ti/p.trail.length;
          ctx.beginPath();ctx.moveTo(pr2.x,pr2.y);ctx.lineTo(qr.x,qr.y);
          ctx.strokeStyle=p.color;ctx.globalAlpha=p.alpha*prog*0.5;ctx.lineWidth=p.size*0.5*prog;ctx.stroke();
        }
        ctx.globalAlpha=p.alpha;
        p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=0.98;
        p.alpha-=p.decay;p.rotation+=p.rotSpeed;
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);
        if(p.isRect){ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}
        else{ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill();}
        ctx.restore();ctx.globalAlpha=1;
      });

      if(animPhase==='hunt'){
        const huntT=Math.min(el/1000,1),wobble=1-huntT;
        rX=lerp(rX,tgtX+Math.sin(el*0.003)*40*wobble,0.035+huntT*0.04);
        rY=lerp(rY,tgtY+Math.cos(el*0.0025)*30*wobble,0.035+huntT*0.04);
        rSize=lerp(rSize,36,0.025);
        drawReticle(rX,rY,rSize,false,0);
        if(huntT>=1){animPhase='locking';lockedAt=now;}
      }else if(animPhase==='locking'){
        const lt=Math.min((now-lockedAt)/700,1);lockProgress=lt;
        rX=lerp(rX,tgtX,0.10+lt*0.12);rY=lerp(rY,tgtY,0.10+lt*0.12);rSize=lerp(rSize,32,0.05);
        drawReticle(rX,rY,rSize,lt>0.95,lt);
        if(lt>0.45&&lt<0.5){triggerFlash(248,113,113,0.4);triggerShake(8);}
        if(lt>0.78&&lt<0.83){triggerFlash(248,113,113,0.6);triggerShake(10);}
        if(lt>=1){animPhase='locked';fireAt=now+500;triggerFlash(255,80,80,0.7);triggerShake(14);}
      }else if(animPhase==='locked'){
        drawReticle(tgtX,tgtY,32,true,1);
        if(now>=fireAt)animPhase='fire';
      }else if(animPhase==='fire'){
        drawReticle(tgtX,tgtY,32,true,1);
        const ft=Math.min((now-fireAt)/700,1),et=ease(ft);
        const cpX=tgtX-W*0.18,cpY=Math.min(msY0,tgtY)-H*0.35;
        const mx=(1-et)*(1-et)*msX0+2*(1-et)*et*cpX+et*et*tgtX;
        const my=(1-et)*(1-et)*msY0+2*(1-et)*et*cpY+et*et*tgtY;
        const ft2=Math.min(ft+0.015,1),et2=ease(ft2);
        const nx=(1-et2)*(1-et2)*msX0+2*(1-et2)*et2*cpX+et2*et2*tgtX;
        const ny=(1-et2)*(1-et2)*msY0+2*(1-et2)*et2*cpY+et2*et2*tgtY;
        const angle=Math.atan2(ny-my,nx-mx)*(180/Math.PI)+90;
        trail.push({x:mx,y:my});if(trail.length>55)trail.shift();
        for(let ti=1;ti<trail.length;ti++){
          const p=trail[ti-1],q=trail[ti],prog=ti/trail.length;
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(250,180,30,${prog*0.9})`;ctx.lineWidth=1.5+prog*4.5;ctx.stroke();
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(255,255,200,${prog*0.55})`;ctx.lineWidth=prog*2;ctx.stroke();
        }
        drawMissile(mx,my,angle);
        if(ft>=1&&!impactFired){
          impactFired=true;animPhase='exploding';impactAt=now;
          spawnExplosion(tgtX,tgtY);
          triggerFlash(255,255,220,1.0);triggerShake(28);
          T(()=>{triggerFlash(255,180,30,0.7);triggerShake(20);},100);
          T(()=>{triggerFlash(255,100,0,0.5);triggerShake(14);},220);
          T(()=>{ spawnNuke(); triggerShake(30); },350);
          T(()=>{ whiteoutPhase='peak'; },1800);
          T(()=>{ whiteoutPhase='fading'; },2600);
          T(()=>{ nukeFadingOut=true; },3200);
          T(()=>{ spawnConfettiRain(); },4400);
          T(()=>{ overlayAlpha=0; doSettle=true; },5200);
        }
      }else if(animPhase==='exploding'){
        const fbt=Math.min((now-impactAt)/800,1);
        if(fbt<1){
          const fbSize=(1-fbt)*Math.max(W,H)*0.85;
          const grad=ctx.createRadialGradient(tgtX,tgtY,0,tgtX,tgtY,fbSize);
          grad.addColorStop(0,`rgba(255,255,255,${(1-fbt)*0.9})`);
          grad.addColorStop(0.15,`rgba(255,240,100,${(1-fbt)*0.8})`);
          grad.addColorStop(0.35,`rgba(255,140,20,${(1-fbt)*0.7})`);
          grad.addColorStop(0.6,`rgba(220,60,0,${(1-fbt)*0.5})`);
          grad.addColorStop(1,'transparent');
          ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
        }
      }

      if(nukeActive){
        if(nukeFadingOut) nukeAlpha=Math.max(0,nukeAlpha-0.018);
        if(nukeAlpha<=0){nukeActive=false;}
        const nt=(now-nukeStart)/2800;
        ctx.save();ctx.globalAlpha=nukeAlpha;
        nukeShockwaves.forEach(sw=>{
          sw.r+=sw.spd;if(sw.r>sw.maxR)return;
          const a=sw.alpha*(1-sw.r/sw.maxR);if(a<0.005)return;
          ctx.save();ctx.globalAlpha=nukeAlpha*a;
          ctx.beginPath();ctx.arc(nukeGroundX,nukeGroundY,sw.r,0,Math.PI*2);
          ctx.strokeStyle=`rgba(${sw.color[0]},${sw.color[1]},${sw.color[2]},${a})`;
          ctx.lineWidth=sw.lw*(1-sw.r/sw.maxR)+1;ctx.stroke();
          ctx.lineWidth=(sw.lw*(1-sw.r/sw.maxR)+1)*4;
          ctx.strokeStyle=`rgba(${sw.color[0]},${sw.color[1]},${sw.color[2]},${a*0.2})`;
          ctx.stroke();ctx.restore();
        });
        nukeDebris.forEach(p=>{
          p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;
          p.vy+=0.08*dt*60;p.vx*=0.98;
          p.alpha-=(dt/p.life)*0.7;p.rot+=p.rotSpd;
          if(p.alpha<=0)return;
          ctx.save();ctx.globalAlpha=Math.max(0,p.alpha)*nukeAlpha;
          ctx.translate(p.x,p.y);ctx.rotate(p.rot);
          ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
          ctx.restore();
        });
        drawNuke(nt);
        ctx.restore();
        if(whiteoutPhase==='rising') whiteoutAlpha=Math.min(whiteoutAlpha+dt*1.2,0.95);
        else if(whiteoutPhase==='peak') whiteoutAlpha=0.92+Math.sin(now*0.004)*0.06;
        else if(whiteoutPhase==='fading'){whiteoutAlpha=Math.max(0,whiteoutAlpha-dt*0.55);if(whiteoutAlpha<=0)whiteoutPhase='none';}
        drawWhiteout();
      }

      if(doSettle&&whiteoutPhase==='none'){
        if(overlayAlpha<0.88) overlayAlpha=Math.min(overlayAlpha+0.025,0.88);
        ctx.fillStyle=`rgba(0,0,0,${overlayAlpha})`;
        ctx.fillRect(0,0,W,H);
      }

      ctx.restore();
      animRef.current=requestAnimationFrame(tick);
    }

    animRef.current=requestAnimationFrame(tick);
    return ()=>{
      if(animRef.current) cancelAnimationFrame(animRef.current);
      timersRef.current.forEach(clearTimeout);
      timersRef.current=[];
    };
  }, []);

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,cursor:"pointer"}} onClick={onDismiss}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} />
      {phase==="settle" && (
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
          <div style={{textAlign:"center",maxWidth:400,width:"100%",animation:"cel-settle 0.6s cubic-bezier(0.34,1.4,0.64,1) forwards"}}>
            <div style={{fontSize:72,lineHeight:1,marginBottom:12,filter:"drop-shadow(0 0 24px rgba(250,204,21,0.9))"}}>
              {wins.length>1?"🏆":"✅"}
            </div>
            <div style={{fontSize:wins.length>1?28:36,fontWeight:800,color:"#facc15",letterSpacing:-1,marginBottom:4,textShadow:"0 0 40px rgba(250,204,21,0.5)"}}>
              {wins.length===1?"CASH IT":`${wins.length}× WINNER`}
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",marginBottom:28,letterSpacing:0.5}}>
              GROUP PLAY{wins.length>1?"S":""} GRADED
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {wins.map((w,i)=>(
                <div key={w.key} style={{background:"linear-gradient(135deg,rgba(74,222,128,0.18),rgba(74,222,128,0.08))",border:"1px solid rgba(74,222,128,0.45)",borderRadius:16,padding:"16px 22px",animation:`cel-card 0.45s cubic-bezier(0.34,1.2,0.64,1) ${0.1+i*0.12}s both`,boxShadow:"0 4px 24px rgba(74,222,128,0.15)",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{fontSize:22,flexShrink:0}}>💰</div>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:15,fontWeight:700,color:"#86efac",lineHeight:1.3}}>{w.label}</div>
                    <div style={{fontSize:11,color:"rgba(134,239,172,0.5)",marginTop:3,letterSpacing:0.3}}>WINNER</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:28,fontSize:11,color:"rgba(255,255,255,0.18)",letterSpacing:1,textTransform:"uppercase"}}>
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
  @keyframes shockwave { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(8); opacity: 0; } }
  @keyframes shockwave2 { 0% { transform: scale(0); opacity: 0.7; } 100% { transform: scale(12); opacity: 0; } }
  @keyframes fireball { 0% { transform: scale(0) rotate(0deg); opacity: 1; } 40% { transform: scale(1.4) rotate(15deg); opacity: 1; } 100% { transform: scale(3) rotate(30deg); opacity: 0; } }
  @keyframes debris { 0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0); opacity: 0; } }
  @keyframes mushroom-stem { 0% { transform: scaleY(0); opacity: 1; } 60% { transform: scaleY(1); opacity: 1; } 100% { transform: scaleY(1); opacity: 0; } }
  @keyframes mushroom-cap { 0% { transform: scale(0) translateY(0); opacity: 1; } 50% { transform: scale(1) translateY(-20px); opacity: 1; } 100% { transform: scale(1.3) translateY(-40px); opacity: 0; } }
  @keyframes celebration-text { 0% { transform: scale(0) rotate(-10deg); opacity: 0; } 50% { transform: scale(1.15) rotate(2deg); opacity: 1; } 70% { transform: scale(0.95) rotate(-1deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
  @keyframes flash { 0% { opacity: 0; } 10% { opacity: 0.9; } 30% { opacity: 0.4; } 50% { opacity: 0.7; } 70% { opacity: 0.2; } 100% { opacity: 0; } }
  @keyframes confetti-fall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0.3; } }
  @keyframes settle-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
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
  const [celebrationLosses, setCelebrationLosses] = useState([]); // plays to mourn
  const [showLossCelebration, setShowLossCelebration] = useState(false);

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
  const [activePicksDate, setActivePicksDate] = useState(TODAY_DATE); // tracks which date's picks are shown

  // Groups
  const [activeGroup, setActiveGroup]           = useState(null); // { id, name, invite_code, role }
  const [myGroups, setMyGroups]                 = useState([]);
  const [showGroupSwitcher, setShowGroupSwitcher] = useState(false);
  const [showCreateGroup, setShowCreateGroup]   = useState(false);
  const [showJoinGroup, setShowJoinGroup]       = useState(false);
  const [groupSetupDone, setGroupSetupDone]     = useState(false); // true once groups loaded
  const [newGroupName, setNewGroupName]         = useState("");
  const [joinCode, setJoinCode]                 = useState("");
  const [groupError, setGroupError]             = useState("");
  const [groupLoading, setGroupLoading]         = useState(false);

  // Futures
  const [futuresPendingPick, setFuturesPendingPick] = useState(null); // { team, odds } awaiting confirm
  const [futuresNote, setFuturesNote]               = useState("");
  const [futuresTeams, setFuturesTeams]         = useState([]); // [{team, odds}]
  const [futuresPicks, setFuturesPicks]         = useState([]); // all users' picks
  const [myFuturesPicks, setMyFuturesPicks]     = useState([]); // current user's picks
  const [futuresLoading, setFuturesLoading]     = useState(false);
  const [futuresOddsLoading, setFuturesOddsLoading] = useState(false);
  const [futuresSearch, setFuturesSearch]       = useState("");

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

  // ── Read ?join= URL param on mount ───────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinParam = params.get("join");
    if (joinParam) {
      setJoinCode(joinParam.toUpperCase());
      setShowJoinGroup(true);
      // Clean the URL without reloading
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // ── Auth init ────────────────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Read username directly from session metadata - no network call needed
        const uname = session.user?.user_metadata?.username || null;
        if (uname) {
          setUsername(uname);
          loadMyGroups(session.user.id, uname); // always load groups on session restore
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
  useEffect(() => {
    if (!session && !viewerMode) return;
    loadOddsFromCache(activeGroup?.id || null);
  }, [session, viewerMode, activeGroup?.id]);

  async function loadOddsFromCache(gid) {
    const groupId = gid || activeGroup?.id;
    try {
      // Try with group_id first, fall back to any row for today (handles null group_id)
      let cached = null;
      if (groupId) {
        const { data } = await supabase.from("group_results").select("result")
          .eq("key", `__odds_cache__${TODAY_DATE}`).eq("date", TODAY_DATE)
          .eq("group_id", groupId).maybeSingle();
        cached = data;
      }
      // Fallback: no group filter (works for null group_id rows and no-group users)
      if (!cached) {
        const { data } = await supabase.from("group_results").select("result")
          .eq("key", `__odds_cache__${TODAY_DATE}`).eq("date", TODAY_DATE)
          .maybeSingle();
        cached = data;
      }
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
      const sports = [{ key: "basketball_ncaab", label: "ncaab" }, { key: "baseball_mlb", label: "mlb" }];
      const allGames = [];
      for (const sport of sports) {
        const res = await fetch(
          `https://api.the-odds-api.com/v4/sports/${sport.key}/odds/?apiKey=${apiKey}&regions=us&markets=spreads,totals,h2h&oddsFormat=american&dateFormat=iso`
        );
        if (!res.ok) continue;
        const data = await res.json();
        const todayGames = data.filter(g => {
          const etDate = new Date(g.commence_time).toLocaleDateString("en-CA", { timeZone: "America/New_York" });
          return etDate === TODAY_DATE;
        });
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
            sport: sport.label,
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
          { key: `__odds_cache__${TODAY_DATE}`, result: JSON.stringify(mergedGames), date: TODAY_DATE, group_id: activeGroup?.id || null },
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
    if (!activeGroup?.id) return; // wait for group to load
    loadData(username, activeGroup.id);
  }, [session, username, viewerMode, activeGroup]);

  async function loadData(activeUsername, gid) {
    const uname = activeUsername || username;
    const groupId = gid || activeGroup?.id;
    if (!uname && !viewerMode) { setLoading(false); return; }
    // Don't load picks without a group — all picks are group-scoped
    if (!groupId && !viewerMode) { setLoading(false); return; }
    setLoading(true);
    try {
    let picksQuery = supabase.from("picks").select("username, selections, is_public, user_id, date").eq("date", TODAY_DATE);
    if (groupId) picksQuery = picksQuery.eq("group_id", groupId);
    let { data: picksRows } = await picksQuery;
    // If no picks today, check yesterday for ungraded plays
    let picksDate = TODAY_DATE;
    setActivePicksDate(TODAY_DATE);
    if (!picksRows || picksRows.length === 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yDate = yesterday.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
      let yQuery = supabase.from("picks").select("username, selections, is_public, user_id, date").eq("date", yDate);
      if (groupId) yQuery = yQuery.eq("group_id", groupId);
      const { data: yRows } = await yQuery;
      if (yRows && yRows.length > 0) {
        // Check if there are any ungraded results from yesterday
        let yResultsQ = supabase.from("group_results").select("key, result").eq("date", yDate).not("result", "in", '("win","loss","push")');
        if (groupId) yResultsQ = yResultsQ.eq("group_id", groupId);
        const { data: yUngraded } = await yResultsQ;
        // Also check if any picks exist that have no result at all (pending)
        if (yUngraded && yUngraded.length > 0) {
          picksRows = yRows;
          picksDate = yDate;
          setActivePicksDate(yDate);
        }
      }
    }

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
    let resultsQuery = supabase.from("group_results").select("key, result").eq("date", picksDate);
    if (groupId) resultsQuery = resultsQuery.eq("group_id", groupId);
    const { data: resultsRows } = await resultsQuery;

    if (resultsRows) {
      const built = {};
      resultsRows.forEach(row => { built[row.key] = row.result; });
      setPlayResults(built);
      recomputeRecord(built);
      checkForNewWins(built, games);
      checkForNewLosses(built, games);
    }

    // Load all-time record - only rows with graded results
    let allTimeQuery2 = supabase.from("group_results").select("result").in("result", ["win", "loss", "push"]);
    if (groupId) allTimeQuery2 = allTimeQuery2.eq("group_id", groupId);
    const { data: allResultsRows } = await allTimeQuery2;
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
      const t = setTimeout(() => setCelebrationPhase("settle"), 5200);
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

  function checkForNewLosses(results, currentGames) {
    const seenKey = `lockin_seen_losses_${TODAY_DATE}`;
    const seen = new Set(JSON.parse(localStorage.getItem(seenKey) || "[]"));
    const newLosses = Object.entries(results)
      .filter(([key, result]) => result === "loss" && !seen.has(key) && !key.startsWith("__"))
      .map(([key]) => {
        const [gid, bt] = key.split("__");
        let label = null;
        const allPicksEntries = Object.values(allPicks);
        for (const p of allPicksEntries) {
          const stored = p.selections?.[key];
          if (stored?.label) { label = `${stored.label} ${stored.line}`; break; }
        }
        if (!label) {
          const game = currentGames.find(g => g.id === gid);
          if (game) {
            const BT = {
              spread_away: (g) => `${g.away} ${g.spread.away}`,
              spread_home: (g) => `${g.home} ${g.spread.home}`,
              over: (g) => `Over ${g.total}`,
              under: (g) => `Under ${g.total}`,
              ml_away: (g) => `${g.away} ML`,
              ml_home: (g) => `${g.home} ML`,
            };
            label = BT[bt]?.(game) || key;
          } else { label = key; }
        }
        return { key, label };
      });
    if (newLosses.length > 0 && !isAdmin) {
      const updatedSeen = [...seen, ...newLosses.map(w => w.key)];
      localStorage.setItem(seenKey, JSON.stringify(updatedSeen));
      setCelebrationLosses(newLosses);
      setShowLossCelebration(true);
    }
  }

  // ── Realtime ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    const gid = activeGroup?.id || null;
    const channelSuffix = gid || "all";

    const picksSub = supabase.channel(`picks-changes-${channelSuffix}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "picks" }, () => {
        let q = supabase.from("picks").select("username, selections, is_public, user_id").eq("date", TODAY_DATE);
        if (gid) q = q.eq("group_id", gid);
        q.then(({ data }) => {
          if (data) {
            const built = {};
            data.forEach(row => {
              built[row.username] = { selections: row.selections, is_public: row.is_public, user_id: row.user_id };
            });
            setAllPicks(built);
          }
        });
      }).subscribe();

    const resultsSub = supabase.channel(`results-changes-${channelSuffix}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "group_results" }, () => {
        let q = supabase.from("group_results").select("key, result").eq("date", TODAY_DATE);
        if (gid) q = q.eq("group_id", gid);
        q.then(({ data }) => {
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
  }, [session, username, activeGroup?.id]);

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
  const filteredGames = games.filter(g => {
    if (!g || !g.away || !g.home) return false;
    // Hide games that started more than 15 minutes ago
    const gameTimeStr = g.time?.replace(" ET", "");
    if (gameTimeStr && gameTimeStr !== "N/A" && gameTimeStr.includes(":")) {
      try {
        const parts = gameTimeStr.split(" ");
        if (parts.length === 2) {
          const [time, period] = parts;
          const timeParts = time.split(":");
          if (timeParts.length === 2) {
            let hour = parseInt(timeParts[0], 10);
            const mins = parseInt(timeParts[1], 10);
            if (!isNaN(hour) && !isNaN(mins)) {
              if (period === "PM" && hour !== 12) hour += 12;
              if (period === "AM" && hour === 12) hour = 0;
              const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
              const gameDate = new Date(`${today}T${String(hour).padStart(2,"0")}:${String(mins).padStart(2,"0")}:00`);
              // Adjust for ET offset manually to avoid Safari ISO parsing issues
              const etOffsetMs = 4 * 60 * 60 * 1000; // EDT = UTC-4
              const gameDateUTC = new Date(gameDate.getTime() + etOffsetMs);
              const cutoff = new Date(gameDateUTC.getTime() + 15 * 60 * 1000);
              if (!isNaN(cutoff.getTime()) && new Date() > cutoff) return false;
            }
          }
        }
      } catch(e) {}
    }
    const s = (search || "").toLowerCase();
    return (
      g.away.toLowerCase().includes(s) ||
      g.home.toLowerCase().includes(s)
    );
  });

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
      group_id: activeGroup?.id || null,
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
      let delQuery = supabase.from("group_results").delete().eq("key", key).eq("date", activePicksDate);
      if (activeGroup?.id) delQuery = delQuery.eq("group_id", activeGroup.id);
      await delQuery;
      // Clear result in pick_history for all users who had this pick
      await supabase.from("pick_history").update({ result: null, units_result: null }).eq("pick_key", key).eq("date", TODAY_DATE);
      const next = { ...playResults };
      delete next[key];
      setPlayResults(next);
      recomputeRecord(next);
    } else {
      await supabase.from("group_results").upsert({ key, result, date: activePicksDate, group_id: activeGroup?.id || null }, { onConflict: "key,date" });
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
    let atQuery = supabase.from("group_results").select("result").in("result", ["win", "loss", "push"]);
    if (activeGroup?.id) atQuery = atQuery.eq("group_id", activeGroup.id);
    const { data: allResultsRows } = await atQuery;
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

  // ── Futures ─────────────────────────────────────────────────────────────────
  async function loadFutures() {
    setFuturesLoading(true);
    // Load cached futures teams from group_results (newest row)
    const { data: cached } = await supabase
      .from("group_results")
      .select("result")
      .eq("key", "__futures_cache__")
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (cached?.result) {
      try { setFuturesTeams(JSON.parse(cached.result)); } catch(e) {}
    }
    // Load all futures picks
    let fpQuery = supabase.from("futures_picks").select("username, team, odds, note, result, user_id").order("created_at", { ascending: true });
    if (activeGroup?.id) fpQuery = fpQuery.eq("group_id", activeGroup.id);
    const { data: picks } = await fpQuery;
    if (picks) {
      setFuturesPicks(picks);
      setMyFuturesPicks(picks.filter(p => p.username === username));
    }
    setFuturesLoading(false);
  }

  async function fetchFuturesOdds() {
    const apiKey = import.meta.env.VITE_ODDS_API_KEY;
    if (!apiKey) return;
    setFuturesOddsLoading(true);
    try {
      // Step 1: Discover which NCAAB futures sport keys are currently active
      const sportsRes = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${apiKey}&all=true`);
      let sportKey = null;
      if (sportsRes.ok) {
        const sportsData = await sportsRes.json();
        // Look for NCAAB winner/outright sport keys
        const candidates = sportsData.filter(s =>
          s.key.includes("ncaab") && (s.has_outrights || s.key.includes("winner") || s.key.includes("champion"))
        );
        console.log("[LockIn] NCAAB futures candidates:", candidates.map(s => s.key + " active=" + s.active));
        const active = candidates.find(s => s.active);
        if (active) sportKey = active.key;
      }

      // Step 2: Fetch odds from the discovered sport key
      let teams = [];
      const toTry = sportKey ? [sportKey] : ["basketball_ncaab_championship_winner"];
      for (const key of toTry) {
        const res = await fetch(
          `https://api.the-odds-api.com/v4/sports/${key}/odds/?apiKey=${apiKey}&regions=us&markets=outrights&oddsFormat=american`
        );
        console.log(`[LockIn] futures ${key} status:`, res.status);
        if (!res.ok) continue;
        const data = await res.json();
        console.log(`[LockIn] futures events returned:`, data.length);
        const teamsMap = {};
        data.forEach(event => {
          const outrights = event.bookmakers?.[0]?.markets?.find(m => m.key === "outrights");
          outrights?.outcomes?.forEach(o => {
            if (!teamsMap[o.name]) {
              const price = o.price > 0 ? `+${o.price}` : `${o.price}`;
              teamsMap[o.name] = { team: o.name, odds: price };
            }
          });
        });
        teams = Object.values(teamsMap).sort((a, b) => {
          const aNum = parseInt(a.odds.replace('+',''));
          const bNum = parseInt(b.odds.replace('+',''));
          return aNum - bNum;
        });
        if (teams.length > 0) break;
      }

      console.log(`[LockIn] futures teams found: ${teams.length}`);
      if (teams.length > 0) {
        setFuturesTeams(teams);
        await supabase.from("group_results").delete().eq("key", "__futures_cache__");
        await supabase.from("group_results").insert(
          { key: "__futures_cache__", result: JSON.stringify(teams), date: TODAY_DATE }
        );
      } else {
        console.warn("[LockIn] No futures teams returned — API may not have outrights for this sport/plan");
      }
    } catch(e) { console.error("Futures fetch error:", e); }
    setFuturesOddsLoading(false);
  }

  async function submitFuturesPick(team, odds, note) {
    if (!session || !username) return;
    const { data: profile } = await supabase.from("profiles").select("id").eq("username", username).maybeSingle();
    if (!profile) return;
    const { error } = await supabase.from("futures_picks").insert({
      user_id: profile.id,
      username,
      team,
      odds,
      note: note?.trim() || null,
      group_id: activeGroup?.id || null,
    });
    if (!error) {
      const newPick = { user_id: profile.id, username, team, odds, note: note?.trim() || null, result: null };
      setFuturesPicks(prev => [...prev, newPick]);
      setMyFuturesPicks(prev => [...prev, newPick]);
      setFuturesPendingPick(null);
      setFuturesNote("");
    }
  }

  async function gradeFuture(team, result) {
    if (!isAdmin) return;
    await supabase.from("futures_picks").update({ result }).eq("team", team);
    setFuturesPicks(prev => prev.map(p => p.team === team ? { ...p, result } : p));
    setMyFuturesPicks(prev => prev.map(p => p.team === team ? { ...p, result } : p));
  }

  // ── Groups ───────────────────────────────────────────────────────────────────
  async function loadMyGroups(uid, uname) {
    const { data, error } = await supabase
      .from("group_members")
      .select("role, groups(id, name, invite_code)")
      .eq("user_id", uid);
    console.log("[LockIn] loadMyGroups data:", JSON.stringify(data), "error:", error?.message);
    if (data && data.length > 0) {
      const groups = data.map(d => ({ ...d.groups, role: d.role }));
      setMyGroups(groups);
      // Load last used group from localStorage
      const lastId = localStorage.getItem("lockin_active_group");
      const last = groups.find(g => g.id === lastId) || groups[0];
      setActiveGroup(last);
      setGroupSetupDone(true);
      // Reload data with the correct group now that we know it
      // Use uid-resolved username, not state (state may not be set yet)
      const resolvedUsername = uname || username;
      if (last) {
        loadData(resolvedUsername, last.id);
        loadOddsFromCache(last.id);
      }
      return last;
    }
    setGroupSetupDone(true);
    return null;
  }

  async function createGroup(name) {
    if (!name.trim()) { setGroupError("Enter a group name"); return; }
    setGroupLoading(true); setGroupError("");
    // Generate unique 6-char code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    const { data: grp, error } = await supabase.from("groups").insert({
      name: name.trim(), invite_code: code, created_by: session.user.id
    }).select().single();
    if (error) { setGroupError("Something went wrong"); setGroupLoading(false); return; }
    await supabase.from("group_members").insert({ group_id: grp.id, user_id: session.user.id, role: "admin" });
    const newGroup = { ...grp, role: "admin" };
    setMyGroups(prev => [...prev, newGroup]);
    switchGroup(newGroup);
    setShowCreateGroup(false); setNewGroupName(""); setGroupLoading(false);
  }

  async function joinGroup(code) {
    if (!code.trim()) { setGroupError("Enter an invite code"); return; }
    setGroupLoading(true); setGroupError("");
    const { data: grp } = await supabase.from("groups").select("*").eq("invite_code", code.trim().toUpperCase()).maybeSingle();
    if (!grp) { setGroupError("Invalid code — check and try again"); setGroupLoading(false); return; }
    // Check already a member
    const { data: existing } = await supabase.from("group_members").select("group_id").eq("group_id", grp.id).eq("user_id", session.user.id).maybeSingle();
    if (existing) { setGroupError("You're already in this group"); setGroupLoading(false); return; }
    await supabase.from("group_members").insert({ group_id: grp.id, user_id: session.user.id, role: "member" });
    const joined = { ...grp, role: "member" };
    setMyGroups(prev => [...prev, joined]);
    switchGroup(joined);
    setShowJoinGroup(false); setJoinCode(""); setGroupLoading(false);
  }

  function switchGroup(group) {
    setActiveGroup(group);
    localStorage.setItem("lockin_active_group", group.id);
    setShowGroupSwitcher(false);
    // Reset daily state
    setAllPicks({}); setMyPicks(null); setSelectedPicks({});
    setPlayResults({}); setGames([]); setRecord({ wins:0,losses:0,pushes:0 });
    setAllTimeRecord({ wins:0,losses:0,pushes:0 });
    setFuturesPicks([]); setMyFuturesPicks([]); setFuturesTeams([]);
    
    loadData(username, group.id);
    loadOddsFromCache(group.id);
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
    // First try live games array
    const g = games.find(x => x.id === gid);
    if (g) {
      const { label, line } = BET_TYPES[bt](g);
      return `${label} ${line}`;
    }
    // Fall back to stored label in any user's selections
    for (const p of Object.values(allPicks)) {
      const stored = p.selections?.[key];
      if (stored?.label) return `${stored.label}${stored.line ? " " + stored.line : ""}`;
    }
    // Last resort: try to make it readable from the key
    return key.split("__").pop()?.replace(/_/g, " ") || key;
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
          <button onClick={() => {  setViewerMode(true); setPage("group"); loadOddsFromCache(); loadData(null); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "Outfit, sans-serif", letterSpacing: 0.3 }}>
            👀 Watch without an account
          </button>
        </div>
      </div>
    </div>
  );

  // ── Group setup screen — shown when user has no groups yet (rendered as overlay)
  const showNoGroupsScreen = session && username && groupSetupDone && myGroups.length === 0;

  if (session && username && showCreateGroup) {
    return (
      <div style={{ minHeight:"100vh", background:"#0d0b1e", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ maxWidth:340, width:"100%" }}>
          <button onClick={() => { setShowCreateGroup(false); setGroupError(""); }} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", fontSize:13, cursor:"pointer", fontFamily:"Outfit, sans-serif", marginBottom:24, display:"flex", alignItems:"center", gap:6 }}>← Back</button>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:6 }}>Create a Group</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:24 }}>You'll get a unique invite code to share with your crew.</div>
          <input
            type="text" maxLength={32} placeholder="Group name (e.g. The Boys)"
            value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
            onKeyDown={e => e.key==="Enter" && createGroup(newGroupName)}
            style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"14px 16px", color:"#fff", fontSize:15, fontFamily:"Outfit, sans-serif", outline:"none", marginBottom:12, boxSizing:"border-box" }}
          />
          {groupError && <div style={{ color:"#f87171", fontSize:12, marginBottom:10 }}>{groupError}</div>}
          <button onClick={() => createGroup(newGroupName)} disabled={groupLoading} style={{ width:"100%", padding:"15px 0", background:"linear-gradient(135deg, rgba(30,144,255,0.4), rgba(14,165,233,0.3))", border:"1px solid rgba(30,144,255,0.5)", borderRadius:14, color:"#e0f2fe", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"Outfit, sans-serif", opacity:groupLoading?0.6:1 }}>
            {groupLoading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    );
  }



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


      {/* ── NO GROUPS WELCOME SCREEN ── */}
      {showNoGroupsScreen && !showCreateGroup && !showJoinGroup && (
        <div style={{ position:"fixed", inset:0, zIndex:400, background:"#0d0b1e", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ textAlign:"center", maxWidth:340, width:"100%" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🎯</div>
            <div style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:-0.5, marginBottom:8 }}>Welcome to Lock In</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.4)", marginBottom:32, lineHeight:1.6 }}>Create a group for your crew or join one with an invite code.</div>
            <button onClick={() => setShowCreateGroup(true)} style={{ width:"100%", padding:"15px 0", background:"linear-gradient(135deg, rgba(30,144,255,0.4), rgba(14,165,233,0.3))", border:"1px solid rgba(30,144,255,0.5)", borderRadius:14, color:"#e0f2fe", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"Outfit, sans-serif", marginBottom:12 }}>Create a Group</button>
            <button onClick={() => setShowJoinGroup(true)} style={{ width:"100%", padding:"15px 0", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, color:"rgba(255,255,255,0.6)", fontSize:15, fontWeight:600, cursor:"pointer", fontFamily:"Outfit, sans-serif" }}>Join with a Code</button>
            <button onClick={() => supabase.auth.signOut()} style={{ marginTop:20, background:"none", border:"none", color:"rgba(255,255,255,0.2)", fontSize:12, cursor:"pointer", fontFamily:"Outfit, sans-serif" }}>Sign out</button>
          </div>
        </div>
      )}

      {/* ── GROUP SWITCHER ── */}
      {showGroupSwitcher && (
        <div style={{ position:"fixed", inset:0, zIndex:400, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }} onClick={() => setShowGroupSwitcher(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:56, left:16, background:"#0d0b1e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:8, minWidth:220, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.25)", letterSpacing:2, textTransform:"uppercase", padding:"6px 12px 4px", fontWeight:600 }}>Your Groups</div>
            {myGroups.map(g => (
              <div key={g.id}>
                <button onClick={() => switchGroup(g)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background:activeGroup?.id===g.id?"rgba(30,144,255,0.2)":"transparent", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"Outfit, sans-serif" }}>
                  <span style={{ fontSize:13, fontWeight:600, color:activeGroup?.id===g.id?"#bae6fd":"#fff" }}>{g.name}</span>
                  {activeGroup?.id===g.id && <span style={{ fontSize:10, color:"#60a5fa" }}>✓</span>}
                </button>
                {activeGroup?.id===g.id && (
                  <div style={{ padding:"0 12px 8px", display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:1.5 }}>{g.invite_code}</span>
                    <button onClick={() => navigator.clipboard.writeText(g.invite_code)} style={{ background:"rgba(30,144,255,0.1)", border:"1px solid rgba(30,144,255,0.2)", borderRadius:5, padding:"2px 8px", color:"#bae6fd", fontSize:9, cursor:"pointer", fontFamily:"Outfit, sans-serif" }}>Copy</button>
                    <button onClick={() => navigator.clipboard.writeText(`https://lock-in-picks.com?join=${g.invite_code}`)} style={{ background:"rgba(30,144,255,0.1)", border:"1px solid rgba(30,144,255,0.2)", borderRadius:5, padding:"2px 8px", color:"#bae6fd", fontSize:9, cursor:"pointer", fontFamily:"Outfit, sans-serif" }}>Copy Link</button>
                  </div>
                )}
              </div>
            ))}
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", marginTop:4, paddingTop:4 }}>
              <button onClick={() => { setShowGroupSwitcher(false); setShowCreateGroup(true); setGroupError(""); }} style={{ width:"100%", padding:"9px 12px", background:"transparent", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"Outfit, sans-serif", fontSize:12, color:"rgba(30,144,255,0.8)", textAlign:"left" }}>+ Create new group</button>
              <button onClick={() => { setShowGroupSwitcher(false); setShowJoinGroup(true); setGroupError(""); }} style={{ width:"100%", padding:"9px 12px", background:"transparent", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"Outfit, sans-serif", fontSize:12, color:"rgba(255,255,255,0.4)", textAlign:"left" }}>+ Join with a code</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE GROUP MODAL ── */}
      {showCreateGroup && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setShowCreateGroup(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#0d0b1e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"22px 22px 0 0", width:"100%", maxWidth:520, padding:"24px 24px 40px" }}>
            <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)", margin:"0 auto 22px" }} />
            <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:6 }}>Create a Group</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:20 }}>You'll get a unique code to share with your crew.</div>
            <input type="text" maxLength={32} placeholder="Group name" value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createGroup(newGroupName)} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:15, fontFamily:"Outfit, sans-serif", outline:"none", marginBottom:10, boxSizing:"border-box" }} />
            {groupError && <div style={{ color:"#f87171", fontSize:12, marginBottom:10 }}>{groupError}</div>}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setShowCreateGroup(false); setGroupError(""); }} style={{ flex:1, padding:"13px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, color:"rgba(255,255,255,0.5)", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"Outfit, sans-serif" }}>Cancel</button>
              <button onClick={() => createGroup(newGroupName)} disabled={groupLoading} style={{ flex:2, padding:"13px 0", background:"linear-gradient(135deg, rgba(30,144,255,0.4), rgba(14,165,233,0.3))", border:"1px solid rgba(30,144,255,0.5)", borderRadius:12, color:"#e0f2fe", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Outfit, sans-serif", opacity:groupLoading?0.6:1 }}>{groupLoading?"Creating...":"Create Group"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── JOIN GROUP MODAL ── */}
      {showJoinGroup && (
        <div style={{ position:"fixed", inset:0, zIndex:500, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setShowJoinGroup(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#0d0b1e", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"22px 22px 0 0", width:"100%", maxWidth:520, padding:"24px 24px 40px" }}>
            <div style={{ width:36, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)", margin:"0 auto 22px" }} />
            <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:6 }}>Join a Group</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:20 }}>Enter the 6-character invite code.</div>
            <input type="text" maxLength={6} placeholder="Enter invite code" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&joinGroup(joinCode)} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:20, fontWeight:700, letterSpacing:6, fontFamily:"Outfit, sans-serif", outline:"none", marginBottom:10, boxSizing:"border-box", textTransform:"uppercase" }} />
            {groupError && <div style={{ color:"#f87171", fontSize:12, marginBottom:10 }}>{groupError}</div>}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setShowJoinGroup(false); setGroupError(""); }} style={{ flex:1, padding:"13px 0", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, color:"rgba(255,255,255,0.5)", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"Outfit, sans-serif" }}>Cancel</button>
              <button onClick={() => joinGroup(joinCode)} disabled={groupLoading} style={{ flex:2, padding:"13px 0", background:"linear-gradient(135deg, rgba(30,144,255,0.4), rgba(14,165,233,0.3))", border:"1px solid rgba(30,144,255,0.5)", borderRadius:12, color:"#e0f2fe", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Outfit, sans-serif", opacity:groupLoading?0.6:1 }}>{groupLoading?"Joining...":"Join Group"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── RECORD DETAIL MODAL ── */}}
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
      {showLossCelebration && <LossCelebration losses={celebrationLosses} onDismiss={() => setShowLossCelebration(false)} />}

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
            <LogoIcon isAdmin={isAdmin} size={28} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: -0.3, whiteSpace: "nowrap" }}>Lock In</div>
              {isAdmin && <div style={{ fontSize: 8, color: "rgba(251,191,36,0.7)", letterSpacing: 0.8, marginTop: 2 }}>ADMIN</div>}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "3px", gap: 2, border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              {[["picks","Picks"],["group","Group"],["players","Players"],["futures","Futures"]].filter(([p]) => !viewerMode || p !== "picks").map(([p, label]) => (
                <button key={p} className="nav-btn" onClick={() => { setPage(p); if(p==="futures") loadFutures(); }} style={{ padding: "7px 10px", background: page===p?"rgba(30,144,255,0.35)":"transparent", border: page===p?"1px solid rgba(30,144,255,0.5)":"1px solid transparent", borderRadius: 8, color: page===p?"#e0f2fe":"rgba(255,255,255,0.38)", fontSize: 11, fontWeight: page===p?600:400, cursor: "pointer", fontFamily: "Outfit, sans-serif", position: "relative", whiteSpace: "nowrap" }}>
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
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {session && (
                  <button onClick={() => setShowGroupSwitcher(v => !v)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontFamily: "Outfit, sans-serif", display: "flex", alignItems: "center", gap: 3, maxWidth: 80 }}>
                    <span style={{ fontSize: 9, color: activeGroup ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeGroup ? activeGroup.name : "No Group"}</span>
                    <span style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>▾</span>
                  </button>
                )}
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

                {/* NCAAB Section */}
                {filteredGames.filter(g => !g.sport || g.sport === "ncaab").length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ background: "linear-gradient(135deg, rgba(30,144,255,0.4), rgba(14,165,233,0.4))", border: "1px solid rgba(30,144,255,0.4)", borderRadius: 6, padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#bae6fd", textTransform: "uppercase" }}>NCAAB</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{filteredGames.filter(g => !g.sport || g.sport === "ncaab").length} game{filteredGames.filter(g => !g.sport || g.sport === "ncaab").length!==1?"s":""}{search?" found":" today"}</span>
                  </div>
                )}

                {filteredGames.filter(g => !g.sport || g.sport === "ncaab").map(game => {
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
                {/* MLB Section */}
                {filteredGames.filter(g => g.sport === "mlb").length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ background: "linear-gradient(135deg, rgba(20,160,60,0.4), rgba(16,130,50,0.4))", border: "1px solid rgba(20,160,60,0.45)", borderRadius: 6, padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#86efac", textTransform: "uppercase" }}>MLB</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{filteredGames.filter(g => g.sport === "mlb").length} game{filteredGames.filter(g => g.sport === "mlb").length!==1?"s":""}{search?" found":" today"}</span>
                    </div>
                    {filteredGames.filter(g => g.sport === "mlb").map(game => {
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
                              {[["Spread",["spread_away","spread_home"]],["Total",["over","under"]],["Moneyline",["ml_away","ml_home"]]].filter(([, types]) => types.every(bt => { const v = BET_TYPES[bt](game); return v.line && v.line !== "N/A"; })).map(([catLabel, types]) => (
                                <div key={catLabel} style={{ marginBottom: 14 }}>
                                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>{catLabel}</div>
                                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    {types.map(bt => {
                                      const v = BET_TYPES[bt](game);
                                      const key = `${game.id}__${bt}`;
                                      const picked = !!selectedPicks[key];
                                      return (
                                        <button key={bt} onClick={() => !hasSubmitted && togglePick(key, v.label)} style={{ flex: 1, minWidth: 100, padding: "10px 14px", background: picked?"linear-gradient(135deg,rgba(30,144,255,0.35),rgba(14,165,233,0.25))":"rgba(255,255,255,0.04)", border: picked?"1px solid rgba(30,144,255,0.6)":"1px solid rgba(255,255,255,0.08)", borderRadius: 10, cursor: hasSubmitted?"default":"pointer", transition: "all 0.15s", fontFamily: "Outfit, sans-serif" }}>
                                          <div style={{ fontSize: 13, fontWeight: 700, color: picked?"#bae6fd":"#fff" }}>{v.line}</div>
                                          <div style={{ fontSize: 10, color: picked?"rgba(186,230,253,0.6)":"rgba(255,255,255,0.3)", marginTop: 2 }}>{v.label}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                              {/* Note + Units for MLB */}
                              {(() => {
                                const activeKey = ["spread_away","spread_home","over","under","ml_away","ml_home"]
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
                                        placeholder="e.g. got +115 instead of +105"
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
                                            <button key={u} onClick={() => setPickUnits(prev => ({ ...prev, [activeKey]: u }))} style={{ flex: 1, padding: "7px 0", background: active?"rgba(30,144,255,0.3)":"rgba(255,255,255,0.04)", border: active?"1px solid rgba(30,144,255,0.5)":"1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: active?"#bae6fd":"rgba(255,255,255,0.35)", fontSize: 12, fontWeight: active?700:400, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>{u}u</button>
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
                  </div>
                )}

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


        {/* ═══ FUTURES PAGE ═══ */}
        {page === "futures" && (
          <div style={{ padding: "0 0 120px" }}>
            <div style={{ padding: "20px 20px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Futures</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>NCAA Tournament winner picks</div>
                </div>
                {isAdmin && (
                  <button onClick={fetchFuturesOdds} disabled={futuresOddsLoading} style={{ background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.4)", borderRadius: 10, padding: "8px 14px", color: "#facc15", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", letterSpacing: 0.5, opacity: futuresOddsLoading ? 0.5 : 1 }}>
                    {futuresOddsLoading ? "Loading..." : "Refresh Odds"}
                  </button>
                )}
              </div>
            </div>

            {/* Group consensus card */}
            {futuresPicks.length > 0 && (() => {
              const counts = {};
              futuresPicks.forEach(p => { counts[p.team] = (counts[p.team] || []).concat(p.username); });
              const sorted = Object.entries(counts).sort((a,b) => b[1].length - a[1].length);
              const top = sorted[0];
              return top[1].length >= 2 ? (
                <div style={{ margin: "16px 20px 0", background: "linear-gradient(135deg, rgba(250,204,21,0.12), rgba(250,204,21,0.06))", border: "1px solid rgba(250,204,21,0.35)", borderRadius: 16, padding: "16px 20px" }}>
                  <div style={{ fontSize: 10, color: "rgba(250,204,21,0.7)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Group Consensus</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{top[0]}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
                        {top[1].join(", ")}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: "#facc15" }}>{top[1].length}</div>
                      <div style={{ fontSize: 10, color: "rgba(250,204,21,0.6)", letterSpacing: 1 }}>AGREE</div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* My picks */}
            {myFuturesPicks.length > 0 && (
              <div style={{ margin: "16px 20px 0" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Your Picks</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {myFuturesPicks.map(p => (
                    <div key={p.team} style={{ background: p.result === "win" ? "rgba(74,222,128,0.12)" : p.result === "loss" ? "rgba(248,113,113,0.08)" : "rgba(30,144,255,0.12)", border: `1px solid ${p.result === "win" ? "rgba(74,222,128,0.35)" : p.result === "loss" ? "rgba(248,113,113,0.3)" : "rgba(30,144,255,0.3)"}`, borderRadius: 12, padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: p.result === "win" ? "#4ade80" : p.result === "loss" ? "#f87171" : "#bae6fd" }}>{p.team}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{p.odds}</div>
                        {p.result === "win" && <div style={{ fontSize: 12 }}>✅</div>}
                        {p.result === "loss" && <div style={{ fontSize: 12 }}>❌</div>}
                        {!p.result && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>🔒</div>}
                      </div>
                      {p.note && <div style={{ fontSize: 11, color: "rgba(250,204,21,0.65)", marginTop: 4, fontStyle: "italic" }}>"{p.note}"</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All picks by team */}
            {futuresPicks.length > 0 && (() => {
              const byTeam = {};
              futuresPicks.forEach(p => {
                if (!byTeam[p.team]) byTeam[p.team] = { pickers: [], result: p.result, odds: p.odds };
                byTeam[p.team].pickers.push(p.username);
              });
              const hasAnyPicks = Object.keys(byTeam).length > 0;
              return hasAnyPicks ? (
                <div style={{ margin: "20px 20px 0" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>All Picks</div>
                  {Object.entries(byTeam).sort((a,b) => b[1].pickers.length - a[1].pickers.length).map(([team, { pickers, result, odds }]) => (
                    <div key={team} style={{ background: result === "win" ? "rgba(74,222,128,0.08)" : result === "loss" ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.04)", border: `1px solid ${result === "win" ? "rgba(74,222,128,0.25)" : result === "loss" ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: result === "win" ? "#4ade80" : result === "loss" ? "#f87171" : "#fff" }}>{team}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{odds}</div>
                          {result === "win" && <div style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6, padding: "2px 7px" }}>WIN</div>}
                          {result === "loss" && <div style={{ fontSize: 11, fontWeight: 700, color: "#f87171", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 6, padding: "2px 7px" }}>OUT</div>}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {pickers.map(u => {
                            const pick = futuresPicks.find(p => p.username === u && p.team === team);
                            return (
                              <div key={u} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <span onClick={() => openPlayerProfile(u)} style={{ background: "rgba(30,144,255,0.12)", border: "1px solid rgba(30,144,255,0.22)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#bae6fd", cursor: "pointer" }}>{u}</span>
                                {pick?.note && <span style={{ fontSize: 10, color: "rgba(250,204,21,0.6)", fontStyle: "italic", paddingLeft: 4 }}>"{pick.note}"</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: pickers.length >= 2 ? "#facc15" : "rgba(255,255,255,0.4)" }}>{pickers.length}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>PICK{pickers.length !== 1 ? "S" : ""}</div>
                        {isAdmin && !result && (
                          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                            <button onClick={() => gradeFuture(team, "win")} style={{ background: "rgba(74,222,128,0.2)", border: "1px solid rgba(74,222,128,0.4)", borderRadius: 6, color: "#4ade80", fontSize: 10, fontWeight: 700, padding: "3px 8px", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>W</button>
                            <button onClick={() => gradeFuture(team, "loss")} style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.35)", borderRadius: 6, color: "#f87171", fontSize: 10, fontWeight: 700, padding: "3px 8px", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>OUT</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null;
            })()}

            {/* Team picker */}
            {!viewerMode && (
              <div style={{ margin: "20px 20px 0" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>
                  {futuresTeams.length > 0 ? "Pick a Team" : "No odds available yet"}
                </div>
                {futuresTeams.length > 0 && (
                  <>
                    <input
                      type="text"
                      placeholder="Search teams..."
                      value={futuresSearch}
                      onChange={e => setFuturesSearch(e.target.value)}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, fontFamily: "Outfit, sans-serif", outline: "none", marginBottom: 12 }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {futuresTeams
                        .filter(t => t.team.toLowerCase().includes(futuresSearch.toLowerCase()))
                        .map(t => {
                          const alreadyPicked = myFuturesPicks.some(p => p.team === t.team);
                          const pickerCount = futuresPicks.filter(p => p.team === t.team).length;
                          return (
                            <button key={t.team} onClick={() => { if(!alreadyPicked){ setFuturesPendingPick({team:t.team,odds:t.odds}); setFuturesNote(""); }}} style={{ background: alreadyPicked ? "rgba(30,144,255,0.18)" : futuresPendingPick?.team===t.team ? "rgba(30,144,255,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${alreadyPicked ? "rgba(30,144,255,0.45)" : futuresPendingPick?.team===t.team ? "rgba(30,144,255,0.6)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: alreadyPicked ? "default" : "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.15s" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {alreadyPicked && <div style={{ fontSize: 12 }}>🔒</div>}
                                <div style={{ fontSize: 14, fontWeight: 600, color: alreadyPicked ? "#bae6fd" : "#fff", textAlign: "left" }}>{t.team}</div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                {pickerCount > 0 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{pickerCount} picked</div>}
                                <div style={{ fontSize: 13, fontWeight: 700, color: t.odds.startsWith("+") ? "#4ade80" : "#f87171" }}>{t.odds}</div>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </>
                )}
                {futuresTeams.length === 0 && !futuresLoading && isAdmin && (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                    Tap "Refresh Odds" to load tournament futures
                  </div>
                )}
                {futuresLoading && (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Loading...</div>
                )}
              </div>
            )}

            {/* Confirmation sheet */}
            {futuresPendingPick && (
              <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setFuturesPendingPick(null)}>
                <div onClick={e => e.stopPropagation()} style={{ background: "#0d0b1e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "22px 22px 0 0", width: "100%", maxWidth: 520, padding: "24px 24px 40px" }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 22px" }} />
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Lock In Future</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{futuresPendingPick.team}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: futuresPendingPick.odds.startsWith("+") ? "#4ade80" : "#f87171" }}>{futuresPendingPick.odds}</div>
                  </div>

                  {/* Warning */}
                  <div style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 16, flexShrink: 0 }}>⚠️</div>
                    <div style={{ fontSize: 12, color: "rgba(250,204,21,0.8)", lineHeight: 1.5 }}>
                      Futures picks are <strong>permanent</strong>. You cannot change or remove this pick after submitting.
                    </div>
                  </div>

                  {/* Note */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Note <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>(optional)</span></div>
                    <input
                      type="text"
                      maxLength={120}
                      placeholder="Optional — enter your real line or strategy for this pick"
                      value={futuresNote}
                      onChange={e => setFuturesNote(e.target.value)}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, fontFamily: "Outfit, sans-serif", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setFuturesPendingPick(null)} style={{ flex: 1, padding: "13px 0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                      Cancel
                    </button>
                    <button onClick={() => submitFuturesPick(futuresPendingPick.team, futuresPendingPick.odds, futuresNote)} style={{ flex: 2, padding: "13px 0", background: "linear-gradient(135deg, rgba(30,144,255,0.4), rgba(14,165,233,0.35))", border: "1px solid rgba(30,144,255,0.55)", borderRadius: 12, color: "#e0f2fe", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                      🔒 Lock It In
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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
