"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import { useAuth } from "@/store/auth";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/resources", label: "Resources" },
  { href: "/helpline", label: "Help" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, LogoutUser } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/85 backdrop-blur-md dark:border-white/10 dark:bg-[#171826]/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative text-sm font-medium text-ink-soft transition-colors hover:text-ink dark:text-white/70 dark:hover:text-white"
              >
                <span className={active ? "text-ink dark:text-white" : ""}>{label}</span>
                {active && (
                  <span className="absolute -bottom-[21px] left-0 h-0.5 w-full rounded-full bg-coral" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <Link
              href="/login"
              onClick={LogoutUser}
              className="hidden rounded-xl border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 sm:inline-block"
            >
              Logout
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10 sm:inline-block"
            >
              Login
            </Link>
          )}
          <Link
            href="/incident-form"
            className="hidden items-center gap-2 rounded-xl bg-coral px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-coral/30 transition-colors hover:bg-coral-dark sm:inline-flex"
          >
            <FaShieldAlt size={13} />
            Report Incident
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-coral-light/60 dark:text-white dark:hover:bg-white/10 md:hidden"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/5 bg-cream px-5 py-4 dark:border-white/10 dark:bg-[#171826] md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-coral-light/50 hover:text-ink dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2">
              <Link
                href="/login"
                onClick={() => {
                  if (isLoggedIn) LogoutUser();
                  setOpen(false);
                }}
                className="flex-1 rounded-xl border border-ink/15 px-4 py-2 text-center text-sm font-semibold text-ink dark:border-white/20 dark:text-white"
              >
                {isLoggedIn ? "Logout" : "Login"}
              </Link>
              <Link
                href="/incident-form"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-coral px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Report Incident
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
