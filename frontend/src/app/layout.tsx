import { Header } from "@/components/header";
import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "@/components/page-transition/PageTransition";
import { AuthProvider } from "@/context/AuthContext"; 

export const metadata: Metadata = {
  title: "ScoreIt",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> 
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
