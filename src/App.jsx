import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// ─── SAMPLE GAMES ────────────────────────────────────────────────────────────
// Replace this array daily with real lines, or wire up an API later.
const SAMPLE_GAMES = [
  { id: "g1",  away: "Alcorn State",  home: "Alabama St",         time: "11:00 AM", spread: { away: "+6.5",  home: "-6.5"  }, total: "143.5", ml: { away: "+220",  home: "-270"  } },
  { id: "g2",  away: "Campbell",      home: "Monmouth",           time: "11:00 AM", spread: { away: "+2.5",  home: "-2.5"  }, total: "N/A",   ml: { away: "+118",  home: "-138"  } },
  { id: "g3",  away: "New Orleans",   home: "Texas A&M-CC",       time: "3:00 PM",  spread: { away: "+2.5",  home: "-2.5"  }, total: "N/A",   ml: { away: "+115",  home: "-135"  } },
  { id: "g4",  away: "N Kentucky",    home: "Wright State",       time: "3:00 PM",  spread: { away: "+1.5",  home: "-1.5"  }, total: "N/A",   ml: { away: "+108",  home: "-128"  } },
  { id: "g5",  away: "Furman",        home: "E Tennessee St",     time: "4:00 PM",  spread: { away: "+1.5",  home: "-1.5"  }, total: "N/A",   ml: { away: "+108",  home: "-128"  } },
  { id: "g6",  away: "GA Southern",   home: "Troy",               time: "4:00 PM",  spread: { away: "+6.5",  home: "-6.5"  }, total: "N/A",   ml: { away: "+220",  home: "-270"  } },
  { id: "g7",  away: "N. Colorado",   home: "Montana",            time: "4:00 PM",  spread: { away: "-3.5",  home: "+3.5"  }, total: "151.5", ml: { away: "-175",  home: "+148"  } },
  { id: "g8",  away: "MS Valley St",  home: "Grambling St",       time: "4:30 PM",  spread: { away: "+12.5", home: "-12.5" }, total: "N/A",   ml: { away: "+450",  home: "-600"  } },
  { id: "g9",  away: "Towson",        home: "Hofstra",            time: "5:30 PM",  spread: { away: "+3.5",  home: "-3.5"  }, total: "N/A",   ml: { away: "+148",  home: "-175"  } },
  { id: "g10", away: "Nicholls St",   home: "UT Rio Grande Valley", time: "5:30 PM", spread: { away: "+7.5", home: "-7.5"  }, total: "N/A",   ml: { away: "+240",  home: "-295"  } },
  { id: "g11", away: "Oregon St",     home: "Gonzaga",            time: "5:30 PM",  spread: { away: "+19",   home: "-19"   }, total: "N/A",   ml: { away: "+900",  home: "-1400" } },
  { id: "g12", away: "Detroit",       home: "Robert Morris",      time: "6:00 PM",  spread: { away: "+5",    home: "-5"    }, total: "N/A",   ml: { away: "+175",  home: "-215"  } },
  { id: "g13", away: "Weber State",   home: "E. Washington",      time: "6:30 PM",  spread: { away: "+2.5",  home: "-2.5"  }, total: "N/A",   ml: { away: "+118",  home: "-138"  } },
  { id: "g14", away: "Santa Clara",   home: "Saint Mary's",       time: "7:00 PM",  spread: { away: "+4.5",  home: "-4.5"  }, total: "N/A",   ml: { away: "+160",  home: "-195"  } },
];

const BET_TYPES = {
  spread_away: (g) => ({ label: g.away, line: g.spread.away }),
  spread_home: (g) => ({ label: g.home, line: g.spread.home }),
  over:        (g) => ({ label: "Over",  line: g.total }),
  under:       (g) => ({ label: "Under", line: g.total }),
  ml_away:     (g) => ({ label: g.away,  line: `ML ${g.ml.away}` }),
  ml_home:     (g) => ({ label: g.home,  line: `ML ${g.ml.home}` }),
};

const OPPOSITES = {
  spread_away: "spread_home", spread_home: "spread_away",
  over: "under", under: "over",
  ml_away: "ml_home", ml_home: "ml_away",
};

