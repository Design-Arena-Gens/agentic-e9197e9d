import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "80s Animation DNA Transformer",
  description: "Transform image prompts with 1980s animation tropes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
