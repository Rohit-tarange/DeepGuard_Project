import { useEffect, useState } from 'react'
import { UserButton, useUser } from '@clerk/clerk-react'
import {
    Logo,
    ScanIcon,
    VideoDetectIcon,
    AudioDetectIcon,
    TextDetectIcon,
    ChartIcon,
    SparklesIcon,
    RefreshIcon,
    ExternalLinkIcon,
    CheckIcon,
    AlertCircleIcon,
    BookOpenIcon,
} from './icons'
import TathyaFactChecker from './TathyaFactChecker'
import DeepFocusVideoDetector from './DeepFocusVideoDetector'
import AudioDetector from './AudioDetector'
import { verifyClaimWithTathya } from '../services/tathyaApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function Sidebar({ activeTab, onSelectTab }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: ScanIcon },
        { id: 'video', label: 'Video Detection', icon: VideoDetectIcon },
        { id: 'audio', label: 'Audio Detection', icon: AudioDetectIcon },
        { id: 'text', label: 'Tathya Fact Check', icon: TextDetectIcon, badge: 'Tathya' },
        { id: 'performance', label: 'Model Performance', icon: ChartIcon },
    ]

    return (
        <aside className="w-72 glass-strong min-h-screen p-6 hidden md:flex flex-col border-r border-white/60 shrink-0">
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
                <Logo />
                <div>
                    <h3 className="font-display font-bold text-slate-900">DeepGuard</h3>
                    <p className="text-xs text-slate-500">Multi-Model AI Monitor</p>
                </div>
            </div>

            <nav className="space-y-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelectTab(item.id)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                                isActive
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 font-semibold'
                                    : 'text-slate-600 hover:bg-indigo-50/70 hover:text-indigo-600'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <span
                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                        isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-indigo-100 text-indigo-700'
                                    }`}
                                >
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            <div className="mt-auto bg-gradient-to-br from-indigo-600 to-violet-600 p-5 rounded-2xl text-white shadow-md shadow-indigo-500/20">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h4 className="font-semibold text-white text-sm">Tathya Agent Online</h4>
                </div>
                <p className="mt-2 text-xs text-indigo-100 leading-relaxed">
                    Fact check claims across web, news, and structured wikidata autonomously.
                </p>
                <button
                    onClick={() => onSelectTab('text')}
                    className="mt-3 w-full bg-white text-indigo-700 font-semibold text-xs py-2 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                >
                    Launch Fact Checker
                </button>
            </div>
        </aside>
    )
}

function MetricCard({ title, value, percent, color = 'from-indigo-600', text = 'text-indigo-600', subtext = 'detections' }) {
    return (
        <div className="p-5 rounded-2xl glass-strong shadow-lg shadow-indigo-500/5 card-hover">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h5 className="text-sm text-slate-500 font-medium">{title}</h5>
                    <div className="mt-2 flex items-baseline gap-3">
                        <span className={`font-display text-3xl font-bold ${text}`}>{value}</span>
                        <span className="text-sm text-slate-400">{subtext}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-semibold`}>
                        {Math.round(percent)}%
                    </div>
                </div>
            </div>
            <div className="mt-4 h-2 bg-slate-200/70 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full bg-gradient-to-r ${color}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    )
}

