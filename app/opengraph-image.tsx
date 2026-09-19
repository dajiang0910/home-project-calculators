import { ImageResponse } from "next/og";

export const alt = "Project Buy List — measure once, buy with confidence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#f5f9ff", color: "#142d50", fontFamily: "Arial, sans-serif", padding: "72px" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", opacity: .18, backgroundImage: "linear-gradient(#125de6 1px, transparent 1px), linear-gradient(90deg, #125de6 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      <div style={{ display: "flex", width: "100%", position: "relative", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 28, fontWeight: 700 }}>
          <div style={{ width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "#125de6", color: "#fff", fontSize: 18 }}>PBL</div>
          Project Buy List
        </div>
        <div style={{ display: "flex", maxWidth: 900, flexDirection: "column" }}>
          <div style={{ color: "#125de6", fontSize: 22, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Practical estimates for real projects</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, fontSize: 78, fontWeight: 750, letterSpacing: -4, lineHeight: 1 }}><span>Measure once.</span><span>Buy with confidence.</span></div>
        </div>
        <div style={{ display: "flex", gap: 28, color: "#496386", fontSize: 20 }}><span>Materials</span><span>Waste</span><span>Packages</span><span>Cost</span></div>
      </div>
    </div>,
    size,
  );
}
