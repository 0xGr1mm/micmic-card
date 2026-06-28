"use client";
import React, { useMemo, useRef } from "react";
import { MagnitudeTier } from "@/lib/magnitude";
import { SeismicIcon } from "./SeismicLogo";

interface MicMicCardProps {
  username: string;
  magnitude: MagnitudeTier;
  pfpUrl: string;
  cardId?: string;
}

function SeismographSVG({ color, intensity }: { color: string; intensity: number }) {
  const amplitudes = [2, 4, 8, 15, 25, 35, 45];
  const amp = amplitudes[intensity - 1] ?? 5;

  const generatePath = () => {
    const points: string[] = [];
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 300;
      const t = i / steps;
      // Seismic wave - flat at edges, spike in middle
      const envelope = Math.sin(t * Math.PI) ** 2;
      const wave =
        Math.sin(t * 40) * amp * 0.3 * envelope +
        Math.sin(t * 17 + 1) * amp * 0.5 * envelope +
        Math.sin(t * 7 + 0.5) * amp * 0.2 * envelope;
      const y = 30 + wave;
      points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(" ");
  };

  return (
    <svg width="300" height="60" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d={generatePath()}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
        className="seismograph-line"
      />
    </svg>
  );
}

function CrackSVG({ intensity, color }: { intensity: number; color: string }) {
  if (intensity < 2) return null;
  const cracks = Array.from({ length: Math.min(intensity - 1, 4) }, (_, i) => i);
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.15 }}>
      {cracks.map((i) => {
        const x1 = [50, 420, 250, 100][i];
        const y1 = [200, 80, 250, 50][i];
        const x2 = [150, 350, 300, 180][i];
        const y2 = [100, 200, 150, 150][i];
        return (
          <path
            key={i}
            d={`M${x1},${y1} L${x2},${y2} L${x2 + 20},${y2 - 30} M${x2},${y2} L${x2 - 15},${y2 + 20}`}
            stroke={color}
            strokeWidth="0.8"
          />
        );
      })}
    </svg>
  );
}

function seededFraction(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function Particle({ color, count }: { color: string; count: number }) {
  const particles = useMemo(
    () => Array.from({ length: Math.min(count, 12) }, (_, i) => ({
      id: i,
      x: seededFraction(i + 1) * 100,
      y: seededFraction(i + 17) * 100,
      size: seededFraction(i + 31) * 3 + 1,
      delay: seededFraction(i + 47) * 3,
      duration: seededFraction(i + 63) * 3 + 2,
    })),
    [count],
  );

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: color,
            opacity: 0.4,
            animation: `seismic-pulse ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </>
  );
}

export default function MicMicCard({ username, magnitude, pfpUrl, cardId }: MicMicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      id="micmic-card-render"
      className={`micmic-card relative select-none ${magnitude.glitchEffect ? "animate-glitch" : ""}`}
      style={{
        width: "500px",
        height: "280px",
        background: magnitude.cardBg,
        border: `1px solid ${magnitude.borderColor}`,
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: `0 0 40px ${magnitude.glow}, 0 0 80px ${magnitude.glow}40, inset 0 1px 0 ${magnitude.borderColor}`,
        position: "relative",
      }}
    >
      {/* Crack overlay */}
      <CrackSVG intensity={magnitude.crackIntensity} color={magnitude.color} />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Particle color={magnitude.color} count={magnitude.particleCount} />
      </div>

      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${magnitude.color}30 0%, transparent 70%)`,
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${magnitude.color}20 0%, transparent 70%)`,
          transform: "translate(-30%, 30%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex h-full p-6 gap-5">
        {/* Left: PFP */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <div
            className="relative"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              border: `2px solid ${magnitude.color}`,
              boxShadow: `0 0 20px ${magnitude.glow}, 0 0 40px ${magnitude.glow}60`,
              overflow: "hidden",
              background: "#1a0f14",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pfpUrl}
              alt={username}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Seismic icon below pfp */}
          <div className="mt-3 flex items-center gap-1 opacity-60">
            <SeismicIcon size={14} color={magnitude.color} />
            <span style={{ color: magnitude.color, fontSize: "9px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
              SEISMIC
            </span>
          </div>
        </div>

        {/* Right: Card info */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Top row: username + magnitude badge */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div
                  style={{
                    color: "#f5eef0",
                    fontSize: "11px",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.15em",
                    opacity: 0.5,
                    marginBottom: "2px",
                  }}
                >
                  MICMIC CARD
                </div>
                <div
                  style={{
                    color: "#f5eef0",
                    fontSize: "22px",
                    fontWeight: 800,
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.1,
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {username}
                </div>
              </div>

              {/* Magnitude badge */}
              <div
                style={{
                  background: `${magnitude.color}20`,
                  border: `1px solid ${magnitude.color}60`,
                  borderRadius: "8px",
                  padding: "4px 10px",
                  flexShrink: 0,
                }}
              >
                <div style={{ color: magnitude.color, fontSize: "9px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
                  MAG
                </div>
                <div style={{ color: magnitude.color, fontSize: "22px", fontWeight: 900, fontFamily: "Inter, sans-serif", lineHeight: 1 }}>
                  {magnitude.level}
                </div>
              </div>
            </div>

            {/* Tier name */}
            <div
              style={{
                color: magnitude.color,
                fontSize: "12px",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.08em",
                marginTop: "6px",
                textTransform: "uppercase",
              }}
            >
              ▸ {magnitude.name} Tier
            </div>
          </div>

          {/* Seismograph */}
          <div style={{ margin: "4px 0", opacity: 0.8 }}>
            <SeismographSVG color={magnitude.color} intensity={magnitude.crackIntensity} />
          </div>

          {/* Bottom: description + card ID */}
          <div className="flex items-end justify-between">
            <div
              style={{
                color: "#c4a0ab",
                fontSize: "10px",
                fontFamily: "Inter, sans-serif",
                fontStyle: "italic",
                opacity: 0.7,
                maxWidth: "230px",
                lineHeight: 1.3,
              }}
            >
              {magnitude.description}
            </div>
            {cardId && (
              <div
                style={{
                  color: magnitude.color,
                  fontSize: "8px",
                  fontFamily: "'Space Mono', monospace",
                  opacity: 0.4,
                  letterSpacing: "0.05em",
                }}
              >
                #{cardId}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Magnitude corner watermark */}
      <div
        className="absolute bottom-3 right-4"
        style={{
          opacity: 0.06,
          fontSize: "80px",
          fontWeight: 900,
          fontFamily: "Inter, sans-serif",
          color: magnitude.color,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {magnitude.level}
      </div>
    </div>
  );
}
