import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const AccordionItem = ({ q, a }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-medium text-white group-hover:text-gray-300 transition-colors">
                    {q}
                </span>
                <ChevronDown
                    className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : ""
                        }`}
                />
            </button>
            {isOpen && (
                <div className="overflow-hidden animate-fade-in">
                    <p className="pb-6 text-gray-400 leading-relaxed text-sm pr-12">
                        {a}
                    </p>
                </div>
            )}
        </div>
    );
};
