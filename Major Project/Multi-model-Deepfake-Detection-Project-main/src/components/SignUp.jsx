import { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo, CheckIcon } from './icons'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const benefits = [
    'Create your detection workspace in seconds',
    'Track all analysis reports in one dashboard',
    'Start with a free deepfake analysis plan',
]

export default function SignUp({ onBack, onSuccess, onGoSignIn }) {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    email,
                    password,
                }),
            })

            if (!response.ok) {
                let detail = 'Sign up failed'
                try {
                    const payload = await response.json()
                    detail = payload.detail || detail
                } catch {
                    // Keep default error message if response body is not JSON.
                }
                throw new Error(detail)
            }

            if (onSuccess) onSuccess()
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Sign up failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-indigo-50/60 flex items-center justify-center py-16 px-5 sm:px-8">
            <div className="blob w-[500px] h-[500px] bg-indigo-200 top-[-150px] right-[-150px]" />
            <div className="blob w-[450px] h-[450px] bg-orange-200 bottom-[-150px] left-[-150px]" />

            <header className="absolute top-0 inset-x-0 z-20">
                <nav className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-16 sm:h-18">
                    <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="flex items-center gap-2.5 group">
                        <Logo className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
                        <span className="font-display text-xl font-bold tracking-tight">
                            Deep<span className="gradient-text">Guard</span>
                        </span>
                    </a>
                    <button
                        onClick={onBack}
                        className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 border border-slate-200"
                    >
                        ← Back to Home
                    </button>
                </nav>
            </header>

            <div className="relative z-10 w-full max-w-5xl grid gap-10 lg:grid-cols-2 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center lg:text-left"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                        Get started
                    </span>
                    <h1 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                        Create your <span className="gradient-text">DeepGuard</span> account
                    </h1>
                    <p className="mt-5 text-lg text-slate-600 max-w-md mx-auto lg:mx-0">
                        Sign up to secure your media workflow, run deepfake checks,
                        and access trusted detection insights instantly.
                    </p>
                    <ul className="mt-8 space-y-3 inline-flex flex-col items-center lg:items-start">
                        {benefits.map((b) => (
                            <li key={b} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                                    <CheckIcon className="w-3.5 h-3.5" />
                                </span>
                                {b}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="glass-strong rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-500/10"
                >
                    <h2 className="font-display text-2xl font-bold">
                        Sign Up
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Create your account to continue.
                    </p>

                    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Full name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Your name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-grad w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (onGoSignIn) onGoSignIn()
                            }}
                            className="font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Sign in
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}