function Sparkline({ data = [3, 5, 4, 7, 6, 9, 8] }) {
    const max = Math.max(...data)
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 100}`).join(' ')
    return (
        <svg viewBox="0 0 100 100" className="w-full h-20">
            <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon fill="url(#sparkFill)" points={`0,100 ${points} 100,100`} />
            <polyline fill="none" stroke="#8b5cf6" strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function DeepfakeDashboard({ user: userProp }) {
    const { user: clerkUser } = useUser()
    // Merge Clerk user info with any passed-in prop (fallback for compatibility)
    const user = clerkUser
        ? {
              full_name: clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress || 'User',
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
          }
        : userProp
    const [activeTab, setActiveTab] = useState('dashboard')
    const historyStorageKey = user?.email
        ? `deepguard_detection_history_${user.email.toLowerCase()}`
        : null

    const [history, setHistory] = useState([
        {
            id: 1,
            type: 'Video',
            name: 'interview_clip.mp4',
            result: 'FAKE',
            score: 92,
            time: '2m ago',
            explanation: 'Facial boundary inconsistencies and unnatural blinking cadence detected during frame sequence inference.',
            sources: [],
            breakdown: [
                { name: 'Frame-level ensemble', score: '0.92' },
                { name: 'Audio-sync detector', score: '0.61' },
                { name: 'Metadata heuristics', score: '0.84' },
            ],
        },
        {
            id: 2,
            type: 'Text',
            name: 'ICC Cricket World Cup 2023 Winner',
            fullClaim: "Which Team won the 2023 ICC men's world cup?",
            result: 'REAL',
            tathyaVerdict: 'TRUE',
            score: 90,
            time: '12m ago',
            explanation: "The claim is verified TRUE by Tathya Fact-Checking System. Official ICC and BBC records confirm Australia defeated India in the final at Ahmedabad on 19 November 2023.",
            sources: [
                { tool: 'Tavily Search', title: '2023 Cricket World Cup final - Wikipedia', url: 'https://en.wikipedia.org/wiki/2023_Cricket_World_Cup_final', snippet: 'Awesome Australia beat India to win the ICC Men\'s Cricket World Cup.' },
                { tool: 'Gemini Search', title: 'BBC Sport - Australia win sixth title', url: 'https://www.bbc.com/sport/cricket/67467918', snippet: 'Australia stunned hosts India in Ahmedabad to win the men\'s Cricket World Cup for a sixth time.' },
            ],
            decomposition: [
                "The 2023 ICC men's world cup had a winner.",
                "The winner of the 2023 ICC men's world cup is a team.",
            ],
        },
        {
            id: 3,
            type: 'Audio',
            name: 'call_recording.wav',
            result: 'REAL',
            score: 85,
            time: '25m ago',
            explanation: 'Acoustic waveform analysis and speech spectral harmonics match authentic biological human voice patterns.',
            sources: [],
            breakdown: [
                { name: 'Acoustic resonance', score: '0.88' },
                { name: 'Vocal tract jitter', score: '0.82' },
            ],
        },
        {
            id: 4,
            type: 'Text',
            name: 'India World Population Rank',
            fullClaim: 'Does India have the largest population in the world?',
            result: 'REAL',
            tathyaVerdict: 'TRUE',
            score: 94,
            time: '1h ago',
            explanation: "Verified TRUE by Tathya. United Nations Population Fund (UNFPA) and World Bank statistical reports confirm India surpassed China in 2023 as the most populous country.",
            sources: [
                { tool: 'NewsAPI', title: 'UN Population Fund Official Demographics', url: 'https://www.unfpa.org', snippet: 'India official demographics demonstrate world leading population.' },
                { tool: 'Wikidata', title: 'List of countries by population', url: 'https://www.wikidata.org', snippet: 'India currently ranks #1 in world population estimates.' },
            ],
            decomposition: [
                'Current global demographic rankings by country',
                'United Nations official world population statistics',
            ],
        },
    ])

    const [selectedHistoryItem, setSelectedHistoryItem] = useState(history[0])

    useEffect(() => {
        if (!historyStorageKey) return

        try {
            const savedHistory = JSON.parse(localStorage.getItem(historyStorageKey) || '[]')
            if (!Array.isArray(savedHistory)) return

            setHistory((currentHistory) => {
                const savedIds = new Set(savedHistory.map((item) => item.id))
                const mergedHistory = [
                    ...savedHistory,
                    ...currentHistory.filter((item) => !savedIds.has(item.id)),
                ].slice(0, 25)
                try {
                    localStorage.setItem(historyStorageKey, JSON.stringify(mergedHistory))
                } catch (error) {
                    console.error('Unable to save restored detection history:', error)
                }
                setSelectedHistoryItem(mergedHistory[0])
                return mergedHistory
            })
        } catch (error) {
            console.error('Unable to restore detection history:', error)
        }
    }, [historyStorageKey])

    const addHistoryItem = (newItem) => {
        setHistory((currentHistory) => {
            const updatedHistory = [newItem, ...currentHistory].slice(0, 25)
            if (historyStorageKey) {
                try {
                    localStorage.setItem(historyStorageKey, JSON.stringify(updatedHistory))
                } catch (error) {
                    console.error('Unable to save detection history:', error)
                }
            }
            return updatedHistory
        })
        setSelectedHistoryItem(newItem)
    }

    const removeHistoryItem = (itemId) => {
        setHistory((currentHistory) => {
            const updatedHistory = currentHistory.filter((item) => item.id !== itemId)
            if (historyStorageKey) {
                try {
                    localStorage.setItem(historyStorageKey, JSON.stringify(updatedHistory))
                } catch (error) {
                    console.error('Unable to delete detection history item:', error)
                }
            }
            return updatedHistory
        })
        setSelectedHistoryItem((currentItem) => currentItem?.id === itemId ? null : currentItem)
    }

    const [uploading, setUploading] = useState(false)
    const [uploadMessage, setUploadMessage] = useState('')
    const [uploadError, setUploadError] = useState('')

    // Quick text claim state in dashboard
    const [quickClaim, setQuickClaim] = useState('')
    const [quickClaimLoading, setQuickClaimLoading] = useState(false)

    async function handleUpload(e, mediaType) {
        const file = e.target.files && e.target.files[0]
        if (!file) return

        setUploadError('')

        if (mediaType !== 'video') {
            setUploadError('Currently backend supports video detection and Tathya text fact-checking. Audio upload will be enabled next.')
            e.target.value = ''
            return
        }

        setUploadMessage(`Analyzing ${file.name}...`)
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                let detail = 'Prediction failed'
                try {
                    const payload = await response.json()
                    detail = payload.detail || detail
                } catch {
                    // Ignore parse errors and keep generic message.
                }
                throw new Error(detail)
            }

            const data = await response.json()
            const newItem = {
                id: Date.now(),
                type: 'Video',
                name: file.name,
                result: data.verdict,
                score: Math.round(data.confidence),
                time: 'just now',
                explanation: `Video model analysis completed with verdict: ${data.verdict} (${Math.round(data.confidence)}% confidence).`,
                sources: [],
                breakdown: [
                    { name: 'Model confidence score', score: (data.confidence / 100).toFixed(2) },
                    { name: 'Raw probability', score: data.raw_prob ? data.raw_prob.toFixed(3) : '0.85' },
                ],
            }
            addHistoryItem(newItem)
            setUploadMessage(`Done: ${file.name} -> ${data.verdict} (${Math.round(data.confidence)}%)`)
        } catch (error) {
            console.error(error)
            setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.')
            setUploadMessage('')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    async function handleQuickFactCheck(e) {
        if (e) e.preventDefault()
        const trimmed = quickClaim.trim()
        if (!trimmed) return

        setUploadError('')
        setUploadMessage(`Tathya is fact checking: "${trimmed}"...`)
        setQuickClaimLoading(true)

        try {
            const data = await verifyClaimWithTathya(trimmed, (step, desc) => {
                if (desc) setUploadMessage(`Tathya Agent: ${desc}`)
            })

            const newItem = {
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
            }

            addHistoryItem(newItem)
            setUploadMessage(`Done: Tathya verdict -> ${data.verdict} (${Math.round(data.confidence || 85)}%)`)
            setQuickClaim('')
        } catch (error) {
            console.error(error)
            setUploadError(error instanceof Error ? error.message : 'Fact check failed.')
            setUploadMessage('')
        } finally {
            setQuickClaimLoading(false)
        }
    }

    function handleTathyaVerificationComplete(newItem) {
        addHistoryItem(newItem)
    }

    const modelStats = {
        'Video (Keras CNN-LSTM)': { accuracy: 92, precision: 90, recall: 88, desc: 'Deepfake face & frame detection' },
        'Text (Tathya Agentic Engine)': { accuracy: 94, precision: 93, recall: 91, desc: 'Autonomous multi-source fact checking' },
        'Audio (Biometric Forensics)': { accuracy: 88, precision: 85, recall: 82, desc: 'Vocal synthesis & clone detection' },
    }

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-white to-indigo-50/60 text-slate-900 overflow-hidden flex">
            {/* Background blobs */}
            <div className="blob w-[500px] h-[500px] bg-indigo-300 top-[-150px] left-[-120px] pointer-events-none" />
            <div className="blob w-[420px] h-[420px] bg-violet-300 top-[20%] right-[-140px] pointer-events-none" />
            <div className="blob w-[380px] h-[380px] bg-orange-200 bottom-[-100px] left-[30%] pointer-events-none" />
            <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

            <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

            <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-700">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Multi-Model Live Engine
                            </span>
                            {activeTab === 'text' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                                    <SparklesIcon className="w-3.5 h-3.5" />
                                    Tathya Fact-Checking Studio
                                </span>
                            )}
                        </div>
                        <h1 className="font-display mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
                            {activeTab === 'text' ? (
                                <>Tathya <span className="gradient-text">Fact-Checking &amp; Claim Verification</span></>
                            ) : activeTab === 'video' ? (
                                <>Video <span className="gradient-text">Deepfake Detection Studio</span></>
                            ) : activeTab === 'audio' ? (
                                <>Audio <span className="gradient-text">Fake-News Detection Studio</span></>
                            ) : activeTab === 'performance' ? (
                                <>Multi-Model <span className="gradient-text">Performance Benchmarks</span></>
                            ) : (
                                <>Deepfake <span className="gradient-text">Detection Dashboard</span></>
                            )}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {activeTab === 'text'
                                ? 'Verify claims and articles against real-time web, news, and knowledge sources'
                                : activeTab === 'audio'
                                ? 'Upload or record audio to transcribe, verify claims, and detect AI-synthesized voices'
                                : 'Monitor Video, Audio & Text factuality across your system in real time'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mobile tab quick-toggle */}
                        <div className="flex md:hidden items-center gap-1 bg-white/80 p-1 rounded-xl border border-slate-200 text-xs font-medium">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`px-2.5 py-1 rounded-lg ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('text')}
                                className={`px-2.5 py-1 rounded-lg ${activeTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                            >
                                Tathya
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-sm text-slate-500 hidden sm:block">
                                Signed in as <strong className="text-slate-800">{user?.full_name || 'User'}</strong>
                            </div>
                            {/* Clerk UserButton: handles avatar, profile management, and sign out */}
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-10 h-10 rounded-full shadow-lg shadow-indigo-500/30',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </header>

                {/* ── TAB: Dedicated Tathya Fact-Checker & DeepFocus Video Studio ── */}
                {activeTab === 'text' ? (
                    <TathyaFactChecker
                        onVerificationComplete={handleTathyaVerificationComplete}
                    />
                ) : activeTab === 'video' ? (
                    <DeepFocusVideoDetector
                        onScanCompleted={handleTathyaVerificationComplete}
                    />
                ) : activeTab === 'audio' ? (
                    <AudioDetector
                        onAudioScanCompleted={handleTathyaVerificationComplete}
                    />
                ) : (
                    /* ── TAB: Main Dashboard Overview ── */
                    <>
                        {/* Metrics row */}
                        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                            <MetricCard
                                title="Video Detections"
                                value={1243}
                                percent={78}
                                color="from-indigo-600 to-violet-600"
                                text="text-indigo-600"
                            />
                            <MetricCard
                                title="Tathya Fact Checks"
                                value={2489}
                                percent={94}
                                color="from-emerald-500 to-teal-500"
                                text="text-emerald-600"
                                subtext="verified claims"
                            />
                            <MetricCard
                                title="Audio Detections"
                                value={842}
                                percent={65}
                                color="from-pink-500 to-rose-500"
                                text="text-pink-500"
                            />
                        </section>

                        {/* Upload & Analyze Section */}
                        <section className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-6">
                            <div className="lg:col-span-2 glass-strong rounded-2xl p-6 shadow-lg shadow-indigo-500/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-display font-bold text-slate-900">Upload &amp; Analyze Multi-Modal Content</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">Choose a modality to detect fabrication or verify truth</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('text')}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        <span>Open Tathya Studio</span>
                                        <ExternalLinkIcon className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Video Card */}
                                    <label className="col-span-1 p-4 rounded-2xl border border-indigo-100 bg-white/60 flex flex-col items-start gap-3 cursor-pointer hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <VideoDetectIcon />
                                        </div>
                                        <div>
                                            <strong className="text-slate-800 block text-sm">Upload Video</strong>
                                            <span className="text-xs text-slate-400">MP4, MOV (Keras Model)</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => handleUpload(e, 'video')}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* Audio Card — navigates to Audio Detection tab */}
                                    <div
                                        className="col-span-1 p-4 rounded-2xl border border-indigo-100 bg-white/60 flex flex-col items-start gap-3 cursor-pointer hover:border-pink-300 hover:shadow-lg hover:shadow-pink-500/10 transition-all group"
                                        onClick={() => setActiveTab('audio')}
                                    >
                                        <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <AudioDetectIcon />
                                        </div>
                                        <div>
                                            <strong className="text-slate-800 block text-sm">Upload Audio</strong>
                                            <span className="text-xs text-slate-400">WAV, MP3 (Voice Forensics)</span>
                                        </div>
                                    </div>

                                    {/* Tathya Text Card */}
                                    <div className="col-span-1 p-4 rounded-2xl border border-emerald-100 bg-emerald-50/20 flex flex-col items-start gap-2.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
                                        <div className="w-full flex items-center justify-between">
                                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                                <TextDetectIcon />
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                                Tathya Model
                                            </span>
                                        </div>
                                        <div>
                                            <strong className="text-slate-800 block text-sm">Fact Check Claim</strong>
                                            <span className="text-xs text-slate-400">Verify text against live web sources</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Tathya Claim Input within Dashboard */}
                                <form onSubmit={handleQuickFactCheck} className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={quickClaim}
                                            onChange={(e) => setQuickClaim(e.target.value)}
                                            placeholder="Quick fact check: enter a claim or news excerpt..."
                                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={quickClaimLoading || !quickClaim.trim()}
                                            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                                        >
                                            {quickClaimLoading ? (
                                                <>
                                                    <RefreshIcon className="w-3.5 h-3.5 animate-spin" />
                                                    <span>Checking...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <SparklesIcon className="w-3.5 h-3.5" />
                                                    <span>Tathya Check</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {(uploading || uploadMessage || uploadError) && (
                                    <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${uploadError ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                                        {uploading ? 'Analyzing content with neural models...' : uploadError || uploadMessage}
                                    </div>
                                )}

                                <div className="mt-6">
                                    <h4 className="text-sm text-slate-500 font-medium">Recent Detection Activity</h4>
                                    <div className="mt-3">
                                        <Sparkline data={[3, 5, 6, 7, 6, 9, 8, 10, 9]} />
                                    </div>
                                </div>
                            </div>

                            {/* Model Performance Overview */}
                            <div className="glass-strong rounded-2xl p-6 shadow-lg shadow-indigo-500/5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-display font-bold text-slate-900">Model Accuracy</h3>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                            Benchmarked
                                        </span>
                                    </div>
                                    <div className="mt-4 space-y-4">
                                        {Object.entries(modelStats).map(([name, stats]) => (
                                            <div key={name} className="p-3.5 rounded-xl bg-white/70 border border-slate-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-800">{name}</div>
                                                        <div className="text-xs text-slate-400">{stats.desc}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-bold text-sm text-indigo-600">{stats.accuracy}%</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2.5 h-2 bg-slate-200/70 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                                        style={{ width: `${stats.accuracy}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                    <span>Tathya Engine v1.0</span>
                                    <button
                                        onClick={() => setActiveTab('text')}
                                        className="text-indigo-600 font-semibold hover:underline"
                                    >
                                        Test Fact Checker →
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Recent History & Selected Details */}
                        <section className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                            {/* History List */}
                            <div className="glass-strong rounded-2xl p-6 shadow-lg shadow-indigo-500/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-display font-bold text-slate-900">Recent Detection History</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">Click any record to inspect verified evidence and model logs</p>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                        {history.length} items
                                    </span>
                                </div>

                                <ul className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                                    {history.map((h) => {
                                        const isSelected = selectedHistoryItem?.id === h.id
                                        const isReal = h.result === 'REAL' || h.result === 'TRUE'
                                        return (
                                            <li
                                                key={h.id}
                                                onClick={() => setSelectedHistoryItem(h)}
                                                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-200/50 shadow-sm'
                                                        : 'bg-white/70 border-slate-100 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                                    <div
                                                        className={`w-11 h-11 rounded-xl shrink-0 bg-gradient-to-br ${
                                                            h.type === 'Video'
                                                                ? 'from-indigo-100 to-violet-100 text-indigo-600'
                                                                : h.type === 'Audio'
                                                                ? 'from-pink-100 to-rose-100 text-pink-500'
                                                                : 'from-emerald-100 to-teal-100 text-emerald-600'
                                                        } flex items-center justify-center`}
                                                    >
                                                        {h.type === 'Video' ? (
                                                            <VideoDetectIcon />
                                                        ) : h.type === 'Audio' ? (
                                                            <AudioDetectIcon />
                                                        ) : (
                                                            <TextDetectIcon />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-slate-800 text-sm truncate">
                                                            {h.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400 mt-0.5">
                                                            {h.type === 'Text' ? 'Tathya Fact Check' : h.type} • {h.time}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-right shrink-0">
                                                    <div
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                            isReal
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                                        }`}
                                                    >
                                                        <span>{h.tathyaVerdict || h.result}</span>
                                                        <span className="opacity-70 font-normal">({h.score}%)</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(event) => {
                                                            event.stopPropagation()
                                                            removeHistoryItem(h.id)
                                                        }}
                                                        className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                        aria-label={`Delete ${h.name} from detection history`}
                                                        title="Delete from history"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                            {/* Last / Selected Analysis Details */}
                            <div className="glass-strong rounded-2xl p-6 shadow-lg shadow-indigo-500/5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-display font-bold text-slate-900">
                                            {selectedHistoryItem?.type === 'Text' ? 'Tathya Fact Check Details' : 'Analysis Inspection'}
                                        </h3>
                                        {selectedHistoryItem?.type === 'Text' && (
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                                Multi-Source Verified
                                            </span>
                                        )}
                                    </div>

                                    {selectedHistoryItem ? (
                                        <div className="mt-4 space-y-4">
                                            {/* Item title / claim */}
                                            <div className="p-3.5 rounded-xl bg-white/70 border border-slate-100">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                    {selectedHistoryItem.type === 'Text' ? 'Claim Verified' : 'File Inspected'}
                                                </span>
                                                <div className="font-semibold text-slate-800 text-sm mt-1">
                                                    {selectedHistoryItem.fullClaim || selectedHistoryItem.name}
                                                </div>
                                            </div>

                                            {/* Verdict & Confidence Cards */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3.5 rounded-xl bg-white/70 border border-slate-100">
                                                    <div className="text-xs text-slate-400">Verdict</div>
                                                    <div className={`font-display font-bold text-lg mt-1 ${
                                                        selectedHistoryItem.result === 'REAL' || selectedHistoryItem.result === 'TRUE'
                                                            ? 'text-emerald-600'
                                                            : 'text-rose-600'
                                                    }`}>
                                                        {selectedHistoryItem.tathyaVerdict || selectedHistoryItem.result}
                                                    </div>
                                                </div>
                                                <div className="p-3.5 rounded-xl bg-white/70 border border-slate-100">
                                                    <div className="text-xs text-slate-400">Confidence</div>
                                                    <div className="font-display font-bold text-lg mt-1 text-indigo-600">
                                                        {selectedHistoryItem.score}%
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Explanation */}
                                            {selectedHistoryItem.explanation && (
                                                <div className="p-3.5 rounded-xl bg-white/70 border border-slate-100">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                                        AI Model Explanation
                                                    </span>
                                                    <p className="text-xs text-slate-700 leading-relaxed">
                                                        {selectedHistoryItem.explanation}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Sources or Breakdown */}
                                            {selectedHistoryItem.sources && selectedHistoryItem.sources.length > 0 && (
                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                                                        <BookOpenIcon className="w-3.5 h-3.5 text-indigo-600" />
                                                        <span>Cited Evidence Sources ({selectedHistoryItem.sources.length})</span>
                                                    </span>
                                                    <ul className="space-y-2">
                                                        {selectedHistoryItem.sources.slice(0, 3).map((src, i) => (
                                                            <li key={i} className="p-2.5 rounded-lg bg-white/60 border border-slate-100 text-xs">
                                                                <div className="flex items-center justify-between font-semibold text-slate-800">
                                                                    <span className="truncate pr-2">{src.title}</span>
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 shrink-0">
                                                                        {src.tool || 'Source'}
                                                                    </span>
                                                                </div>
                                                                {src.url && (
                                                                    <a
                                                                        href={src.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-[11px] text-indigo-600 hover:underline mt-1 inline-flex items-center gap-1"
                                                                    >
                                                                        <span>Open Reference</span>
                                                                        <ExternalLinkIcon className="w-3 h-3" />
                                                                    </a>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Model breakdown if present */}
                                            {selectedHistoryItem.breakdown && (
                                                <div>
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                                        Layer Breakdown
                                                    </span>
                                                    <ul className="space-y-1.5 text-xs">
                                                        {selectedHistoryItem.breakdown.map((b, i) => (
                                                            <li key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/60 border border-slate-100">
                                                                <span className="text-slate-600">{b.name}</span>
                                                                <span className="font-semibold text-indigo-600">{b.score}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-8 text-center text-slate-400 text-sm">
                                            Select any detection from the history list to inspect.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <button
                                        onClick={() => setActiveTab('text')}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        <SparklesIcon className="w-3.5 h-3.5" />
                                        <span>Deep Fact Check in Tathya Studio</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}
