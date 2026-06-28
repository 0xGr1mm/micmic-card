"use client";
import React, { useState, useRef } from "react";
import { Upload, Download, Link, Check, Loader2, Waves, ChevronRight } from "lucide-react";
import { getTierByLevel } from "@/lib/magnitude";
import MicMicCard from "@/components/MicMicCard";
import MagnitudeSelector from "@/components/MagnitudeSelector";
import { SeismicIcon } from "@/components/SeismicLogo";

type Step = "form" | "preview" | "done";

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [username, setUsername] = useState("");
  const [magnitude, setMagnitude] = useState(3);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [pfpPreview, setPfpPreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardId, setCardId] = useState<string>("");
  const [cardPfpUrl, setCardPfpUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const tier = getTierByLevel(magnitude);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image must be under 10MB");
      return;
    }
    setPfpFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPfpPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!username.trim() || !pfpFile || !magnitude) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("magnitude", magnitude.toString());
      formData.append("pfp", pfpFile);

      const res = await fetch("/api/cards", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      setCardId(data.cardId);
      setCardPfpUrl(data.pfpUrl);
      setStep("preview");
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const el = document.getElementById("micmic-card-render");
      if (!el) return;

      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `micmic-card-${username}-mag${magnitude}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Card downloaded!");
    } catch (err) {
      console.error(err);
      showToast("Download failed. Try again.");
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/card/${cardId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnX = () => {
    const url = `${window.location.origin}/card/${cardId}`;
    const text = `i'm a Magnitude ${magnitude} on Seismic — ${tier.name} Tier\n\n${tier.description}\n\nget yours 👇`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(130, 90, 109, 0.2)" }}>
        <div className="flex items-center gap-3">
          <SeismicIcon size={28} color="#825A6D" />
          <div>
            <div style={{ color: "#f5eef0", fontWeight: 800, fontSize: "18px", fontFamily: "Inter, sans-serif", lineHeight: 1 }}>
              MicMic Card
            </div>
            <div style={{ color: "#7a5560", fontSize: "11px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
              SEISMIC IDENTITY
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="animate-seismic-pulse" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#E74C3C" }} />
          <span style={{ color: "#7a5560", fontSize: "11px", fontFamily: "'Space Mono', monospace" }}>TESTNET LIVE</span>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-12 px-4" style={{ borderBottom: "1px solid rgba(130, 90, 109, 0.15)" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(130, 90, 109, 0.1)",
            border: "1px solid rgba(130, 90, 109, 0.3)",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "20px",
          }}
        >
          <Waves size={12} color="#825A6D" />
          <span style={{ color: "#825A6D", fontSize: "11px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.12em" }}>
            GENERATE YOUR SEISMIC IDENTITY
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 900,
            fontFamily: "Inter, sans-serif",
            color: "#f5eef0",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "12px",
          }}
        >
          Your Magnitude.
          <br />
          <span style={{ color: "#825A6D" }}>Your Card.</span>
        </h1>

        <p style={{ color: "#7a5560", fontSize: "15px", fontFamily: "Inter, sans-serif", maxWidth: "480px", margin: "0 auto" }}>
          Upload your PFP, pick your Magnitude tier, and get a unique MicMic Card you can flex on X.
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-10 gap-10">

        {step === "form" && (
          <div className="w-full max-w-2xl space-y-8 animate-float-up">

            {/* PFP Upload */}
            <div className="space-y-3">
              <label style={{ color: "#c4a0ab", fontSize: "11px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.15em", display: "block" }}>
                UPLOAD YOUR PFP
              </label>

              <div
                className={`upload-zone rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? "drag-active" : ""}`}
                style={{ height: "160px" }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {pfpPreview ? (
                  <div className="flex items-center gap-5">
                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", border: `2px solid ${tier.color}`, boxShadow: `0 0 20px ${tier.glow}` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pfpPreview} alt="PFP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ color: "#f5eef0", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>PFP ready</div>
                      <div style={{ color: "#7a5560", fontSize: "12px", fontFamily: "'Space Mono', monospace" }}>Click to change</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={28} color="#7a5560" style={{ marginBottom: "10px" }} />
                    <div style={{ color: "#c4a0ab", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>Drop your PFP here</div>
                    <div style={{ color: "#7a5560", fontSize: "12px", fontFamily: "'Space Mono', monospace", marginTop: "4px" }}>PNG, JPG, GIF · max 10MB</div>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>

            {/* Username */}
            <div className="space-y-3">
              <label style={{ color: "#c4a0ab", fontSize: "11px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.15em", display: "block" }}>
                YOUR USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. 0xGr1mm"
                maxLength={32}
                style={{
                  width: "100%",
                  background: "rgba(130, 90, 109, 0.08)",
                  border: `1px solid ${username ? tier.color + "50" : "rgba(130, 90, 109, 0.2)"}`,
                  borderRadius: "12px",
                  padding: "14px 18px",
                  color: "#f5eef0",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s",
                  boxShadow: username ? `0 0 20px ${tier.glow}20` : "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = tier.color + "80")}
                onBlur={(e) => (e.target.style.borderColor = username ? tier.color + "50" : "rgba(130, 90, 109, 0.2)")}
              />
            </div>

            {/* Magnitude Selector */}
            <MagnitudeSelector selected={magnitude} onChange={setMagnitude} />

            {/* Live preview mini */}
            {pfpPreview && username && (
              <div className="space-y-3">
                <label style={{ color: "#c4a0ab", fontSize: "11px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.15em" }}>
                  PREVIEW
                </label>
                <div className="flex justify-center overflow-hidden" style={{ borderRadius: "16px" }}>
                  <div style={{ transform: "scale(0.68)", transformOrigin: "top center", marginBottom: "-60px" }}>
                    <MicMicCard username={username} magnitude={getTierByLevel(magnitude)} pfpUrl={pfpPreview} />
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              className="btn-primary w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              style={{ fontSize: "15px", fontFamily: "Inter, sans-serif" }}
              onClick={handleSubmit}
              disabled={!username.trim() || !pfpFile || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating your card...
                </>
              ) : (
                <>
                  Generate My MicMic Card
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        )}

        {step === "preview" && (
          <div className="w-full max-w-2xl space-y-8 animate-float-up">
            <div className="text-center">
              <div style={{ color: tier.color, fontSize: "13px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.15em", marginBottom: "8px" }}>
                ▸ CARD GENERATED
              </div>
              <h2 style={{ color: "#f5eef0", fontSize: "28px", fontWeight: 900, fontFamily: "Inter, sans-serif", marginBottom: "4px" }}>
                Here&apos;s your MicMic Card
              </h2>
              <p style={{ color: "#7a5560", fontSize: "13px", fontFamily: "Inter, sans-serif" }}>
                Download as PNG or share your unique link
              </p>
            </div>

            {/* Card render */}
            <div className="flex justify-center" style={{ overflowX: "auto" }}>
              <div ref={cardRef}>
                <MicMicCard
                  username={username}
                  magnitude={tier}
                  pfpUrl={cardPfpUrl}
                  cardId={cardId}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                className="btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
                style={{ fontSize: "14px", fontFamily: "Inter, sans-serif" }}
                onClick={handleDownload}
              >
                <Download size={16} />
                Download PNG
              </button>
              <button
                onClick={handleCopyLink}
                className="py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                style={{
                  background: copied ? `${tier.color}20` : "rgba(130, 90, 109, 0.1)",
                  border: `1px solid ${copied ? tier.color : "rgba(130, 90, 109, 0.3)"}`,
                  color: copied ? tier.color : "#c4a0ab",
                  fontSize: "14px",
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                }}
              >
                {copied ? <Check size={16} /> : <Link size={16} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <button
              onClick={shareOnX}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f5eef0",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>

            <div className="text-center">
              <button
                onClick={() => { setStep("form"); setPfpFile(null); setPfpPreview(""); setUsername(""); setCardId(""); setCardPfpUrl(""); }}
                style={{ color: "#7a5560", fontSize: "13px", fontFamily: "'Space Mono', monospace", cursor: "pointer", background: "none", border: "none" }}
              >
                ← Generate another card
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="toast fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl z-50"
          style={{
            background: "rgba(61, 40, 49, 0.95)",
            border: "1px solid rgba(196, 160, 171, 0.3)",
            color: "#f5eef0",
            fontFamily: "'Space Mono', monospace",
            fontSize: "13px",
            backdropFilter: "blur(10px)",
          }}
        >
          {toast}
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center border-t" style={{ borderColor: "rgba(130, 90, 109, 0.15)" }}>
        <div style={{ color: "#4e2d3a", fontSize: "11px", fontFamily: "'Space Mono', monospace" }}>
          built on seismic · micmic card · 2025
        </div>
      </footer>
    </main>
  );
}
