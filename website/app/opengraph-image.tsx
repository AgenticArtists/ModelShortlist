import { ImageResponse } from 'next/og'

export const alt = 'ModelShortlist — describe the job, get the shortlist'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: '#0b1220',
          color: '#f8fafc',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', left: -120, top: -140, width: 500, height: 500, borderRadius: 999, background: 'rgba(6,182,212,.15)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', right: -100, bottom: -180, width: 560, height: 560, borderRadius: 999, background: 'rgba(139,92,246,.18)', filter: 'blur(90px)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', padding: '72px 82px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', width: 54, height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: 'linear-gradient(135deg,#06b6d4,#2563eb 35%,#8b5cf6 70%,#ec4899)', fontSize: 27, fontWeight: 800 }}>M</div>
            <div style={{ display: 'flex', fontSize: 29, fontWeight: 700 }}>
              <span>Model</span><span style={{ color: '#8b5cf6' }}>Shortlist</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940 }}>
            <div style={{ display: 'flex', fontSize: 68, lineHeight: 1.06, fontWeight: 800, letterSpacing: '-3px' }}>
              Describe the job. Get the shortlist.
            </div>
            <div style={{ display: 'flex', marginTop: 28, fontSize: 27, lineHeight: 1.45, color: '#94a3b8' }}>
              Evidence-backed AI model selection using OpenRouter catalog data and Artificial Analysis benchmarks.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 20, color: '#cbd5e1' }}>
            <span>Local</span><span style={{ color: '#475569' }}>•</span><span>BYOK</span><span style={{ color: '#475569' }}>•</span><span>Open source</span><span style={{ color: '#475569' }}>•</span><span>ZDR when required</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
