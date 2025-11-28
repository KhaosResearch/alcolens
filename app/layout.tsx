import type { Metadata } from "next";
import {primaryFontRegular} from "./lib/utils/fonts";
import "./globals.css";
import { AuthProvider } from "@/app/lib/providers";
import  Header from "@/app/lib/utils/header";
import  Footer from "./lib/utils/footer";
import { CursorProvider, Cursor, CursorFollow } from "@/components/animate-ui/components/animate/cursor";



export const metadata: Metadata = {
  title: "AlcoLens",
  description: "Alcohol level monitoring system",
  icons: "/favicon.ico",
};


export default function RootLayout({
  
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${primaryFontRegular.className} antialiased bg-slate-red-50 min-h-screen flex flex-col`}
      >
        <div className="fixed inset-0 bg-[#CD4242] -z-10"></div>
        <AuthProvider>
          <CursorProvider>
            <Cursor />
            <CursorFollow>AlcoLens</CursorFollow>
            <Header/>
            <main>{children}</main>
            <Footer />
            </CursorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
