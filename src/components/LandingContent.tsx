import { AccordionItem } from "@/components/ui/Accordion";
import { YellowButton } from "@/components/ui/YellowButton";
import { ArrowRight } from "lucide-react";

export function LandingContent({ t, user, navigateTo }: any) {
    const faqList = [
        { q: t.faq_q1, a: t.faq_a1 },
        { q: t.faq_q2, a: t.faq_a2 },
        { q: t.faq_q3, a: t.faq_a3 },
        { q: t.faq_q4, a: t.faq_a4 },
        { q: t.faq_q5, a: t.faq_a5 },
    ];

    return (
        <main>
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2000&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0E0E0E]/60 to-[#0E0E0E]" />
                </div>
                <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
                    <div className="text-gray-400 text-sm mb-6 flex items-center gap-2 uppercase tracking-widest">
                        {t.landing_subtitle}
                    </div>
                    <h1
                        className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-snug py-4"
                        dangerouslySetInnerHTML={{ __html: t.landing_title }}
                    />
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed drop-shadow-md">
                        {t.landing_desc}
                    </p>
                    <YellowButton
                        onClick={() =>
                            user ? navigateTo("/workspace") : navigateTo("/login")
                        }
                        className="px-10 py-4 text-lg flex items-center gap-3"
                    >
                        {t.btn_start_studio} <ArrowRight size={20} />
                    </YellowButton>
                    <p className="mt-6 text-xs text-gray-500 font-mono tracking-widest uppercase">
                        {t.landing_bonus}
                    </p>
                </div>
            </section>

            <section className="px-6 md:px-12 max-w-7xl mx-auto py-32">
                <div className="mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                        dangerouslySetInnerHTML={{ __html: t.how_title }}
                    ></h2>
                    <p className="text-gray-400 max-w-xl text-lg">{t.how_desc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        {
                            title: t.step1_title,
                            desc: t.step1_desc,
                            img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=600&auto=format&fit=crop",
                        },
                        {
                            title: t.step2_title,
                            desc: t.step2_desc,
                            img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600&auto=format&fit=crop",
                        },
                        {
                            title: t.step3_title,
                            desc: t.step3_desc,
                            img: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=600&auto=format&fit=crop",
                        },
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col">
                            <h3 className="text-xl font-bold mb-3 flex items-start gap-2">
                                <ArrowRight
                                    className="mt-1 text-gray-500 shrink-0"
                                    size={20}
                                />
                                {step.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed h-12">
                                {step.desc}
                            </p>
                            <div className="mt-auto aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 relative group">
                                <img
                                    src={step.img}
                                    alt={step.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 md:px-12 max-w-4xl mx-auto py-32 border-t border-white/5">
                <h2 className="text-4xl md:text-5xl font-bold mb-12">{t.faq_title}</h2>
                <div className="flex flex-col">
                    {faqList.map((item, i) => (
                        <AccordionItem key={i} q={item.q} a={item.a} />
                    ))}
                </div>
            </section>
        </main>
    );
}
