"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) setVisible(true);
    }, []);

    const accept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem("cookie_consent", "declined");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 print:hidden">
            <div className="max-w-4xl mx-auto bg-[#161616] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 text-sm text-gray-300">
                    <p className="font-bold text-white mb-1">🍪 We use cookies</p>
                    <p>
                        We use cookies to improve your experience, remember your preferences, and track referrals from our affiliate program.
                        By continuing to use this site, you consent to our use of cookies.{" "}
                        <Link href="/privacy" className="text-[#EEDC00] underline hover:text-yellow-300">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={decline}
                        className="px-4 py-2 rounded-xl text-sm font-bold border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        className="px-5 py-2 rounded-xl text-sm font-bold bg-[#EEDC00] text-black hover:bg-yellow-300 transition-colors"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
