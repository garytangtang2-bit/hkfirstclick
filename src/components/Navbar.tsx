import {
    ChevronDown,
    Globe,
    Coins,
    LogOut,
    User,
    Loader2,
    Menu,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NavItem = ({ label, hasDropdown = false, onClick }: any) => (
    <div
        onClick={onClick}
        className="flex items-center gap-1 text-sm font-medium text-white hover:text-[#EEDC00] cursor-pointer transition-colors whitespace-nowrap"
    >
        {label} {hasDropdown && <ChevronDown size={14} className="text-gray-400" />}
    </div>
);

const TopbarSelect = ({ icon: Icon, value, onChange, options }: any) => (
    <div className="relative group flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer text-sm font-medium">
        <Icon size={14} />
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent border-none outline-none appearance-none cursor-pointer text-gray-400 group-hover:text-white pr-4 tracking-wider"
        >
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value} className="bg-[#161616] text-white py-2">
                    {opt.label}
                </option>
            ))}
        </select>
        <ChevronDown size={12} className="absolute right-0 pointer-events-none" />
    </div>
);

export function Navbar({
    user,
    profile,
    credits,
    handleSignOut,
    t,
    language,
    setLanguage,
    currency,
    setCurrency,
    navigateTo,
}: any) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#0E0E0E]/90 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-6 md:px-8">
                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-[#EEDC00] tracking-tighter cursor-pointer"
                    >
                        HKfirstclick
                    </Link>
                    <div className="hidden lg:flex items-center gap-6">
                        <NavItem label={t.nav_itinerary} onClick={() => navigateTo("/workspace")} />
                        <NavItem label="My Trips" onClick={() => navigateTo("/my-trips")} />
                        <NavItem label={t.nav_map} onClick={() => navigateTo("/map")} />
                        <NavItem label={t.nav_catalog} onClick={() => navigateTo("/catalog")} />
                        <NavItem
                            label={t.nav_flights}
                            onClick={() => navigateTo("/flights")}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 pl-4 border-l border-white/10">
                        <TopbarSelect
                            icon={Globe}
                            value={language}
                            onChange={setLanguage}
                            options={[
                                { label: "🇺🇸 English", value: "English" },
                                { label: "🇹🇼 繁體中文", value: "繁體中文" },
                                { label: "🇯🇵 日本語", value: "日本語" },
                                { label: "🇰🇷 한국어", value: "한국어" },
                                { label: "🇫🇷 Français", value: "Français" },
                                { label: "🇪🇸 Español", value: "Español" },
                                { label: "🇮🇩 Bahasa Indonesia", value: "Bahasa Indonesia" },
                                { label: "🇮🇳 हिन्दी", value: "हिन्दी" },
                                { label: "🇵🇹 Português", value: "Português" },
                                { label: "🇸🇦 العربية", value: "العربية" },
                                { label: "🇧🇩 বাংলা", value: "বাংলা" },
                                { label: "🇷🇺 Русский", value: "Русский" },
                            ]}
                        />
                        <TopbarSelect
                            icon={Coins}
                            value={currency}
                            onChange={setCurrency}
                            options={[
                                { label: "🇺🇸 USD", value: "USD" },
                                { label: "🇭🇰 HKD", value: "HKD" },
                                { label: "🇹🇼 TWD", value: "TWD" },
                                { label: "🇯🇵 JPY", value: "JPY" },
                                { label: "🇪🇺 EUR", value: "EUR" },
                                { label: "🇰🇷 KRW", value: "KRW" },
                                { label: "🇬🇧 GBP", value: "GBP" },
                                { label: "🇦🇺 AUD", value: "AUD" },
                                { label: "🇨🇦 CAD", value: "CAD" },
                                { label: "🇸🇬 SGD", value: "SGD" },
                            ]}
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <span
                            className="hover:text-[#EEDC00] cursor-pointer whitespace-nowrap transition-colors"
                            onClick={() => navigateTo("/pricing")}
                        >
                            {t.nav_pricing}
                        </span>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] text-gray-400">
                                    {user.email?.split("@")[0]}
                                </span>
                                <span className="text-xs font-bold text-[#EEDC00]">
                                    {profile ? (
                                        `${credits} Credits`
                                    ) : (
                                        <Loader2 size={12} className="animate-spin" />
                                    )}
                                </span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                                title="登出"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigateTo("/login")}
                            className="bg-[#EEDC00]/10 border border-[#EEDC00]/30 text-[#EEDC00] px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-[#EEDC00] hover:text-black transition-all"
                        >
                            <User size={16} /> {t.nav_login}
                        </button>
                    )}

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-white"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div className="fixed top-16 left-0 w-full bg-[#161616] border-b border-white/10 z-[60] p-6 flex flex-col gap-6 lg:hidden shadow-2xl">
                    <div className="flex flex-col gap-4 text-base font-bold">
                        <span
                            className="text-white hover:text-[#EEDC00] cursor-pointer"
                            onClick={() => navigateTo("/workspace")}
                        >
                            {t.nav_itinerary}
                        </span>
                        <span
                            className="text-white hover:text-[#EEDC00] cursor-pointer"
                            onClick={() => navigateTo("/my-trips")}
                        >
                            My Trips
                        </span>
                        <span
                            className="text-white hover:text-[#EEDC00] cursor-pointer"
                            onClick={() => navigateTo("/map")}
                        >
                            {t.nav_map}
                        </span>
                        <span
                            className="text-white hover:text-[#EEDC00] cursor-pointer"
                            onClick={() => navigateTo("/catalog")}
                        >
                            {t.nav_catalog}
                        </span>
                        <span
                            className="text-white hover:text-[#EEDC00] cursor-pointer"
                            onClick={() => navigateTo("/pricing")}
                        >
                            {t.nav_pricing}
                        </span>
                        <span
                            className="text-white hover:text-[#EEDC00] cursor-pointer"
                            onClick={() => navigateTo("/login")}
                        >
                            {t.nav_login}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}
