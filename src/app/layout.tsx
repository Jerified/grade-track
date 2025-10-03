import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ExamsProvider } from "./providers";
import { ThemeProvider } from "./theme-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Grade Track - Student Assessment Management",
  description: "Manage student assessments and exams efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body
        className={`${poppins.variable} antialiased bg-[#efe6dd] dark:bg-[#0a0e27] text-[#1b1b1b] dark:text-gray-100 transition-colors`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ExamsProvider>{children}</ExamsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
