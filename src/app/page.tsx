"use client";

import { useState } from "react";

const data = {
  visitors: { today: 2847, week: 18432, trend: +12.4 },
  formStarts: { today: 1104, week: 7230, rate: 38.8 },
  dropoffs: { today: 743, week: 4891, rate: 67.3 },
  conversions: { today: 361, week: 2339, rate: 12.7 },
};

const sources = [
  { name: "Organic Search", visitors: 892, pct: 31.3, color: "#00d4c8" },
  { name: "Paid Search", visitors: 741, pct: 26.0, color: "#4f7cff" },
  { name: "Direct", visitors: 498, pct: 17.5, color: "#a78bfa" },
  { name: "Email / Nurture", visitors: 412, pct: 14.5, color: "#f59e0b" },
  { name: "Social", visitors: 193, pct: 6.8, color: "#f472b6" },
  { name: "Referral", visitors: 111, pct: 3.9, color: "#6b7280" },
];

const funnelSteps = [
  { id: "quiz", label: "Quiz Start", count: 1104, pct: 100, drop: null },
  { id: "product", label: "Product Selection", count: 891, pct: 80.7, drop: 19.3 },
  { id: "contact", label: "Contact Info", count: 734, pct: 66.5, drop: 17.6 },
  { id: "insurance", label: "Insurance Upload", count: 612, pct: 55.4, drop: 16.6 },
  { id: "Resupply Cadence", label: "Product Review & Resupply Cadence", count: 529, pct: 47.9, drop: 12.3 },
  { id: "shipping", label: "Shipping", count: 448, pct: 40.6, drop: 15.3 },
  { id: "Order", label: "Order", count: 361, pct: 32.7, drop: 19.4 },
];

const journeyPaths = [
  { path: "Quiz → Product → Contact → Insurance → Rx → Ship → Order", count: 218, pct: 60.4 },
  { path: "Quiz → Product → Contact → Skip Insurance → Rx → Ship → Order", count: 87, pct: 24.1 },
  { path: "Quiz → Product → Contact → Insurance → Rx → Back → Rx → Ship → Order", count: 31, pct: 8.6 },
  { path: "Quiz → Product → Contact → Address Fail → Contact → … → Order", count: 18, pct: 5.0 },
  { path: "Deep-link → Product → Contact → Insurance → Rx → Ship → Order", count: 7, pct: 1.9 },
];

const hourly = [14,22,31,28,19,12,8,7,9,18,32,58,74,88,102,119,134,128,115,97,79,61,44,28];

