"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarAngleAxis, PolarGrid, Radar, CartesianGrid, AreaChart, Area } from "recharts"


export function DashboardCharts({ projectStatusData, ticketTrendData, clientStatusData }) {

  console.log("Project status data : ", projectStatusData)
  console.log("\n\nTicket status data : ", ticketTrendData)

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Client Status Distribution</CardTitle>
            <CardDescription>Current status of all tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                desktop: {
                  label: "Desktop",
                  color: "var(--chart-4)",
                },
              }}
              className="h-[300px] w-full overflow-hidden"
            >

              <AreaChart data={clientStatusData}>

                <CartesianGrid vertical={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis dataKey="count" />

                <Area
                  dataKey="count"
                  type="natural"
                  fill="var(--color-desktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
                />

              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 my-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Projects",
                  color: "var(--chart-4)",
                },
              }}
              className="h-[300px] w-full overflow-hidden"
            >
              {/* <ResponsiveContainer width="100%" height="100%"> */}
              <BarChart accessibilityLayer data={projectStatusData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                {/* <Legend /> */}
                <Bar dataKey="count" fill="var(--color-count)" radius={8} name="Projects" />
              </BarChart>
              {/* </ResponsiveContainer> */}
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Status Distribution</CardTitle>
            <CardDescription>Current status of all tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                desktop: {
                  label: "Desktop",
                  color: "var(--chart-4)",
                },
              }}
              className="h-[300px] w-full overflow-hidden"
            >
              {/* <ResponsiveContainer width="100%" height="100%"> */}

              <RadarChart data={ticketTrendData}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey="status" />
                <PolarGrid />
                <Radar
                  dataKey="count"
                  fill="var(--color-desktop)"
                  fillOpacity={0.6}
                />
              </RadarChart>
              {/* </ResponsiveContainer> */}
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
