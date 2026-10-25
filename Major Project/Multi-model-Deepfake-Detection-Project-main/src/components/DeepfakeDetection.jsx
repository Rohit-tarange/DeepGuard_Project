import { motion } from 'framer-motion'
import {
    VideoDetectIcon,
    AudioDetectIcon,
    TextDetectIcon,
    UploadIcon,
    CpuIcon,
    CheckIcon,
} from './icons'

const detectionTypes = [
    {
        icon: VideoDetectIcon,
        title: 'Video Detection',
        desc: 'Frame-by-frame analysis spots face-swaps, expression transfer, and manipulated sequences with high precision.',
        color: 'bg-indigo-100 text-indigo-600',
        verdict: 'REAL',
    },
    {
        icon: AudioDetectIcon,
        title: 'Audio Detection',
        desc: 'Voice-biometric and spectrogram forensics catch cloned voices, synthetic speech, and lip-sync mismatches.',
        color: 'bg-orange-100 text-orange-600',
        verdict: 'FAKE',
    },
    {
        icon: TextDetectIcon,
        title: 'Text Fact Checking (Tathya)',
        desc: 'Autonomous agentic verification breaks down claims and gathers multi-source evidence via Gemini, Tavily, and NewsAPI.',
        color: 'bg-emerald-100 text-emerald-600',
        verdict: 'REAL',
    },
]

const processSteps = [
    {
        icon: UploadIcon,
        title: 'Upload Content',
        desc: 'Drop in a video, audio file, or piece of text.',
    },
    {
        icon: CpuIcon,
        title: 'AI Analysis',
        desc: 'Our ensemble models inspect every signal.',
    },
    {
        icon: CheckIcon,
        title: 'REAL / FAKE Result',
        desc: 'Get a clear verdict with a confidence score.',
    },
]

export default function DeepfakeDetection() {
    return (
        <section id="deepfake-detection" className="relative py-24 sm:py-32 overflow-hidden">
            <div className="blob w-[420px] h-[420px] bg-indigo-200 top-[10%] left-[-160px]" />
            <div className="blob w-[400px] h-[400px] bg-orange-200 bottom-[-120px] right-[-120px]" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                        Deepfake Detection
                    </span>
                    <h2 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                        Detect deepfakes across <span className="gradient-text">any content</span>
                    </h2>
                    <p className="mt-5 text-lg text-slate-600">
                        Upload a video, an audio clip, or a piece of text and let our AI
                        determine if it is real or fabricated — with a transparent confidence score.
                    </p>
                </motion.div>

                {/* Feature cards */}
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {detectionTypes.map((d, i) => (
                        <motion.div
                            key={d.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                            className="card-hover glass rounded-3xl p-7 group"
                        >
                            <span
                                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${d.color} transition-transform duration-300 group-hover:scale-110`}
                            >
                                <d.icon className="w-6 h-6" />
                            </span>
                            <h3 className="font-display mt-5 text-lg font-bold">
                                {d.title}
                            </h3>
                            <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                                {d.desc}
                            </p>
                            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-900/5 px-3 py-1 text-xs font-bold tracking-wide text-slate-700">
                                <CheckIcon className="w-4 h-4 text-emerald-600" />
                                VERDICT: {d.verdict}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Process strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-16 relative glass-strong rounded-3xl p-8 sm:p-10 shadow-lg shadow-indigo-500/5"
                >
                    <h3 className="font-display text-center text-xl sm:text-2xl font-bold">
                        How it works in <span className="gradient-text">three quick steps</span>
                    </h3>
                    <div className="mt-10 relative">
                        {/* connector line on desktop */}
                        <div className="hidden lg:block absolute top-10 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                        <div className="grid gap-8 sm:grid-cols-3">
                            {processSteps.map((s, i) => (
                                <div key={s.title} className="relative text-center px-2">
                                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl glass shadow-lg shadow-indigo-500/10 z-10">
                                        <s.icon className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <span className="mt-5 block font-display text-sm font-bold tracking-widest text-indigo-400">
                                        STEP 0{i + 1}
                                    </span>
                                    <h4 className="font-display mt-2 text-lg font-bold">
                                        {s.title}
                                    </h4>
                                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                                        {s.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="mt-10 text-center text-sm text-slate-500">
                        Every result includes a <span className="font-semibold text-indigo-600">confidence score</span> so you
                        always know how certain the model is.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
