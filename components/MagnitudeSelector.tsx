"use client";
import React from "react";
import { MAGNITUDE_TIERS } from "@/lib/magnitude";

interface MagnitudeSelectorProps {
  selected: number;
  onChange: (level: number) => void;
}

const MAG_ICONS = ["🔵", "🟢", "🔷", "🟣", "🟠", "🔴", "⭐"];
const RICHTER_DESC = ["1.0–1.9", "2.0–2.9", "3.0–3.9", "4.0–4.9", "5.0–5.9", "6.0–6.9", "7.0+"];

export default function MagnitudeSelector({ selected, onChange }: MagnitudeSelectorProps) {
  return (
    <div className="space-y-3">
      <label
        style={{
          color: "#c4a0ab",
          fontSize: "11px",
          fontFamily: "'Space Mono', monospace",
          letterSpacing: "0.15em",
          display: "block",
        }}
      >
        SELECT YOUR MAGNITUDE TIER
      </label>

      <div className="grid grid-cols-7 gap-2">
        {MAGNITUDE_TIERS.map((tier) => (
          <button
            key={tier.level}
            onClick={() => onChange(tier.level)}
            className={`mag-option rounded-xl p-2 flex flex-col items-center gap-1 ${selected === tier.level ? "selected" : ""}`}
            style={{
              background: selected === tier.level
                ? `${tier.color}15`
                : "rgba(130, 90, 109, 0.05)",
              border: `2px solid ${selected === tier.level ? tier.color : "rgba(130, 90, 109, 0.2)"}`,
              boxShadow: selected === tier.level ? `0 0 16px ${tier.glow}` : "none",
            } as React.CSSProperties}
          >
            <span style={{ fontSize: "18px" }}>{MAG_ICONS[tier.level - 1]}</span>
            <span
              style={{
                color: selected === tier.level ? tier.color : "#7a5560",
                fontSize: "16px",
                fontWeight: 900,
                fontFamily: "Inter, sans-serif",
                lineHeight: 1,
              }}
            >
              {tier.level}
            </span>
            <span
              style={{
                color: selected === tier.level ? tier.color : "#7a5560",
                fontSize: "8px",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.03em",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {tier.name.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* Selected tier detail */}
      {selected > 0 && (() => {
        const tier = MAGNITUDE_TIERS.find(t => t.level === selected)!;
        return (
          <div
            className="rounded-xl p-4 transition-all"
            style={{
              background: `${tier.color}08`,
              border: `1px solid ${tier.color}30`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: tier.color,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1,
                  textShadow: `0 0 20px ${tier.glow}`,
                }}
              >
                {tier.level}
              </div>
              <div>
                <div style={{ color: tier.color, fontWeight: 700, fontSize: "14px", fontFamily: "Inter, sans-serif" }}>
                  {tier.name} Tier
                </div>
                <div style={{ color: "#7a5560", fontSize: "11px", fontFamily: "'Space Mono', monospace" }}>
                  Richter {RICHTER_DESC[tier.level - 1]}
                </div>
              </div>
            </div>
            <div style={{ color: "#c4a0ab", fontSize: "12px", fontStyle: "italic", marginBottom: "8px" }}>
              &ldquo;{tier.description}&rdquo;
            </div>
            <div className="flex flex-wrap gap-1">
              {tier.perks.map((perk) => (
                <span
                  key={perk}
                  style={{
                    background: `${tier.color}15`,
                    border: `1px solid ${tier.color}40`,
                    color: tier.color,
                    fontSize: "9px",
                    fontFamily: "'Space Mono', monospace",
                    padding: "2px 8px",
                    borderRadius: "100px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {perk}
                </span>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
