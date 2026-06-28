import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MicMic Card | Seismic",
  description: "Generate your personalized Seismic MicMic Card based on your Magnitude tier",
  openGraph: {
    title: "MicMic Card | Seismic",
    description: "Generate your personalized Seismic MicMic Card",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="seismic-bg crack-overlay antialiased">
        {children}
      </body>
    </html>
  );
}
