"use client";

import { useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import useTaskStore from "@/hooks/useTaskStore";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function CategorySidebar() {
  const categories = useTaskStore((state) => state.categories);
  const setCategories = useTaskStore((state) => state.setCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.log(error);
        return [];
      }
    };

    fetchCategories();
  },[setCategories]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tasks</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {categories && categories.map((cat) => (
            <SidebarMenuItem key={cat.id}>
              <SidebarMenuButton asChild>
                <Link id={`catId-${cat?.id}`} href={`/tasks/cat/${cat.id}`}>
                  <Icon icon="line-md:hash-small" width="1.2em" height="1.2em"  style={{color: "#7500b8"}} />
                  <span>{cat.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
