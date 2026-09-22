import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label={brand.company}>
      <svg width="30" height="30" viewBox="0 0 32 32" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="corvex-gradient" x1="2" y1="2" x2="30" y2="30">
            <stop stopColor={brand.theme.primary} />
            <stop offset="1" stopColor={brand.theme.mint} />
          </linearGradient>
        </defs>
        <path
          d="M16 2 28 9v14l-12 7L4 23V9L16 2Z"
          fill="url(#corvex-gradient)"
          opacity=".22"
        />
        <path
          d="m21.8 10.3-7.4-3.1-5.3 5.5 1.3 7.5 6.7 3.5 5.7-4.5"
          fill="none"
          stroke="url(#corvex-gradient)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      {!compact && (
        <span className={cn("text-[15px] font-bold tracking-tight", light && "text-white")}>
          {brand.product}
        </span>
      )}
    </div>
  );
}
