import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo, MenuIcon, CloseIcon } from './icons'

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Technology', href: '#technology' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
]

export default function Navbar({ onSignIn, onSignUp }) {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg shadow-indigo-500/5' : 'bg-transparent'
                }`}
        >
            <nav className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-16 sm:h-18">
                <a href="#home" className="flex items-center gap-2.5 group">
                    <Logo className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-display text-xl font-bold tracking-tight">
                        Deep<span className="gradient-text">Guard</span>
                    </span>
                </a>

                <ul className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden lg:flex items-center gap-3">
                    <button
                        onClick={onSignUp}
                        className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 border border-slate-200"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={onSignIn}
                        className="btn-outline px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 border border-slate-200"
                    >
                        Sign in
                    </button>
                    <button
                        onClick={onSignIn}
                        className="btn-grad px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                    >
                        Get Started
                    </button>
                </div>

                <button
                    className="lg:hidden p-2 text-slate-700"
                    onClick={() => setOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {open ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden glass-strong border-t border-white/60 overflow-hidden"
                    >
                        <ul className="px-5 py-4 flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li className="mt-2 flex flex-col gap-2">
                                <button
                                    onClick={() => { setOpen(false); onSignUp(); }}
                                    className="px-4 py-3 rounded-xl text-center text-sm font-semibold text-slate-700 border border-slate-200"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => { setOpen(false); onSignIn(); }}
                                    className="px-4 py-3 rounded-xl text-center text-sm font-semibold text-slate-700 border border-slate-200"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => { setOpen(false); onSignIn(); }}
                                    className="btn-grad px-4 py-3 rounded-xl text-center text-sm font-semibold text-white"
                                >
                                    Get Started
                                </button>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
