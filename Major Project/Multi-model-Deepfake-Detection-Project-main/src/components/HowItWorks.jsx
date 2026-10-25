import { motion } from 'framer-motion'
import { UploadIcon, CpuIcon, ShieldIcon, ChartIcon } from './icons'

const steps = [
    {
        icon: UploadIcon,
        number: '01',
        title: 'Upload Your Video',
        desc: 'Drag and drop any video file or paste a URL. We support MP4, MOV, WebM, and most common formats up to 2GB.',
    },
    {
        icon: CpuIcon,
        number: '02',
        title: 'AI Analyzes',
        desc: 'Our ensemble of neural networks scans every frame, tracking landmarks, micro-expressions, and artifacts.',
    },
    {
        icon: ChartIcon,
        number: '03',
        title: 'Get Your Report',
        desc: 'Receive a clear verdict with a confidence score, frame-level heatmap, and a detailed evidence breakdown.',
    },
    {
        icon: ShieldIcon,
        number: '04',
        title: 'Take Action',
        desc: 'Export shareable reports, flag content for takedown, or integrate results into your existing workflows via API.',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative py-24 sm:py-32 bg-gradient-to-b from-white to-indigo-50/50 overflow-hidden">
            <div className="blob w-[420px] h-[420px] bg-indigo-200 top-[20%] left-[-160px]" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                        Simple Process
                    </span>
                    <h2 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                        How <span className="gradient-text">It Works</span>
                    </h2>
                    <p className="mt-5 text-lg text-slate-600">
                        From upload to verdict in four effortless steps. No technical
                        expertise required — just paste and let the AI do the rest.
                    </p>
                </motion.div>

                <div className="mt-16 relative">
                    {/* connector line on desktop */}
                    <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((s, i) => (
                            <motion.div
                                key={s.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.12 }}
                                className="relative text-center px-2"
                            >
                                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-strong shadow-lg shadow-indigo-500/10 z-10">
                                    <s.icon className="w-8 h-8 text-indigo-600" />
                                </div>
                                <span className="mt-5 block font-display text-sm font-bold tracking-widest text-indigo-400">
                                    STEP {s.number}
                                </span>
                                <h3 className="font-display mt-2 text-lg font-bold">{s.title}</h3>
                                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
