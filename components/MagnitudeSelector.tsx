"use client";
import React from "react";
import { MAGNITUDE_TIERS } from "@/lib/magnitude";

interface Props { selected: number; onChange: (n: number) => void; }
const RICHTER = ["1–2","2–3","3–4","4–5","5–6","6–7","7–8","8–9","9+"];

export default function MagnitudeSelector({ selected, onChange }: Props) {
  const tier = MAGNITUDE_TIERS.find(t => t.level === selected);
  return (
    <div className="space-y-4">
      <p className="eyebrow">your magnitude tier</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: "6px" }}>
        {MAGNITUDE_TIERS.map((t) => (
          <button
            key={t.level}
            onClick={() => onChange(t.level)}
            className={`mag-btn ${selected === t.level ? "active" : ""}`}
            style={{ "--mag-c": t.color, "--mag-g": t.glow, padding: "10px 4px" } as React.CSSProperties}
          >
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "19px", lineHeight: 1,
              color: selected === t.level ? t.color : "rgba(196,160,171,0.3)",
              textShadow: selected === t.level ? `0 0 18px ${t.color}` : "none",
              transition: "all 0.2s",
            }}>{t.level}</div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: "6.5px", letterSpacing: "0.04em",
              color: selected === t.level ? t.color : "rgba(196,160,171,0.2)",
              textTransform: "uppercase", marginTop: "3px", transition: "color 0.2s",
            }}>{t.name}</div>
          </button>
        ))}
      </div>

      {tier && (
        <div style={{
          borderRadius: "16px", padding: "16px",
          background: `linear-gradient(135deg, ${tier.color}08 0%, transparent 100%)`,
          border: `1px solid ${tier.color}20`,
          transition: "all 0.3s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "48px", lineHeight: 1,
              color: tier.color, letterSpacing: "-0.04em", minWidth: "52px",
              textShadow: `0 0 28px ${tier.color}80, 0 0 56px ${tier.color}30`,
            }}>{tier.level}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px", color: tier.color, marginBottom: "1px" }}>
                {tier.name} Tier
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "0.14em", color: "rgba(196,160,171,0.35)", marginBottom: "6px" }}>
                RICHTER {RICHTER[tier.level - 1]}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontStyle: "italic", color: "rgba(196,160,171,0.5)", lineHeight: 1.5 }}>
                &ldquo;{tier.description}&rdquo;
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "10px" }}>
            {tier.perks.map((p) => (
              <span key={p} style={{
                background: `${tier.color}10`, border: `1px solid ${tier.color}28`,
                color: tier.color, fontFamily: "'Space Mono', monospace",
                fontSize: "8px", letterSpacing: "0.05em", padding: "3px 9px", borderRadius: "100px",
              }}>{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
