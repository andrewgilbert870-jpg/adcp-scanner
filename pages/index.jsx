import { useState, useCallback } from "react";
import Head from "next/head";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const STATUS = { PENDING: "pending", CHECKING: "checking", LIVE: "live", NOT_FOUND: "not_found", POSSIBLE: "possible" };

const STATUS_CONFIG = {
  [STATUS.PENDING]:   { label: "Queued",    color: "#334455", dot: "#1A2535" },
  [STATUS.CHECKING]:  { label: "Checking…", color: "#4A9FD4", dot: "#2E6DA4" },
  [STATUS.LIVE]:      { label: "LIVE",      color: "#2a9b45", dot: "#2a9b45" },
  [STATUS.NOT_FOUND]: { label: "Not found", color: "#334455", dot: "#1A2535" },
  [STATUS.POSSIBLE]:  { label: "Possible",  color: "#b87820", dot: "#b87820" },
};

const CAT_COLORS = {
  "News": "#1B3A6B", "Digital Native": "#2A4A7A", "Finance/Business": "#1B5A6B",
  "B2B/Professional": "#2A3A5A", "B2B/Tools": "#2A4A5A", "Lifestyle": "#6B3A5A",
  "Women's Lifestyle": "#8A3A6A", "Youth/Culture": "#2A7A4B", "Entertainment": "#6B1B5A",
  "Gaming": "#3A1B6B", "Community": "#4A5A3A", "Sport": "#8A1B1B", "Travel": "#6B4A1B",
  "Tourism": "#5A4A2A", "Health": "#1B6B3A", "Education": "#3A5A3A", "Reference": "#3A4A3A",
  "Cultural": "#5A3A4A", "Property": "#7A5A1B", "Classifieds": "#6B5A1B", "Portal": "#3A3A6B",
  "Retail Media": "#7A2E1B", "Food/Delivery": "#6B3A2A", "Search/Aggregator": "#1B1B6B",
  "Video": "#6B1B3A", "Social": "#4A1B6B", "Social/Video": "#5A1B5A", "Audio": "#1B6B5A",
  "News Aggregator": "#2A2A6B", "Professional Network": "#1B4A6B", "Government": "#3A3A3A",
  "Events": "#4A5A4A", "Retail": "#7A2E1B", "QSR": "#8A4A1B", "FMCG": "#5A6B1B",
  "Finance": "#1B3A6B", "Fintech": "#1B4A8A", "Insurance": "#4A1B6B",
  "Insurance/Comparison": "#5A2A7A", "Telco": "#1B5A7A", "Auto": "#3A3A6B",
  "Tech": "#1B6B5A", "Tech/Mobility": "#2A7A5A", "Tech/Delivery": "#3A6B2A",
  "Government/Tourism": "#4A5A3A", "Gambling": "#6B1B1B",
};

