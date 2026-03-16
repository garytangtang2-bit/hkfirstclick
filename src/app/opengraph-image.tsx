import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HKfirstclick — AI Travel Itinerary Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    background: "linear-gradient(135deg, #0A0A0A 0%, #1a0a2e 50%, #0A0A0A 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Background glow effects */}
                <div
                    style={{
                        position: "absolute",
                        top: "-100px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "800px",
                        height: "400px",
                        background: "radial-gradient(ellipse, rgba(168,85,247,0.25) 0%, transparent 70%)",
                        display: "flex",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-80px",
                        left: "100px",
                        width: "400px",
                        height: "300px",
                        background: "radial-gradient(ellipse, rgba(238,220,0,0.15) 0%, transparent 70%)",
                        display: "flex",
                    }}
                />

                {/* Logo + Brand */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #EEDC00, #f59e0b)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            fontWeight: "900",
                            color: "#0A0A0A",
                        }}
                    >
                        HK
                    </div>
                    <span style={{ fontSize: "32px", fontWeight: "900", color: "#EEDC00", letterSpacing: "-1px" }}>
                        HKfirstclick
                    </span>
                </div>

                {/* Main headline */}
                <div
                    style={{
                        fontSize: "64px",
                        fontWeight: "900",
                        color: "#ffffff",
                        textAlign: "center",
                        lineHeight: 1.1,
                        letterSpacing: "-2px",
                        maxWidth: "900px",
                        marginBottom: "24px",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    AI Travel Itinerary
                    <span style={{ color: "#EEDC00", marginLeft: "16px" }}>Generator</span>
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: "26px",
                        color: "rgba(255,255,255,0.6)",
                        textAlign: "center",
                        maxWidth: "700px",
                        marginBottom: "40px",
                        display: "flex",
                    }}
                >
                    Plan perfect trips to 54+ destinations in 12 languages
                </div>

                {/* Feature pills */}
                <div style={{ display: "flex", gap: "16px" }}>
                    {["✈️ Real Flight Prices", "🏨 Hotel Picks", "🗺️ Day-by-Day Plans", "🤖 Powered by AI"].map((text) => (
                        <div
                            key={text}
                            style={{
                                padding: "10px 20px",
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "100px",
                                fontSize: "18px",
                                color: "rgba(255,255,255,0.85)",
                                display: "flex",
                            }}
                        >
                            {text}
                        </div>
                    ))}
                </div>

                {/* Bottom URL */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "32px",
                        fontSize: "18px",
                        color: "rgba(255,255,255,0.35)",
                        display: "flex",
                    }}
                >
                    www.hkfirstclick.com
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
