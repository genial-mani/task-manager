import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "./components/providers/toastProvider";

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
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
