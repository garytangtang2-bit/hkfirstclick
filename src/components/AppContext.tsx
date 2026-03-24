"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LANG_CODE_TO_NAME } from "@/utils/langMapping";

import en from "../locales/en.json";
import zh from "../locales/zh.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";
import fr from "../locales/fr.json";
import es from "../locales/es.json";
import id from "../locales/id.json";
import hi from "../locales/hi.json";
import pt from "../locales/pt.json";
import ar from "../locales/ar.json";
import bn from "../locales/bn.json";
import ru from "../locales/ru.json";

export const locales: Record<string, any> = {
    "English": en,
    "繁體中文": zh,
    "日本語": ja,
    "한국어": ko,
    "Français": fr,
    "Español": es,
    "Bahasa Indonesia": id,
    "हिन्दी": hi,
    "Português": pt,
    "العربية": ar,
    "বাংলা": bn,
    "Русский": ru,
};

const AppContext = createContext<any>(null);

export const AppProvider = ({ children, initialLanguage }: { children: ReactNode; initialLanguage?: string }) => {
    const [language, setLanguage] = useState(initialLanguage || "English");
    const [currency, setCurrency] = useState("USD");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let targetLang = initialLanguage || "English";
        if (typeof window !== "undefined") {
            if (!initialLanguage) {
                // No URL-specified language: use localStorage first, then browser language
                const savedLang = localStorage.getItem("hkfirstclick_lang");
                if (savedLang && locales[savedLang]) {
                    targetLang = savedLang;
                } else {
                    // No saved preference: detect from browser language
                    const browserLang = navigator.language.toLowerCase();
                    if (browserLang.includes("zh")) targetLang = "繁體中文";
                    else if (browserLang.includes("ja")) targetLang = "日本語";
                    else if (browserLang.includes("ko")) targetLang = "한국어";
                    else if (browserLang.includes("fr")) targetLang = "Français";
                    else if (browserLang.includes("es")) targetLang = "Español";
                    else if (browserLang.includes("id")) targetLang = "Bahasa Indonesia";
                    else if (browserLang.includes("hi")) targetLang = "हिन्दी";
                    else if (browserLang.includes("pt")) targetLang = "Português";
                    else if (browserLang.includes("ar")) targetLang = "العربية";
                    else if (browserLang.includes("bn")) targetLang = "বাংলা";
                    else if (browserLang.includes("ru")) targetLang = "Русский";
                }
            }
            // initialLanguage (from URL) always wins — do NOT let localStorage override it

            // URL ?lang= param has highest priority (supports both "en" code and "English" name)
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get("lang");
            if (urlLang) {
                const decoded = decodeURIComponent(urlLang);
                if (locales[decoded]) {
                    targetLang = decoded; // full name e.g. "English"
                } else if (LANG_CODE_TO_NAME[decoded] && locales[LANG_CODE_TO_NAME[decoded]]) {
                    targetLang = LANG_CODE_TO_NAME[decoded]; // code e.g. "en" → "English"
                }
            }

            const savedCurrency = localStorage.getItem("hkfirstclick_currency");
            if (savedCurrency) {
                setCurrency(savedCurrency);
            }
        }
        setLanguage(targetLang);
        setMounted(true);
    }, [initialLanguage]);

    const handleSetLanguage = (lang: string) => {
        setLanguage(lang);
        localStorage.setItem("hkfirstclick_lang", lang);
        // URL updates are handled by GlobalLayout (router.push) — do NOT pushState here
        // to avoid conflicting with catalog/destination page navigation
    };

    const handleSetCurrency = (curr: string) => {
        setCurrency(curr);
        localStorage.setItem("hkfirstclick_currency", curr);
    };

    const t = locales[language] || locales["English"];

    if (!mounted) return null;

    return (
        <AppContext.Provider value={{ language, setLanguage: handleSetLanguage, currency, setCurrency: handleSetCurrency, t }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
