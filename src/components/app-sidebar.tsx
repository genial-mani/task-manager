import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Card } from "./ui/card"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { cookies } from "next/headers"
import CategorySidebar from "./CategorySidebar"


// user created categories should be looped and displayed here
const items = [
  {
    label: "Home",
    href: "/tasks/home",
    icon: "mdi:home"
  },
  {
    label: "Work",
    href: "/tasks/work",
    icon: "mdi:briefcase"
  },
  {
    label: "Education",
    href: "/tasks/education",
    icon: "mdi:school"
  },

]

export async function AppSidebar() {

  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');
  const user = userCookie ? JSON.parse(userCookie.value) : null;
  return (
    <Sidebar style={{background: "#000"}} >
      <SidebarHeader >
        <Card className="mt-3">
          <Link href={'/'} className="w-full h-full flex gap-1 text-[#a855f7] p-2"><Icon icon="mdi:todo-auto" width="24" height="24" />{" "} DoIt</Link>
        </Card>
      </SidebarHeader>
      <SidebarContent>
        {user ? <CategorySidebar/> : 
        <SidebarGroup>
          <SidebarGroupLabel>Welcome</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/login">
                    <Icon icon="mdi:login" width="24" height="24" />
                    <span>Login</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/signup">
                    <Icon icon="mdi:account-plus" width="24" height="24" />
                    <span>Register</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        }
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter >
        jhv
      </SidebarFooter>
    </Sidebar>
  )
}