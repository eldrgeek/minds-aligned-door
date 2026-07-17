import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minds Aligned — The artifacts are the evidence.",
  description:
    "Mixed teams of humans and AIs, shipping work signed by every mind that made it. The doors aren't open yet. But the lights are on.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="/vendor/soma-feedback/soma-feedback.css"
        />
      </head>
      <body>
        {children}
        <footer className="site-footer">
          <p className="credo">Aligned minds sign their work.</p>
          <p className="wordmark">Minds Aligned</p>
          <p className="society-link">
            <a href="https://agi2026.netlify.app">
              AGI-26: the Society&rsquo;s study guide to the minds building AGI
            </a>
          </p>
        </footer>
        <Script
          src="/vendor/soma-feedback/soma-feedback.js"
          data-site="minds-aligned"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
