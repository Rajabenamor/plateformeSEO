import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "STRIVE | Intelligent SEO Infrastructure",
  description: "Enterprise-grade SEO analysis and automated technical optimization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans min-h-screen selection:bg-accent/20 selection:text-accent transition-colors duration-300`}
      >
        <ThemeProvider>
          {googleId ? (
            <GoogleOAuthProvider clientId={googleId}>
              {children}
            </GoogleOAuthProvider>
          ) : (
            <>
              {children}
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
