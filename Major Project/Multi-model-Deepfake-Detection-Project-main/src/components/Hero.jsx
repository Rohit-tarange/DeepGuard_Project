import { motion } from 'framer-motion'
import { UploadIcon, PlayIcon, ShieldIcon, CheckIcon, BoltIcon, EyeIcon } from './icons'

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
}

const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const stats = [
    { value: '99.7%', label: 'Detection Accuracy' },
    { value: '< 30s', label: 'Avg. Analysis Time' },
    { value: '2M+', label: 'Videos Analyzed' },
]

export default function Hero() {
    return (
        <section id="home" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
            {/* Background blobs */}
            <div className="blob w-[500px] h-[500px] bg-indigo-300 top-[-120px] left-[-120px]" />
            <div className="blob w-[420px] h-[420px] bg-violet-300 top-[10%] right-[-140px]" />
            <div className="blob w-[380px] h-[380px] bg-orange-200 bottom-[-100px] left-[30%]" />
            <div className="absolute inset-0 dot-grid opacity-40" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
                <motion.div variants={container} initial="hidden" animate="show">
                    <motion.div variants={item}>
                        <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            AI-Powered Deepfake Detection
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={item}
                        className="font-display mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight"
                    >
                        Detect <span className="gradient-text">Deepfake Videos</span> in Seconds
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl"
                    >
                        DeepGuard AI uses cutting-edge neural networks to analyze facial
                        micro-expressions, frame artifacts, and audio-visual sync to reveal
                        manipulated media with pixel-perfect confidence.
                    </motion.p>

                    <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
                        <a
                            href="#cta"
                            className="btn-grad inline-flex items-center gap-2 px-7 py-4 rounded-full text-white font-semibold"
                        >
                            <UploadIcon className="w-5 h-5" />
                            Upload Video
                        </a>
                        <a
                            href="#how-it-works"
                            className="btn-outline inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-slate-800 border border-slate-200 bg-white/60 backdrop-blur"
                        >
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600">
                                <PlayIcon className="w-3 h-3" />
                            </span>
                            Try Demo
                        </a>
                    </motion.div>

                    <motion.div variants={item} className="mt-10 flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex -space-x-2">
                            {['bg-indigo-400', 'bg-violet-400', 'bg-orange-300', 'bg-sky-400'].map((c, i) => (
                                <span
                                    key={i}
                                    className={`w-8 h-8 rounded-full ${c} ring-2 ring-white`}
                                />
                            ))}
                        </span>
                        <span>
                            Trusted by <strong className="text-slate-800">25,000+</strong> security teams
                        </span>
                    </motion.div>
                </motion.div>

                {/* Right visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative"
                >
                    <div className="relative glass-strong rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
                        {/* Fake video preview */}
                        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 aspect-video flex items-center justify-center">
                            <EyeIcon className="w-16 h-16 text-white/70" />
                            <div className="absolute inset-0 flex items-end p-4">
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 rounded-full bg-white/60" />
                                    <span className="w-2 h-2 rounded-full bg-white/60" />
                                    <span className="w-2 h-2 rounded-full bg-white/60" />
                                </div>
                            </div>
                            <span className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-xs font-semibold text-indigo-700">
                                Analyzing…
                            </span>
                        </div>

                        {/* Result row */}
                        <div className="mt-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">sample_news_clip.mp4</p>
                                <p className="text-xs text-slate-500">12.4 MB · 2:18 duration</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 text-sm font-semibold">
                                <CheckIcon className="w-4 h-4" />
                                Real
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                <span>Confidence Score</span>
                                <span className="font-semibold text-indigo-600">98.4%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '98.4%' }}
                                    transition={{ duration: 1.6, delay: 0.5, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Floating badges */}
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-5 -right-4 sm:-right-6 glass rounded-2xl px-4 py-3 shadow-xl shadow-indigo-500/10"
                    >
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600">
                                <BoltIcon className="w-5 h-5" />
                            </span>
                            <div>
                                <p className="text-xs text-slate-500">Analysis</p>
                                <p className="text-sm font-bold text-slate-800">{'<'} 30 seconds</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -bottom-6 -left-4 sm:-left-8 glass rounded-2xl px-4 py-3 shadow-xl shadow-indigo-500/10"
                    >
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600">
                                <ShieldIcon className="w-5 h-5" />
                            </span>
                            <div>
                                <p className="text-xs text-slate-500">Protection</p>
                                <p className="text-sm font-bold text-slate-800">Threats blocked</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Stats strip */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative mx-auto max-w-6xl px-5 sm:px-8 mt-20 sm:mt-28"
            >
                <div className="glass-strong rounded-3xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/70">
                    {stats.map((s) => (
                        <div key={s.label} className="px-8 py-8 text-center">
                            <p className="font-display text-3xl sm:text-4xl font-bold gradient-text">
                                {s.value}
                            </p>
                            <p className="mt-1.5 text-sm text-slate-600">{s.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
