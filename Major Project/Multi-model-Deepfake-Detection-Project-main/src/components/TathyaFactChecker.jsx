import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TextDetectIcon,
    SparklesIcon,
    SearchIcon,
    RefreshIcon,
    ExternalLinkIcon,
    CheckIcon,
    AlertCircleIcon,
    BookOpenIcon,
} from './icons'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const SAMPLE_CLAIMS = [
    {
        title: "2023 Cricket World Cup",
        claim: "Which team won the 2023 ICC men's cricket world cup?",
    },
    {
        title: "India Population",
        claim: "Does India have the largest population in the world?",
    },
    {
        title: "Mars Water Discovery",
        claim: "NASA confirmed the discovery of flowing liquid water rivers on Mars surface.",
    },
    {
        title: "Global Health Statement",
        claim: "WHO declared artificial sweeteners as an immediate hazardous bio-toxin.",
    },
]

import { verifyClaimWithTathya } from '../services/tathyaApi'

export default function TathyaFactChecker({ onVerificationComplete, activeClaim }) {
    const [claim, setClaim] = useState(activeClaim || '')
    const [analyzing, setAnalyzing] = useState(false)
    const [stepIndex, setStepIndex] = useState(0)
    const [stepDetail, setStepDetail] = useState('')
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)

    const verificationSteps = [
        { title: 'Decomposing Claim', desc: 'Extracting key entities and verifiable factual sub-questions' },
        { title: 'Gathering Multi-Source Evidence', desc: 'Querying Tavily, Gemini Search, NewsAPI & Wikidata' },
        { title: 'Cross-Examining Evidence', desc: 'Detecting contradictions, verifying source reliability & timestamps' },
        { title: 'Synthesizing Final Verdict', desc: 'Computing confidence rating and comprehensive explanation' },
    ]

    async function handleVerify(e) {
        if (e) e.preventDefault()
        const trimmed = claim.trim()
        if (!trimmed) {
            setError('Please enter a claim or statement to fact-check.')
            return
        }

        setError('')
        setAnalyzing(true)
        setStepIndex(0)
        setStepDetail('Connecting to Tathya verification agent...')
        setResult(null)

        try {
            const data = await verifyClaimWithTathya(trimmed, (step, desc) => {
                setStepIndex(Math.min(step - 1, 3))
                if (desc) setStepDetail(desc)
            })

            setResult(data)

            if (onVerificationComplete) {
                onVerificationComplete({
                    id: Date.now(),
                    type: 'Text',
                    name: trimmed.length > 35 ? trimmed.substring(0, 35) + '...' : trimmed,
                    fullClaim: trimmed,
                    result: data.verdict === 'TRUE' ? 'REAL' : data.verdict === 'FALSE' ? 'FAKE' : data.verdict,
                    tathyaVerdict: data.verdict,
                    score: Math.round(data.confidence || (data.confidence_score * 100) || 85),
                    time: 'just now',
                    explanation: data.explanation,
                    sources: data.sources || [],
                    decomposition: data.decomposition || [],
                })
            }
        } catch (err) {
            console.error('Fact check error:', err)
            setError(err instanceof Error ? err.message : 'Fact check failed. Check backend connection.')
        } finally {
            setAnalyzing(false)
        }
    }

    function getVerdictBadge(verdict) {
        const v = (verdict || '').toUpperCase()
        if (v === 'TRUE' || v === 'REAL') {
            return {
                bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700',
                banner: 'from-emerald-600 to-teal-600',
                pill: 'bg-emerald-500 text-white',
                label: 'TRUE / VERIFIED REAL',
                icon: CheckIcon,
            }
        }
        if (v === 'FALSE' || v === 'FAKE') {
            return {
                bg: 'bg-rose-500/10 border-rose-500/30 text-rose-700',
                banner: 'from-rose-600 to-red-600',
                pill: 'bg-rose-500 text-white',
                label: 'FALSE / FABRICATED',
                icon: AlertCircleIcon,
            }
        }
        if (v.includes('PARTIAL') || v.includes('MIXTURE')) {
            return {
                bg: 'bg-amber-500/10 border-amber-500/30 text-amber-700',
                banner: 'from-amber-500 to-orange-600',
                pill: 'bg-amber-500 text-white',
                label: 'PARTIALLY TRUE / MIXTURE',
                icon: AlertCircleIcon,
            }
        }
        return {
            bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700',
            banner: 'from-indigo-600 to-violet-600',
            pill: 'bg-indigo-500 text-white',
            label: verdict || 'UNCERTAIN / UNVERIFIED',
            icon: AlertCircleIcon,
        }
    }

    const verdictMeta = result ? getVerdictBadge(result.verdict) : null
    const confidencePct = result ? Math.round(result.confidence || (result.confidence_score * 100) || 0) : 0

    return (
        <div className="w-full space-y-6">
            {/* Header banner */}
            <div className="p-6 rounded-2xl glass-strong border border-indigo-100/70 shadow-lg shadow-indigo-500/5 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-44 h-44 bg-gradient-to-br from-indigo-300/30 to-violet-400/20 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                            <TextDetectIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-display text-xl font-bold text-slate-900">
                                    Tathya Fact-Checking Engine
                                </h2>
                                <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                                    Agentic Model
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Autonomous multi-source evidence verification powered by Groq LLM, Gemini &amp; Tavily
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span>Sources: Tavily, Gemini, NewsAPI, Wikidata</span>
                    </div>
                </div>

                {/* Claim input form */}
                <form onSubmit={handleVerify} className="mt-6">
                    <div className="relative">
                        <textarea
                            value={claim}
                            onChange={(e) => setClaim(e.target.value)}
                            rows={3}
                            placeholder="Type or paste any claim, headline, rumor, or article excerpt to fact check..."
                            className="w-full p-4 rounded-xl bg-white/80 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/70 transition-all text-sm sm:text-base resize-none shadow-inner"
                        />
                        {claim && (
                            <button
                                type="button"
                                onClick={() => { setClaim(''); setResult(null); setError('') }}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded-md bg-slate-100 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Sample claim chips */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">Try sample:</span>
                        {SAMPLE_CLAIMS.map((sample) => (
                            <button
                                key={sample.title}
                                type="button"
                                onClick={() => {
                                    setClaim(sample.claim)
                                    setResult(null)
                                    setError('')
                                }}
                                className="text-xs px-3 py-1 rounded-lg bg-white/70 border border-slate-200/80 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                            >
                                {sample.title}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                            {claim.length} characters
                        </span>
                        <button
                            type="submit"
                            disabled={analyzing || !claim.trim()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {analyzing ? (
                                <>
                                    <RefreshIcon className="w-4 h-4 animate-spin" />
                                    <span>Investigating Claim...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-4 h-4" />
                                    <span>Fact Check with Tathya</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 p-3.5 rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 text-sm flex items-center gap-2">
                        <AlertCircleIcon className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* In-flight verification progress */}
            <AnimatePresence>
                {analyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="p-6 rounded-2xl glass-strong border border-indigo-200/60 shadow-lg shadow-indigo-500/5 space-y-4"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <SearchIcon className="w-4 h-4 text-indigo-600 animate-pulse" />
                                    Tathya Agent Investigation in Progress...
                                </h3>
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                                    Phase {stepIndex + 1} of 4
                                </span>
                            </div>
                            {stepDetail && (
                                <p className="text-xs text-indigo-700 mt-1 flex items-center gap-1.5 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                                    {stepDetail}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {verificationSteps.map((step, idx) => {
                                const isDone = idx < stepIndex
                                const isCurrent = idx === stepIndex
                                return (
                                    <div
                                        key={step.title}
                                        className={`p-3.5 rounded-xl border transition-all ${
                                            isCurrent
                                                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200/50'
                                                : isDone
                                                ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                                                : 'bg-white/40 border-slate-100 opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                    isDone
                                                        ? 'bg-emerald-500 text-white'
                                                        : isCurrent
                                                        ? 'bg-indigo-600 text-white animate-pulse'
                                                        : 'bg-slate-200 text-slate-500'
                                                }`}
                                            >
                                                {isDone ? '✓' : idx + 1}
                                            </div>
                                            <span className="font-semibold text-xs text-slate-800">
                                                {step.title}
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-[11px] text-slate-500 leading-tight">
                                            {step.desc}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Final Tathya Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Big verdict card */}
                        <div className="p-6 rounded-2xl glass-strong border border-white/60 shadow-xl shadow-indigo-500/10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Tathya Verified Verdict
                                    </span>
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className={`px-4 py-2 rounded-xl text-white font-display font-extrabold text-lg sm:text-xl tracking-wide bg-gradient-to-r ${verdictMeta.banner} shadow-lg shadow-indigo-500/15 flex items-center gap-2`}>
                                            <verdictMeta.icon className="w-5 h-5" />
                                            <span>{verdictMeta.label}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 italic max-w-xl">
                                        Claim: &ldquo;{result.claim}&rdquo;
                                    </p>
                                </div>

                                {/* Confidence score meter */}
                                <div className="md:text-right min-w-[200px]">
                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Confidence Rating
                                    </div>
                                    <div className="mt-1 flex items-baseline md:justify-end gap-2">
                                        <span className="font-display text-3xl sm:text-4xl font-black text-slate-900">
                                            {confidencePct}%
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">
                                            ({result.confidence_score !== undefined ? result.confidence_score.toFixed(2) : (confidencePct / 100).toFixed(2)} score)
                                        </span>
                                    </div>
                                    <div className="mt-2 h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${confidencePct}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className={`h-full rounded-full bg-gradient-to-r ${verdictMeta.banner}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Decomposed Sub-Questions */}
                            {result.decomposition && result.decomposition.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <span>Sub-Questions Analyzed</span>
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.decomposition.map((q, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-700 font-medium"
                                            >
                                                • {q}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Detailed Explanation */}
                            <div className="mt-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    AI Agent Detailed Explanation &amp; Synthesis
                                </h4>
                                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                                    {result.explanation || 'No detailed explanation provided by the model.'}
                                </div>
                            </div>
                        </div>

                        {/* Evidence Sources Grid */}
                        <div className="p-6 rounded-2xl glass-strong border border-white/60 shadow-lg shadow-indigo-500/5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2">
                                        <BookOpenIcon className="w-5 h-5 text-indigo-600" />
                                        <span>Multi-Source Evidence ({result.sources ? result.sources.length : 0})</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Ground-truth citations and references retrieved across web and news platforms
                                    </p>
                                </div>
                            </div>

                            {result.sources && result.sources.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.sources.map((source, index) => {
                                        const toolName = source.tool || source.source_tool || 'Web Source'
                                        return (
                                            <div
                                                key={index}
                                                className="p-4 rounded-xl bg-white/70 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                            {toolName}
                                                        </span>
                                                        {source.score && (
                                                            <span className="text-[11px] text-slate-400">
                                                                Relevance: {Math.round(source.score * 100)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h5 className="font-semibold text-slate-800 text-sm line-clamp-1">
                                                        {source.title || 'Untitled Source'}
                                                    </h5>
                                                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                                        {source.snippet || 'No preview text provided for this evidence.'}
                                                    </p>
                                                </div>

                                                {source.url && (
                                                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                                        <span className="text-[11px] text-slate-400 truncate max-w-[220px]">
                                                            {source.url}
                                                        </span>
                                                        <a
                                                            href={source.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0 ml-2"
                                                        >
                                                            <span>View Source</span>
                                                            <ExternalLinkIcon className="w-3.5 h-3.5" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center rounded-xl bg-slate-50/50 border border-dashed border-slate-200 text-slate-400 text-sm">
                                    No explicit web sources cited for this claim.
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
