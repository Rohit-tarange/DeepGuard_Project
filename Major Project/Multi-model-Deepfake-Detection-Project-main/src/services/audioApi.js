/**
 * API client for the Fake-News Audio Detector backend (port 8001).
 * Configured via VITE_AUDIO_API_BASE_URL env var, defaulting to localhost:8001.
 */

const AUDIO_API = import.meta.env.VITE_AUDIO_API_BASE_URL || 'http://localhost:8001';

export async function checkAudioBackendHealth() {
  const resp = await fetch(`${AUDIO_API}/api/health`);
  if (!resp.ok) throw new Error(`Audio API health check failed: ${resp.statusText}`);
  return resp.json();
}

export async function uploadAudioFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const resp = await fetch(`${AUDIO_API}/api/audio/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!resp.ok) {
    const errData = await resp.json().catch(() => ({}));
    throw new Error(errData.detail || `Upload failed with status ${resp.status}`);
  }
  return resp.json();
}

export async function startAnalysisJob(audioFileId) {
  const resp = await fetch(`${AUDIO_API}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio_file_id: audioFileId }),
  });

  if (!resp.ok) {
    const errData = await resp.json().catch(() => ({}));
    throw new Error(errData.detail || `Failed to start analysis job: ${resp.status}`);
  }
  return resp.json();
}

export async function getAnalysisJobStatus(jobId) {
  const resp = await fetch(`${AUDIO_API}/api/analyze/${jobId}/status`);
  if (!resp.ok) throw new Error(`Failed to fetch job status: ${resp.status}`);
  return resp.json();
}

export async function getAnalysisJobResults(jobId) {
  const resp = await fetch(`${AUDIO_API}/api/analyze/${jobId}`);
  if (!resp.ok) throw new Error(`Failed to fetch job results: ${resp.status}`);
  return resp.json();
}

export function getAudioStreamUrl(audioFileId) {
  return `${AUDIO_API}/api/audio/${audioFileId}/stream`;
}
