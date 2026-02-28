"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState("English");
    const [currency, setCurrency] = useState("USD");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let targetLang = "English";
        if (typeof window !== "undefined") {
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

            const savedLang = localStorage.getItem("hkfirstclick_lang");
            if (savedLang && locales[savedLang]) {
                targetLang = savedLang;
            }
            const savedCurrency = localStorage.getItem("hkfirstclick_currency");
            if (savedCurrency) {
                setCurrency(savedCurrency);
            }
        }
        setLanguage(targetLang);
        setMounted(true);
    }, []);

    const handleSetLanguage = (lang: string) => {
        setLanguage(lang);
        localStorage.setItem("hkfirstclick_lang", lang);
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
