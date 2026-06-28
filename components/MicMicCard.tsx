"use client";
import React, { useState } from "react";
import { MagnitudeTier } from "@/lib/magnitude";
import { SeismicIcon } from "./SeismicLogo";

interface Props {
  username: string;
  magnitude: MagnitudeTier;
  pfpUrl: string;
  cardId?: string;
  enableFlip?: boolean;
}

function SeismographPath({ color, intensity }: { color: string; intensity: number }) {
  const amp = [2, 5, 10, 18, 28, 38, 48, 58, 72][intensity - 1] ?? 8;
  const pts: string[] = [];
  const W = 270, H = 48;
  for (let i = 0; i <= 130; i++) {
    const t = i / 130;
    const nx = 12 + t * (W - 24);
    const env = Math.pow(Math.sin(t * Math.PI), 0.65);
    const wave =
      Math.sin(t * 24) * 0.45 * amp * env +
      Math.sin(t * 10 + 0.8) * 0.32 * amp * env +
      Math.sin(t * 48 + 1.5) * 0.23 * amp * env;
    pts.push(`${i === 0 ? "M" : "L"}${nx.toFixed(1)},${(H / 2 + wave).toFixed(1)}`);
  }
  const d = pts.join(" ");
  return (
    <svg width="280" height={H} viewBox={`0 0 280 ${H}`} fill="none" style={{ display: "block" }}>
      <defs>
        <filter id={`glow-${color.replace("#","")}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* glow */}
      <path d={d} stroke={color} strokeWidth="4" fill="none" opacity="0.12"
        filter={`url(#glow-${color.replace("#","")})`}/>
      {/* line */}
      <path d={d} stroke={color} strokeWidth="1.2" fill="none" opacity="0.85"
        className="richter-line" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Card Front ── */
function CardFront({ username, tier, pfpUrl, cardId }: { username: string; tier: MagnitudeTier; pfpUrl: string; cardId?: string }) {
  return (
    <div
      className="card-face"
      style={{
        background: `linear-gradient(135deg, #050308 0%, #0e0612 50%, #160820 100%)`,
      }}
    >
      {/* Magnitude color radial wash */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 80% 10%, ${tier.color}1a 0%, transparent 55%),
                     radial-gradient(ellipse at 10% 90%, ${tier.color}0d 0%, transparent 45%)`,
      }}/>

      {/* Subtle grid lines */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: `linear-gradient(rgba(196,160,171,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(196,160,171,0.5) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }}/>

      {/* Border + inner glow */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "20px",
        border: `1px solid ${tier.color}28`,
        boxShadow: `inset 0 1px 0 ${tier.color}18, inset 0 -1px 0 rgba(0,0,0,0.5)`,
        pointerEvents: "none",
      }}/>

      {/* Big watermark */}
      <div style={{
        position: "absolute", right: "20px", bottom: "-10px",
        fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "180px",
        lineHeight: 1, color: tier.color, opacity: 0.03,
        letterSpacing: "-0.06em", userSelect: "none", pointerEvents: "none",
      }}>{tier.level}</div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", height: "100%", padding: "22px 26px", gap: "20px" }}>
        {/* PFP */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{
            width: "92px", height: "92px", borderRadius: "50%",
            padding: "2px",
            background: `conic-gradient(from 0deg, ${tier.color}, ${tier.color}40, ${tier.color})`,
            boxShadow: `0 0 0 1px ${tier.color}15, 0 0 28px ${tier.color}35, 0 0 56px ${tier.color}12`,
          }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#050308" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pfpUrl} alt={username} style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous"/>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", opacity: 0.45 }}>
            <SeismicIcon size={10} color={tier.color}/>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.18em", color: tier.color }}>SEISMIC</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
          {/* Top */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.22em", color: "rgba(196,160,171,0.3)", marginBottom: "3px" }}>
                MICMIC CARD
              </div>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "22px",
                color: "#f0e6ea", lineHeight: 1.1, letterSpacing: "-0.02em",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{username}</div>
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: "9px",
                color: tier.color, letterSpacing: "0.1em", marginTop: "4px",
                textShadow: `0 0 14px ${tier.color}70`,
              }}>▸ {tier.name.toUpperCase()} TIER</div>
            </div>

            {/* Badge */}
            <div style={{
              background: `linear-gradient(135deg, ${tier.color}15 0%, ${tier.color}05 100%)`,
              border: `1px solid ${tier.color}35`,
              borderRadius: "12px", padding: "7px 13px", textAlign: "center", flexShrink: 0,
              boxShadow: `0 0 20px ${tier.color}18`,
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "7px", letterSpacing: "0.18em", color: `${tier.color}70` }}>MAG</div>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "28px", lineHeight: 1,
                color: tier.color,
                textShadow: `0 0 20px ${tier.color}, 0 0 40px ${tier.color}50`,
                letterSpacing: "-0.03em",
              }}>{tier.level}</div>
            </div>
          </div>

          {/* Seismograph */}
          <div style={{ opacity: 0.8, margin: "0 -4px" }}>
            <SeismographPath color={tier.color} intensity={tier.crackIntensity} />
          </div>

          {/* Bottom */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{
              fontFamily: "Inter, sans-serif", fontSize: "9.5px", fontStyle: "italic",
              color: "rgba(196,160,171,0.4)", lineHeight: 1.5, maxWidth: "210px",
            }}>{tier.description}</div>
            {cardId && (
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: "7px",
                color: `${tier.color}35`, letterSpacing: "0.06em",
              }}>#{cardId.toUpperCase()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Card Back ── */
function CardBack({ username, tier }: { username: string; tier: MagnitudeTier }) {
  const RICHTER = ["1–2","2–3","3–4","4–5","5–6","6–7","7–8","8–9","9+"];
  return (
    <div
      className="card-face card-face-back"
      style={{
        background: `linear-gradient(135deg, #050308 0%, #0e0612 60%, #160820 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "20px", padding: "28px",
      }}
    >
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.05,
        backgroundImage: `linear-gradient(rgba(196,160,171,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(196,160,171,0.5) 1px, transparent 1px)`,
        backgroundSize: "40px 40px", pointerEvents: "none",
      }}/>

      <div style={{ border: `1px solid ${tier.color}25`, borderRadius: "20px", position: "absolute", inset: 0, pointerEvents: "none" }}/>

      {/* Big tier number */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "80px", lineHeight: 1,
          color: tier.color, letterSpacing: "-0.05em",
          textShadow: `0 0 40px ${tier.color}, 0 0 80px ${tier.color}50`,
        }}>{tier.level}</div>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontStyle: "italic",
          fontSize: "20px", color: "#f0e6ea", letterSpacing: "-0.01em", marginTop: "4px",
        }}>{tier.name}</div>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.2em",
          color: "rgba(196,160,171,0.35)", marginTop: "6px",
        }}>RICHTER {RICHTER[tier.level - 1]}</div>
      </div>

      {/* Divider */}
      <div style={{ width: "80px", height: "1px", background: `linear-gradient(90deg, transparent, ${tier.color}60, transparent)` }}/>

      {/* Perks */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", maxWidth: "340px" }}>
        {tier.perks.map((p) => (
          <span key={p} style={{
            background: `${tier.color}10`, border: `1px solid ${tier.color}28`,
            color: tier.color, fontFamily: "'Space Mono', monospace",
            fontSize: "8px", letterSpacing: "0.06em", padding: "4px 11px", borderRadius: "100px",
          }}>{p}</span>
        ))}
      </div>

      {/* Username */}
      <div style={{
        position: "absolute", bottom: "20px",
        fontFamily: "'Space Mono', monospace", fontSize: "9px",
        letterSpacing: "0.14em", color: "rgba(196,160,171,0.25)",
      }}>{username} · SEISMIC NETWORK</div>
    </div>
  );
}

/* ── Main export ── */
export default function MicMicCard({ username, magnitude: tier, pfpUrl, cardId, enableFlip = true }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div
        className="card-3d-scene"
        style={{ cursor: enableFlip ? "pointer" : "default" }}
        onClick={() => enableFlip && setFlipped(f => !f)}
      >
        <div
          id={!flipped ? "micmic-card-render" : undefined}
          className={`card-3d-inner ${flipped ? "flipped" : "anim-float"} ${tier.level === 9 ? "anim-pulse-w" : ""} ${tier.glitchEffect && !flipped ? "anim-glitch" : ""}`}
        >
          <CardFront username={username} tier={tier} pfpUrl={pfpUrl} cardId={cardId} />
          <CardBack username={username} tier={tier} />
        </div>
      </div>
      {enableFlip && (
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: "9px",
          letterSpacing: "0.16em", color: "rgba(196,160,171,0.3)",
        }}>CLICK TO FLIP</div>
      )}
    </div>
  );
}
