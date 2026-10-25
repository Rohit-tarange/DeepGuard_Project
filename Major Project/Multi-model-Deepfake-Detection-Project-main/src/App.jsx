import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import DeepfakeDashboard from './components/DeepfakeDashboard'
import Hero from './components/Hero'
import LogoTicker from './components/LogoTicker'
import Features from './components/Features'
import DeepfakeDetection from './components/DeepfakeDetection'
import HowItWorks from './components/HowItWorks'
import Technology from './components/Technology'
import Statistics from './components/Statistics'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'

function ClerkAuthButtons({ onGetStarted }) {
    return (
        <div className="flex items-center gap-3">
            <SignInButton mode="modal">
                <button className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl hover:bg-indigo-50">
                    Sign In
                </button>
            </SignInButton>
            <SignUpButton mode="modal">
                <button
                    onClick={onGetStarted}
                    className="text-sm font-semibold px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition-all"
                >
                    Get Started
                </button>
            </SignUpButton>
        </div>
    )
}

function AuthenticatedApp() {
    const { user } = useUser()

    const userObj = {
        full_name: user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'User',
        email: user?.primaryEmailAddress?.emailAddress || '',
    }

    return <DeepfakeDashboard user={userObj} />
}

function LandingPage() {
    const [page, setPage] = useState('landing')

    if (page === 'signin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-indigo-50/60">
                <div className="glass-strong rounded-3xl p-10 shadow-2xl shadow-indigo-500/10 w-full max-w-md text-center space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-slate-900 text-2xl">Welcome back</h2>
                        <p className="text-slate-500 text-sm mt-1">Sign in to access DeepGuard AI Monitor</p>
                    </div>
                    <SignInButton mode="modal" afterSignInUrl="/">
                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all">
                            Continue with Sign In
                        </button>
                    </SignInButton>
                    <p className="text-xs text-slate-400">
                        Don't have an account?{' '}
                        <button onClick={() => setPage('signup')} className="text-indigo-600 font-semibold hover:underline">
                            Sign Up
                        </button>
                    </p>
                    <button onClick={() => setPage('landing')} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                        ← Back to Home
                    </button>
                </div>
            </div>
        )
    }

    if (page === 'signup') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-indigo-50/60">
                <div className="glass-strong rounded-3xl p-10 shadow-2xl shadow-indigo-500/10 w-full max-w-md text-center space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-slate-900 text-2xl">Create Account</h2>
                        <p className="text-slate-500 text-sm mt-1">Join DeepGuard AI to detect deepfakes and verify facts</p>
                    </div>
                    <SignUpButton mode="modal" afterSignUpUrl="/">
                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all">
                            Continue with Sign Up
                        </button>
                    </SignUpButton>
                    <p className="text-xs text-slate-400">
                        Already have an account?{' '}
                        <button onClick={() => setPage('signin')} className="text-indigo-600 font-semibold hover:underline">
                            Sign In
                        </button>
                    </p>
                    <button onClick={() => setPage('landing')} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                        ← Back to Home
                    </button>
                </div>
            </div>
        )
    }

    // Landing page
    return (
        <>
            <Navbar
                onSignIn={() => setPage('signin')}
                onSignUp={() => setPage('signup')}
            />
            <main>
                <Hero />
                <LogoTicker />
                <Features />
                <DeepfakeDetection />
                <HowItWorks />
                <Technology />
                <Statistics />
                <Testimonials />
                <FAQ />
                <CallToAction onGetStarted={() => setPage('signup')} />
            </main>
            <Footer />
        </>
    )
}

export default function App() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* When user is signed in via Clerk → show Dashboard */}
            <SignedIn>
                <AuthenticatedApp />
            </SignedIn>

            {/* When user is not signed in → show Landing page with Clerk modal auth */}
            <SignedOut>
                <LandingPage />
            </SignedOut>
        </div>
    )
}
