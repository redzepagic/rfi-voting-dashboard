export function CikLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="white" rx="8"/>
      <path d="M25 50 Q25 30, 40 30 L60 30 Q75 30, 75 50 Q75 70, 60 70 L40 70 Q25 70, 25 50" 
            fill="none" stroke="#FF6B35" strokeWidth="6"/>
      <circle cx="50" cy="50" r="8" fill="#FF6B35"/>
      <text x="50" y="90" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" 
            fill="#FF6B35" textAnchor="middle">CIK</text>
    </svg>
  );
}
