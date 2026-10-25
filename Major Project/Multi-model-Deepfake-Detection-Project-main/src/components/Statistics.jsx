import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
    { value: 99.7, suffix: '%', label: 'Detection Accuracy', decimals: 1 },
    { value: 2.4, suffix: 'M+', label: 'Videos Analyzed', decimals: 1 },
    { value: 120, suffix: '+', label: 'Global Organizations', decimals: 0 },
    { value: 24, suffix: '/7', label: 'Real-Time Protection', decimals: 0 },
]

function Counter({ value, suffix, decimals }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        if (!inView) return
        let start = null
        const duration = 1800
        const step = (timestamp) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(value * eased)
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [inView, value])

    return (
        <span ref={ref} className="font-display text-4xl sm:text-5xl font-bold gradient-text">
            {display.toFixed(decimals)}
            {suffix}
        </span>
    )
}

export default function Statistics() {
    return (
        <section className="relative py-20 sm:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700" />
            <div className="absolute inset-0 dot-grid opacity-20" />
            <div className="blob w-[400px] h-[400px] bg-white/20 top-[-100px] left-[10%]" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-white">
                        Real Impact
                    </span>
                    <h2 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
                        Numbers that <span className="text-white/80">speak for themselves</span>
                    </h2>
                </motion.div>

                <div className="mt-14 grid gap-10 grid-cols-2 lg:grid-cols-4">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="text-center"
                        >
                            <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                            <p className="mt-2 text-sm font-medium text-white/80">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
