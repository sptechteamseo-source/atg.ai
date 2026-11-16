"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";
import { Sun, Moon } from "@/components/icons/Icons";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button className="icon-btn" aria-label="Toggle theme" style={{
        width: 34, height: 34,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: 9999,
        background: "transparent",
        border: "1px solid var(--border)",
        color: "var(--fg-muted)",
      }} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      className="icon-btn"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      style={{
        width: 34, height: 34,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: 9999,
        background: "transparent",
        border: "1px solid var(--border)",
        color: "var(--fg-muted)",
        cursor: "pointer",
        transition: "color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease)",
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
