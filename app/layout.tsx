import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Market Operations Chatbot",
  description: "AI Frontend developer assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}> */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
