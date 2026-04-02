"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import GlobalLayout from "@/components/GlobalLayout";
import { AppProvider } from "@/components/AppContext";

export default function ResetPasswordPage() {
    return (
        <AppProvider>
            <GlobalLayout>
                <ResetPasswordContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function ResetPasswordContent() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return setError("Passwords do not match.");
        if (password.length < 6) return setError("Password must be at least 6 characters.");
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setDone(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#161616] border border-white/10 rounded-2xl p-10 shadow-2xl">
                <h2 className="text-2xl font-black text-white mb-2 text-center">Set New Password</h2>
                <p className="text-gray-400 text-sm text-center mb-8">Enter your new password below.</p>

                {done ? (
                    <div className="text-center space-y-4">
                        <div className="text-4xl">✅</div>
                        <p className="text-white font-bold">Password updated successfully.</p>
                        <a href="/login" className="inline-block bg-[#EEDC00] text-black font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors">
                            Sign In
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        <input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            className="w-full bg-[#0E0E0E] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EEDC00] transition-colors"
                        />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#EEDC00] text-black font-black py-3 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
