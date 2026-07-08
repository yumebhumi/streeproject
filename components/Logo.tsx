import Link from "next/link";

/**
 * The Stree brand mark: a circular illustrated avatar of a woman, drawn as a
 * small flat SVG, paired with the wordmark.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="inline-flex h-9 w-9 overflow-hidden rounded-full ring-2 ring-coral/30">
        <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
          <rect width="40" height="40" fill="#FBE4DC" />
          {/* hair back */}
          <path d="M9 30c-1-12 4-20 12-20s12 7 11 19c-2-6-5-8-5-8-2 4-9 5-14 3-2 2-3 4-4 6z" fill="#5B3A34" />
          {/* face */}
          <path d="M14 17c0-5 3-8 7-8s7 3 7 8-3 10-7 10-7-5-7-10z" fill="#F3C6A9" />
          {/* hair front sweep */}
          <path d="M13 18c0-6 4-9 8-9 3 0 5 1 6 3-3-1-8-1-10 3-1 2-1 5-1 7-2-1-3-3-3-4z" fill="#7A4A40" />
          {/* shoulder / top */}
          <path d="M6 40c1-7 6-11 14-11s13 4 14 11z" fill="#EF6D54" />
        </svg>
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-ink dark:text-white">
        Stree
      </span>
    </Link>
  );
}
