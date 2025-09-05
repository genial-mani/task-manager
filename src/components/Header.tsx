"use client";

import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineLogin } from "react-icons/hi";
import { Icon } from "@iconify/react";
import Logout from "./Logout";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // dynamic pathname(in next.js)
  const { open } = useSidebar();

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLoggedInUser();
  }, [pathname]);

  return (
    <div className="fixed z-20 w-full max-w-full h-12 px-5 py-7 bg-[#13001cc8] text-seasalt flex items-center justify-between">
      <SidebarTrigger size="icon" className="size-10" />
      <div className="fixed right-5 flex items-center justify-between gap-5">
        <Link
          href={"/dashboard"}
          className={
            pathname === "/dashboard"
              ? "mr-5 font-bold text-center flex items-center justify-center gap-1"
              : "mr-5 text-center flex items-center justify-center gap-1"
          }
        >
          <Icon
            icon="material-symbols:dashboard-rounded"
            width="24"
            height="24"
            color={pathname === "/dashboard" ? "#a855f7" : "#fff"}
          />
          Dashboard
        </Link>
        <Link
          href={"/tasks"}
          className={
            pathname === "/tasks"
              ? "min-w-12 mr-5 font-bold text-center flex items-center justify-center gap-1"
              : "min-w-12 mr-5 text-center flex items-center justify-center gap-1"
          }
        >
          <Icon
            icon="arcticons:everyday-tasks"
            width="24"
            height="24"
            strokeWidth={3}
            color={`${pathname === "/tasks" ? "#a855f7" : "#fff"}`}
          />
          Tasks
        </Link>
        {!isLoggedIn ? (
          <Link
            href={"/login"}
            className=" flex items-center gap-1 py-2 px-3 rounded-lg bg-onyx text-purple-500"
          >
            <HiOutlineLogin />
            Login
          </Link>
        ) : (
          <Logout />
        )}
      </div>
    </div>
  );
}
