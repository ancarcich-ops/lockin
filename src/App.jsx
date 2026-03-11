]import { useState, useEffect, useRef } from "react";
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

const TODAY_LABEL = new Date().toLocaleDateString("en-US", {
  weekday: "long", month: "long", day: "numeric", year: "numeric",
});

const TODAY_DATE = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const ADMIN_PASSWORD = "football4";


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
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 14, fontStyle: "italic" }}>This player's picks are private — you can see which games they bet but not which side.</div>
            {keys.map(key => {
              const [gid] = key.split("__");
              const g = games.find(x => x.id === gid);
              return g ? (
                <div key={key} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{g.away} @ {g.home}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 2 }}>{g.time} ET · Pick hidden</div>
                </div>
              ) : null;
            })}
          </div>
        ) : (
          keys.map(key => {
            const info = getLabel(key);
            return (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "rgba(30,144,255,0.08)", border: "1px solid rgba(30,144,255,0.15)", borderRadius: 10, marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e0f2fe" }}>{info.label} {info.line}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{info.game?.away} @ {info.game?.home}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

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

  // App
  const [page, setPage]                     = useState("picks");
  const [viewingPlayer, setViewingPlayer]   = useState(null); // username string or null
  const [games, setGames]                   = useState(SAMPLE_GAMES);
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
  const [playResults, setPlayResults]       = useState({});

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
        // Read username directly from session metadata — no network call needed
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
    // Construct fake email directly — no DB lookup needed
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
    setMyPicks(null); setSelectedPicks({}); setPage("picks"); setIsAdmin(false);
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
  useEffect(() => {
    if (!session) return;
    fetchOdds();
  }, [session]);

  async function fetchOdds() {
    const apiKey = import.meta.env.VITE_ODDS_API_KEY;
    if (!apiKey) return; // Fall back to SAMPLE_GAMES
    setOddsLoading(true); setOddsError(null);
    try {
      // Fetch NCAAB + NBA games for today
      const sports = ["basketball_ncaab", "basketball_nba"];
      const allGames = [];
      for (const sport of sports) {
        const res = await fetch(
          `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=us&markets=spreads,totals,h2h&oddsFormat=american&dateFormat=iso`
        );
        if (!res.ok) continue;
        const data = await res.json();
        // Filter to today's games only
        const todayStr = TODAY_DATE;
        const todayGames = data.filter(g => g.commence_time.startsWith(todayStr));
        todayGames.forEach((g, i) => {
          const h2h = g.bookmakers?.[0]?.markets?.find(m => m.key === "h2h");
          const spreads = g.bookmakers?.[0]?.markets?.find(m => m.key === "spreads");
          const totals = g.bookmakers?.[0]?.markets?.find(m => m.key === "totals");
          const awayTeam = g.away_team;
          const homeTeam = g.home_team;
          const time = new Date(g.commence_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
          const awaySpread = spreads?.outcomes?.find(o => o.name === awayTeam);
          const homeSpread = spreads?.outcomes?.find(o => o.name === homeTeam);
          const over = totals?.outcomes?.find(o => o.name === "Over");
          const awayML = h2h?.outcomes?.find(o => o.name === awayTeam);
          const homeML = h2h?.outcomes?.find(o => o.name === homeTeam);
          allGames.push({
            id: `live_${sport}_${i}`,
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
          });
        });
      }
      if (allGames.length > 0) {
        setGames(allGames);
      }
    } catch (err) {
      console.error("Odds fetch error:", err);
      setOddsError("Could not load live odds — showing default games.");
    } finally {
      setOddsLoading(false);
    }
  }

  // ── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session || !username) return;
    loadData(username);
  }, [session, username]);

  async function loadData(activeUsername) {
    const uname = activeUsername || username;
    if (!uname) { setLoading(false); return; }
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
        // Include all picks for group play tallying; is_public flag controls UI display
        built[row.username] = { selections: row.selections, is_public: row.is_public };
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
    }
    } catch (err) {
      console.error("loadData error:", err);
    } finally {
      setLoading(false);
    }
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

  // ── Realtime ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    const picksSub = supabase.channel("picks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "picks" }, () => {
        supabase.from("picks").select("username, selections, is_public").eq("date", TODAY_DATE).then(({ data }) => {
          if (data) {
            const built = {};
            data.forEach(row => {
              if (row.username === username || row.is_public) {
                built[row.username] = { selections: row.selections, is_public: row.is_public };
              }
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
    setSelectedPicks(prev => {
      const key = `${gameId}__${betType}`;
      const oppKey = `${gameId}__${OPPOSITES[betType]}`;
      const next = { ...prev };
      delete next[oppKey];
      if (next[key]) delete next[key]; else next[key] = true;
      return next;
    });
  }

  async function submitPicks() {
    if (!Object.keys(selectedPicks).length) return;
    const payload = {
      username,
      user_id: session.user.id,
      selections: selectedPicks,
      is_public: isPublic,
      date: TODAY_DATE,
    };
    const { error } = await supabase.from("picks").upsert(payload, { onConflict: "username,date" });
    if (!error) {
      setMyPicks({ selections: selectedPicks, is_public: isPublic });
      setAllPicks(prev => ({
        ...prev,
        [username]: { selections: selectedPicks, is_public: isPublic },
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
      const next = { ...playResults };
      delete next[key];
      setPlayResults(next);
      recomputeRecord(next);
    } else {
      await supabase.from("group_results").upsert({ key, result, date: TODAY_DATE }, { onConflict: "key,date" });
      const next = { ...playResults, [key]: result };
      setPlayResults(next);
      recomputeRecord(next);
    }
  }

  async function deletePicker(personUsername) {
    if (!isAdmin) return;
    await supabase.from("picks").delete().eq("username", personUsername).eq("date", TODAY_DATE);
    const next = { ...allPicks };
    delete next[personUsername];
    setAllPicks(next);
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
      ? people.length >= 4
        ? { color: "#f87171", glow: "rgba(248,113,113,0.4)", border: "rgba(248,113,113,0.4)" }
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
              {game && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{game.away} @ {game.home} · {game.time} ET</div>}
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

  if (!session) return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", fontFamily: "Outfit, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{CSS}</style>
      <div className="orb1" /><div className="orb2" /><div className="orb3" />
      <div className="glass-card pop" style={{ borderRadius: 24, padding: "40px 32px", width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #1E90FF, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 14px", boxShadow: "0 4px 24px rgba(30,144,255,0.4)" }}>🎯</div>
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
        <div style={{ maxWidth: 660, margin: "0 auto", padding: "0 22px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="logo-btn" onClick={handleLogoTap} style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: isAdmin?"linear-gradient(135deg, #f59e0b, #fbbf24)":"linear-gradient(135deg, #1E90FF, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: isAdmin?"0 4px 16px rgba(245,158,11,0.5)":"0 4px 16px rgba(30,144,255,0.4)", transition: "all 0.3s" }}>
              {isAdmin ? "⚡" : "🎯"}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Lock In</div>
              <div style={{ fontSize: 9, color: isAdmin?"rgba(251,191,36,0.7)":"rgba(255,255,255,0.3)", letterSpacing: 0.8, marginTop: 1 }}>{isAdmin ? "ADMIN MODE" : TODAY_LABEL}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "4px", gap: 3, border: "1px solid rgba(255,255,255,0.07)" }}>
              {[["picks","My Picks"],["group","Group Plays"],["players","Players"]].map(([p, label]) => (
                <button key={p} className="nav-btn" onClick={() => setPage(p)} style={{ padding: "8px 14px", background: page===p?"rgba(30,144,255,0.35)":"transparent", border: page===p?"1px solid rgba(30,144,255,0.5)":"1px solid transparent", borderRadius: 9, color: page===p?"#e0f2fe":"rgba(255,255,255,0.38)", fontSize: 12, fontWeight: page===p?600:400, cursor: "pointer", fontFamily: "Outfit, sans-serif", position: "relative", letterSpacing: 0.1 }}>
                  {label}
                  {p==="group" && groupPlays.length>0 && <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, background: "#0ea5e9", borderRadius: "50%", boxShadow: "0 0 8px #0ea5e9" }} />}
                </button>
              ))}
            </div>
            {/* Account switcher */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowAccountMenu(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(30,144,255,0.15)", border: "1px solid rgba(30,144,255,0.3)", borderRadius: 20, padding: "5px 12px 5px 14px", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#bae6fd" }}>{username}</span>
                <span style={{ fontSize: 9, color: "rgba(186,230,253,0.5)", marginTop: 1 }}>▾</span>
              </button>
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
            </div>
          </div>
        </div>

        {submitters.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "7px 22px" }}>
            <div style={{ maxWidth: 660, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase" }}>Filed:</span>
              {submitters.map(s => (
                <span key={s} onClick={() => setViewingPlayer(s)} style={{ background: s===username?"rgba(30,144,255,0.25)":"rgba(30,144,255,0.12)", border: `1px solid ${s===username?"rgba(30,144,255,0.5)":"rgba(30,144,255,0.25)"}`, borderRadius: 20, padding: "2px 10px", fontSize: 11, color: "#bae6fd", fontWeight: s===username?700:400, cursor: "pointer", transition: "all 0.15s" }}>
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
        {page === "picks" && (
          <div className="fade-up">
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>{TODAY_LABEL}</div>

            {/* Odds status */}
            {oddsLoading && (
              <div style={{ textAlign: "center", padding: "12px", fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>⏳ Fetching live odds...</div>
            )}
            {oddsError && (
              <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#fbbf24", marginBottom: 12 }}>⚠ {oddsError}</div>
            )}

            {/* Already submitted — show their picks */}
            {hasSubmitted && (
              <div style={{ marginBottom: 20 }}>
                <div className="glass-card" style={{ borderRadius: 16, padding: "16px 20px", marginBottom: 14, border: "1px solid rgba(30,144,255,0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Your picks are in ✓</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
                        {Object.keys(myPicks.selections).length} play{Object.keys(myPicks.selections).length!==1?"s":""} · {myPicks.is_public ? "🌐 Public" : "🔒 Private"}
                      </div>
                    </div>
                    <button onClick={() => setMyPicks(null)} style={{ padding: "7px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>Edit</button>
                  </div>
                </div>

                {/* Show their picks summary */}
                {Object.keys(myPicks.selections).map(key => {
                  const label = getLabel(key);
                  const [gid] = key.split("__");
                  const game = games.find(g => g.id === gid);
                  return (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "rgba(30,144,255,0.08)", border: "1px solid rgba(30,144,255,0.15)", borderRadius: 10, marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e0f2fe" }}>{label}</div>
                        {game && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{game.away} @ {game.home}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pick entry form */}
            {!hasSubmitted && (
              <>
                <div style={{ position: "relative", marginBottom: 16 }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "rgba(255,255,255,0.25)", pointerEvents: "none" }}>🔍</div>
                  <input className="glass-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams..." style={{ width: "100%", borderRadius: 12, padding: "11px 14px 11px 40px", color: "#fff", fontSize: 13, fontFamily: "Outfit, sans-serif", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>}
                </div>

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
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{game.time} ET</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {gamePicks.length > 0 && <span style={{ background: "linear-gradient(135deg, rgba(30,144,255,0.35), rgba(14,165,233,0.35))", border: "1px solid rgba(30,144,255,0.4)", borderRadius: 20, padding: "3px 11px", fontSize: 11, color: "#bae6fd", fontWeight: 600 }}>{gamePicks.length} pick{gamePicks.length!==1?"s":""}</span>}
                          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, display: "inline-block", transform: isOpen?"rotate(180deg)":"rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)" }}>▾</span>
                        </div>
                      </div>
                      {isOpen && (
                        <div style={{ padding: "16px 18px 18px" }} className="expand">
                          {[["Spread",["spread_away","spread_home"]],["Total",["over","under"]],["Moneyline",["ml_away","ml_home"]]].map(([catLabel, types]) => (
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
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{ height: 16 }} />
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
              return (
                <div className="glass-card" style={{ borderRadius: 16, padding: "18px 20px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Group Play Record</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>{record.wins}-{record.losses}{record.pushes>0?`-${record.pushes}`:""}</span>
                        {pct !== null && <span style={{ fontSize: 13, fontWeight: 600, color: record.wins>record.losses?"#86efac":record.losses>record.wins?"#fca5a5":"rgba(255,255,255,0.4)" }}>{pct}%</span>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, textAlign: "center" }}>
                      {[["W",record.wins,"#86efac","rgba(134,239,172,0.15)"],["L",record.losses,"#fca5a5","rgba(252,165,165,0.15)"],["P",record.pushes,"rgba(255,255,255,0.4)","rgba(255,255,255,0.06)"]].map(([lbl,val,color,bg]) => (
                        <div key={lbl} style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 10, padding: "8px 14px", minWidth: 44 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, marginTop: 3 }}>{lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden", display: "flex" }}>
                    {total > 0 && <>
                      <div style={{ width: `${winW}%`, background: "linear-gradient(90deg, #4ade80, #86efac)", transition: "width 0.4s ease" }} />
                      <div style={{ width: `${pushW}%`, background: "rgba(255,255,255,0.2)", transition: "width 0.4s ease" }} />
                      <div style={{ width: `${lossW}%`, background: "linear-gradient(90deg, #f87171, #fca5a5)", transition: "width 0.4s ease" }} />
                    </>}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>
                    {isAdmin ? "Tap W / L / P on each play to grade results" : "Results graded by admin after games finish"}
                  </div>
                </div>
              );
            })()}

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
                  <PlayCard key={key} playKey={key} people={people} dissenters={dissenters} index={i} dimmed={false} onPlayerClick={setViewingPlayer} />
                ))}
              </>
            )}

            {/* Other plays */}
            {otherPlays.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 10, marginTop: groupPlays.length>0?24:0 }}>Other Plays</div>
                {otherPlays.map(([key, people, dissenters], i) => (
                  <PlayCard key={key} playKey={key} people={people} dissenters={dissenters} index={i} dimmed={true} onPlayerClick={setViewingPlayer} />
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
                    <button onClick={() => setViewingPlayer(s)} style={{ padding: "8px 16px", background: "rgba(30,144,255,0.15)", border: "1px solid rgba(30,144,255,0.3)", borderRadius: 10, color: "#bae6fd", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit, sans-serif", transition: "all 0.15s" }}>
                      View →
                    </button>
                  </div>
                  {/* Preview picks — public only */}
                  {!isPrivate && keys.length > 0 && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 20px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {keys.slice(0, 4).map(key => {
                        const [gid, bt] = key.split("__");
                        const g = games.find(x => x.id === gid);
                        if (!g) return null;
                        const BT = { spread_away: (g) => ({ label: g.away, line: g.spread.away }), spread_home: (g) => ({ label: g.home, line: g.spread.home }), over: (g) => ({ label: "Over", line: g.total }), under: (g) => ({ label: "Under", line: g.total }), ml_away: (g) => ({ label: g.away, line: `ML ${g.ml.away}` }), ml_home: (g) => ({ label: g.home, line: `ML ${g.ml.home}` }) };
                        const { label, line } = BT[bt](g);
                        return (
                          <span key={key} style={{ background: "rgba(30,144,255,0.1)", border: "1px solid rgba(30,144,255,0.2)", borderRadius: 20, padding: "3px 11px", fontSize: 11, color: "#bae6fd" }}>
                            {label} {line}
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
              Lock In →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
