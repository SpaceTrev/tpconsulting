interface FacMarkProps {
  size?: number;
}

export default function FacMark({ size = 24 }: FacMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <rect width="64" height="64" rx="12" fill="var(--bg-canvas)" />
      <g transform="translate(32 32)">
        <circle r="22" fill="none" stroke="var(--accent-primary)" strokeWidth="3.5" />
        <circle r="4" fill="var(--accent-primary)" />
        <line x1="0" y1="-22" x2="0" y2="-10" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="22" y1="0" x2="10" y2="0" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="0" y1="22" x2="0" y2="10" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="-22" y1="0" x2="-10" y2="0" stroke="var(--accent-primary)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="15.5" y1="-15.5" x2="7" y2="-7" stroke="var(--accent-secondary)" strokeWidth="3" strokeLinecap="round" />
        <line x1="15.5" y1="15.5" x2="7" y2="7" stroke="var(--accent-secondary)" strokeWidth="3" strokeLinecap="round" />
        <line x1="-15.5" y1="15.5" x2="-7" y2="7" stroke="var(--accent-secondary)" strokeWidth="3" strokeLinecap="round" />
        <line x1="-15.5" y1="-15.5" x2="-7" y2="-7" stroke="var(--accent-secondary)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
