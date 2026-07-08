import Link from "next/link";
import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Logo from "./Logo";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/resources", label: "Resources" },
  { href: "/helpline", label: "Help" },
];

const socials = [
  { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
  { href: "https://twitter.com", label: "Twitter", Icon: FaTwitter },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-peach/60 dark:border-white/10 dark:bg-[#1f2133]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft dark:text-white/60">
              Together, we can build a safer tomorrow.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink dark:text-white">Links</h4>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-ink-soft transition-colors hover:text-coral dark:text-white/60 dark:hover:text-coral"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink dark:text-white">Connect</h4>
            <div className="mt-4 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 text-ink-soft transition-colors hover:border-coral hover:text-coral dark:border-white/15 dark:text-white/60 dark:hover:text-coral"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-ink/5 pt-6 text-center dark:border-white/10">
          <p className="text-xs text-ink-soft dark:text-white/50">
            © 2024 Stree. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
