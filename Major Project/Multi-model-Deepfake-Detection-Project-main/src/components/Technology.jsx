import { motion } from 'framer-motion'

const categories = [
    {
        name: 'Machine Learning',
        color: 'from-indigo-500 to-violet-500',
        items: ['CNNs', 'Vision Transformers', 'GAN Forensics', 'Ensemble Models'],
    },
    {
        name: 'Computer Vision',
        color: 'from-sky-500 to-cyan-500',
        items: ['Facial Landmarking', 'Optical Flow', 'Frame Artifact Analysis', 'Pupil & Blink Detection'],
    },
    {
        name: 'Audio Analysis',
        color: 'from-orange-500 to-amber-500',
        items: ['Voice Biometrics', 'Spectrogram Analysis', 'Lip-Sync Verification', 'GNN Noise Modeling'],
    },
    {
        name: 'Infrastructure',
        color: 'from-emerald-500 to-green-500',
        items: ['GPU Acceleration', 'Edge Deployment', 'RESTful API', 'End-to-End Encryption'],
    },
]

export default function Technology() {
    return (
        <section id="technology" className="relative py-24 sm:py-32 overflow-hidden">
            <div className="blob w-[400px] h-[400px] bg-sky-200 bottom-[-120px] right-[-100px]" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                        Our Stack
                    </span>
                    <h2 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                        Built on <span className="gradient-text">cutting-edge AI</span>
                    </h2>
                    <p className="mt-5 text-lg text-slate-600">
                        We combine multiple research-grade models into a single, seamless
                        detection engine that keeps pace with the latest deepfake methods.
                    </p>
                </motion.div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="card-hover glass rounded-3xl p-7"
                        >
                            <span
                                className={`inline-block h-1.5 w-12 rounded-full bg-gradient-to-r ${cat.color}`}
                            />
                            <h3 className="font-display mt-4 text-lg font-bold">{cat.name}</h3>
                            <ul className="mt-4 space-y-2.5">
                                {cat.items.map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cat.color}`} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
