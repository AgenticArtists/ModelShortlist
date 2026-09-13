import { useId, type SVGProps } from 'react'

function Mark({ title = 'ModelShortlist', ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  const id = useId().replace(/:/g, '')
  const titleId = `${id}-title`
  const gradientId = `${id}-gradient`

  return (
    <svg
      viewBox="0 0 120 120"
      role={title ? 'img' : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <defs>
        <linearGradient id={gradientId} x1="22" y1="20" x2="101" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#06B6D4" />
          <stop offset="0.34" stopColor="#2563EB" />
          <stop offset="0.68" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <rect x="18" y="20" width="84" height="80" rx="23" fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" />
      <path d="M37 44h35" fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round" />
      <path d="M37 62h25" fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round" opacity="0.82" />
      <path d="M37 80h17" fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round" opacity="0.62" />
      <path d="M72 72l8 8 15-20" fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Logo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark title="" className="h-8 w-8 shrink-0" />
      {!compact ? (
        <span className="font-heading text-base font-bold leading-none tracking-tight sm:text-lg" aria-hidden="true">
          <span className="text-foreground">Model</span>
          <span className="brand-gradient-text">Shortlist</span>
        </span>
      ) : null}
    </span>
  )
}
