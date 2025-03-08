import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "../providers/ToastProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MaxWidthProvider from "@/providers/MaxWidthProvider";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A simple task manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f3fcfd] text-eerie-black poppins">
        <Header />
        <ToastProvider>
          <MaxWidthProvider>{children}</MaxWidthProvider>
        </ToastProvider>
        <Footer />
      </body>  
    </html>
  );
}