export default function Dashboard() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
      background: "#ffffff",
      color: "#1d1d1f",
      minHeight: "100vh",
      padding: "0",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; }
        .metric-card { 
          background: #ffffff; 
          border: 1px solid #e2e8f0; 
          border-radius: 8px; 
          padding: 20px 24px; 
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .metric-card:hover { border-color: #cbd5e1; }
        .metric-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
        }
        .metric-card.teal::before { background: linear-gradient(90deg, #00d4c8, transparent); }
        .metric-card.blue::before { background: linear-gradient(90deg, #4f7cff, transparent); }
        .metric-card.amber::before { background: linear-gradient(90deg, #f59e0b, transparent); }
        .metric-card.green::before { background: linear-gradient(90deg, #22c55e, transparent); }
        .tag { 
          font-size: 11px; 
          letter-spacing: 0.08em; 
          text-transform: uppercase; 
          color: #64748b;
          margin-bottom: 8px;
        }
        .big-num {
          font-size: 32px;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }
        .funnel-bar {
          height: 36px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          cursor: pointer;
          transition: opacity 0.15s;
          position: relative;
        }
        .funnel-bar:hover { opacity: 0.85; }
        .funnel-row { 
          display: grid; 
          grid-template-columns: 160px 1fr 80px 80px; 
          gap: 12px;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .funnel-row:last-child { border-bottom: none; }
        .source-row {
          display: grid;
          grid-template-columns: 1fr 60px 70px;
          gap: 8px;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .source-row:last-child { border-bottom: none; }
        .section-header {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-header::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }
        .bar-track {
          background: #e2e8f0;
          border-radius: 4px;
          height: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 4px;
        }
        .pill {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }
        .chip-up { background: rgba(34,197,94,0.12); color: #16a34a; }
        .chip-down { background: rgba(239,68,68,0.12); color: #dc2626; }
        .spark-container { display: flex; align-items: flex-end; gap: 2px; height: 32px; }
        .spark-bar { 
          flex: 1; 
          border-radius: 2px 2px 0 0; 
          transition: opacity 0.15s;
          min-width: 8px;
        }
        .spark-bar:hover { opacity: 0.7; }
        .path-row {
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: 1fr 60px 50px;
          gap: 8px;
          align-items: center;
        }
        .path-row:last-child { border-bottom: none; }
        .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .status-bar {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 10px;
          color: #64748b;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #22c55e;
          animation: pulse 2s infinite;
          display: inline-block;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .header-nav {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 0;
        }
        .nav-tab {
          padding: 14px 18px;
          font-size: 11px;
          letter-spacing: 0.05em;
          cursor: pointer;
          color: #64748b;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
        }
        .nav-tab.active { color: #0891b2; border-bottom-color: #0891b2; }
        .nav-tab:hover:not(.active) { color: #475569; }
      `}</style>

      {/* Status Bar */}
      <div className="status-bar">
        <span><span className="live-dot" style={{marginRight: 6}}/> LIVE</span>
        <span>Last sync: 0:23 ago</span>
        <span style={{marginLeft: 'auto'}}>ENV: PROD</span>
        <span>Amplitude · Tealium · Salesforce</span>
        <span style={{color: '#16a34a'}}>● All systems nominal</span>
      </div>

      {/* Header */}
      <div style={{
        padding: "20px 24px 0",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: 0,
      }}>
        <div>
          <div style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.5px",
            color: "#1d1d1f",
          }}>
            MINIMED / EVENT LOG DASHBOARD
          </div>
          <div style={{fontSize: 11, color: "#64748b", marginTop: 4}}>
            eCommerce Funnel · Day One Operations View
          </div>
        </div>
        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
          <div style={{fontSize: 10, color: "#64748b", textAlign: "right"}}>
            <div>TODAY</div>
            <div style={{color: "#1d1d1f", fontSize: 13, fontWeight: 600}}>
              {new Date().toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}
            </div>
          </div>
          <div style={{
            padding: "6px 14px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            fontSize: 10,
            color: "#2563eb",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}>TODAY ▾</div>
        </div>
      </div>

      {/* Nav */}
      <div className="header-nav" style={{marginTop: 16}}>
        {["OVERVIEW","FUNNEL","SESSIONS","ERRORS","SALESFORCE SYNC"].map((t, i) => (
          <div key={t} className={`nav-tab${i === 0 ? " active" : ""}`}>{t}</div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{padding: "20px 24px", display: "grid", gap: 16}}>

        {/* Top KPI Row */}
        <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12}}>
          {[
            { label: "Unique Visitors", value: "2,847", sub: "18,432 this week", trend: "+12.4%", up: true, cls: "teal" },
            { label: "Form Starts", value: "1,104", sub: "38.8% visit-to-start", trend: "+8.1%", up: true, cls: "blue" },
            { label: "Drop-offs", value: "743", sub: "67.3% of form starts", trend: "-3.2%", up: false, cls: "amber" },
            { label: "Conversions", value: "361", sub: "12.7% overall rate", trend: "+18.9%", up: true, cls: "green" },
          ].map(m => (
            <div key={m.label} className={`metric-card ${m.cls}`}>
              <div className="tag">{m.label}</div>
              <div className="big-num" style={{
                color: m.cls === "teal" ? "#0891b2" : m.cls === "blue" ? "#2563eb" : m.cls === "amber" ? "#d97706" : "#16a34a"
              }}>{m.value}</div>
              <div style={{marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span style={{fontSize: 10, color: "#64748b"}}>{m.sub}</span>
                <span className={`pill ${m.up ? "chip-up" : "chip-down"}`}>{m.up ? "↑" : "↓"} {m.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Hourly Sparkline */}
        <div className="card" style={{padding: "16px 20px"}}>
          <div className="section-header">Hourly Traffic — Today (00:00–23:00)</div>
          <div style={{display: "flex", alignItems: "flex-end", gap: 3, height: 60}}>
            {hourly.map((v, i) => {
              const max = Math.max(...hourly);
              const h = (v / max) * 60;
              const isNow = i === new Date().getHours();
              return (
                <div key={i} style={{
                  flex: 1,
                  height: h,
                  background: isNow ? "#0891b2" : i > new Date().getHours() ? "#e2e8f0" : "#94a3b8",
                  borderRadius: "2px 2px 0 0",
                  position: "relative",
                  cursor: "default",
                  transition: "opacity 0.15s",
                  minWidth: 0,
                }} title={`${String(i).padStart(2,'0')}:00 — ${v} visitors`} />
              );
            })}
          </div>
          <div style={{display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "#94a3b8"}}>
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
        </div>

        {/* Middle Row: Funnel + Sources */}
        <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12}}>

          {/* Funnel */}
          <div className="card" style={{padding: "16px 20px"}}>
            <div className="section-header">Conversion Funnel — Form Starts Today</div>
            <div style={{display: "grid", gridTemplateColumns: "160px 1fr 68px 72px", gap: "0 12px", marginBottom: 8}}>
              <span style={{fontSize: 9, color: "#94a3b8", letterSpacing: "0.08em"}}>STEP</span>
              <span></span>
              <span style={{fontSize: 9, color: "#94a3b8", textAlign: "right", letterSpacing: "0.08em"}}>COUNT</span>
              <span style={{fontSize: 9, color: "#94a3b8", textAlign: "right", letterSpacing: "0.08em"}}>DROP</span>
            </div>
            {funnelSteps.map((step, i) => (
              <div key={step.id}
                className="funnel-row"
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                style={{cursor: "pointer"}}
              >
                <div style={{
                  fontSize: 10,
                  color: activeStep === step.id ? "#0891b2" : "#475569",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>{step.label}</div>
                <div style={{position: "relative"}}>
                  <div className="bar-track">
                    <div className="bar-fill" style={{
                      width: `${step.pct}%`,
                      background: `linear-gradient(90deg, ${
                        i === 0 ? "#00d4c8" :
                        i <= 2 ? "#4f7cff" :
                        i <= 4 ? "#a78bfa" :
                        "#f59e0b"
                      }, transparent)`,
                    }} />
                  </div>
                  {activeStep === step.id && (
                    <div style={{
                      position: "absolute",
                      top: -24,
                      left: `${step.pct}%`,
                      transform: "translateX(-50%)",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 6,
                      padding: "3px 8px",
                      fontSize: 9,
                      color: "#0891b2",
                      whiteSpace: "nowrap",
                      zIndex: 10,
                    }}>{step.pct}% of starts</div>
                  )}
                </div>
                <div style={{fontSize: 11, textAlign: "right", color: "#1d1d1f", fontWeight: 600}}>
                  {step.count.toLocaleString()}
                </div>
                <div style={{textAlign: "right"}}>
                  {step.drop !== null ? (
                    <span style={{
                      fontSize: 10,
                      color: step.drop > 15 ? "#dc2626" : "#d97706",
                      fontWeight: 600,
                    }}>−{step.drop}%</span>
                  ) : (
                    <span style={{color: "#94a3b8", fontSize: 9}}>—</span>
                  )}
                </div>
              </div>
            ))}
            <div style={{
              marginTop: 14,
              padding: "10px 12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{fontSize: 10, color: "#64748b"}}>Quiz Start → Order</span>
              <span style={{fontWeight: 600, fontSize: 14, color: "#16a34a"}}>32.7% end-to-end</span>
            </div>
          </div>

          {/* Sources */}
          <div className="card" style={{padding: "16px 20px"}}>
            <div className="section-header">Traffic Sources</div>
            {sources.map(s => (
              <div key={s.name} className="source-row">
                <div style={{display: "flex", alignItems: "center", gap: 8}}>
                  <span className="dot" style={{background: s.color}} />
                  <span style={{fontSize: 10, color: "#475569"}}>{s.name}</span>
                </div>
                <div style={{fontSize: 11, textAlign: "right", color: "#1d1d1f", fontWeight: 600}}>
                  {s.visitors.toLocaleString()}
                </div>
                <div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width: `${s.pct}%`, background: s.color, opacity: 0.8}} />
                  </div>
                  <div style={{fontSize: 9, color: "#64748b", marginTop: 3, textAlign: "right"}}>{s.pct}%</div>
                </div>
              </div>
            ))}

            {/* Conversion by Source mini table */}
            <div className="section-header" style={{marginTop: 20}}>Conv. Rate by Source</div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 50px 50px", gap: "0 8px", fontSize: 9, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.08em"}}>
              <span>SOURCE</span><span style={{textAlign:"right"}}>CVR%</span><span style={{textAlign:"right"}}>RANK</span>
            </div>
            {[
              { name: "Email / Nurture", cvr: "19.4", rank: 1 },
              { name: "Direct", cvr: "16.1", rank: 2 },
              { name: "Paid Search", cvr: "13.2", rank: 3 },
              { name: "Organic", cvr: "10.8", rank: 4 },
            ].map(r => (
              <div key={r.name} style={{display: "grid", gridTemplateColumns: "1fr 50px 50px", gap: "0 8px", padding: "5px 0", borderBottom: "1px solid #e2e8f0"}}>
                <span style={{fontSize: 10, color: "#475569"}}>{r.name}</span>
                <span style={{textAlign: "right", fontSize: 10, color: "#16a34a", fontWeight: 600}}>{r.cvr}%</span>
                <span style={{textAlign: "right", fontSize: 10, color: "#64748b"}}>#{r.rank}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Page Journeys + Drop-off Detail */}
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>

          {/* Page Journeys */}
          <div className="card" style={{padding: "16px 20px"}}>
            <div className="section-header">Top Page Journeys (Converters Today)</div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 60px 50px", gap: "0 8px", fontSize: 9, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.08em"}}>
              <span>PATH</span><span style={{textAlign:"right"}}>ORDERS</span><span style={{textAlign:"right"}}>SHARE</span>
            </div>
            {journeyPaths.map((j, i) => (
              <div key={i} className="path-row">
                <div style={{fontSize: 9, color: "#475569", lineHeight: 1.5, wordBreak: "break-word"}}>{j.path}</div>
                <div style={{textAlign: "right", fontSize: 11, color: "#1d1d1f", fontWeight: 600}}>{j.count}</div>
                <div style={{textAlign: "right", fontSize: 10, color: "#64748b"}}>{j.pct}%</div>
              </div>
            ))}
          </div>

          {/* Drop-off Detail */}
          <div className="card" style={{padding: "16px 20px"}}>
            <div className="section-header">Drop-off Detail by Step</div>
            {[
              { step: "Insurance Upload", count: 82, reason: "OCR failure / timeout", severity: "high" },
              { step: "Order", count: 70, reason: "Card declined", severity: "high" },
              { step: "Product Selection", count: 63, reason: "No action / bounce", severity: "med" },
              { step: "Contact Info", count: 54, reason: "Consent not accepted", severity: "med" },
              { step: "Product Review & Resupply Cadence", count: 44, reason: "Missing Rx fields", severity: "med" },
              { step: "Shipping", count: 36, reason: "Non-serviceable region", severity: "low" },
              { step: "Order", count: 21, reason: "3DS abandoned", severity: "low" },
            ].map((d, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "minmax(180px, 1fr) 1fr 50px",
                gap: 8,
                padding: "8px 0",
                borderBottom: "1px solid #e2e8f0",
                alignItems: "center",
              }}>
                <div>
                  <div style={{fontSize: 10, color: "#475569"}}>{d.step}</div>
                  <div style={{fontSize: 9, color: "#64748b", marginTop: 2}}>{d.reason}</div>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{
                    width: `${(d.count/82)*100}%`,
                    background: d.severity === "high" ? "#dc2626" : d.severity === "med" ? "#d97706" : "#2563eb",
                  }} />
                </div>
                <div style={{
                  textAlign: "right",
                  fontSize: 11,
                  fontWeight: 600,
                  color: d.severity === "high" ? "#dc2626" : d.severity === "med" ? "#d97706" : "#2563eb",
                }}>{d.count}</div>
              </div>
            ))}

            {/* Salesforce Sync Status */}
            <div className="section-header" style={{marginTop: 20}}>Salesforce Sync Status</div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8}}>
              {[
                { label: "Leads Created", val: "1,104", color: "#4f7cff" },
                { label: "Opps Converted", val: "361", color: "#22c55e" },
                { label: "Sync Errors", val: "3", color: "#ef4444" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  padding: "10px 12px",
                  textAlign: "center",
                }}>
                  <div style={{fontWeight: 600, fontSize: 20, color: s.color}}>{s.val}</div>
                  <div style={{fontSize: 9, color: "#64748b", marginTop: 4, letterSpacing: "0.08em"}}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          borderTop: "1px solid #e2e8f0",
          fontSize: 9,
          color: "#94a3b8",
          letterSpacing: "0.08em",
        }}>
          <span>MINIMED ECOMMERCE · EVENT LOG v1.0 · DAY ONE OPS</span>
          <span style={{display: "flex", gap: 16}}>
            <span>● Amplitude</span>
            <span>● Tealium</span>
            <span>● Salesforce</span>
            <span style={{color: "#16a34a"}}>● Fresh Paint HIPAA</span>
          </span>
          <span>AUTO-REFRESH: 30s</span>
        </div>
      </div>
    </div>
  );
}
