import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { CustomCursor } from "@/components/CustomCursor";
import { BackgroundEffects } from "@/components/BackgroundEffects";

export const metadata: Metadata = {
  title: "Raycaster.dev",
  description: "Raycaster.dev portfolio demo migrated to Next.js",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const themeInitScript = `
(function() {
  try {
    var pref = localStorage.getItem('theme-preference') || 'system';
    var dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers>
          <div className="relative overflow-hidden bg-(--color-bg) text-(--color-fg) font-['Satoshi',sans-serif]">
            <CustomCursor />
            {children}
            <BackgroundEffects />
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
