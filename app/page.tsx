"use client";
import React, { useState, useRef } from "react";
import { Upload, Download, Link, Check, Loader2, ChevronRight, RotateCcw } from "lucide-react";
import { getTierByLevel } from "@/lib/magnitude";
import MicMicCard from "@/components/MicMicCard";
import MagnitudeSelector from "@/components/MagnitudeSelector";
import { SeismicIcon } from "@/components/SeismicLogo";
import dynamic from "next/dynamic";

const SeismicCanvas = dynamic(() => import("@/components/SeismicCanvas"), { ssr: false });

type Step = "form" | "preview";

export default function Home() {
  const [step, setStep] = useState<Step>("form");
  const [username, setUsername] = useState("");
  const [magnitude, setMagnitude] = useState(3);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [pfpPreview, setPfpPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cardId, setCardId] = useState("");
  const [cardPfpUrl, setCardPfpUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const mounted = true;
  const fileRef = useRef<HTMLInputElement>(null);
  const tier = getTierByLevel(magnitude);


  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) { showToast("Image files only"); return; }
    if (file.size > 10 * 1024 * 1024) { showToast("Max 10MB"); return; }
    setPfpFile(file);
    const r = new FileReader();
    r.onload = (e) => setPfpPreview(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
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
      setCardId(d.cardId);
      setCardPfpUrl(d.pfpUrl);
      setStep("preview");
    } catch {
      showToast("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    const el = document.getElementById("micmic-card-render");
    if (!el) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 3, useCORS: true, logging: false });
      const a = document.createElement("a");
      a.download = `micmic-${username}-mag${magnitude}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      showToast("Downloaded ✓");
    } catch { showToast("Download failed"); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/card/${cardId}`);
    setCopied(true);
    showToast("Link copied ✓");
    setTimeout(() => setCopied(false), 2500);
  };

  const shareX = () => {
    const url = `${window.location.origin}/card/${cardId}`;
    const text = `i'm magnitude ${magnitude} on seismic — ${tier.name.toLowerCase()} tier\n\n"${tier.description}"\n\nget yours 👇`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const reset = () => {
    setStep("form");
    setPfpFile(null);
    setPfpPreview("");
    setUsername("");
    setCardId("");
    setCardPfpUrl("");
  };

  const canGenerate = username.trim().length > 0 && !!pfpFile && !isLoading;

  return (
    <>
      <SeismicCanvas />

      <div className="page-content min-h-screen flex flex-col">
        {/* ── HEADER ── */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid rgba(196,160,171,0.08)",
        }}>
          <div className="flex items-center gap-3">
            <div className="anim-pulse">
              <SeismicIcon size={30} color="#9B6B80" />
            </div>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "17px", color: "#f0e6ea", lineHeight: 1 }}>
                MicMic Card
              </div>
              <div className="eyebrow" style={{ marginTop: "1px" }}>Seismic Identity</div>
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "100px", padding: "5px 12px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", display: "block" }}
              className="anim-pulse" />
            <span className="eyebrow" style={{ color: "rgba(239,68,68,0.7)" }}>Testnet Live</span>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 60px" }}>

          {/* Hero */}
          {step === "form" && (
            <div style={{ textAlign: "center", padding: "56px 0 48px", maxWidth: "560px" }}
              className={mounted ? "anim-fade-up" : ""}>
              <div className="eyebrow" style={{ marginBottom: "16px" }}>Generate your seismic identity</div>

              <h1 style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(38px, 6vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                marginBottom: "16px",
              }}>
                <span style={{ color: "#f0e6ea" }}>Your Magnitude.</span>
                <br />
                <span className="shimmer-text">Your Card.</span>
              </h1>

              <p style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                color: "rgba(196,160,171,0.6)",
                lineHeight: 1.6,
              }}>
                Upload your PFP, pick your tier,<br />get a card you can flex on X.
              </p>
            </div>
          )}

          {step === "preview" && (
            <div style={{ textAlign: "center", padding: "48px 0 36px" }} className="anim-fade-up">
              <div className="eyebrow" style={{ marginBottom: "10px", color: tier.color }}>card generated</div>
              <h2 style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "32px",
                color: "#f0e6ea", letterSpacing: "-0.02em",
              }}>Here&apos;s your MicMic Card</h2>
            </div>
          )}

          {/* ── FORM ── */}
          {step === "form" && (
            <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "28px" }}
              className="anim-fade-up">

              {/* Upload */}
              <div>
                <p className="eyebrow" style={{ marginBottom: "10px" }}>your pfp</p>
                <div
                  className={`upload-zone rounded-2xl flex flex-col items-center justify-center ${isDragging ? "drag-active" : ""}`}
                  style={{ height: "148px", borderRadius: "16px" }}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                >
                  {pfpPreview ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <div style={{
                        width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden",
                        border: `2px solid ${tier.color}`,
                        boxShadow: `0 0 24px ${tier.color}50`,
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pfpPreview} alt="PFP" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px", color: "#f0e6ea" }}>
                          PFP ready
                        </div>
                        <div className="eyebrow" style={{ marginTop: "3px" }}>tap to change</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: "10px", opacity: 0.4 }}>
                        <Upload size={24} color="#c4a0ab" />
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "14px", color: "rgba(196,160,171,0.7)" }}>
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
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="0xYourHandle"
                  maxLength={32}
                  className="s-input w-full"
                  style={{ borderRadius: "14px", padding: "14px 18px", fontSize: "16px", letterSpacing: "0.02em" }}
                  onKeyDown={(e) => e.key === "Enter" && canGenerate && handleSubmit()}
                />
              </div>

              {/* Magnitude */}
              <MagnitudeSelector selected={magnitude} onChange={setMagnitude} />

              {/* Live preview */}
              {pfpPreview && username && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: "12px" }}>preview</p>
                  <div style={{
                    display: "flex", justifyContent: "center",
                    overflow: "hidden", borderRadius: "14px",
                  }}>
                    <div style={{ transform: "scale(0.62)", transformOrigin: "top center", marginBottom: "-104px" }}>
                      <MicMicCard username={username} magnitude={getTierByLevel(magnitude)} pfpUrl={pfpPreview} />
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                className="btn-primary w-full flex items-center justify-center gap-2"
                style={{ padding: "16px", borderRadius: "16px", fontSize: "16px", fontFamily: "Inter, sans-serif" }}
                onClick={handleSubmit}
                disabled={!canGenerate}
              >
                {isLoading
                  ? <><Loader2 size={18} className="animate-spin" /> Generating your card…</>
                  : <>Generate My MicMic Card <ChevronRight size={17} /></>
                }
              </button>
            </div>
          )}

          {/* ── PREVIEW ── */}
          {step === "preview" && (
            <div style={{ width: "100%", maxWidth: "560px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}
              className="anim-fade-up">

              {/* Card */}
              <div style={{ overflowX: "auto", maxWidth: "100vw", paddingBottom: "4px" }}>
                <MicMicCard
                  username={username}
                  magnitude={tier}
                  pfpUrl={cardPfpUrl}
                  cardId={cardId}
                />
              </div>

              {/* Action buttons */}
              <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button className="btn-primary flex items-center justify-center gap-2"
                  style={{ padding: "13px", borderRadius: "14px", fontSize: "14px", fontFamily: "Inter, sans-serif" }}
                  onClick={handleDownload}>
                  <Download size={15} /> Download PNG
                </button>

                <button className="btn-ghost flex items-center justify-center gap-2"
                  style={{ padding: "13px", borderRadius: "14px", fontSize: "14px", fontFamily: "Inter, sans-serif" }}
                  onClick={handleCopy}>
                  {copied ? <Check size={15} /> : <Link size={15} />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>

              {/* Share on X */}
              <button
                onClick={shareX}
                style={{
                  width: "100%", padding: "13px", borderRadius: "14px",
                  background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "#f0e6ea", fontSize: "14px", fontFamily: "Inter, sans-serif",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>

              {/* Reset */}
              <button
                onClick={reset}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "6px",
                  color: "rgba(196,160,171,0.4)", fontFamily: "'Space Mono', monospace", fontSize: "11px",
                  letterSpacing: "0.1em", transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(196,160,171,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(196,160,171,0.4)")}
              >
                <RotateCcw size={12} /> GENERATE ANOTHER
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: "center", padding: "20px",
          borderTop: "1px solid rgba(196,160,171,0.06)",
        }}>
          <span className="eyebrow">built on seismic · micmic card · 2025</span>
        </footer>
      </div>

      {/* Toast */}
      {toast && (
        <div className="anim-fade-up" style={{
          position: "fixed", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(26,13,19,0.92)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(196,160,171,0.2)", borderRadius: "12px",
          padding: "11px 20px", zIndex: 100,
          fontFamily: "'Space Mono', monospace", fontSize: "12px",
          color: "#f0e6ea", letterSpacing: "0.05em",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
