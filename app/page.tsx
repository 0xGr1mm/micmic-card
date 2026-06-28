"use client";
import React, { useState, useRef } from "react";
import { Upload, Download, Link, Check, Loader2, RotateCcw } from "lucide-react";
import { getTierByLevel } from "@/lib/magnitude";
import MicMicCard from "@/components/MicMicCard";
import MagnitudeSelector from "@/components/MagnitudeSelector";
import { SeismicIcon } from "@/components/SeismicLogo";
import dynamic from "next/dynamic";

const SeismicCanvas = dynamic(() => import("@/components/SeismicCanvas"), { ssr: false });
const HeroSection   = dynamic(() => import("@/components/HeroSection"),   { ssr: false });

type Step = "form" | "preview";

export default function Home() {
  const [step, setStep]             = useState<Step>("form");
  const [username, setUsername]     = useState("");
  const [magnitude, setMagnitude]   = useState(3);
  const [pfpFile, setPfpFile]       = useState<File | null>(null);
  const [pfpPreview, setPfpPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [cardId, setCardId]         = useState("");
  const [cardPfpUrl, setCardPfpUrl] = useState("");
  const [copied, setCopied]         = useState(false);
  const [toast, setToast]           = useState("");
  const mounted = true;
  const fileRef = useRef<HTMLInputElement>(null);
  const tier = getTierByLevel(magnitude);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { showToast("Image files only"); return; }
    if (file.size > 10 * 1024 * 1024)   { showToast("Max 10MB"); return; }
    setPfpFile(file);
    const r = new FileReader();
    r.onload = (e) => setPfpPreview(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!username.trim() || !pfpFile) return;
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("username", username.trim());
      fd.append("magnitude", magnitude.toString());
      fd.append("pfp", pfpFile);
      const res = await fetch("/api/cards", { method: "POST", body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setCardId(d.cardId); setCardPfpUrl(d.pfpUrl);
      setStep("preview");
    } catch { showToast("Something went wrong. Try again."); }
    finally { setIsLoading(false); }
  };

  const handleDownload = async () => {
    const el = document.getElementById("micmic-card-render");
    if (!el) { showToast("Flip card to front first"); return; }
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 3, useCORS: true, logging: false });
      const a = document.createElement("a");
      a.download = `micmic-${username}-mag${magnitude}.png`;
      a.href = canvas.toDataURL("image/png"); a.click();
      showToast("Downloaded ✓");
    } catch { showToast("Download failed"); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${cardId}`);
    setCopied(true); showToast("Link copied ✓");
    setTimeout(() => setCopied(false), 2500);
  };

  const shareX = () => {
    const url = `${window.location.origin}/card/${cardId}`;
    const text = `i'm magnitude ${magnitude} on seismic — ${tier.name.toLowerCase()} tier\n\n"${tier.description}"\n\nget yours 👇`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const reset = () => {
    setStep("form"); setPfpFile(null); setPfpPreview("");
    setUsername(""); setCardId(""); setCardPfpUrl("");
  };

  const canGenerate = username.trim().length > 0 && !!pfpFile && !isLoading;

  return (
    <>
      <SeismicCanvas />

      {/* ── NAV ── */}
      <nav className="site-nav">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SeismicIcon size={26} color="#c4a0ab" />
          <span className="font-playfair" style={{ color: "#fff", fontSize: "22px", fontStyle: "italic" }}>
            MicMic
          </span>
        </div>

        {/* Center pill */}
        <div className="nav-pill">
          {["Seismic","Card","Gallery","About"].map((item, i) => (
            <button key={item} className={`nav-pill-btn ${i === 0 ? "active" : ""}`}>{item}</button>
          ))}
        </div>

        {/* Right */}
        <a href="https://seismic.network" target="_blank" rel="noreferrer"
          style={{
            background: "#fff", color: "#111", fontSize: "13px", fontWeight: 600,
            padding: "9px 22px", borderRadius: "100px",
            display: "none", textDecoration: "none",
          }}
          className="hidden md:block"
        >
          Seismic →
        </a>
      </nav>

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── BUILD SECTION ── */}
      <div id="build-section" className="page-content">
        <div className="form-section">

          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: "56px" }} className={mounted ? "anim-fade-up" : ""}>
            <p className="eyebrow" style={{ marginBottom: "12px" }}>step into the fault</p>
            <h2 className="font-playfair" style={{
              fontSize: "clamp(32px, 4vw, 52px)", fontStyle: "italic",
              color: "#f0e6ea", letterSpacing: "-0.02em", lineHeight: 1.1,
            }}>
              {step === "form" ? "Build Your Card" : "Your card is ready"}
            </h2>
          </div>

          {/* ── FORM ── */}
          {step === "form" && (
            <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "32px" }}>

              {/* Upload */}
              <div>
                <p className="eyebrow" style={{ marginBottom: "10px" }}>your pfp</p>
                <div
                  className={`upload-zone rounded-2xl flex flex-col items-center justify-center ${isDragging ? "drag-active" : ""}`}
                  style={{ height: "152px", borderRadius: "18px" }}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                >
                  {pfpPreview ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <div style={{
                        width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden",
                        padding: "2px",
                        background: `conic-gradient(from 0deg, ${tier.color}, ${tier.color}40, ${tier.color})`,
                        boxShadow: `0 0 24px ${tier.color}50`,
                      }}>
                        <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={pfpPreview} alt="PFP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px", color: "#f0e6ea" }}>PFP ready</div>
                        <div className="eyebrow" style={{ marginTop: "3px" }}>tap to change</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={22} color="rgba(196,160,171,0.4)" style={{ marginBottom: "10px" }} />
                      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "rgba(196,160,171,0.6)" }}>
                        Drop your PFP here
                      </div>
                      <div className="eyebrow" style={{ marginTop: "5px" }}>PNG · JPG · GIF · max 10MB</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>

              {/* Username */}
              <div>
                <p className="eyebrow" style={{ marginBottom: "10px" }}>your username</p>
                <input
                  type="text" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="0xYourHandle" maxLength={32}
                  className="s-input w-full"
                  style={{ borderRadius: "14px", padding: "14px 18px", fontSize: "16px" }}
                  onKeyDown={(e) => e.key === "Enter" && canGenerate && handleSubmit()}
                />
              </div>

              {/* Magnitude */}
              <MagnitudeSelector selected={magnitude} onChange={setMagnitude} />

              {/* Live card preview */}
              {pfpPreview && username && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: "14px" }}>preview</p>
                  <div style={{ display: "flex", justifyContent: "center", overflow: "hidden" }}>
                    <div style={{ transform: "scale(0.6)", transformOrigin: "top center", marginBottom: "-114px" }}>
                      <MicMicCard username={username} magnitude={getTierByLevel(magnitude)} pfpUrl={pfpPreview} enableFlip={false} />
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                className="btn-primary w-full flex items-center justify-center gap-2"
                style={{ padding: "16px", borderRadius: "16px", fontSize: "16px" }}
                onClick={handleSubmit} disabled={!canGenerate}
              >
                {isLoading
                  ? <><Loader2 size={18} className="animate-spin" /> Generating…</>
                  : <>Generate My Card</>
                }
              </button>
            </div>
          )}

          {/* ── PREVIEW ── */}
          {step === "preview" && (
            <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
              <div style={{ overflowX: "auto", maxWidth: "100vw" }}>
                <MicMicCard username={username} magnitude={tier} pfpUrl={cardPfpUrl} cardId={cardId} enableFlip />
              </div>

              <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button className="btn-primary flex items-center justify-center gap-2"
                  style={{ padding: "13px", borderRadius: "14px", fontSize: "14px" }}
                  onClick={handleDownload}>
                  <Download size={15} /> Download PNG
                </button>
                <button className="btn-ghost flex items-center justify-center gap-2"
                  style={{ padding: "13px", borderRadius: "14px", fontSize: "14px" }}
                  onClick={handleCopy}>
                  {copied ? <Check size={15} /> : <Link size={15} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>

              <button onClick={shareX} style={{
                width: "100%", padding: "13px", borderRadius: "14px",
                background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.07)",
                color: "#f0e6ea", fontSize: "14px", fontFamily: "Inter, sans-serif",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "border-color 0.2s ease",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </button>

              <button onClick={reset} style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                color: "rgba(196,160,171,0.35)", fontFamily: "'Space Mono', monospace",
                fontSize: "10px", letterSpacing: "0.14em", transition: "color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(196,160,171,0.65)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,160,171,0.35)")}
              >
                <RotateCcw size={12} /> GENERATE ANOTHER
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="page-content" style={{
        textAlign: "center", padding: "24px",
        borderTop: "1px solid rgba(196,160,171,0.06)",
        background: "var(--s-void)",
      }}>
        <span className="eyebrow">built on seismic · micmic card · 2025</span>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="anim-fade-up" style={{
          position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(8,5,8,0.92)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(196,160,171,0.18)", borderRadius: "12px",
          padding: "11px 20px", zIndex: 200,
          fontFamily: "'Space Mono', monospace", fontSize: "11px",
          color: "#f0e6ea", letterSpacing: "0.06em",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)", whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
