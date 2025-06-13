import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, FolderOpen, Ticket } from "lucide-react"
import { searchClients } from "@/scripts/client-actions"
import { searchUsers } from "@/scripts/user-actions"
import { searchProjects } from "@/scripts/project-actions"
import { getAllTickets } from "@/scripts/ticket-actions"

export async function DashboardStats() {
  // Fetch stats from server actions
  const [clientsResult, usersResult, projectsResult, ticketsResult] = await Promise.all([
    searchClients("", 1, 1),
    searchUsers("", 1, 1),
    searchProjects("", 1, 1),
    getAllTickets(1, 1),
  ])

  const stats = [
    {
      title: "Total Clients",
      value: clientsResult.success ? clientsResult.data.length || 0 : 0,
      icon: Building2,
      description: "Active clients",
    },
    {
      title: "Team Members",
      value: usersResult.success ? usersResult.data.length || 0 : 0,
      icon: Users,
      description: "Active users",
    },
    {
      title: "Projects",
      value: projectsResult.success ? projectsResult.data.length || 0 : 0,
      icon: FolderOpen,
      description: "Total projects",
    },
    {
      title: "Open Tickets",
      value: ticketsResult.success ? ticketsResult.data.length || 0 : 0,
      icon: Ticket,
      description: "Pending tickets",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
