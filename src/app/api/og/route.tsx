import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get("destination") || "";
    const lang = searchParams.get("lang") || "en";

    const cityName = destination.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const langLabels: Record<string, string> = {
        en: "English", zh: "繁體中文", ja: "日本語", ko: "한국어",
        fr: "Français", es: "Español", id: "Bahasa Indonesia",
        hi: "हिन्दी", pt: "Português", ar: "العربية", bn: "বাংলা", ru: "Русский",
    };
    const langLabel = langLabels[lang] || "English";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    background: "linear-gradient(135deg, #0A0A0A 0%, #1a0a2e 60%, #0A0A0A 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    fontFamily: "sans-serif",
                    padding: "60px 72px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Purple glow top right */}
                <div style={{
                    position: "absolute", top: "-50px", right: "-50px",
                    width: "500px", height: "500px",
                    background: "radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, transparent 70%)",
                    display: "flex",
                }} />
                {/* Yellow glow bottom left */}
                <div style={{
                    position: "absolute", bottom: "-80px", left: "-60px",
                    width: "400px", height: "350px",
                    background: "radial-gradient(ellipse, rgba(238,220,0,0.2) 0%, transparent 70%)",
                    display: "flex",
                }} />

                {/* Top bar */}
                <div style={{
                    position: "absolute", top: "48px", left: "72px", right: "72px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "44px", height: "44px", borderRadius: "12px",
                            background: "linear-gradient(135deg, #EEDC00, #f59e0b)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "20px", fontWeight: "900", color: "#0A0A0A",
                        }}>HK</div>
                        <span style={{ fontSize: "24px", fontWeight: "900", color: "#EEDC00" }}>HKfirstclick</span>
                    </div>
                    <div style={{
                        padding: "8px 18px",
                        background: "rgba(168,85,247,0.2)",
                        border: "1px solid rgba(168,85,247,0.4)",
                        borderRadius: "100px",
                        fontSize: "18px", color: "rgba(255,255,255,0.8)",
                        display: "flex",
                    }}>
                        {langLabel}
                    </div>
                </div>

                {/* Tag */}
                <div style={{
                    fontSize: "18px", fontWeight: "700", color: "#EEDC00",
                    textTransform: "uppercase", letterSpacing: "3px",
                    marginBottom: "20px", display: "flex",
                }}>
                    AI Travel Itinerary
                </div>

                {/* City Name */}
                <div style={{
                    fontSize: cityName.length > 12 ? "64px" : "96px",
                    fontWeight: "900", color: "#ffffff",
                    lineHeight: 1, letterSpacing: "-3px",
                    marginBottom: "24px", display: "flex",
                }}>
                    {cityName}
                </div>

                {/* Description */}
                <div style={{
                    fontSize: "26px", color: "rgba(255,255,255,0.55)",
                    marginBottom: "0px", display: "flex",
                }}>
                    Complete day-by-day itinerary • Powered by AI
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
