import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/store/auth";

export const metadata: Metadata = {
  title: "Stree",
  description: "Empowering Women's Safety and Growth",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-container">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
