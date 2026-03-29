"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { AppProvider, useAppContext } from "@/components/AppContext";
import GlobalLayout from "@/components/GlobalLayout";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
    return (
        <AppProvider>
            <GlobalLayout>
                <LoginContent />
            </GlobalLayout>
        </AppProvider>
    );
}

function LoginContent() {
    const { t } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/workspace";

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Use full page navigation instead of client-side routing to ensure
            // the middleware can read the newly set Supabase session cookie.
            window.location.href = redirectTo;
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback?next=${redirectTo}`,
            },
        });
        if (error) {
            setError(error.message);
        } else {
            alert("Registration successful! You can now log in.");
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback?next=${redirectTo}`,
            },
        });
        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    const handleDiscordSignIn = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `${location.origin}/auth/callback?next=${redirectTo}`,
            },
        });
        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center -mt-16 py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2000&auto=format&fit=crop"
                    alt="Login Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent" />
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10 bg-[#161616] p-10 rounded-2xl border border-white/10 shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        {t.login_title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        {t.login_desc}
                    </p>
                </div>
                <form className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-white/10 bg-[#0E0E0E] text-white rounded-t-lg focus:outline-none focus:ring-[#EEDC00] focus:border-[#EEDC00] focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-white/10 bg-[#0E0E0E] text-white rounded-b-lg focus:outline-none focus:ring-[#EEDC00] focus:border-[#EEDC00] focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div className="flex gap-4">
                        <button
                            onClick={handleSignIn}
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-[#EEDC00] hover:bg-[#ffe800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EEDC00] disabled:opacity-50 transition-all"
                        >
                            {loading ? "Loading..." : t.login_btn_signin}
                        </button>
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-white/20 text-sm font-bold rounded-xl text-white bg-transparent hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 disabled:opacity-50 transition-all"
                        >
                            {t.login_btn_signup}
                        </button>
                    </div>

                    <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#161616] text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/20 rounded-xl text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/20 disabled:opacity-50 transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            <path fill="none" d="M1 1h22v22H1z" />
                        </svg>
                        Sign in with Google
                    </button>

                    <button
                        type="button"
                        onClick={handleDiscordSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/20 rounded-xl text-white bg-[#5865F2]/10 hover:bg-[#5865F2]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2]/50 disabled:opacity-50 transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#5865F2">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.93 19.93 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Sign in with Discord
                    </button>
                    <div className="text-center mt-6">
                        <a href="/privacy" className="text-xs text-gray-500 hover:text-[#EEDC00] transition-colors uppercase tracking-widest font-bold">
                            {t.footer_privacy}
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
