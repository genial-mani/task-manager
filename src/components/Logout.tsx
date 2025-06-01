import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Logout() {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem("user");
        window.location.href = "/";
        toast.success(data.message);
      } else {
        toast.error(data.error);
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error logging out.");
    }
  };

  return (
    <div
      onClick={handleLogout}
      className="flex items-center gap-1 py-2 px-3 rounded-lg bg-[#a855f7] text-seasalt cursor-pointer"
    >
      {" "}
      <Icon icon="humbleicons:logout" width="24" height="24" /> Logout
    </div>
  );
}
