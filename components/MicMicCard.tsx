"use client";
import React from "react";
import { MagnitudeTier } from "@/lib/magnitude";
import { SeismicIcon } from "./SeismicLogo";

interface Props {
  username: string;
  magnitude: MagnitudeTier;
  pfpUrl: string;
  cardId?: string;
}

function SeismographPath({ color, intensity }: { color: string; intensity: number }) {
  const amp = [3, 6, 12, 20, 30, 40, 52][intensity - 1] ?? 8;
  const pts: string[] = [];
  const W = 280, cx = 30, H = 52;
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const nx = cx + t * (W - cx * 2);
    const env = Math.pow(Math.sin(t * Math.PI), 0.7);
    const wave =
      Math.sin(t * 22) * 0.45 * amp * env +
      Math.sin(t * 9 + 0.8) * 0.35 * amp * env +
      Math.sin(t * 45 + 1.5) * 0.2 * amp * env;
    pts.push(`${i === 0 ? "M" : "L"}${nx.toFixed(1)},${(H / 2 + wave).toFixed(1)}`);
  }
  return (
    <svg width="280" height={H} viewBox={`0 0 280 ${H}`} fill="none" style={{ display: "block" }}>
      {/* Glow copy */}
      <path d={pts.join(" ")} stroke={color} strokeWidth="3" fill="none" opacity="0.15" filter="url(#blur)" />
      <path d={pts.join(" ")} stroke={color} strokeWidth="1" fill="none" opacity="0.9"
        className="richter-line" strokeLinecap="round" />
      <defs>
        <filter id="blur"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
    </svg>
  );
}

function CrackLines({ color, intensity }: { color: string; intensity: number }) {
  if (intensity < 2) return null;
  const cracks = [
    { d: "M20,80 L60,55 L75,30", op: 0.18 },
    { d: "M460,40 L420,70 L430,100", op: 0.14 },
    { d: "M240,250 L260,220 L250,195", op: 0.1 },
    { d: "M80,240 L95,210 L85,185", op: 0.08 },
  ].slice(0, intensity - 1);

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 270" fill="none" style={{ pointerEvents: "none" }}>
      {cracks.map((c, i) => (
        <path key={i} d={c.d} stroke={color} strokeWidth="0.7" opacity={c.op} strokeLinecap="round" />
      ))}
    </svg>
  );
}

export default function MicMicCard({ username, magnitude: tier, pfpUrl, cardId }: Props) {
  return (
    <div
      id="micmic-card-render"
      className={`micmic-card-wrap ${tier.glitchEffect ? "anim-glitch" : ""}`}
      style={{
        "--mg": tier.glow,
        width: "500px",
        height: "270px",
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      } as React.CSSProperties}
    >
      {/* Base layer */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, #0d0610 0%, #18091260 60%, #220d18 100%)`,
      }} />

      {/* Magnitude color wash */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 85% 15%, ${tier.color}18 0%, transparent 55%),
                     radial-gradient(ellipse at 15% 85%, ${tier.color}0c 0%, transparent 45%)`,
      }} />

      {/* Glass surface */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
        backdropFilter: "blur(0px)",
      }} />

      {/* Crack overlay */}
      <CrackLines color={tier.color} intensity={tier.crackIntensity} />

      {/* Border ring */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "20px",
        border: `1px solid ${tier.color}30`,
        boxShadow: `inset 0 1px 0 ${tier.color}20, inset 0 -1px 0 rgba(0,0,0,0.3)`,
        pointerEvents: "none",
      }} />

      {/* BIG watermark number */}
      <div style={{
        position: "absolute",
        right: "24px",
        top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "Inter, sans-serif",
        fontWeight: 900,
        fontSize: "160px",
        lineHeight: 1,
        color: tier.color,
        opacity: 0.04,
        letterSpacing: "-0.05em",
        userSelect: "none",
        pointerEvents: "none",
      }}>{tier.level}</div>

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", height: "100%", padding: "24px 28px", gap: "24px" }}>

        {/* LEFT: PFP */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          {/* PFP ring */}
          <div style={{
            width: "96px", height: "96px",
            borderRadius: "50%",
            padding: "2px",
            background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}40 100%)`,
            boxShadow: `0 0 0 1px ${tier.color}20, 0 0 30px ${tier.color}40, 0 0 60px ${tier.color}15`,
          }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#0d0610" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pfpUrl} alt={username} style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            </div>
          </div>

          {/* Seismic logo mark */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", opacity: 0.5 }}>
            <SeismicIcon size={11} color={tier.color} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.15em", color: tier.color }}>SEISMIC</span>
          </div>
        </div>

        {/* RIGHT: Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>

          {/* TOP: name + badge */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "rgba(196,160,171,0.35)",
                marginBottom: "4px",
              }}>MICMIC CARD</div>

              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "24px",
                color: "#f0e6ea",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>{username}</div>

              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: tier.color,
                letterSpacing: "0.08em",
                marginTop: "5px",
                textShadow: `0 0 12px ${tier.color}80`,
              }}>▸ {tier.name.toUpperCase()} TIER</div>
            </div>

            {/* Magnitude badge */}
            <div style={{
              background: `linear-gradient(135deg, ${tier.color}18 0%, ${tier.color}06 100%)`,
              border: `1px solid ${tier.color}40`,
              borderRadius: "12px",
              padding: "8px 14px",
              textAlign: "center",
              flexShrink: 0,
              boxShadow: `0 0 20px ${tier.color}20`,
            }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.15em", color: `${tier.color}80` }}>MAG</div>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "30px",
                lineHeight: 1,
                color: tier.color,
                textShadow: `0 0 20px ${tier.color}, 0 0 40px ${tier.color}50`,
                letterSpacing: "-0.02em",
              }}>{tier.level}</div>
            </div>
          </div>

          {/* MIDDLE: Seismograph */}
          <div style={{ margin: "2px 0", opacity: 0.85 }}>
            <SeismographPath color={tier.color} intensity={tier.crackIntensity} />
          </div>

          {/* BOTTOM: description + ID */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontStyle: "italic",
              color: "rgba(196,160,171,0.45)",
              lineHeight: 1.4,
              maxWidth: "220px",
            }}>{tier.description}</div>

            {cardId && (
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "7px",
                color: `${tier.color}40`,
                letterSpacing: "0.06em",
              }}>#{cardId.toUpperCase()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
