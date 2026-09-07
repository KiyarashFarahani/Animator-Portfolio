import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Masoud Azad",
  description: "2D Character Animator & Visual Development Artist",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("ma_splash_seen")){document.documentElement.classList.add("ma-splash-seen");document.documentElement.dataset.maSplash="done"}else{document.documentElement.dataset.maSplash="loading"}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip">
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
