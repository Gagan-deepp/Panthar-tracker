import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { searchProjects } from "@/scripts/project-actions"
import Link from "next/link"

export async function LatestProjectsTable() {
  const result = await searchProjects("", 1, 5)

  if (!result.success || !result.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No projects found</p>
        </CardContent>
      </Card>
    );
  }

  const projects = result.data.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Team Size</TableHead>
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
                  <Badge variant="default">{project.project_status}</Badge>
                </TableCell>
                <TableCell>{new Date(project.project_start_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{project.team?.length || 0} members</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
