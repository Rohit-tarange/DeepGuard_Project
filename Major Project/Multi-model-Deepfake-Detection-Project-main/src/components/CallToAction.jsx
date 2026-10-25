import { motion } from 'framer-motion'
import { UploadIcon, PlayIcon } from './icons'

export default function CallToAction({ onGetStarted }) {
    return (
        <section id="cta" className="relative py-24 sm:py-32 overflow-hidden">
            <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-orange-500 p-10 sm:p-16 text-center shadow-2xl shadow-indigo-500/30"
                >
                    <div className="absolute inset-0 dot-grid opacity-20" />
                    <div className="absolute w-72 h-72 rounded-full bg-white/20 blur-3xl -top-20 -left-20" />
                    <div className="absolute w-72 h-72 rounded-full bg-white/20 blur-3xl -bottom-20 -right-20" />

                    <div className="relative">
                        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
                            Ready to unmask the truth?
                        </h2>
                        <p className="mt-5 text-lg text-white/85 max-w-2xl mx-auto">
                            Join thousands of organizations protecting their media from
                            deepfakes. Start your first free analysis today — no credit card
                            required.
                        </p>

                        <div className="mt-9 flex flex-wrap justify-center gap-4">
                            <button
                                onClick={onGetStarted}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-indigo-700 font-semibold hover:-translate-y-0.5 transition-transform shadow-lg"
                            >
                                <UploadIcon className="w-5 h-5" />
                                Start Free Analysis
                            </button>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
                            >
                                <PlayIcon className="w-5 h-5" />
                                Watch Demo
                            </a>
                        </div>

                        <p className="mt-6 text-sm text-white/70">
                            Free plan includes 5 analyses/month · Cancel anytime
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
