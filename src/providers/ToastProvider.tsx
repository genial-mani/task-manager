import { Toaster } from "sonner";

export default function ToastProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}