const TODAY = new Date().toLocaleDateString("en-US", {
  weekday: "long", month: "long", day: "numeric", year: "numeric",
});

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]                 = useState("picks");
  const [games]                         = useState(SAMPLE_GAMES);
  const [allPicks, setAllPicks]         = useState({});   // { name: { "g1__spread_away": true, ... } }
  const [name, setName]                 = useState("");
  const [selectedPicks, setSelectedPicks] = useState({});
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const [expandedGame, setExpandedGame] = useState(null);
  const [search, setSearch]             = useState("");
  const [record, setRecord]             = useState({ wins: 0, losses: 0, pushes: 0 });
  const [playResults, setPlayResults]   = useState({});   // { "g1__spread_away": "win"|"loss"|"push" }

  // ── Load all picks + results on mount ──────────────────────────────────────
  useEffect(() => {
    async function load() {
      // Load all picks rows
      const { data: picksRows } = await supabase
        .from("picks")
        .select("name, selections");

      if (picksRows) {
        const built = {};
        picksRows.forEach(row => { built[row.name] = row.selections; });
        setAllPicks(built);
      }

      // Load results
      const { data: resultsRows } = await supabase
        .from("group_results")
        .select("key, result");

      if (resultsRows) {
        const built = {};
        resultsRows.forEach(row => { built[row.key] = row.result; });
        setPlayResults(built);
        // Recompute record
        const rec = { wins: 0, losses: 0, pushes: 0 };
        Object.values(built).forEach(r => {
          if (r === "win") rec.wins++;
          else if (r === "loss") rec.losses++;
          else if (r === "push") rec.pushes++;
        });
        setRecord(rec);
      }

      setLoading(false);
    }
    load();
  }, []);

  // ── Realtime subscription so all group members see updates live ────────────
  useEffect(() => {
    const picksSub = supabase
      .channel("picks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "picks" }, () => {
        // Re-fetch all picks when anything changes
        supabase.from("picks").select("name, selections").then(({ data }) => {
          if (data) {
            const built = {};
            data.forEach(row => { built[row.name] = row.selections; });
            setAllPicks(built);
          }
        });
      })
      .subscribe();

    const resultsSub = supabase
      .channel("results-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "group_results" }, () => {
        supabase.from("group_results").select("key, result").then(({ data }) => {
          if (data) {
            const built = {};
            data.forEach(row => { built[row.key] = row.result; });
            setPlayResults(built);
            const rec = { wins: 0, losses: 0, pushes: 0 };
            Object.values(built).forEach(r => {
              if (r === "win") rec.wins++;
              else if (r === "loss") rec.losses++;
              else if (r === "push") rec.pushes++;
            });
            setRecord(rec);
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(picksSub);
      supabase.removeChannel(resultsSub);
    };
  }, []);

  // ── Filtered games for search ──────────────────────────────────────────────
  const filteredGames = games.filter(g =>
    g.away.toLowerCase().includes(search.toLowerCase()) ||
    g.home.toLowerCase().includes(search.toLowerCase())
  );

  // ── Pick toggling ──────────────────────────────────────────────────────────
  function togglePick(gameId, betType) {
    setSelectedPicks(prev => {
      const key = `${gameId}__${betType}`;
      const oppKey = `${gameId}__${OPPOSITES[betType]}`;
      const next = { ...prev };
      delete next[oppKey];
      if (next[key]) delete next[key]; else next[key] = true;
      return next;
    });
  }

  // ── Submit picks to Supabase ───────────────────────────────────────────────
  async function submitPicks() {
    if (!name.trim() || !Object.keys(selectedPicks).length) return;

    // Upsert so re-submitting the same name overwrites previous picks
    const { error } = await supabase
      .from("picks")
      .upsert({ name: name.trim(), selections: selectedPicks }, { onConflict: "name" });

    if (!error) {
      setAllPicks(prev => ({ ...prev, [name.trim()]: selectedPicks }));
      setSubmitted(true);
    } else {
      console.error("Error saving picks:", error);
      alert("Something went wrong saving your picks. Try again.");
    }
  }

  // ── Mark result for a group play ───────────────────────────────────────────
  async function markResult(key, result) {
    const prev = playResults[key];
    const isClear = result === null || prev === result;

    if (isClear) {
      await supabase.from("group_results").delete().eq("key", key);
      const next = { ...playResults };
      delete next[key];
      setPlayResults(next);
      const rec = { wins: 0, losses: 0, pushes: 0 };
      Object.values(next).forEach(r => {
        if (r === "win") rec.wins++;
        else if (r === "loss") rec.losses++;
        else if (r === "push") rec.pushes++;
      });
      setRecord(rec);
    } else {
      await supabase
        .from("group_results")
        .upsert({ key, result }, { onConflict: "key" });
      const next = { ...playResults, [key]: result };
      setPlayResults(next);
      const rec = { wins: 0, losses: 0, pushes: 0 };
      Object.values(next).forEach(r => {
        if (r === "win") rec.wins++;
        else if (r === "loss") rec.losses++;
        else if (r === "push") rec.pushes++;
      });
      setRecord(rec);
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function getLabel(key) {
    const [gid, bt] = key.split("__");
    const g = games.find(x => x.id === gid);
    if (!g) return key;
    const { label, line } = BET_TYPES[bt](g);
    return `${label} ${line}`;
  }

  function getGroupPlays() {
    const tally = {};
    Object.entries(allPicks).forEach(([person, picks]) =>
      Object.keys(picks).forEach(key => {
        if (!tally[key]) tally[key] = [];
        tally[key].push(person);
      })
    );
    const plays = Object.entries(tally)
      .filter(([, p]) => p.length >= 2)
      .sort((a, b) => b[1].length - a[1].length);

    return plays.map(([key, people]) => {
      const [gid, bt] = key.split("__");
      const oppKey = `${gid}__${OPPOSITES[bt]}`;
      const dissenters = Object.entries(allPicks)
        .filter(([, picks]) => picks[oppKey])
        .map(([person]) => person);
      return [key, people, dissenters];
    });
  }

  const groupPlays  = getGroupPlays();
  const submitters  = Object.keys(allPicks);
  const pickCount   = Object.keys(selectedPicks).length;
  const canSubmit   = name.trim() && pickCount > 0;

  // ── Styles ─────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body { background: #0d0b1e; font-family: 'Outfit', sans-serif; }

    .orb1 { position: fixed; top: -180px; left: -120px; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(30,144,255,0.32) 0%, transparent 68%); pointer-events: none; z-index: 0; }
    .orb2 { position: fixed; bottom: -140px; right: -80px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 68%); pointer-events: none; z-index: 0; }
    .orb3 { position: fixed; top: 40%; left: 60%; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 68%); pointer-events: none; z-index: 0; }

    .glass-nav   { background: rgba(13,11,30,0.88); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(255,255,255,0.07); }
    .glass-card  { background: rgba(255,255,255,0.045); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.09); }
    .glass-card-open { background: rgba(255,255,255,0.06); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(30,144,255,0.3); }
    .glass-input { background: rgba(255,255,255,0.06); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; }
    .glass-input:focus { border-color: rgba(30,144,255,0.7) !important; box-shadow: 0 0 0 3px rgba(30,144,255,0.15), 0 0 20px rgba(30,144,255,0.1) !important; outline: none; }
    .glass-bottom { background: rgba(13,11,30,0.92); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(255,255,255,0.08); }

    .game-row  { transition: all 0.18s cubic-bezier(0.4,0,0.2,1); cursor: pointer; }
    .game-row:hover { background: rgba(255,255,255,0.04) !important; }

    .pick-btn  { transition: all 0.14s cubic-bezier(0.4,0,0.2,1); cursor: pointer; }
    .pick-btn:hover:not(.active) { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; transform: translateY(-1px); }
    .pick-btn.active { transform: scale(1.01); }

    .sub-btn { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
    .sub-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(30,144,255,0.55) !important; }
    .sub-btn:active:not(:disabled) { transform: translateY(0); }

    .nav-btn { transition: all 0.15s; }
    .nav-btn:hover { color: rgba(255,255,255,0.9) !important; }

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

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0b1e" }}>
      <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)" }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "Outfit, sans-serif", paddingBottom: page === "picks" && !submitted ? 100 : 0 }}>
      <style>{css}</style>
      <div className="orb1" /><div className="orb2" /><div className="orb3" />

      {/* ── NAV ── */}
      <div className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 22px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg, #1E90FF 0%, #0ea5e9 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 16px rgba(30,144,255,0.4)" }}>🎯</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Lock In</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 0.8, marginTop: 1 }}>{TODAY}</div>
            </div>
          </div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "4px", gap: 3, border: "1px solid rgba(255,255,255,0.07)" }}>
            {[["picks", "My Picks"], ["group", "Group Plays"]].map(([p, label]) => (
              <button key={p} className="nav-btn" onClick={() => { setPage(p); if (p === "picks") setSubmitted(false); }} style={{ padding: "8px 18px", background: page === p ? "rgba(30,144,255,0.35)" : "transparent", border: page === p ? "1px solid rgba(30,144,255,0.5)" : "1px solid transparent", borderRadius: 9, color: page === p ? "#e0f2fe" : "rgba(255,255,255,0.38)", fontSize: 13, fontWeight: page === p ? 600 : 400, cursor: "pointer", fontFamily: "Outfit, sans-serif", position: "relative", letterSpacing: 0.1 }}>
                {label}
                {p === "group" && groupPlays.length > 0 && (
                  <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, background: "#0ea5e9", borderRadius: "50%", boxShadow: "0 0 8px #0ea5e9" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {submitters.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "8px 22px" }}>
            <div style={{ maxWidth: 660, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase" }}>Filed:</span>
              {submitters.map(s => (
                <span key={s} style={{ background: "rgba(30,144,255,0.18)", border: "1px solid rgba(30,144,255,0.35)", borderRadius: 20, padding: "2px 11px", fontSize: 11, color: "#bae6fd", fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "24px 22px", position: "relative", zIndex: 1 }}>

        {/* ═══ PICKS PAGE ═══ */}
        {page === "picks" && !submitted && (
          <div className="fade-up">
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>{TODAY}</div>

            {/* Name */}
            <div className="glass-card" style={{ borderRadius: 16, padding: "18px 20px", marginBottom: 14 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 1.8, textTransform: "uppercase", display: "block", marginBottom: 9 }}>Your name</label>
              <input className="glass-input" value={name} onChange={e => setName(e.target.value)} placeholder="Who's picking?" style={{ width: "100%", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "Outfit, sans-serif", fontWeight: 500 }} />
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "rgba(255,255,255,0.25)", pointerEvents: "none" }}>🔍</div>
              <input className="glass-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams..." style={{ width: "100%", borderRadius: 12, padding: "11px 14px 11px 40px", color: "#fff", fontSize: 13, fontFamily: "Outfit, sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
              )}
            </div>

            {/* Sport tag */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ background: "linear-gradient(135deg, rgba(30,144,255,0.4), rgba(14,165,233,0.4))", border: "1px solid rgba(30,144,255,0.4)", borderRadius: 6, padding: "3px 10px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#bae6fd", textTransform: "uppercase" }}>NCAAB</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{filteredGames.length} game{filteredGames.length !== 1 ? "s" : ""}{search ? " found" : " today"}</span>
            </div>

            {filteredGames.length === 0 && (
              <div className="glass-card" style={{ borderRadius: 16, padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🔎</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>No games match "{search}"</div>
              </div>
            )}

            {/* Game cards */}
            {filteredGames.map((game) => {
              const isOpen = expandedGame === game.id;
              const gamePicks = Object.keys(selectedPicks).filter(k => k.startsWith(game.id));
              return (
                <div key={game.id} className={isOpen ? "glass-card-open" : "glass-card"} style={{ borderRadius: 16, marginBottom: 10, overflow: "hidden", transition: "border-color 0.2s, background 0.2s" }}>
                  <div className="game-row" onClick={() => setExpandedGame(isOpen ? null : game.id)} style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: isOpen ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: -0.2 }}>
                        {game.away} <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 300 }}>@</span> {game.home}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{game.time} ET</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {gamePicks.length > 0 && (
                        <span style={{ background: "linear-gradient(135deg, rgba(30,144,255,0.35), rgba(14,165,233,0.35))", border: "1px solid rgba(30,144,255,0.4)", borderRadius: 20, padding: "3px 11px", fontSize: 11, color: "#bae6fd", fontWeight: 600 }}>
                          {gamePicks.length} pick{gamePicks.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)" }}>▾</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: "16px 18px 18px" }} className="expand">
                      {[["Spread", ["spread_away", "spread_home"]], ["Total", ["over", "under"]], ["Moneyline", ["ml_away", "ml_home"]]].map(([catLabel, types]) => (
                        <div key={catLabel} style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(30,144,255,0.8)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{catLabel}</div>
                          <div style={{ display: "flex", gap: 8 }}>
                            {types.map(bt => {
                              const { label: l, line } = BET_TYPES[bt](game);
                              const key = `${game.id}__${bt}`;
                              const active = !!selectedPicks[key];
                              return (
                                <button key={bt} className={`pick-btn${active ? " active" : ""}`} onClick={() => togglePick(game.id, bt)} style={{ flex: 1, padding: "12px 14px", borderRadius: 12, border: `1px solid ${active ? "rgba(30,144,255,0.7)" : "rgba(255,255,255,0.09)"}`, background: active ? "rgba(30,144,255,0.22)" : "rgba(255,255,255,0.04)", cursor: "pointer", fontFamily: "Outfit, sans-serif", textAlign: "center", boxShadow: active ? "0 0 16px rgba(30,144,255,0.2)" : "none" }}>
                                  <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#e0f2fe" : "rgba(255,255,255,0.75)" }}>{l}</div>
                                  <div style={{ fontSize: 13, color: active ? "#bae6fd" : "rgba(255,255,255,0.3)", marginTop: 3, fontWeight: active ? 600 : 400 }}>{line}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ height: 16 }} />
          </div>
        )}

        {/* Submitted state */}
        {page === "picks" && submitted && (
          <div style={{ textAlign: "center", padding: "90px 20px" }} className="pop">
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, rgba(30,144,255,0.35), rgba(14,165,233,0.35))", border: "1px solid rgba(30,144,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", fontSize: 30, boxShadow: "0 0 32px rgba(30,144,255,0.25)" }}>✓</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5, marginBottom: 8 }}>Locked in, {name}.</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 36 }}>
              {pickCount} play{pickCount !== 1 ? "s" : ""} submitted{groupPlays.length > 0 ? ` · ${groupPlays.length} group play${groupPlays.length !== 1 ? "s" : ""} so far` : ""}
            </div>
            <button onClick={() => setPage("group")} style={{ padding: "14px 32px", background: "linear-gradient(135deg, #1E90FF, #0ea5e9)", border: "none", borderRadius: 14, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", boxShadow: "0 8px 28px rgba(30,144,255,0.45)", letterSpacing: 0.2 }}>
              View Group Plays →
            </button>
          </div>
        )}

        {/* ═══ GROUP PAGE ═══ */}
        {page === "group" && (
          <div className="fade-up">
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{TODAY}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Group Plays</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Plays where 2 or more people agree</div>
            </div>

            {/* Record tracker */}
            {(() => {
              const total = record.wins + record.losses + record.pushes;
              const pct = total > 0 ? Math.round((record.wins / (record.wins + record.losses || 1)) * 100) : null;
              const winW  = total > 0 ? (record.wins   / total) * 100 : 0;
              const lossW = total > 0 ? (record.losses / total) * 100 : 0;
              const pushW = total > 0 ? (record.pushes / total) * 100 : 0;
              return (
                <div className="glass-card" style={{ borderRadius: 16, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Group Play Record</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>{record.wins}-{record.losses}{record.pushes > 0 ? `-${record.pushes}` : ""}</span>
                        {pct !== null && (
                          <span style={{ fontSize: 13, fontWeight: 600, color: record.wins > record.losses ? "#86efac" : record.losses > record.wins ? "#fca5a5" : "rgba(255,255,255,0.4)" }}>{pct}%</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, textAlign: "center" }}>
                      {[["W", record.wins, "#86efac", "rgba(134,239,172,0.15)"], ["L", record.losses, "#fca5a5", "rgba(252,165,165,0.15)"], ["P", record.pushes, "rgba(255,255,255,0.4)", "rgba(255,255,255,0.06)"]].map(([lbl, val, color, bg]) => (
                        <div key={lbl} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 10, padding: "8px 14px", minWidth: 44 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, marginTop: 3 }}>{lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden", display: "flex" }}>
                    {total > 0 ? (
                      <>
                        <div style={{ width: `${winW}%`,  background: "linear-gradient(90deg, #4ade80, #86efac)", transition: "width 0.4s ease" }} />
                        <div style={{ width: `${pushW}%`, background: "rgba(255,255,255,0.2)",                   transition: "width 0.4s ease" }} />
                        <div style={{ width: `${lossW}%`, background: "linear-gradient(90deg, #f87171, #fca5a5)", transition: "width 0.4s ease" }} />
                      </>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>Mark results on each play below to track your record</div>
                </div>
              );
            })()}

            {groupPlays.length === 0 ? (
              <div className="glass-card" style={{ borderRadius: 16, padding: "60px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 42, marginBottom: 14 }}>🤝</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>No group plays yet</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>Need at least 2 people on the same side.</div>
              </div>
            ) : (
              groupPlays.map(([key, people, dissenters], i) => {
                const [gid, bt] = key.split("__");
                const game = games.find(g => g.id === gid);
                const label = getLabel(key);
                const oppLabel = getLabel(`${gid}__${OPPOSITES[bt]}`);
                const heat = people.length >= 4
                  ? { color: "#f87171", glow: "rgba(248,113,113,0.4)", border: "rgba(248,113,113,0.4)" }
                  : people.length >= 3
                  ? { color: "#fb923c", glow: "rgba(251,146,60,0.4)",  border: "rgba(251,146,60,0.4)"  }
                  : { color: "#bae6fd", glow: "rgba(30,144,255,0.4)",  border: "rgba(30,144,255,0.5)"  };
                const result = playResults[key] || null;
                const leftBorder = result === "win" ? "#4ade80" : result === "loss" ? "#f87171" : result === "push" ? "rgba(255,255,255,0.3)" : heat.border;

                return (
                  <div key={key} className="glass-card fade-up" style={{ borderRadius: 16, marginBottom: 10, animationDelay: `${i * 0.06}s`, borderLeft: `3px solid ${leftBorder}`, overflow: "hidden" }}>
                    <div style={{ padding: "20px 20px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 5, letterSpacing: -0.2 }}>{label}</div>
                          {game && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{game.away} @ {game.home} · {game.time} ET</div>}
                        </div>
                        <div style={{ textAlign: "center", minWidth: 54 }}>
                          <div style={{ fontSize: 36, fontWeight: 800, color: heat.color, lineHeight: 1, textShadow: `0 0 20px ${heat.glow}` }}>{people.length}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase" }}>agree</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                        {people.map(p => (
                          <span key={p} style={{ background: "rgba(30,144,255,0.18)", border: "1px solid rgba(30,144,255,0.35)", borderRadius: 20, padding: "4px 13px", fontSize: 11, color: "#bae6fd", fontWeight: 500 }}>{p}</span>
                        ))}
                      </div>

                      {/* Result buttons */}
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1, textTransform: "uppercase", marginRight: 4 }}>Result:</span>
                        {[
                          ["W", "win",  "#4ade80",              "rgba(74,222,128,0.18)",   "rgba(74,222,128,0.4)"],
                          ["L", "loss", "#f87171",              "rgba(248,113,113,0.18)",  "rgba(248,113,113,0.4)"],
                          ["P", "push", "rgba(255,255,255,0.6)","rgba(255,255,255,0.1)",   "rgba(255,255,255,0.3)"],
                        ].map(([lbl, val, color, bg, border]) => (
                          <button key={val} onClick={() => markResult(key, val)} style={{ padding: "5px 13px", borderRadius: 8, border: `1px solid ${result === val ? border : "rgba(255,255,255,0.1)"}`, background: result === val ? bg : "transparent", color: result === val ? color : "rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.15s", boxShadow: result === val ? `0 0 10px ${bg}` : "none" }}>
                            {lbl}
                          </button>
                        ))}
                        {result && (
                          <button onClick={() => markResult(key, null)} style={{ marginLeft: 4, padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "rgba(255,255,255,0.2)", fontSize: 11, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>clear</button>
                        )}
                      </div>
                    </div>

                    {dissenters.length > 0 && (
                      <div style={{ borderTop: "1px solid rgba(251,113,133,0.2)", background: "rgba(251,113,133,0.07)", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "#fda4af", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 14 }}>⚠</span> Disagrees:
                        </span>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          {dissenters.map(p => (
                            <span key={p} style={{ background: "rgba(251,113,133,0.15)", border: "1px solid rgba(251,113,133,0.35)", borderRadius: 20, padding: "3px 11px", fontSize: 11, color: "#fda4af", fontWeight: 500 }}>{p}</span>
                          ))}
                        </div>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>on {oppLabel}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── STICKY BOTTOM SUBMIT BAR ── */}
      {page === "picks" && !submitted && (
        <div className="glass-bottom" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200 }}>
          <div style={{ maxWidth: 660, margin: "0 auto", padding: "14px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: pickCount > 0 ? "#fff" : "rgba(255,255,255,0.3)" }}>
                {pickCount > 0 ? `${pickCount} play${pickCount !== 1 ? "s" : ""} selected` : "No picks yet"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
                {name.trim() ? `Submitting as ${name}` : "Enter your name above"}
              </div>
            </div>
            <button className="sub-btn" disabled={!canSubmit} onClick={submitPicks} style={{ padding: "13px 28px", background: canSubmit ? "linear-gradient(135deg, #1E90FF, #0ea5e9)" : "rgba(255,255,255,0.07)", border: "none", borderRadius: 13, color: canSubmit ? "#fff" : "rgba(255,255,255,0.2)", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "Outfit, sans-serif", letterSpacing: 0.2, boxShadow: canSubmit ? "0 4px 20px rgba(30,144,255,0.4)" : "none" }}>
              Lock In →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
