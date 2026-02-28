import React from "react";

export const YellowButton = ({ children, onClick, className = "", disabled = false }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`bg-[#EEDC00] hover:bg-[#ffe800] text-black px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(238,220,0,0.3)] hover:shadow-[0_0_25px_rgba(238,220,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${className}`}
    >
        {children}
    </button>
);
