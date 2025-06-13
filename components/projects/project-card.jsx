"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export function ProjectCard({ project }) {
  // Format dates
  const startDate = new Date(project.project_start_date)
  const endDate = new Date(project.project_end_date)

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-300"
      case "on design":
        return "bg-cyan-400"
      case "research":
        return "bg-purple-300"
      case "completed":
        return "bg-gray-300"
      case "on hold":
        return "bg-blue-300"
      case "cancelled":
        return "bg-red-300"
      default:
        return "bg-gray-300"
    }
  }

  return (
    // <Link href={`/`} >
    <Card className="overflow-hidden relative">
      <div className={`h-2 w-full top-0 absolute inset-x-0 ${getStatusColor(project.project_status)}`} />

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.project_name}</CardTitle>
          <Badge variant={project.project_status === "completed" ? "secondary" : "default"}>
            {project.project_status.charAt(0).toUpperCase() + project.project_status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{project.project_desc}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pb-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">{project.project_name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="border-2 border-background h-8 w-8">
                <AvatarImage src={member?.user?.profile_image} />
                <AvatarFallback className="text-xs bg-primary" >{member.user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
              </Avatar>
            ))}
            {project.team.length > 3 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                +{project.team.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{project.team.length}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          View Details (for future...)
        </Button>
      </CardFooter>
    </Card>
    // </Link>
  )
}
