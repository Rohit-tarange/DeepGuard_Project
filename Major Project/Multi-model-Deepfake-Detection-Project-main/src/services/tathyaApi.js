/**
 * Tathya API Client Service
 * Connects to Tathya Fact Checking System (via async task polling or synchronous endpoints)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function verifyClaimWithTathya(claim, onProgress) {
    const trimmed = claim.trim()
    if (!trimmed) {
        throw new Error('Claim text cannot be empty')
    }

    // Try 1: Call Tathya asynchronous task pipeline (POST /check -> GET /results/{task_id})
    try {
        if (onProgress) onProgress(1, 'Connecting to Tathya Agent...')
        const checkRes = await fetch(`${API_BASE_URL}/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ claim: trimmed, language: 'en' }),
        })

        if (checkRes.ok) {
            const initData = await checkRes.json()
            const taskId = initData.task_id

            if (taskId) {
                // Poll for completion
                const maxPolls = 40 // ~80 seconds
                for (let attempt = 0; attempt < maxPolls; attempt++) {
                    await new Promise((r) => setTimeout(r, 2000))

                    if (attempt < 2 && onProgress) {
                        onProgress(2, 'Gathering multi-source evidence via Tavily, Gemini & NewsAPI...')
                    } else if (attempt >= 2 && attempt < 5 && onProgress) {
                        onProgress(3, 'Cross-examining sources & evaluating factual consistency...')
                    } else if (attempt >= 5 && onProgress) {
                        onProgress(4, 'Synthesizing verdict & computing confidence score...')
                    }

                    const statusRes = await fetch(`${API_BASE_URL}/results/${taskId}`)
                    if (!statusRes.ok) continue

                    const pollData = await statusRes.json()

                    if (pollData.status === 'completed' && pollData.result) {
                        const r = pollData.result
                        const score = typeof r.confidence_score === 'number' ? r.confidence_score : 0.9
                        return {
                            claim: r.claim || trimmed,
                            verdict: (r.result || 'TRUE').toUpperCase(),
                            confidence: Math.round(score > 1 ? score : score * 100),
                            confidence_score: score > 1 ? score / 100 : score,
                            explanation: r.explanation || 'Claim verified by Tathya agent.',
                            sources: (r.sources || []).map((s) => ({
                                tool: s.tool || s.source_tool || 'Tathya Search',
                                title: s.title || s.url || 'Web Source',
                                url: s.url || '',
                                snippet: s.snippet || '',
                                score: s.score,
                            })),
                            decomposition: r.decomposition || [],
                        }
                    }

                    if (pollData.status === 'error') {
                        throw new Error(pollData.error_detail || 'Tathya background fact-check encountered an error.')
                    }
                }
            }
        }
    } catch (err) {
        console.warn('Async /check pipeline error, falling back to direct endpoint:', err)
    }

    // Try 2: Call synchronous /fact-check endpoint
    if (onProgress) onProgress(2, 'Running unified fact-check endpoint...')
    const syncRes = await fetch(`${API_BASE_URL}/fact-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: trimmed, language: 'en' }),
    })

    if (!syncRes.ok) {
        let errorMsg = 'Fact-checking service request failed.'
        try {
            const data = await syncRes.json()
            errorMsg = data.detail || data.message || errorMsg
        } catch {}
        throw new Error(errorMsg)
    }

    const data = await syncRes.json()
    const score = typeof data.confidence_score === 'number' ? data.confidence_score : 0.9
    return {
        claim: data.claim || trimmed,
        verdict: (data.verdict || 'TRUE').toUpperCase(),
        confidence: Math.round(data.confidence || score * 100),
        confidence_score: score > 1 ? score / 100 : score,
        explanation: data.explanation || 'Verified by Tathya.',
        sources: data.sources || [],
        decomposition: data.decomposition || [],
    }
}
