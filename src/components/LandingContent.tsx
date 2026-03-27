import { AccordionItem } from "@/components/ui/Accordion";
import { YellowButton } from "@/components/ui/YellowButton";
import { ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";

export function LandingContent({ t, user, navigateTo }: any) {
    const faqList = [
        { q: t.faq_q1, a: t.faq_a1 },
        { q: t.faq_q2, a: t.faq_a2 },
        { q: t.faq_q3, a: t.faq_a3 },
        { q: t.faq_q4, a: t.faq_a4 },
        { q: t.faq_q5, a: t.faq_a5 },
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqList.map(({ q, a }) => ({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": { "@type": "Answer", "text": a },
        })),
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2000&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover opacity-50 cinematic-img"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0F1E]/60 to-[#0A0F1E]" />
                </div>
                <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
                    <div className="text-[#00D2FF] text-sm mb-6 flex items-center gap-2 uppercase tracking-widest font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse"></span>
                        {t.landing_subtitle}
                    </div>
                    <h1
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-2xl leading-tight md:leading-snug py-2 md:py-4 heading-premium px-2"
                        dangerouslySetInnerHTML={{ __html: t.landing_title }}
                    />
                    <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl leading-relaxed drop-shadow-md text-muted-premium px-4 md:px-0">
                        {t.landing_desc}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                        <YellowButton
                            onClick={() => navigateTo("/workspace-check")}
                            className="w-full sm:w-auto px-8 py-3.5 md:px-10 md:py-4 text-base md:text-lg flex items-center justify-center gap-3 premium-btn shadow-[0_0_30px_rgba(238,220,0,0.3)] hover:shadow-[0_0_50px_rgba(238,220,0,0.5)] [transition:transform_300ms_ease,box-shadow_300ms_ease,background-color_300ms_ease] hover:-translate-y-1"
                        >
                            {t.btn_start_studio} <ArrowRight size={20} />
                        </YellowButton>
                    </div>
                    <p className="mt-6 text-xs text-gray-500 font-mono tracking-widest uppercase premium-glass-card px-4 py-2 border border-white/5 inline-block">
                        {t.landing_bonus}
                    </p>
                </div>
            </section>

            <section className="px-6 md:px-12 max-w-7xl mx-auto py-20 md:py-32">
                <div className="mb-12 md:mb-16 text-center md:text-left">
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight heading-premium"
                        dangerouslySetInnerHTML={{ __html: t.how_title }}
                    ></h2>
                    <p className="text-muted-premium max-w-xl text-base md:text-lg mx-auto md:mx-0">{t.how_desc}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
                        <div key={i} className="flex flex-col premium-glass-card p-6 h-full cursor-pointer group">
                            <h3 className="text-xl font-bold mb-3 flex items-start gap-3 heading-premium">
                                <span className="bg-[#00D2FF]/10 text-[#00D2FF] w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0">
                                    {i + 1}
                                </span>
                                {step.title}
                            </h3>
                            <p className="text-muted-premium text-sm mb-8 leading-relaxed flex-grow">
                                {step.desc}
                            </p>
                            <div className="mt-auto aspect-[4/3] rounded-2xl overflow-hidden relative border border-white/5">
                                <img
                                    src={step.img}
                                    alt={step.title}
                                    className="w-full h-full object-cover cinematic-img transition-transform duration-700 ease-in-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/80 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Affiliate Banner */}
            <section className="px-6 md:px-12 max-w-7xl mx-auto pb-16 md:pb-24">
                <Link href="/affiliate">
                    <div className="group relative overflow-hidden bg-[#0E0E0E] border border-[#EEDC00]/20 hover:border-[#EEDC00]/50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer transition-all duration-300 hover:shadow-[0_0_60px_rgba(238,220,0,0.08)]">
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#EEDC00]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#EEDC00]/10 transition-all duration-500" />
                        <div className="relative flex-1">
                            <div className="inline-flex items-center gap-2 bg-[#EEDC00]/10 text-[#EEDC00] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4 border border-[#EEDC00]/20">
                                <DollarSign size={12} />
                                {t.aff_title}
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-white mb-3">
                                {t.aff_terms_commission} <span className="text-[#EEDC00]">30%</span> {t.aff_terms_commission_val}
                            </h2>
                            <p className="text-gray-400 max-w-lg text-sm md:text-base leading-relaxed">
                                {t.aff_join_desc}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-500">
                                <span className="flex items-center gap-1.5">✓ {t.aff_terms_method_val}</span>
                                <span className="flex items-center gap-1.5">✓ {t.aff_terms_fees_val}</span>
                            </div>
                        </div>
                        <div className="relative shrink-0">
                            <div className="bg-[#EEDC00] text-black font-black px-8 py-4 rounded-2xl group-hover:bg-yellow-300 transition-colors flex items-center gap-2 text-sm md:text-base">
                                {t.aff_btn_get_link} <ArrowRight size={18} />
                            </div>
                        </div>
                    </div>
                </Link>
            </section>

            <section className="px-6 md:px-12 max-w-4xl mx-auto py-20 md:py-32 border-t border-white/5">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold heading-premium mb-4">{t.faq_title}</h2>
                    <div className="w-16 md:w-24 h-1 bg-[#00D2FF] mx-auto rounded-full opacity-50"></div>
                </div>
                <div className="flex flex-col gap-4">
                    {faqList.map((item, i) => (
                        <AccordionItem key={i} q={item.q} a={item.a} />
                    ))}
                </div>
            </section>
        </main>
    );
}
