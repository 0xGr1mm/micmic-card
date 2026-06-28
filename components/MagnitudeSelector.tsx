"use client";
import React from "react";
import { MAGNITUDE_TIERS } from "@/lib/magnitude";

interface Props { selected: number; onChange: (n: number) => void; }

const ICONS = ["◈","◉","◆","◈","◉","◆","★","✦","✹"];
const RICHTER = ["1–2","2–3","3–4","4–5","5–6","6–7","7–8","8–9","9+"];

export default function MagnitudeSelector({ selected, onChange }: Props) {
  const tier = MAGNITUDE_TIERS.find(t => t.level === selected);

  return (
    <div className="space-y-4">
      <p className="eyebrow">your magnitude tier</p>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
        {MAGNITUDE_TIERS.map((t) => (
          <button
            key={t.level}
            onClick={() => onChange(t.level)}
            className={`mag-btn mag-${t.level}-color rounded-xl py-3 px-1 flex flex-col items-center gap-1.5 ${selected === t.level ? "active" : ""}`}
            style={{ "--mc": t.color, "--mg": t.glow } as React.CSSProperties}
          >
            <span style={{
              color: selected === t.level ? t.color : "rgba(196,160,171,0.3)",
              fontSize: "11px",
              transition: "color 0.2s"
            }}>{ICONS[t.level - 1]}</span>

            <span style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "20px",
              lineHeight: 1,
              color: selected === t.level ? t.color : "rgba(196,160,171,0.4)",
              textShadow: selected === t.level ? `0 0 20px ${t.color}` : "none",
              transition: "all 0.2s",
            }}>{t.level}</span>

            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "7px",
              letterSpacing: "0.05em",
              color: selected === t.level ? t.color : "rgba(196,160,171,0.25)",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}>{t.name}</span>
          </button>
        ))}
      </div>

      {/* Detail card */}
      {tier && (
        <div
          className="rounded-2xl p-4 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${tier.color}0a 0%, transparent 100%)`,
            border: `1px solid ${tier.color}25`,
          }}
        >
          <div className="flex items-center gap-4">
            {/* Big number */}
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "52px",
              lineHeight: 1,
              color: tier.color,
              textShadow: `0 0 30px ${tier.color}80, 0 0 60px ${tier.color}30`,
              letterSpacing: "-0.03em",
              minWidth: "52px",
            }}>{tier.level}</div>

            <div className="flex-1">
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "15px",
                color: tier.color,
                marginBottom: "2px",
              }}>{tier.name} Tier</div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: "rgba(196,160,171,0.45)",
                marginBottom: "8px",
                letterSpacing: "0.1em",
              }}>RICHTER {RICHTER[tier.level - 1]}</div>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontStyle: "italic",
                color: "rgba(196,160,171,0.6)",
                lineHeight: 1.5,
              }}>&ldquo;{tier.description}&rdquo;</div>
            </div>
          </div>

          {/* Perks */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tier.perks.map((p) => (
              <span key={p} style={{
                background: `${tier.color}12`,
                border: `1px solid ${tier.color}30`,
                color: tier.color,
                fontFamily: "'Space Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.05em",
                padding: "3px 10px",
                borderRadius: "100px",
              }}>{p}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
