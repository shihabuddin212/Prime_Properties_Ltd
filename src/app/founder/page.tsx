import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Md Ariful Islam — Founder & CEO | Prime Properties BD',
    description: 'Learn about Md Ariful Islam, the Founder & CEO of Prime Properties BD — his journey from an engineering graduate to building one of Bangladesh\'s most dependable real estate firms.',
};

export default function FounderPage() {
    return (
        <main className="min-h-screen bg-primary-navy text-white">

            {/* ── HERO SECTION ── */}
            {/* Full photo, no crop — stacked layout (image on top, name below) */}
            <section className="w-full bg-[#0a0f1e]">

                {/* Full photo — natural aspect ratio, no crop, full brightness */}
                <div className="w-full overflow-hidden">
                    <img
                        src="/ariful-islam.jpg"
                        alt="Md Ariful Islam — Founder & CEO, Prime Properties BD"
                        className="w-full h-auto object-contain block"
                    />
                </div>

                {/* Name / title block — sits directly below the photo */}
                <div className="w-full bg-primary-navy border-t border-luxury-gold/30 px-6 sm:px-10 lg:px-16 py-8 sm:py-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="h-px w-16 bg-luxury-gold mb-5" />
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">
                            Md Ariful Islam
                        </h1>
                        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-luxury-gold font-semibold mt-2">
                            Founder &amp; CEO — Prime Properties BD
                        </p>
                    </div>
                </div>
            </section>

            {/* ── ABOUT ME CONTENT ── */}
            <section className="bg-primary-navy py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">

                        {/* Left column — heading / label */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-bold mb-3">About Me</p>
                                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                    The Story<br />Behind PPD
                                </h2>
                                <div className="h-1 w-12 bg-luxury-gold mt-5 rounded-full" />
                            </div>

                            {/* Sticky stat box */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                {[
                                    { value: '10+', label: 'Years of Experience' },
                                    { value: '50+', label: 'Projects Delivered' },
                                    { value: '1000+', label: 'Happy Families' },
                                    { value: '100%', label: 'Commitment' },
                                ].map((s) => (
                                    <div key={s.label} className="border border-white/10 rounded-xl p-4 bg-white/5">
                                        <p className="text-2xl font-extrabold text-luxury-gold">{s.value}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 leading-snug">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right column — article body */}
                        <article className="lg:col-span-8 space-y-7 text-gray-300 text-[15px] leading-[1.95] font-light">
                            <p>
                                I am <strong className="text-white font-semibold">Md Ariful Islam</strong>. Years ago, right after graduating with an engineering degree, I took a leap of faith to launch my own enterprise. I had no capital, no industry experience, and no foolproof blueprint for the future. All I had was an intense, almost irrational drive to build something meaningful and successful. Looking back, embarking on that journey without financial backing or domain expertise seemed logically bound for failure.
                            </p>

                            <p>
                                By the grace of Allah, that early struggle turned into a remarkable journey. What started as a daring dream has now established itself as <strong className="text-white font-semibold">Prime Properties BD (PPD)</strong>—one of Bangladesh's most dependable and progressive real estate development firms. In the early days, my naivety was perhaps a blessing in disguise; it shielded me from overthinking the risks. Today, experience has turned me into a strategic analyst. Had I overanalyzed my circumstances back then, logic would have dictated abandoning the idea altogether. That experience proved a crucial entrepreneurial principle: achieving big goals requires absolute courage, relentless optimism, and a burning conviction. Hesitation and fear of failure have no place on the path to success.
                            </p>

                            {/* Pull-quote */}
                            <blockquote className="border-l-4 border-luxury-gold pl-6 py-2 my-6 bg-white/5 rounded-r-xl">
                                <p className="text-white text-lg md:text-xl italic font-light leading-relaxed">
                                    "Achieving big goals requires absolute courage, relentless optimism, and a burning conviction."
                                </p>
                                <footer className="mt-3 text-xs text-luxury-gold uppercase tracking-widest font-semibold">— Md Ariful Islam</footer>
                            </blockquote>

                            <p>
                                At Prime Properties BD (PPD), our success is driven primarily by our work culture. We hold ourselves to a strict standard of core values, ensuring that every team member shares the same commitment to integrity. We maintain an open policy where honest operational mistakes are understood as learning opportunities, but intentional deviations from our core ethics are strictly unacceptable. This strong foundation builds an environment where only dedicated professionals thrive, fostering a team that is deeply aligned and motivated. While many talk about having top talent, it is our environment and values that truly empower our people to achieve exceptional results. For us, our team is undoubtedly our biggest asset.
                            </p>

                            <p>
                                Frequently, aspiring founders and young professionals in the real estate sector reach out seeking advice on navigating business challenges. I firmly believe that senior leaders have a responsibility to mentor and empower the next generation in Bangladesh's evolving corporate landscape. Through this platform, I intend to share practical reflections on business management, strategic planning, leadership, and sector insights. Additionally, maintaining physical health and a disciplined lifestyle is something I hold close to my heart, so I will also occasionally touch upon wellness and balance—key ingredients for long-term achievement.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* ── FOOTER CTA STRIP ── */}
            <section className="bg-black/40 border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-1">Connect with Prime Properties BD</p>
                        <p className="text-white text-lg font-semibold">Building futures, one home at a time.</p>
                    </div>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-luxury-gold hover:bg-yellow-500 text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full transition shadow-lg"
                    >
                        Get in Touch
                    </a>
                </div>
            </section>

        </main>
    );
}
