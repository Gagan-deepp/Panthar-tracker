"use client"

import { Building2, FolderOpen, LayoutDashboard, LogOut, MessageSquare, Ticket, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ThemeToggle } from "@/components/theme-toggle"
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
import { signOutAction } from "@/scripts/auth-action"
import { Button } from "./ui/button"
import { useSession } from "next-auth/react"

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Building2,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: Ticket,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: MessageSquare,
  },
]
const empMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
]



export function AppSidebar() {
  const { data: session } = useSession()
  console.log("Session in sidebar==> ", session)

  const pathname = usePathname()

  const handleLogOut = async () => {
    await signOutAction()
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Panthar InfoHub</span>
            <span className="truncate text-xs">Management Portal</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* (session?.user?.role === "admin" ? adminMenuItems : empMenuItems) */}
              {(session?.user?.role === "admin" ? adminMenuItems : session?.user?.email === "gagan717113@gmail.com" ? adminMenuItems : empMenuItems)?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 gap-2">
              <SidebarMenuButton variant="default" onClick={handleLogOut} className="hover:scale-[0.9] duration-200 transition-all ease-in-out cursor-pointer bg-primary" >
                <LogOut className="size-4" />
                <span className="max-sm:hidden" > Logout </span>
              </SidebarMenuButton>
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
