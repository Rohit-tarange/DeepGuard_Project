import { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo, CheckIcon } from './icons'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const benefits = [
    'Real-time deepfake detection',
    'Video, audio & text analysis',
    'Confidence-scored reports',
]

export default function SignIn({ onBack, onSuccess, onGoSignUp }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            let payload;
            try {
                payload = await response.json();
            } catch (ignore) {}

            if (!response.ok) {
                const detail = payload?.detail || 'Sign in failed';
                throw new Error(detail);
            }

            if (onSuccess) onSuccess(payload?.user);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Sign in failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-indigo-50/60 flex items-center justify-center py-16 px-5 sm:px-8">
            <div className="blob w-[500px] h-[500px] bg-indigo-200 top-[-150px] right-[-150px]" />
            <div className="blob w-[450px] h-[450px] bg-orange-200 bottom-[-150px] left-[-150px]" />

            {/* Header */}
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
                {/* Left: pitch */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center lg:text-left"
                >
                    <span className="inline-block glass rounded-full px-4 py-2 text-sm font-semibold text-indigo-700">
                        Welcome back
                    </span>
                    <h1 className="font-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                        Sign in to <span className="gradient-text">DeepGuard</span>
                    </h1>
                    <p className="mt-5 text-lg text-slate-600 max-w-md mx-auto lg:mx-0">
                        Access your dashboard to run analyses, review reports, and
                        protect your content from synthetic manipulation.
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

                {/* Right: form card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="glass-strong rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-500/10"
                >
                    <h2 className="font-display text-2xl font-bold">
                        Sign In
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Enter your credentials to continue.
                    </p>

<form className="mt-7 space-y-5" onSubmit={handleSubmit}>
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
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>

                        <label className="flex items-center gap-2.5 text-sm text-slate-600">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            Remember me
                        </label>

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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <span className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs font-medium text-slate-400">or continue with</span>
                        <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="btn-outline inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200">
                            <GoogleIcon className="w-4 h-4" />
                            Google
                        </button>
                        <button className="btn-outline inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200">
                            <GithubIcon className="w-4 h-4" />
                            GitHub
                        </button>
                    </div>

                    <p className="mt-7 text-center text-sm text-slate-600">
                        Don&apos;t have an account?{' '}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (onGoSignUp) onGoSignUp()
                            }}
                            className="font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Create one
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    )
}

function GoogleIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1H12v2.9h5.4c-.5 2.5-2.6 4.1-5.4 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.55 3.95 1.45l2.15-2.15C16.4 3.4 14.3 2.6 12 2.6 6.9 2.6 2.8 6.7 2.8 12s4.1 9.4 9.2 9.4c4.7 0 8.25-3.15 8.25-8.6 0-.6-.05-1.05-.15-1.7z" />
        </svg>
    )
}

function GithubIcon({ className = 'w-5 h-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
<path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.2 5 18.2 5.3 18.2 5.3c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
        </svg>
    )
}
