import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Programming Game",
  description: "Programming path game project powered by Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
