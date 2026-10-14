export function Pin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M12 2C7.6 2 4 5.5 4 9.9c0 5.6 6.6 11.3 7.3 11.9a1 1 0 0 0 1.4 0C13.4 21.2 20 15.5 20 9.9 20 5.5 16.4 2 12 2z"
        fill="var(--coral)"
      />
      <circle cx="12" cy="10" r="3.2" fill="#fff" />
    </svg>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-[0.25em] text-brand">
      <Pin className="h-4 w-4" />
      {children}
    </span>
  );
}

export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 56" aria-hidden className={className} fill="#fff">
      <circle cx="30" cy="36" r="15" />
      <circle cx="56" cy="26" r="21" />
      <circle cx="84" cy="34" r="17" />
      <rect x="15" y="34" width="86" height="20" rx="10" />
    </svg>
  );
}

export function Hills({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      <path
        d="M0 120C200 60 380 60 560 110s340 50 540-20 260-30 340 0v110H0z"
        fill="var(--ocean)"
        opacity=".3"
      />
      <path
        d="M0 150c240-50 420-30 620 0s380 20 580-20 200-10 240 0v70H0z"
        fill="var(--land)"
        opacity=".45"
      />
      <path
        d="M0 178c300-25 600 15 900-5s400-15 540 2v25H0z"
        fill="var(--brand)"
        opacity=".25"
      />
    </svg>
  );
}
