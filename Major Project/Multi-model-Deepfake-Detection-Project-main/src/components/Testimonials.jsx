import { motion } from 'framer-motion'
import { StarIcon, QuoteIcon } from './icons'

const testimonials = [
    {
        name: 'Pawan Shigwan',
        role: 'Head of Digital Trust, NewsCorp',
        quote:
            'DeepGuard caught a synthetic CEO video that slipped past our manual review team. This tool is now an essential part of our verification pipeline.',
        color: 'bg-indigo-400',
    },
    {
        name: 'Om Chavan',
        role: 'Security Lead, CyberShield',
        quote:
            'The confidence heatmaps are brilliant. We can immediately show stakeholders exactly where and why a video was flagged as manipulated.',
        color: 'bg-violet-400',
    },
    {
        name: 'Rohit Tarange',
        role: 'Investigative Journalist',
        quote:
            'As a journalist, I deal with misinformation daily. DeepGuard gives me fast, reliable results I can quote with total confidence.',
        color: 'bg-orange-300',
    },
    {
        name: 'Sairaj Sutar',
        role: 'CTO, Sentinel Exchange',
        quote:
            'The RESTful API integrates perfectly with our fraud systems. Sub-second latency and enterprise-grade accuracy — exactly what we needed.',
        color: 'bg-sky-400',
    },
]

export default function Testimonials() {
    return (
        <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white">
            <div className="blob w-[380px] h-[380px] bg-orange-200 top-[-80px] right-[-80px]" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                        Testimonials
                    </span>
                    <h2 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                        Loved by <span className="gradient-text">trusted teams</span>
                    </h2>
                    <p className="mt-5 text-lg text-slate-600">
                        From newsrooms to security teams, organizations rely on DeepGuard AI
                        every day to protect the truth.
                    </p>
                </motion.div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                            className="card-hover glass rounded-3xl p-7 flex flex-col"
                        >
                            <QuoteIcon className="w-8 h-8 text-indigo-200" />
                            <p className="mt-4 text-sm text-slate-700 leading-relaxed flex-1">
                                “{t.quote}”
                            </p>
                            <div className="mt-5 flex gap-1 text-amber-400">
                                {Array.from({ length: 5 }).map((_, s) => (
                                    <StarIcon key={s} className="w-4 h-4" />
                                ))}
                            </div>
                            <div className="mt-5 flex items-center gap-3 pt-5 border-t border-slate-200/70">
                                <span className={`w-11 h-11 rounded-2xl ${t.color} ring-2 ring-white`} />
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{t.name}</p>
                                    <p className="text-xs text-slate-500">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
