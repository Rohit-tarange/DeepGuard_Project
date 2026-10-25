import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from './icons'

const faqs = [
    {
        q: 'How accurate is DeepGuard AI?',
        a: 'Our ensemble model achieves 99.7% accuracy on benchmark datasets, with a very low false-positive rate. We continuously retrain on the latest deepfake generation methods to keep accuracy high as new techniques emerge.',
    },
    {
        q: 'What file formats and sizes are supported?',
        a: 'We support MP4, MOV, WebM, AVI, and MKV files up to 2GB. You can also analyze public video URLs directly. For enterprise plans, we offer batch uploads and API integration for larger workflows.',
    },
    {
        q: 'Is my data private and secure?',
        a: 'Absolutely. Uploads are encrypted in transit and at rest, processed in isolated sandboxes, and automatically deleted after analysis. We never train on your data and offer on-premise deployment for the most sensitive use cases.',
    },
    {
        q: 'How long does an analysis take?',
        a: 'Most videos are analyzed in under 30 seconds. The exact time depends on video length, resolution, and current load. Our GPU-accelerated pipeline is optimized for high-volume, real-time checks.',
    },
    {
        q: 'Can I integrate this with my own systems?',
        a: 'Yes. We provide a comprehensive RESTful API, webhooks, and SDKs for Python, Node.js, and Go. Enterprise customers can integrate real-time deepfake detection directly into their content pipelines.',
    },
    {
        q: 'Do you offer a free trial?',
        a: 'You can start with a free plan that includes 5 analyses per month, no credit card required. Upgrade anytime to scale up with higher limits, batch processing, and priority support.',
    },
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <section id="faq" className="relative py-24 sm:py-32 overflow-hidden">
            <div className="blob w-[360px] h-[360px] bg-violet-200 bottom-[-100px] left-[-100px]" />
            <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                        FAQ
                    </span>
                    <h2 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                        Frequently asked <span className="gradient-text">questions</span>
                    </h2>
                    <p className="mt-5 text-lg text-slate-600">
                        Everything you need to know about DeepGuard AI. Can’t find an
                        answer? Reach out to our team.
                    </p>
                </motion.div>

                <div className="mt-12 space-y-4">
                    {faqs.map((faq, i) => {
                        const open = openIndex === i
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'shadow-lg shadow-indigo-500/10' : ''
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(open ? -1 : i)}
                                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                                >
                                    <span className="font-display font-semibold text-slate-800">
                                        {faq.q}
                                    </span>
                                    <motion.span
                                        animate={{ rotate: open ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${open ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                                            }`}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
