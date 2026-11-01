import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    checkAudioBackendHealth,
    uploadAudioFile,
    startAnalysisJob,
    getAnalysisJobStatus,
    getAnalysisJobResults,
    getAudioStreamUrl,
} from '../services/audioApi'
import { AudioDetectIcon, SparklesIcon, RefreshIcon, CheckIcon, AlertCircleIcon } from './icons'

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ onStartAnalysis, isUploading }) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [audioPreviewUrl, setAudioPreviewUrl] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    const [recordingSeconds, setRecordingSeconds] = useState(0)
    const fileInputRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    const timerRef = useRef(null)

    const startRecording = async () => {
        setErrorMsg(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []
            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
                const file = new File([blob], `mic_recording_${Date.now()}.wav`, { type: 'audio/wav' })
                validateAndSet(file)
                stream.getTracks().forEach((t) => t.stop())
            }
            mediaRecorder.start(250)
            setIsRecording(true)
            setRecordingSeconds(0)
            timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000)
        } catch {
            setErrorMsg('Microphone access denied or not available.')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }

    const validateAndSet = (file) => {
        setErrorMsg(null)
        if (!file) return
        const validExts = ['.mp3', '.wav', '.m4a', '.mp4']
        if (!validExts.some((ext) => file.name.toLowerCase().endsWith(ext))) {
            setErrorMsg('Unsupported format. Please upload .mp3, .wav, .m4a, or .mp4.')
            return
        }
        if (file.size > 100 * 1024 * 1024) { setErrorMsg('File exceeds 100 MB limit.'); return }
        setSelectedFile(file)
        if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
        setAudioPreviewUrl(URL.createObjectURL(file))
    }

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
        else if (e.type === 'dragleave') setDragActive(false)
    }
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false)
        if (e.dataTransfer.files?.[0]) validateAndSet(e.dataTransfer.files[0])
    }
    const handleChange = (e) => { if (e.target.files?.[0]) validateAndSet(e.target.files[0]) }

    const handleLoadDemo = (type) => {
        setErrorMsg(null)
        const sr = 16000, dur = 3.5, n = Math.floor(sr * dur)
        const buf = new ArrayBuffer(44 + n * 2)
        const v = new DataView(buf)
        const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }
        ws(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ')
        v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
        v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true)
        ws(36, 'data'); v.setUint32(40, n * 2, true)
        for (let i = 0; i < n; i++) {
            const t = i / sr
            const f0 = type === 'health' ? 175 + 25 * Math.sin(2 * Math.PI * 2.5 * t) : 210 + 35 * Math.sin(2 * Math.PI * 3.2 * t)
            const s = 0.35 * Math.sin(2 * Math.PI * f0 * t) + 0.15 * Math.sin(2 * Math.PI * 720 * t)
            v.setInt16(44 + i * 2, Math.max(-32767, Math.min(32767, Math.floor(s * 32767))), true)
        }
        const fname = type === 'health' ? 'sample_health_news.wav' : 'sample_official_briefing.wav'
        validateAndSet(new File([new Blob([buf], { type: 'audio/wav' })], fname, { type: 'audio/wav' }))
    }

    return (
        <div className="w-full space-y-4">
            {/* Drop Zone */}
            <div
                className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${dragActive ? 'border-indigo-400 bg-indigo-50/60' : 'border-slate-200 bg-white/60 hover:border-indigo-300 hover:bg-indigo-50/30'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input ref={fileInputRef} type="file" accept=".mp3,.wav,.m4a,.mp4,audio/*" className="hidden" onChange={handleChange} />
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
                        <AudioDetectIcon className="w-9 h-9" />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-slate-900 text-lg">Upload Spoken Audio or News Clip</h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                            Drag & drop an audio file here or click to browse. Supports MP3, WAV, M4A, MP4 up to 100 MB.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {['.MP3', '.WAV', '.M4A', '.MP4'].map((f) => (
                            <span key={f} className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">{f}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mic Recording */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {!isRecording ? (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); startRecording() }}
                        className="px-5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:border-rose-400 hover:text-rose-700 font-semibold text-sm flex items-center gap-2 shadow-sm transition-all"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        Record Live Audio from Microphone
                    </button>
                ) : (
                    <div className="flex items-center gap-4 px-5 py-2.5 rounded-xl bg-rose-50 border border-rose-300">
                        <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-rose-700 font-semibold text-sm">
                            Recording: {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                        </span>
                        <button type="button" onClick={stopRecording}
                            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition-colors">
                            Stop & Inspect
                        </button>
                    </div>
                )}
            </div>

            {/* Error */}
            {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
                    <AlertCircleIcon className="w-5 h-5 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Selected File Card */}
            {selectedFile && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-strong rounded-2xl p-5 border border-indigo-200 bg-indigo-50/30 shadow-lg shadow-indigo-500/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <AudioDetectIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800 truncate max-w-xs">{selectedFile.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'audio file'}
                                </div>
                            </div>
                        </div>
                        {audioPreviewUrl && (
                            <div className="flex-1 max-w-xs">
                                <audio controls src={audioPreviewUrl} className="w-full h-9 rounded-lg" />
                            </div>
                        )}
                        <button
                            onClick={() => onStartAnalysis(selectedFile)}
                            disabled={isUploading}
                            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 shrink-0"
                        >
                            {isUploading ? (
                                <><RefreshIcon className="w-4 h-4 animate-spin" /><span>Processing...</span></>
                            ) : (
                                <><SparklesIcon className="w-4 h-4" /><span>Run Full Analysis</span></>
                            )}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Demo Samples */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 gap-2">
                <span className="font-medium text-slate-500">Quick test samples:</span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleLoadDemo('health') }}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-600 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                        🎙️ Health News Sample
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleLoadDemo('briefing') }}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-violet-300 text-slate-600 hover:text-violet-600 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                        🎙️ Official Briefing Sample
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Pipeline Progress ─────────────────────────────────────────────────────────
const PIPELINE_STAGES = [
    { key: 'speech_to_text', label: 'Speech-to-Text', icon: '🎙️', desc: 'Transcribing audio with Whisper' },
    { key: 'claim_extraction', label: 'Claim Extraction', icon: '🔍', desc: 'Identifying verifiable claims' },
    { key: 'claim_verification', label: 'Fact Verification', icon: '⚖️', desc: 'Cross-referencing evidence sources' },
    { key: 'audio_detection', label: 'Acoustic Forensics', icon: '📊', desc: 'Detecting AI-synthesized voice' },
]

