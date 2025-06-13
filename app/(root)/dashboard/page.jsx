import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { LatestProjectsTable } from "@/components/dashboard/latest-projects-table"
import { LatestTicketsTable } from "@/components/dashboard/latest-tickets-table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/lib/auth"
import { dashboardMetrics } from "@/scripts/auth-action"
import { Suspense } from "react"

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function DashboardChartsContainer() {


  const res = await dashboardMetrics();

  console.log("Dashboard Metrics ==> ", res)

  // Process project status data
  const projectStatusMap = {
    "active": 0,
    "on design": 0,
    "research": 0,
    "completed": 0,
    "on hold": 0,
    "cancelled": 0
  }
  if (res?.projectsPerStatus) {
    res.projectsPerStatus?.forEach((project) => {
      const status = project._id || "unknown"
      projectStatusMap[status] = (projectStatusMap[status] || 0) + 1
    })
  }

  const projectStatusData = Object.entries(projectStatusMap).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
    count,
  }))

  // Process ticket status data
  const ticketStatusMap = {
    "Pending": 0,
    "In Progress": 0,
    "Completed": 0,
  }
  if (res?.ticketsPerStatus) {
    res.ticketsPerStatus?.forEach((ticket) => {
      const status = ticket?._id || "unknown"
      ticketStatusMap[status] = (ticketStatusMap[status] || 0) + 1
    })
  }

  const ticketTrendData = Object.entries(ticketStatusMap).map(([status, count]) => ({
    status,
    count,
  }))

  //Map client status data
  const formattedData = res?.clientsPerMonth.map(item => {
    const [year, month] = item._id.split("-");
    const date = new Date(+year, +month - 1); // JS months are 0-indexed
    const monthName = date.toLocaleString("default", { month: "long" }); // "June"

    return {
      month: monthName,
      count: item.count,
    };
  });

  return <DashboardCharts projectStatusData={projectStatusData} ticketTrendData={ticketTrendData} clientStatusData={formattedData} />
}

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[350px]" />
            <Skeleton className="h-[350px]" />
          </div>
        }
      >
        <DashboardChartsContainer />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <LatestProjectsTable />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[400px]" />}>
          <LatestTicketsTable />
        </Suspense>
      </div>
    </div>
  )
}