const COUNTRY_CONFIG = {
  AU: { label: "AU", color: "#1B3A6B" },
  NZ: { label: "NZ", color: "#1B6B3A" },
  ANZ: { label: "ANZ", color: "#5A3A6B" },
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Row({ item, isPublisher }) {
  const sc = STATUS_CONFIG[item.status];
  const catColor = CAT_COLORS[item.category] || "#334";
  const cc = isPublisher ? (COUNTRY_CONFIG[item.country] || COUNTRY_CONFIG.AU) : null;
  const isLive = item.status === STATUS.LIVE;
  const isPossible = item.status === STATUS.POSSIBLE;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 14px",
      background: isLive ? "#0A1F0E" : isPossible ? "#1A1408" : "transparent",
      borderBottom: "1px solid #0D1520",
      transition: "background 0.3s",
    }}>
      <div style={{ width: 24, textAlign: "right", fontSize: 10, color: "#223344", flexShrink: 0 }}>
        {item.rank}
      </div>
      <div style={{
        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
        background: sc.dot,
        boxShadow: isLive ? "0 0 8px #2a9b45" : item.status === STATUS.CHECKING ? "0 0 5px #2E6DA4" : "none",
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: isLive ? "#7bcf8a" : isPossible ? "#d4924a" : "#8899AA" }}>
            {item.name}
          </span>
          <span style={{ fontSize: 9, color: "#334" }}>{item.domain}</span>
          <span style={{
            fontSize: 9, padding: "1px 5px", borderRadius: 2, textTransform: "uppercase", letterSpacing: 0.5,
            background: catColor + "18", color: catColor, border: `1px solid ${catColor}33`
          }}>{item.category}</span>
          {cc && (
            <span style={{
              fontSize: 9, padding: "1px 5px", borderRadius: 2, fontWeight: 700,
              background: cc.color + "22", color: cc.color, border: `1px solid ${cc.color}44`
            }}>{cc.label}</span>
          )}
        </div>
        {item.result?.note && item.status !== STATUS.PENDING && (
          <div style={{ fontSize: 10, color: isLive ? "#4a9b5a" : isPossible ? "#8a6030" : "#334", marginTop: 2 }}>
            {item.result.note}
          </div>
        )}
      </div>
      <div style={{ fontSize: 9, letterSpacing: 1.5, fontWeight: 700, textTransform: "uppercase", color: sc.color, flexShrink: 0 }}>
        {sc.label}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, fileType, scanType, description }) {
  const [items, setItems] = useState([]);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const isPublisher = scanType === "publishers";

  const runScan = useCallback(async () => {
    setRunning(true); setStarted(true); setProgress(0); setFilter("all"); setCountryFilter("all");
    const interval = setInterval(() => setProgress(p => Math.min(p + 1, 88)), 320);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: scanType }),
      });
      const data = await res.json();
      clearInterval(interval); setProgress(100);
      if (data.error) throw new Error(data.error);
      setItems(data.entities.map((e, i) => {
        const r = data.results[i] || { status: "not_found", note: "" };
        return { ...e, status: r.status === "live" ? STATUS.LIVE : r.status === "possible" ? STATUS.POSSIBLE : STATUS.NOT_FOUND, result: r };
      }));
    } catch (e) {
      clearInterval(interval);
      setItems(prev => prev.map(it => ({ ...it, status: STATUS.NOT_FOUND, result: { note: "Scan error" } })));
    }
    setRunning(false);
  }, [scanType]);

  const liveCount = items.filter(i => i.status === STATUS.LIVE).length;
  const possibleCount = items.filter(i => i.status === STATUS.POSSIBLE).length;
  const done = started && !running && items.length === 100;

  const filtered = items.filter(item => {
    const matchCountry = !isPublisher || countryFilter === "all" || item.country === countryFilter;
    const matchStatus = filter === "all" ? true
      : filter === "live" ? item.status === STATUS.LIVE
      : filter === "possible" ? (item.status === STATUS.LIVE || item.status === STATUS.POSSIBLE)
      : true;
    return matchCountry && matchStatus;
  });

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      {/* Panel header */}
      <div style={{
        background: "#0A111D", border: "1px solid #0D1520", borderRadius: "8px 8px 0 0",
        padding: "20px 20px 16px", borderBottom: "none",
      }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: "#334", textTransform: "uppercase", marginBottom: 6 }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#C8D8E8", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 10, color: "#334", marginBottom: 14 }}>
          <span style={{ color: "#4A9FD4" }}>/.well-known/{fileType}</span>
          {" · "}{description}
        </div>

        {/* Stats */}
        {started && (
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[
              { v: liveCount, label: "Live", color: "#2a9b45" },
              { v: possibleCount, label: "Possible", color: "#b87820" },
              { v: done ? 100 - liveCount - possibleCount : "—", label: "Not found", color: "#334" },
            ].map(s => (
              <div key={s.label}>
                <span style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.v}</span>
                <span style={{ fontSize: 9, color: "#334", marginLeft: 5, letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        {started && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ height: 2, background: "#0D1520", borderRadius: 1 }}>
              <div style={{
                height: "100%", borderRadius: 1,
                background: liveCount > 0 ? "linear-gradient(90deg,#1a4a22,#2a9b45)" : "linear-gradient(90deg,#1B3A6B,#4A9FD4)",
                width: `${progress}%`, transition: "width 0.3s ease"
              }} />
            </div>
            <div style={{ fontSize: 9, color: "#334", marginTop: 4 }}>
              {running ? `Processing… ${progress}%` : "Complete"}
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={runScan} disabled={running} style={{
            padding: "7px 16px", background: running ? "transparent" : "#0D1520",
            color: running ? "#334" : "#7AAFC8", border: "1px solid",
            borderColor: running ? "#0D1520" : "#1E3A52", borderRadius: 3,
            fontSize: 9, fontFamily: "inherit", letterSpacing: 2, textTransform: "uppercase",
            cursor: running ? "not-allowed" : "pointer",
          }}>
            {running ? "Scanning…" : started ? "Re-scan" : "Run Scan"}
          </button>

          {isPublisher && started && (
            <>
              {["all", "AU", "NZ", "ANZ"].map(c => (
                <button key={c} onClick={() => setCountryFilter(c)} style={{
                  padding: "5px 8px", borderRadius: 3, fontSize: 9, fontFamily: "inherit",
                  letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
                  background: countryFilter === c ? (c === "NZ" ? "#1B6B3A" : c === "ANZ" ? "#5A3A6B" : "#1B3A6B") : "transparent",
                  color: countryFilter === c ? "#C8D8E8" : "#445566",
                  border: `1px solid ${countryFilter === c ? "#fff3" : "#0D1520"}`,
                }}>{c}</button>
              ))}
            </>
          )}

          {started && (
            <>
              {[{ k: "all", l: "All" }, { k: "live", l: "Live" }, { k: "possible", l: "Live + Possible" }].map(f => (
                <button key={f.k} onClick={() => setFilter(f.k)} style={{
                  padding: "5px 8px", borderRadius: 3, fontSize: 9, fontFamily: "inherit",
                  letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
                  background: filter === f.k ? "#1B3A6B" : "transparent",
                  color: filter === f.k ? "#7AAFC8" : "#445566",
                  border: `1px solid ${filter === f.k ? "#2E6DA4" : "#0D1520"}`,
                }}>{f.l}</button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{
        flex: 1, border: "1px solid #0D1520", borderTop: "1px solid #0D1520",
        borderRadius: "0 0 8px 8px", overflow: "hidden", background: "#070C14",
        maxHeight: 600, overflowY: "auto",
      }}>
        {!started && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#223344", fontSize: 11 }}>
            Press Run Scan to check all 100 {isPublisher ? "publishers" : "advertisers"}
          </div>
        )}
        {started && running && items.length === 0 && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#4A9FD4", fontSize: 11 }}>
            One API call in progress…
          </div>
        )}
        {filtered.map(item => <Row key={`${item.rank}-${item.domain}`} item={item} isPublisher={isPublisher} />)}
        {done && filtered.length === 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "#334", fontSize: 11 }}>No results match filter</div>
        )}
      </div>

      {/* Summary */}
      {done && (
        <div style={{
          marginTop: 8, padding: "10px 14px",
          background: "#0A111D", border: "1px solid #0D1520", borderRadius: 5,
          fontSize: 10, color: "#445566", lineHeight: 1.7,
        }}>
          {liveCount === 0 && possibleCount === 0
            ? `Zero of the top 100 ANZ ${isPublisher ? "publishers" : "advertisers"} have ${fileType} live. ${isPublisher ? "The supply side is currently unreachable by AdCP buyer agents." : "Every brand is invisible to AdCP buyer agents."}`
            : `${liveCount} confirmed live · ${possibleCount} possible · ${100 - liveCount - possibleCount} not found`
          }
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Head>
        <title>ANZ AdCP Readiness Scanner — Systems That Decide</title>
        <meta name="description" content="Live scanner showing which ANZ publishers and advertisers have implemented the Ad Context Protocol (AdCP). Updated in real time." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        fontFamily: "'DM Mono', 'Courier New', monospace",
        background: "#070C14", minHeight: "100vh", color: "#8899AA",
        padding: "0 0 60px",
      }}>
        {/* Masthead */}
        <div style={{
          background: "#0A111D", borderBottom: "1px solid #0D1520",
          padding: "24px 32px 20px",
        }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: 5, color: "#334", textTransform: "uppercase", marginBottom: 8 }}>
                  Systems That Decide · systemsthatdecide.io
                </div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#E8EDF5", letterSpacing: -0.5 }}>
                  ANZ AdCP Readiness Scanner
                </h1>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: "#445566", lineHeight: 1.7, maxWidth: 640 }}>
                  Live intelligence on which ANZ publishers and advertisers have implemented the Ad Context Protocol.
                  Supply side checks <span style={{ color: "#4A9FD4" }}>adagents.json</span>.
                  Demand side checks <span style={{ color: "#4A9FD4" }}>brand.json</span>.
                  Run each scan independently. Data sourced from Ipsos iris, Nielsen Ad Intel, and Similarweb (May 2026).
                </p>
              </div>
              <div style={{ fontSize: 9, color: "#223344", lineHeight: 2, textAlign: "right" }}>
                <div>Protocol: Ad Context Protocol (AdCP)</div>
                <div>Market: Australia + New Zealand</div>
                <div>Sources: Ipsos iris · Nielsen · Similarweb</div>
                <div>Updated: May 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Context strip */}
        <div style={{ background: "#0D1520", borderBottom: "1px solid #0D1520", padding: "10px 32px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { label: "Protocol launched", value: "Oct 2025" },
              { label: "ANZ confirmed live (supply)", value: "1 / 100" },
              { label: "Only confirmed ANZ seller", value: "Yahoo AU" },
              { label: "IAB ARTF status", value: "In development" },
            ].map(s => (
              <div key={s.label}>
                <span style={{ fontSize: 9, color: "#334", letterSpacing: 1, textTransform: "uppercase" }}>{s.label} </span>
                <span style={{ fontSize: 10, color: "#4A9FD4", fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two panels */}
        <div style={{ maxWidth: 1400, margin: "24px auto 0", padding: "0 32px", display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 340 }}>
            <Panel
              title="Publisher Readiness"
              subtitle="Supply Side · Top 100 ANZ Publishers"
              fileType="adagents.json"
              scanType="publishers"
              description="Declares authorized seller agents for AI buyer discovery"
            />
          </div>
          <div style={{ flex: 1, minWidth: 340 }}>
            <Panel
              title="Advertiser Readiness"
              subtitle="Demand Side · Top 100 AU Advertisers"
              fileType="brand.json"
              scanType="advertisers"
              description="Makes brands discoverable and legible to AI buyer agents"
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ maxWidth: 1400, margin: "24px auto 0", padding: "0 32px" }}>
          <div style={{
            padding: "14px 18px", background: "#0A111D",
            border: "1px solid #0D1520", borderRadius: 6,
            fontSize: 9, color: "#223344", lineHeight: 2,
          }}>
            <span style={{ color: "#334" }}>Methodology: </span>
            Browser CORS policy prevents direct HTTP endpoint checks. Results use Claude's knowledge of AdCP founding members, public adoption announcements, and protocol specification as of May 2026.
            {" "}For live verification: <span style={{ color: "#4A9FD4" }}>curl https://[domain]/.well-known/adagents.json</span>
            {" "}or <span style={{ color: "#4A9FD4" }}>curl https://[domain]/.well-known/brand.json</span>
            {" · "}
            <a href="https://adcontextprotocol.org" target="_blank" rel="noopener noreferrer" style={{ color: "#4A9FD4" }}>adcontextprotocol.org</a>
            {" · "}
            <a href="https://systemsthatdecide.io" target="_blank" rel="noopener noreferrer" style={{ color: "#4A9FD4" }}>systemsthatdecide.io</a>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070C14; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070C14; }
        ::-webkit-scrollbar-thumb { background: #1B3A6B; border-radius: 2px; }
        a { text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>
    </>
  );
}
