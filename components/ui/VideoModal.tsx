"use client";

import { useEffect, useCallback } from "react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  /** YouTube video ID */
  videoId: string;
  /** Start offset in seconds */
  startSec?: number;
}

export default function VideoModal({ open, onClose, videoId, startSec = 0 }: VideoModalProps) {
  /* ── Close on ESC ── */
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  if (!open) return null;

  const src = `https://www.youtube.com/embed/${videoId}?start=${startSec}&autoplay=1&rel=0&modestbranding=1`;

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.82)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(16px, 4vw, 48px)",
        animation: "fadeIn 180ms ease forwards",
      }}
    >
      {/* Dialog — stop propagation so clicking inside doesn't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,.8), 0 0 0 1px var(--border)",
          animation: "scaleIn 220ms cubic-bezier(.2,0,0,1) forwards",
        }}
      >
        {/* 16 / 9 aspect wrapper */}
        <div style={{ position: "relative", paddingBottom: "56.25%" /* 9/16 */, height: 0 }}>
          <iframe
            src={src}
            title="Product demo video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              border: 0,
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close video"
          style={{
            position: "absolute", top: 12, right: 12,
            width: 34, height: 34, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.2)",
            background: "rgba(0,0,0,.6)",
            color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            fontSize: 18, lineHeight: 1,
            transition: "background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.15)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,.6)";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(.94) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}
