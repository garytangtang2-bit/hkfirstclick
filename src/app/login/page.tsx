"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { AppProvider, useAppContext } from "@/components/AppContext";
import GlobalLayout from "@/components/GlobalLayout";
import { useRouter } from "next/navigation";

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
            router.push("/workspace");
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
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });
        if (error) {
            setError(error.message);
        } else {
            alert("Registration successful! You can now log in.");
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
                </form>
            </div>
        </div>
    );
}
