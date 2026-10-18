import type React from "react";
import { Img, staticFile } from "remotion";
import { display, masthead } from "../engine/fonts";

/** Filler column lines: grey bars that read as small print at a glance. */
const Columns: React.FC<{ readonly seed: number; readonly rows: number }> = ({ seed, rows }) => (
  <div style={{ display: "flex", gap: 14 }}>
    {[0, 1, 2].map((col) => (
      <div key={col} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            style={{
              height: 7,
              width: `${72 + ((seed * 31 + col * 17 + i * 13) % 28)}%`,
              backgroundColor: "rgba(40,30,20,0.55)",
            }}
          />
        ))}
      </div>
    ))}
  </div>
);

/** A front page built in code: aged paper, masthead, giant headline, columns. */
export const Newspaper: React.FC<{
  readonly name: string;
  readonly date: string;
  readonly headline: React.ReactNode;
  readonly headlineColor?: string;
  readonly headlineSize?: number;
  readonly seed: number;
  readonly style?: React.CSSProperties;
}> = ({ name, date, headline, headlineColor = "#1d1610", headlineSize = 168, seed, style }) => (
  <div
    style={{
      position: "absolute",
      width: 640,
      height: 860,
      padding: "30px 34px",
      boxSizing: "border-box",
      backgroundColor: "#e6d7b6",
      color: "#1d1610",
      overflow: "hidden",
      boxShadow: "0 30px 60px rgba(0,0,0,0.55), 0 6px 14px rgba(0,0,0,0.4)",
      ...style,
    }}
  >
    <Img
      src={staticFile("assets/paper-wall.jpg")}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        mixBlendMode: "multiply",
        opacity: 0.5,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(255,240,200,0) 40%, rgba(120,80,30,0.35) 100%)",
      }}
    />
    <div style={{ position: "relative" }}>
      <div
        style={{
          fontFamily: masthead,
          fontWeight: 700,
          fontSize: 62,
          textAlign: "center",
          letterSpacing: 1,
          lineHeight: 1,
        }}
      >
        {name}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "3px solid #1d1610",
          borderBottom: "1px solid #1d1610",
          marginTop: 10,
          padding: "4px 0",
          fontFamily: masthead,
          fontSize: 17,
          textTransform: "uppercase",
        }}
      >
        <span>Vol. CXLIX</span>
        <span>{date}</span>
        <span>Price 50¢</span>
      </div>
      <div
        style={{
          fontFamily: display,
          fontSize: headlineSize,
          lineHeight: 0.92,
          textAlign: "center",
          textTransform: "uppercase",
          color: headlineColor,
          margin: "18px 0 16px",
        }}
      >
        {headline}
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <div
          style={{
            width: 230,
            height: 190,
            backgroundColor: "rgba(40,30,20,0.75)",
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0 3px, transparent 3px 7px)",
          }}
        />
        <div style={{ flex: 1 }}>
          <Columns seed={seed} rows={12} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <Columns seed={seed + 3} rows={14} />
      </div>
    </div>
  </div>
);
