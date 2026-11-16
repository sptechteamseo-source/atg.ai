import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-sunken": "var(--bg-sunken)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        "fg-subtle": "var(--fg-subtle)",
        "fg-inverted": "var(--fg-inverted)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-fg": "var(--accent-fg)",
        action: "var(--action)",
        "action-fg": "var(--action-fg)",
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        label: ["var(--font-label)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "9999px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        DEFAULT: "var(--dur)",
        slow: "var(--dur-slow)",
      },
      transitionTimingFunction: {
        ease: "var(--ease)",
      },
      maxWidth: {
        site: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
