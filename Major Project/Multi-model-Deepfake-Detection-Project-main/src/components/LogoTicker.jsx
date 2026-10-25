const logos = [
    'NewsCorp',
    'MediaTrust',
    'CyberShield',
    'VerdiTech',
    'SentryLab',
    'PulseMedia',
    'NovaSec',
    'Truthwise',
]

export default function LogoTicker() {
    const doubled = [...logos, ...logos]
    return (
        <section className="py-14 border-y border-slate-100 bg-white">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-400 mb-8">
                    Trusted by leading media &amp; security organizations
                </p>
                <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                    <div className="flex w-max animate-marquee gap-14 items-center">
                        {doubled.map((name, i) => (
                            <span
                                key={i}
                                className="font-display text-xl sm:text-2xl font-bold text-slate-300 whitespace-nowrap"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
