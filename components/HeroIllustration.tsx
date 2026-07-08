/**
 * Flat-vector hero scene for the landing page: a warm circular backdrop with a
 * faint India Gate silhouette, foliage, birds, and a woman checking her phone
 * with a tote over her shoulder. Purely decorative.
 */
export default function HeroIllustration({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 560 480"
      className={className}
      role="img"
      aria-label="Illustration of a woman using her phone in a warm, safe setting"
    >
      <defs>
        <radialGradient id="blob" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#FDEAE1" />
          <stop offset="100%" stopColor="#F6CBBB" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7D8CB" />
          <stop offset="100%" stopColor="#F3C9B8" />
        </linearGradient>
      </defs>

      {/* soft backdrop */}
      <circle cx="315" cy="195" r="180" fill="url(#blob)" />

      {/* faint monument silhouette */}
      <g fill="#F0C3B2" opacity="0.7">
        <path d="M196 300v-60c0-26 14-44 34-44s34 18 34 44v60h-16v-58c0-16-8-28-18-28s-18 12-18 28v58z" />
        <rect x="188" y="298" width="88" height="10" rx="3" />
        <rect x="224" y="150" width="16" height="52" rx="4" />
        <circle cx="232" cy="142" r="7" />
      </g>

      {/* birds */}
      <g stroke="#C88A78" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M430 96q8-9 16 0q8-9 16 0" />
        <path d="M470 78q6-7 12 0q6-7 12 0" />
        <path d="M452 118q5-6 10 0q5-6 10 0" />
      </g>

      {/* ground curve */}
      <path d="M60 452c90-26 350-26 452 0v28H60z" fill="url(#ground)" />

      {/* back foliage right */}
      <g>
        <path d="M498 470c-30-8-46-40-38-78 26 8 44 42 38 78z" fill="#C98BA6" />
        <path d="M470 320v150" stroke="#B57A95" strokeWidth="2" />
        <path d="M524 472c8-34-6-70-34-84 0 34 12 66 34 84z" fill="#EF8A70" />
        <path d="M508 470c22-14 34-46 28-78-24 16-34 48-28 78z" fill="#F2B0A0" />
      </g>

      {/* back foliage left */}
      <g>
        <path d="M70 472c-8-30 4-62 30-74 2 32-10 60-30 74z" fill="#D79BB2" />
        <path d="M104 474c6-24 0-50-16-62-4 26 2 48 16 62z" fill="#EF8A70" />
      </g>

      {/* ---- figure ---- */}
      <g>
        {/* tote bag */}
        <path d="M330 236l40 6-8 92c-1 10-9 16-19 15l-8-1c-10-1-16-9-15-19z" fill="#F0DFB8" />
        <path d="M330 236l40 6" stroke="#E4CE9C" strokeWidth="3" fill="none" />
        <path d="M338 214c6-10 22-8 30 4" stroke="#E4CE9C" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* legs / trousers */}
        <path d="M262 300h56c8 0 12 6 11 14l-10 138c-1 8-6 12-14 12s-13-4-14-12l-9-96-8 96c-1 8-6 12-14 12s-13-4-14-12l-9-138c-1-8 3-14 11-14z" fill="#2E3149" />

        {/* torso / top */}
        <path d="M258 186c2-16 16-26 32-26s30 10 33 26l8 74c1 10-6 18-16 18h-49c-10 0-17-8-16-18z" fill="#EF6D54" />

        {/* back arm (holding strap) */}
        <path d="M316 196c14 4 22 16 22 32l-3 34-16-2 2-30c0-8-4-14-11-18z" fill="#E85C43" />

        {/* neck */}
        <path d="M280 150h20v22c0 6-4 10-10 10s-10-4-10-10z" fill="#EBB392" />

        {/* hair back */}
        <path d="M254 150c-6-34 12-58 40-58s44 22 40 54c-4-14-10-22-10-22-4 10-8 40-10 70-2 22-8 40-16 40l-6-118c-16 0-28-16-28-16z" fill="#4A2F2A" />

        {/* face */}
        <path d="M262 142c0-22 12-36 30-36 16 0 26 12 26 30 0 22-12 40-30 40-16 0-26-16-26-34z" fill="#F3C6A9" />

        {/* hair front */}
        <path d="M258 140c-4-30 12-48 34-48 14 0 24 8 28 20-8-8-24-10-34 2-8 10-8 26-8 40-10-2-18-8-20-14z" fill="#5B3A34" />

        {/* front (raised) arm + phone */}
        <path d="M262 196c-14 6-22 20-20 38l4 20 16-4-3-18c-1-8 3-16 12-20z" fill="#EF6D54" />
        <path d="M250 244l16-6 10 22c3 6 0 10-6 12s-11 0-13-6z" fill="#EBB392" />
        <rect x="238" y="196" width="26" height="42" rx="6" transform="rotate(-18 251 217)" fill="#2E3149" />
        <rect x="242" y="202" width="18" height="30" rx="3" transform="rotate(-18 251 217)" fill="#4C86C6" opacity="0.85" />
      </g>

      {/* front foliage */}
      <g>
        <path d="M40 474c-6-26 6-52 28-62 2 28-10 52-28 62z" fill="#EF6D54" />
        <path d="M520 476c14-10 22-30 20-50-18 10-26 32-20 50z" fill="#C98BA6" />
      </g>
    </svg>
  );
}
