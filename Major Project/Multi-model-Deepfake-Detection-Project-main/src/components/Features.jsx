import { motion } from 'framer-motion'
import {
    ScanIcon,
    ShieldIcon,
    BoltIcon,
    EyeIcon,
    CpuIcon,
    LockIcon,
} from './icons'

const features = [
    {
        icon: ScanIcon,
        title: 'Real-Time Analysis',
        desc: 'Frame-by-frame deep inspection powered by convolutional neural networks identifies manipulation artifacts instantly.',
        color: 'bg-indigo-100 text-indigo-600',
    },
    {
        icon: SideBySideIcon,
        title: 'Face Swapping Detection',
        desc: 'Detects face-swap, expression transfer, and lip-sync manipulations with state-of-the-art precision.',
        color: 'bg-violet-100 text-violet-600',
    },
    {
        icon: EyeIcon,
        title: 'Audio-Visual Sync',
        desc: 'Cross-checks lip movement against the audio track to catch subtle mismatches humans easily miss.',
        color: 'bg-sky-100 text-sky-600',
    },
    {
        icon: BoltIcon,
        title: 'Lightning Fast',
        desc: 'Get results in under 30 seconds with our optimized GPU pipeline — perfect for high-volume checks.',
        color: 'bg-orange-100 text-orange-600',
    },
    {
        icon: LockIcon,
        title: 'Privacy-First',
        desc: 'Your uploads are encrypted, processed in isolated sandboxes, and never stored or shared.',
        color: 'bg-emerald-100 text-emerald-600',
    },
    {
        icon: CpuIcon,
        title: 'Explainable Results',
        desc: 'Receive a detailed confidence breakdown with heatmaps highlighting exactly where manipulation was detected.',
        color: 'bg-rose-100 text-rose-600',
    },
]

function SideBySideIcon({ className = 'w-6 h-6' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="9" height="18" rx="2" />
            <rect x="12" y="3" width="9" height="18" rx="2" />
        </svg>
    )
}

export default function Features() {
    return (
        <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
            <div className="blob w-[400px] h-[400px] bg-violet-200 top-[-100px] right-[-100px]" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                        Powerful Capabilities
                    </span>
                    <h2 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                        Everything you need to <span className="gradient-text">fight deepfakes</span>
                    </h2>
                    <p className="mt-5 text-lg text-slate-600">
                        A comprehensive suite of detection tools engineered to protect your
                        media, brand, and audience from synthetic manipulation.
                    </p>
                </motion.div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                            className="card-hover glass rounded-3xl p-7 group"
                        >
                            <span
                                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${f.color} transition-transform duration-300 group-hover:scale-110`}
                            >
                                <f.icon className="w-6 h-6" />
                            </span>
                            <h3 className="font-display mt-5 text-lg font-bold">{f.title}</h3>
                            <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
