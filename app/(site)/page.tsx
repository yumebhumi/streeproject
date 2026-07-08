import Link from "next/link";
import { FaShieldAlt, FaMapMarkerAlt, FaRegEdit, FaRegEye, FaLocationArrow, FaHandsHelping, FaPhoneAlt, FaBalanceScale, FaBrain, FaArrowRight } from "react-icons/fa";
import HeroIllustration from "@/components/HeroIllustration";
import MapPreview from "@/components/MapPreview";

const steps = [
  { icon: FaRegEdit, title: "Report", body: "Share what happened with us.", tint: "bg-coral-light text-coral" },
  { icon: FaRegEye, title: "Review", body: "Our team reviews your report.", tint: "bg-grape-soft text-grape" },
  { icon: FaLocationArrow, title: "Publish", body: "Verified reports are published on map.", tint: "bg-sky-soft text-sky" },
  { icon: FaHandsHelping, title: "Help", body: "Your report helps others stay safe.", tint: "bg-gold-soft text-gold" },
];

const resources = [
  { icon: FaPhoneAlt, title: "Emergency Help", body: "Helplines and immediate assistance.", href: "/helpline", tint: "bg-coral-light text-coral", card: "bg-coral-light/40" },
  { icon: FaBalanceScale, title: "Legal Support", body: "Know your rights and legal options.", href: "/resources", tint: "bg-grape-soft text-grape", card: "bg-grape-soft/50" },
  { icon: FaBrain, title: "Mental Health", body: "Counseling and emotional well-being.", href: "/helpline", tint: "bg-sky-soft text-sky", card: "bg-sky-soft/50" },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ---------------- Hero ---------------- */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-16 pt-10 sm:px-8 md:grid-cols-2 md:pb-24 md:pt-16">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral-light px-4 py-1.5 text-sm font-medium text-coral-dark dark:bg-coral/15 dark:text-coral">
              <FaShieldAlt size={12} />
              A safer community for every woman
            </span>

            <h1 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight text-ink dark:text-white sm:text-5xl md:text-6xl">
              Speak up.
              <br />
              We&rsquo;re here for{" "}
              <span className="text-coral">you.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft dark:text-white/60">
              Report incidents, access trusted resources, and help build a safer
              India for women.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/incident-form"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-coral px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-coral/25 transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
              >
                <FaShieldAlt size={14} />
                Report Incident
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-ink/15 bg-white/60 px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-coral hover:text-coral dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:border-coral dark:hover:text-coral"
              >
                <FaMapMarkerAlt size={14} />
                Explore Safety Map
              </Link>
            </div>
          </div>

          <div className="relative">
            <HeroIllustration className="mx-auto w-full max-w-lg" />
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <h2 className="text-center font-display text-2xl font-bold text-ink dark:text-white">
          How it works
        </h2>

        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {steps.map(({ icon: Icon, title, body, tint }, i) => (
            <div key={title} className="flex flex-1 items-start gap-4 sm:flex-col sm:items-center sm:gap-0 sm:text-center">
              <div className="relative flex items-center sm:w-full sm:justify-center">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tint}`}>
                  <Icon size={20} />
                </span>
                {i < steps.length - 1 && (
                  <span className="absolute left-full top-1/2 hidden h-px w-full -translate-y-1/2 border-t-2 border-dashed border-ink/15 dark:border-white/15 sm:block" />
                )}
              </div>
              <div className="sm:mt-4">
                <h3 className="font-display text-base font-semibold text-ink dark:text-white">{title}</h3>
                <p className="mt-1 max-w-[10rem] text-sm leading-snug text-ink-soft dark:text-white/55">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Explore Safety Map ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid overflow-hidden rounded-3xl bg-peach/70 dark:bg-[#20222f] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <h2 className="font-display text-2xl font-bold text-ink dark:text-white sm:text-3xl">
              Explore Safety Map
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft dark:text-white/60">
              See real reports, stay aware, and make informed choices.
            </p>
            <Link
              href="/map"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-coral px-5 py-3 text-sm font-semibold text-white shadow-md shadow-coral/25 transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
            >
              Explore Full Map
              <FaArrowRight size={12} />
            </Link>
          </div>
          <MapPreview />
        </div>
      </section>

      {/* ---------------- Quick Resources ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-12 pb-20 sm:px-8">
        <h2 className="text-center font-display text-2xl font-bold text-ink dark:text-white">
          Quick Resources
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {resources.map(({ icon: Icon, title, body, href, tint, card }) => (
            <Link
              key={title}
              href={href}
              className={`group rounded-2xl border border-ink/5 ${card} p-6 transition-all hover:-translate-y-1 hover:shadow-card dark:border-white/10 dark:bg-white/5`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}>
                <Icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-white">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-white/60">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-coral">
                View
                <FaArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
