"use client";
import React, { useEffect, useState } from "react";
import { Download, ArrowLeft, Waves } from "lucide-react";
import { getTierByLevel } from "@/lib/magnitude";
import MicMicCard from "@/components/MicMicCard";
import { SeismicIcon } from "@/components/SeismicLogo";
import Link from "next/link";

interface CardData {
  id: string;
  username: string;
  magnitude: number;
  pfp_url: string;
  view_count: number;
  created_at: string;
}

export default function SharedCardView({ cardId }: { cardId: string }) {
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/cards?id=${cardId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(true); } else { setCard(d); }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cardId]);

  const handleDownload = async () => {
    if (!card) return;
    const el = document.getElementById("micmic-card-render");
    if (!el) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(el, { backgroundColor: null, scale: 3, useCORS: true });
    const link = document.createElement("a");
    link.download = `micmic-card-${card.username}-mag${card.magnitude}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const tier = card ? getTierByLevel(card.magnitude) : null;

  if (loading) return (
    <div className="seismic-bg min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-seismic-pulse">
          <SeismicIcon size={48} color="#825A6D" />
        </div>
        <div style={{ color: "#7a5560", fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>
          Loading card...
        </div>
      </div>
    </div>
  );

  if (error || !card || !tier) return (
    <div className="seismic-bg min-h-screen flex flex-col items-center justify-center gap-6">
      <SeismicIcon size={48} color="#825A6D" />
      <div style={{ color: "#f5eef0", fontSize: "20px", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>Card not found</div>
      <Link href="/" style={{ color: "#825A6D", fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>
        ← Create your own
      </Link>
    </div>
  );

  return (
    <main className="seismic-bg crack-overlay min-h-screen flex flex-col items-center justify-center px-4 py-12 gap-8">
      {/* Back */}
      <Link href="/" className="flex items-center gap-2 self-start" style={{ color: "#7a5560", fontFamily: "'Space Mono', monospace", fontSize: "12px" }}>
        <ArrowLeft size={14} />
        micmic.card
      </Link>

      {/* Badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(130, 90, 109, 0.1)", border: "1px solid rgba(130, 90, 109, 0.3)", borderRadius: "100px", padding: "6px 16px" }}>
        <Waves size={12} color="#825A6D" />
        <span style={{ color: "#825A6D", fontSize: "11px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.12em" }}>
          SEISMIC MICMIC CARD
        </span>
      </div>

      {/* Card */}
      <div style={{ overflowX: "auto", maxWidth: "100vw" }}>
        <MicMicCard
          username={card.username}
          magnitude={tier}
          pfpUrl={card.pfp_url}
          cardId={card.id}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6" style={{ color: "#7a5560", fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>
        <span>{card.view_count + 1} views</span>
        <span>·</span>
        <span>Magnitude {tier.level} — {tier.name}</span>
        <span>·</span>
        <span>{new Date(card.created_at).toLocaleDateString()}</span>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleDownload}
          className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
          style={{ fontSize: "14px", fontFamily: "Inter, sans-serif" }}
        >
          <Download size={16} />
          Download Card
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
          style={{
            background: "rgba(130, 90, 109, 0.1)",
            border: "1px solid rgba(130, 90, 109, 0.3)",
            color: "#c4a0ab",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            textDecoration: "none",
          }}
        >
          Generate yours →
        </Link>
      </div>
    </main>
  );
}
