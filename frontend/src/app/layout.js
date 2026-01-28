import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/contexts/SidebarContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "ReTh!nk - AI-Powered Sustainable Living",
  description: "Discover creative reuse ideas with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
