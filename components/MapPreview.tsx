import Link from "next/link";
import { FaMapMarkerAlt, FaShieldAlt, FaArrowRight } from "react-icons/fa";

const pins = [
  { top: "18%", left: "36%", color: "text-coral" },
  { top: "30%", left: "62%", color: "text-coral" },
  { top: "22%", left: "82%", color: "text-gold" },
  { top: "52%", left: "24%", color: "text-coral" },
  { top: "78%", left: "44%", color: "text-coral" },
  { top: "56%", left: "88%", color: "text-coral" },
];

export default function MapPreview() {
  return (
    <div className="relative min-h-[320px] overflow-hidden">
      {/* stylized street map */}
      <svg
        viewBox="0 0 600 360"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect width="600" height="360" fill="#ECE5DB" />
        {/* parks */}
        <rect x="20" y="24" width="120" height="90" rx="10" fill="#DCE7C9" />
        <rect x="430" y="210" width="150" height="130" rx="12" fill="#DCE7C9" />
        <rect x="250" y="150" width="70" height="60" rx="8" fill="#DCE7C9" />
        {/* river */}
        <path d="M470 -10c-30 90 20 150 -10 240s10 150 -10 150l90 0V-10z" fill="#CBDDE4" opacity="0.9" />
        <path d="M120 380c40-120 130-90 150-200s120-120 150-200" stroke="#CBDDE4" strokeWidth="16" fill="none" opacity="0.7" />
        {/* roads */}
        <g stroke="#FBFAF7" strokeLinecap="round">
          <path d="M0 120h600" strokeWidth="12" />
          <path d="M0 250h600" strokeWidth="10" />
          <path d="M170 0v360" strokeWidth="12" />
          <path d="M360 0v360" strokeWidth="9" />
          <path d="M40 40l520 300" strokeWidth="6" opacity="0.8" />
        </g>
        <g stroke="#E7DFD3" strokeWidth="3">
          <path d="M0 70h600" />
          <path d="M0 190h600" />
          <path d="M0 320h600" />
          <path d="M90 0v360" />
          <path d="M470 0v360" />
        </g>
      </svg>

      {/* pins */}
      {pins.map((pin, i) => (
        <FaMapMarkerAlt
          key={i}
          className={`absolute -translate-x-1/2 -translate-y-full drop-shadow-md ${pin.color}`}
          style={{ top: pin.top, left: pin.left }}
          size={26}
        />
      ))}

      {/* floating incident card */}
      <div className="absolute bottom-5 left-1/2 w-[min(280px,80%)] -translate-x-1/2 rounded-2xl bg-white p-4 shadow-float sm:left-auto sm:right-6 sm:translate-x-0">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-coral">
            <FaShieldAlt size={11} />
            Harassment
          </span>
          <span className="text-[11px] text-ink-soft">2 hours ago</span>
        </div>
        <p className="mt-2 font-display text-sm font-semibold text-ink">Connaught Place, Delhi</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          Catcalling and inappropriate comments near the metro gate.
        </p>
        <Link
          href="/map"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:text-coral-dark"
        >
          View Details
          <FaArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
}
