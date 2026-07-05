"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { MdMessage, MdOutlineSportsKabaddi } from "react-icons/md";
import { IoMdHome } from "react-icons/io";

const links = [
  { href: "/", label: "Home", icon: IoMdHome },
  { href: "/admin/users", label: "Users", icon: FaUser },
  { href: "/admin/incidents", label: "Incidents", icon: MdOutlineSportsKabaddi },
  { href: "/admin/contacts", label: "Contact", icon: MdMessage },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="container" style={{ paddingTop: "7rem" }}>
        <nav>
          <ul>
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={pathname === href ? "active" : undefined}
                >
                  <Icon style={{ color: "magenta" }} /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {children}
    </>
  );
}