function PipelineProgress({ statusData }) {
    const pct = statusData?.progress_percent || 0
    const stage = statusData?.current_stage || ''
    const currentIdx = PIPELINE_STAGES.findIndex((s) => stage.toLowerCase().includes(s.key.replace(/_/g, '')))

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-strong rounded-2xl p-8 shadow-lg shadow-indigo-500/5 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <RefreshIcon className="w-8 h-8 animate-spin text-white" />
                </div>
                <div>
                    <h3 className="font-display font-bold text-slate-900 text-xl">Analyzing Audio Pipeline</h3>
                    <p className="text-sm text-slate-500 mt-1">{stage || 'Starting pipeline...'}</p>
                </div>
                <div className="max-w-sm mx-auto">
                    <div className="flex justify-between text-xs font-semibold text-indigo-700 mb-1.5">
                        <span>Progress</span><span>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {PIPELINE_STAGES.map((s, i) => {
                    const done = currentIdx > i || pct >= 100
                    const active = currentIdx === i
                    return (
                        <div key={s.key} className={`glass-strong rounded-2xl p-4 shadow-sm border transition-all ${active ? 'border-indigo-300 bg-indigo-50/40' : done ? 'border-emerald-200 bg-emerald-50/20' : 'border-white/70'}`}>
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <div className={`font-semibold text-sm ${active ? 'text-indigo-700' : done ? 'text-emerald-700' : 'text-slate-500'}`}>{s.label}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{s.desc}</div>
                            {active && (
                                <div className="mt-2 w-full h-1 bg-indigo-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                                </div>
                            )}
                            {done && (
                                <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                    <CheckIcon className="w-3.5 h-3.5" /> Complete
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}

// ─── Verdict Banner ────────────────────────────────────────────────────────────
function VerdictBanner({ jobData, onReset }) {
    const auth = jobData?.audio_authenticity_result
    const claims = jobData?.claims || []
    const trueCount = claims.filter((c) => getClaimVerdict(c) === 'TRUE').length
    const falseCount = claims.filter((c) => ['FALSE', 'MISLEADING', 'CONFLICTING'].includes(getClaimVerdict(c))).length
    const unverifiedCount = claims.filter((c) => getClaimVerdict(c) === 'UNVERIFIED').length
    const isSynthetic = (auth?.ai_probability ?? auth?.fake_probability ?? 0) > 0.5
    const claimsReal = falseCount === 0
    const overallReal = !isSynthetic && claimsReal

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`glass-strong rounded-2xl p-6 shadow-lg border ${overallReal ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'}`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Audio Intelligence Verdict</span>
                    <h2 className={`font-display text-4xl font-extrabold mt-1 ${overallReal ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {overallReal ? 'AUTHENTIC' : 'SUSPICIOUS'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {overallReal
                            ? 'Voice appears genuine. Claims are supported by available evidence.'
                            : unverifiedCount > 0 && falseCount === 0
                                ? 'Voice appears genuine, but some claims could not be verified from available evidence.'
                            : 'Potential synthetic voice or false claims detected. Review forensics below.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`px-5 py-3 rounded-xl text-center ${overallReal ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">Status</div>
                        <div className="font-bold text-sm mt-0.5">{overallReal ? 'Verified Authentic' : 'Review Required'}</div>
                    </div>
                    <button
                        onClick={onReset}
                        className="px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 font-semibold text-xs shadow-sm transition-all"
                    >
                        Analyze Another
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
                <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Voice</div>
                    <div className={`font-display font-bold text-xl mt-1 ${isSynthetic ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {isSynthetic ? 'Synthetic' : 'Genuine'}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verified Claim</div>
                    <div className="font-display font-bold text-xl mt-1 text-emerald-600">{trueCount > 0 ? 'TRUE' : '—'}</div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Disputed Claim</div>
                    <div className="font-display font-bold text-xl mt-1 text-rose-600">{falseCount > 0 ? 'FALSE' : '—'}</div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unverified Claim</div>
                    <div className="font-display font-bold text-xl mt-1 text-amber-600">{unverifiedCount > 0 ? 'UNVERIFIED' : '—'}</div>
                </div>
            </div>
        </motion.div>
    )
}

// ─── Transcript Panel ──────────────────────────────────────────────────────────
function TranscriptPanel({ audioFileId, transcription }) {
    const text = transcription?.full_text || transcription?.text || ''
    const segments = transcription?.segments || []
    const streamUrl = audioFileId ? getAudioStreamUrl(audioFileId) : null

    return (
        <div className="glass-strong rounded-2xl p-6 shadow-lg shadow-indigo-500/5 flex flex-col">
            <h4 className="font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>🎙️</span> Audio Transcript
            </h4>
            {streamUrl && (
                <audio controls src={streamUrl} className="w-full rounded-lg mb-4" />
            )}
            <div className="overflow-y-auto pr-1 space-y-2 max-h-72">
                {segments.length > 0 ? (
                    segments.map((seg, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/70 border border-slate-100 text-xs">
                            <span className="font-mono text-indigo-600 font-semibold mr-2">
                                {typeof seg.start === 'number' ? `${seg.start.toFixed(1)}s` : ''}
                            </span>
                            <span className="text-slate-700 leading-relaxed">{seg.text}</span>
                        </div>
                    ))
                ) : text ? (
                    <div className="p-4 rounded-xl bg-white/70 border border-slate-100 text-sm text-slate-700 leading-relaxed">{text}</div>
                ) : (
                    <div className="text-sm text-slate-400 text-center py-6">No transcript available.</div>
                )}
            </div>
        </div>
    )
}

// ─── Claims Explorer ───────────────────────────────────────────────────────────
const VERDICT_STYLE = {
    TRUE: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    FALSE: 'bg-rose-50 text-rose-700 border border-rose-200',
    UNVERIFIED: 'bg-slate-100 text-slate-600 border border-slate-200',
    MISLEADING: 'bg-amber-50 text-amber-700 border border-amber-200',
    CONFLICTING: 'bg-violet-50 text-violet-700 border border-violet-200',
}

function getClaimVerdict(claim) {
    return claim.verdict || claim.verification?.classification || 'UNVERIFIED'
}

function getClaimText(claim) {
    return claim.claim || claim.claim_text || ''
}

function ClaimsExplorer({ claims }) {
    const [selected, setSelected] = useState(null)
    useEffect(() => { if (claims.length > 0) setSelected(claims[0]) }, [claims])

    if (!claims.length) {
        return (
            <div className="glass-strong rounded-2xl p-6 shadow-lg shadow-indigo-500/5 flex flex-col">
                <h4 className="font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span>⚖️</span> Claim Verification
                </h4>
                <div className="flex-1 flex items-center justify-center text-sm text-slate-400 py-8">
                    No verifiable claims detected in this audio.
                </div>
            </div>
        )
    }

    return (
        <div className="glass-strong rounded-2xl p-6 shadow-lg shadow-indigo-500/5 flex flex-col">
            <h4 className="font-display font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2"><span>⚖️</span> Claim Verification</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{claims.length} claims</span>
            </h4>
            <ul className="space-y-2 overflow-y-auto max-h-44 pr-1 mb-4">
                {claims.map((c, i) => (
                    <li
                        key={i}
                        onClick={() => setSelected(c)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all text-xs ${selected === c ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200/50' : 'bg-white/70 border-slate-100 hover:border-indigo-200'}`}
                    >
                        <span className="font-medium text-slate-800 truncate pr-2">{getClaimText(c)}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${VERDICT_STYLE[getClaimVerdict(c)] || VERDICT_STYLE.UNVERIFIED}`}>
                            {getClaimVerdict(c)}
                        </span>
                    </li>
                ))}
            </ul>
            {selected && (
                <div className="space-y-3 overflow-y-auto">
                    <div className={`flex items-center justify-between p-3.5 rounded-xl ${VERDICT_STYLE[getClaimVerdict(selected)] || VERDICT_STYLE.UNVERIFIED}`}>
                        <span className="text-[11px] font-bold uppercase tracking-wider">Verification Result</span>
                        <span className="font-display font-bold">{getClaimVerdict(selected)}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/70 border border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim Text</div>
                        <p className="text-sm text-slate-800 font-medium">{getClaimText(selected)}</p>
                    </div>
                    {(selected.explanation || selected.verification?.explanation) && (
                        <div className="p-3.5 rounded-xl bg-white/70 border border-slate-100">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI Explanation</div>
                            <p className="text-xs text-slate-600 leading-relaxed">{selected.explanation || selected.verification.explanation}</p>
                        </div>
                    )}
                    {(selected.evidence?.length > 0 || selected.verification?.sources?.length > 0) && (
                        <div className="p-3.5 rounded-xl bg-white/70 border border-slate-100">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Evidence Sources</div>
                            <ul className="space-y-1.5">
                                {(selected.evidence || selected.verification.sources).slice(0, 3).map((ev, i) => (
                                    <li key={i} className="text-xs text-slate-600">
                                        <span className="font-semibold text-slate-800">{ev.title || ev.url}</span>{' '}
                                        {ev.url && (
                                            <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">↗</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Acoustic Forensics ────────────────────────────────────────────────────────
function AcousticForensics({ authenticityResult }) {
    if (!authenticityResult) return null
    const prob = authenticityResult.ai_probability ?? authenticityResult.fake_probability ?? 0
    const confidence = authenticityResult.detection_confidence ?? authenticityResult.confidence
    const isSynthetic = prob > 0.5
    const features = authenticityResult.acoustic_features || authenticityResult.features || {}

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6 shadow-lg shadow-indigo-500/5">
            <div className="flex items-center justify-between mb-5">
                <h4 className="font-display font-bold text-slate-900 flex items-center gap-2">
                    <span>📊</span> Acoustic Forensics
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSynthetic ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    {authenticityResult.verdict || (isSynthetic ? 'SYNTHETIC' : 'AUTHENTIC')}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="glass-strong rounded-xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Synthetic Probability</div>
                    <div className={`font-display text-2xl font-bold mt-1 ${isSynthetic ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {(prob * 100).toFixed(1)}%
                    </div>
                </div>
                <div className="glass-strong rounded-xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confidence</div>
                    <div className="font-display text-2xl font-bold mt-1 text-indigo-600">
                        {confidence !== undefined
                            ? `${(confidence * 100).toFixed(0)}%`
                            : 'N/A'}
                    </div>
                </div>
                <div className="glass-strong rounded-xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine</div>
                    <div className="font-semibold text-slate-800 text-sm mt-2">Voice Forensics</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active</div>
                </div>
            </div>

            {Object.keys(features).length > 0 && (
                <div className="space-y-3">
                    <h5 className="font-semibold text-slate-700 text-sm">Signal Features</h5>
                    {Object.entries(features).slice(0, 4).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                                <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                <span className="font-mono">{typeof val === 'number' ? val.toFixed(4) : String(val)}</span>
                            </div>
                            {typeof val === 'number' && (
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${isSynthetic ? 'bg-rose-400' : 'bg-emerald-400'}`}
                                        style={{ width: `${Math.min(100, Math.abs(val) * 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {authenticityResult.explanation && (
                <div className="mt-4 p-3.5 rounded-xl bg-white/70 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    {authenticityResult.explanation}
                </div>
            )}
        </motion.div>
    )
}

// ─── Main AudioDetector Export ─────────────────────────────────────────────────
export default function AudioDetector({ onAudioScanCompleted }) {
    const [backendOnline, setBackendOnline] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [jobId, setJobId] = useState(null)
    const [jobStatus, setJobStatus] = useState(null)
    const [jobResults, setJobResults] = useState(null)
    const [error, setError] = useState(null)
    const pollRef = useRef(null)

    // Check audio backend health on mount
    useEffect(() => {
        checkAudioBackendHealth()
            .then(() => setBackendOnline(true))
            .catch(() => setBackendOnline(false))
    }, [])

    // Poll job status when a job is active
    useEffect(() => {
        if (!jobId || jobStatus?.status === 'COMPLETED' || jobStatus?.status === 'FAILED') {
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
            return
        }
        const poll = async () => {
            try {
                const status = await getAnalysisJobStatus(jobId)
                setJobStatus(status)
                if (status.status === 'COMPLETED') {
                    setIsProcessing(false)
                    const results = await getAnalysisJobResults(jobId)
                    setJobResults(results)
                    if (onAudioScanCompleted) {
                        const fakeProb = results.audio_authenticity_result?.ai_probability
                            ?? results.audio_authenticity_result?.fake_probability
                            ?? 0
                        onAudioScanCompleted({
                            id: Date.now(),
                            type: 'Audio',
                            name: results.audio_file?.original_filename || 'audio_analysis',
                            result: fakeProb > 0.5 ? 'FAKE' : 'REAL',
                            score: Math.round((1 - fakeProb) * 100),
                            time: 'just now',
                            explanation: `Audio pipeline: voice ${fakeProb > 0.5 ? 'SYNTHETIC' : 'GENUINE'} (${(fakeProb * 100).toFixed(1)}% fake probability). ${results.claims?.length || 0} claims analyzed.`,
                            sources: [],
                            breakdown: [
                                { name: 'Acoustic forensics', score: (1 - fakeProb).toFixed(2) },
                                { name: 'Claims', score: results.claims?.length ? `${results.claims.filter(c => getClaimVerdict(c) === 'TRUE').length}/${results.claims.length} TRUE` : 'N/A' },
                            ],
                        })
                    }
                } else if (status.status === 'FAILED') {
                    setIsProcessing(false)
                    setError(status.error_message || 'Pipeline analysis failed.')
                }
            } catch (err) { console.error('Audio poll error:', err) }
        }
        poll()
        pollRef.current = setInterval(poll, 1500)
        return () => { if (pollRef.current) clearInterval(pollRef.current) }
    }, [jobId, jobStatus?.status, onAudioScanCompleted])

    const handleStartAnalysis = async (file) => {
        setError(null); setIsProcessing(true); setJobResults(null); setJobStatus(null)
        try {
            const uploadResp = await uploadAudioFile(file)
            const audioFileId = uploadResp.audio_file_id || uploadResp.id
            const jobResp = await startAnalysisJob(audioFileId)
            setJobId(jobResp.id)
            setJobStatus({
                id: jobResp.id,
                status: jobResp.status,
                progress_percent: jobResp.progress_percent || 0,
                current_stage: jobResp.current_stage || 'Starting pipeline...',
            })
        } catch (err) {
            setIsProcessing(false)
            setError(err.message || 'Failed to start audio analysis.')
        }
    }

    const handleReset = () => {
        setJobId(null); setJobStatus(null); setJobResults(null); setError(null); setIsProcessing(false)
    }

    return (
        <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="glass-strong rounded-2xl p-5 sm:p-6 shadow-lg shadow-indigo-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                        <AudioDetectIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                            Audio Forensics Studio
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Whisper + Voice AI
                            </span>
                        </h2>
                        <p className="text-xs text-slate-500">
                            Speech-to-text → claim extraction → fact verification → AI voice detection
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/80 px-4 py-2 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto">
                    <span className={`w-2 h-2 rounded-full ${backendOnline === true ? 'bg-emerald-400 animate-pulse' : backendOnline === false ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    <span>
                        {backendOnline === true
                            ? 'Audio API Connected'
                            : backendOnline === false
                            ? 'Audio API Offline — Start on :8001'
                            : 'Connecting...'}
                    </span>
                </div>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 shadow">
                        <AlertCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <div className="font-bold text-rose-800 mb-0.5">Analysis Failed</div>
                            <div>{error}</div>
                        </div>
                        <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 text-xs underline shrink-0">
                            Dismiss
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* View 1: Upload & Initial State */}
            {!jobResults && !isProcessing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-strong rounded-2xl p-6 sm:p-10 shadow-lg shadow-indigo-500/5">
                    <div className="text-center mb-8">
                        <h3 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl leading-tight">
                            Verify News Authenticity from{' '}
                            <span className="gradient-text">Spoken Audio</span>
                        </h3>
                        <p className="text-slate-400 text-sm mt-2 max-w-2xl mx-auto">
                            End-to-end pipeline: upload or record audio → transcribe speech → extract & verify claims → detect AI-generated voice.
                        </p>
                    </div>
                    <UploadZone onStartAnalysis={handleStartAnalysis} isUploading={isProcessing} />
                </motion.div>
            )}

            {/* View 2: Processing */}
            {isProcessing && jobStatus && <PipelineProgress statusData={jobStatus} />}

            {/* View 3: Results Dashboard */}
            {jobResults && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <VerdictBanner jobData={jobResults} onReset={handleReset} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TranscriptPanel audioFileId={jobResults.audio_file?.id} transcription={jobResults.transcription} />
                        <ClaimsExplorer claims={jobResults.claims || []} />
                    </div>
                    {jobResults.audio_authenticity_result && (
                        <AcousticForensics authenticityResult={jobResults.audio_authenticity_result} />
                    )}
                </motion.div>
            )}

            {/* Offline Setup Guide */}
            {backendOnline === false && !isProcessing && !jobResults && (
                <div className="glass-strong rounded-2xl p-6 shadow-lg border border-amber-200 bg-amber-50/20">
                    <h4 className="font-display font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <span>⚠️</span> Audio Backend Not Running
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">Start the audio detection backend to enable live analysis:</p>
                    <div className="bg-slate-800 text-emerald-400 font-mono text-xs p-4 rounded-xl overflow-x-auto space-y-1">
                        <div className="text-slate-400"># 1. Navigate to audio backend</div>
                        <div>cd "Major Project/fake-news-audio-detector-main/fake-news-audio-detector-main/backend"</div>
                        <div className="text-slate-400 mt-2"># 2. Install Python dependencies (first time)</div>
                        <div>pip install -r requirements.txt</div>
                        <div className="text-slate-400 mt-2"># 3. Start on port 8001</div>
                        <div>uvicorn app.main:app --port 8001 --reload</div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                        The main project backend (port 8000) and audio backend (port 8001) run independently.
                    </p>
                </div>
            )}
        </div>
    )
}
