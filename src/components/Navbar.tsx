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

const TopbarSelect = ({ value, onChange, options }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    // Auto-close dropdown when clicking outside
    return (
        <div
            className="relative group flex items-center gap-2 cursor-pointer text-sm font-medium"
            onMouseLeave={() => setIsOpen(false)}
        >
            <div
                className="flex items-center gap-2 px-2 py-1 rounded bg-transparent hover:bg-white/5 transition-colors text-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://flagcdn.com/w20/${options.find((o: any) => o.value === value)?.flagCode}.png`} alt="flag" width={20} className="rounded-sm" />
                <span className="text-gray-300 font-bold tracking-widest">{options.find((o: any) => o.value === value)?.display}</span>
                <ChevronDown size={14} className="text-gray-500" />
            </div>

            {isOpen && (
                <div className="absolute top-full mt-1 right-0 w-max min-w-[140px] bg-[#1A1A24] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-2">
                    {options.map((opt: any) => (
                        <div
                            key={opt.value}
                            className={`flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors ${value === opt.value ? 'bg-white/5 text-[#EEDC00]' : 'text-gray-300'}`}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`https://flagcdn.com/w20/${opt.flagCode}.png`} alt="flag" width={20} className="rounded-sm shadow" />
                            <span className="font-medium tracking-wide">{opt.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

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

                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 pl-4 border-l border-white/10">
                        <TopbarSelect
                            value={language}
                            onChange={setLanguage}
                            options={[
                                { label: "English", value: "English", flagCode: "us", display: "EN" },
                                { label: "繁體中文", value: "繁體中文", flagCode: "tw", display: "TW" },
                                { label: "日本語", value: "日本語", flagCode: "jp", display: "JP" },
                                { label: "한국어", value: "한국어", flagCode: "kr", display: "KR" },
                                { label: "Français", value: "Français", flagCode: "fr", display: "FR" },
                                { label: "Español", value: "Español", flagCode: "es", display: "ES" },
                                { label: "Bahasa Indonesia", value: "Bahasa Indonesia", flagCode: "id", display: "ID" },
                                { label: "हिन्दी", value: "हिन्दी", flagCode: "in", display: "IN" },
                                { label: "Português", value: "Português", flagCode: "pt", display: "PT" },
                                { label: "العربية", value: "العربية", flagCode: "sa", display: "SA" },
                                { label: "বাংলা", value: "বাংলা", flagCode: "bd", display: "BD" },
                                { label: "Русский", value: "Русский", flagCode: "ru", display: "RU" },
                            ]}
                        />
                        <TopbarSelect
                            value={currency}
                            onChange={setCurrency}
                            options={[
                                { label: "USD ($)", value: "USD", flagCode: "us", display: "USD" },
                                { label: "HKD ($)", value: "HKD", flagCode: "hk", display: "HKD" },
                                { label: "TWD (NT$)", value: "TWD", flagCode: "tw", display: "TWD" },
                                { label: "JPY (¥)", value: "JPY", flagCode: "jp", display: "JPY" },
                                { label: "EUR (€)", value: "EUR", flagCode: "eu", display: "EUR" },
                                { label: "KRW (₩)", value: "KRW", flagCode: "kr", display: "KRW" },
                                { label: "GBP (£)", value: "GBP", flagCode: "gb", display: "GBP" },
                                { label: "AUD ($)", value: "AUD", flagCode: "au", display: "AUD" },
                                { label: "CAD ($)", value: "CAD", flagCode: "ca", display: "CAD" },
                                { label: "SGD ($)", value: "SGD", flagCode: "sg", display: "SGD" },
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
