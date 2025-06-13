import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { searchProjects } from "@/scripts/project-actions"
import { Calendar, Edit, Eye, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { DeleteProjectDialog } from "./delete-project-dialog"
import { EditProjectDialog } from "./edit-project-dialog"

/**
 * @param {Object} props
 * @param {string} props.search - Search query
 * @param {number} props.page - Current page number
 */
export async function ProjectsTable({ search, page }) {
  const result = await searchProjects(search, page, 10)

  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load projects: {result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const projects = result.data || []

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No projects found.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "on hold":
        return "destructive"
      case "cancelled":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects ({result.data.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Team Size</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/projects/${project._id}`} className="hover:underline">
                    {project.project_name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(project.project_status)}>{project.project_status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(project.project_start_date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(project.project_end_date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{project.team?.length || 0} members</Badge>
                  </div>
                </TableCell>
                <TableCell>{project.client?.client_name || "No client"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/projects/${project._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <EditProjectDialog project={project}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </EditProjectDialog>
                    <DeleteProjectDialog projectId={project._id} projectName={project.project_name}>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteProjectDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
