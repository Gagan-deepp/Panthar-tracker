import { AppSidebar } from "@/components/app-sidebar";
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({ children }) {
    return (
        <SidebarProvider suppressHydrationWarning >
            <SessionProvider>
                <AppSidebar />
            </SessionProvider>
            <main className="flex-1 overflow-auto">{children}</main>
        </SidebarProvider>
    );
}
