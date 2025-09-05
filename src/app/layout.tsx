import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "../providers/ToastProvider";
import Header from "../components/Header";
import MaxWidthProvider from "@/providers/MaxWidthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A simple task manager",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en">
      <body
        className="bg-eerie-black text-eerie-black poppins relative dark"
        style={{
          minHeight: "100vh",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <div
          className="fixed inset-0 -z-10"
          style={{
            width: "100vw",
            height: "100%",
            background: `radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)`,
            backgroundAttachment: "fixed",
          }}
        />
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <div className="w-full max-w-full">
            <Header />
            <ToastProvider>
              <MaxWidthProvider>{children}</MaxWidthProvider>
            </ToastProvider>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
