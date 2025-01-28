"use client";

import { getCurrentUser } from "@/utils/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logout from "./Logout";
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // dynamic pathname(in next.js)

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
    <div className="w-full max-w-full h-12 px-5 py-7 bg-eerie-black text-seasalt flex items-center justify-between">
      <Link href={"/"}>DoIt</Link>
      <div className="flex items-center justify-between mr-5 gap-5">
        <Link
          href={"/dashboard"}
          className={
            pathname === "/dashboard"
              ? "mr-5 font-bold text-center"
              : "mr-5 text-center"
          }
        >
          Dashboard
        </Link>
        <Link
          href={"/tasks"}
          className={
            pathname === "/tasks"
              ? "w-12 mr-5 font-bold text-center"
              : "w-12 mr-5 text-center"
          }
        >
          Tasks
        </Link>
        {!isLoggedIn ? (
          <Link
            href={"/login"}
            className="py-2 px-3 rounded-lg bg-onyx text-seasalt"
          >
            Login
          </Link>
        ) : (
          <Logout />
        )}
      </div>
    </div>
  );
}
