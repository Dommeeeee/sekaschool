import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ระบบแจ้งปัญหา | โรงเรียนเซกา จังหวัดบึงกาฬ",
  description: "ระบบแจ้งปัญหาและติดตามการแก้ไขปัญหาภายในโรงเรียนเซกา จังหวัดบึงกาฬ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
