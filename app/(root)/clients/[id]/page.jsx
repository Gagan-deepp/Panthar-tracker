import { Suspense } from "react"
import { notFound } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { getClient } from "@/scripts/client-actions"
import { Skeleton } from "@/components/ui/skeleton"

function ClientDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

async function ClientDetail({ id }) {
  const result = await getClient(id)

  if (!result.success) {
    notFound()
  }

  const client = result.data

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{client.client_name}</h1>
          <p className="text-muted-foreground">Client Details</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.client_mail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.client_contact}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined {new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge variant={client.client_status ? "default" : "secondary"}>
                {client.client_status ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>CSAT Score</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{client.cast_score?.toFixed(1) || "0.0"}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Projects</span>
              <Badge variant="outline">{client.projects?.length || 0} projects</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      {client.projects && client.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Associated Projects</CardTitle>
            <CardDescription>Projects this client is involved in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {client.projects.map((project) => (
                <Link
                  href={`/projects/${project._id}`}
                  key={project._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <div>
                    <h4 className="font-medium">{project.project_name}</h4>
                    <p className="text-sm text-muted-foreground">{project.project_desc}</p>
                  </div>
                  <Badge variant="default">{project.project_status}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {client.projects && client.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Client Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {client.feedback.map((feed) => (
                <Link
                  href={`/projects/${feed._id}`}
                  key={feed._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                  <div>
                    <h4 className="font-medium">{project.project_name}</h4>
                    <p className="text-sm text-muted-foreground">{project.project_desc}</p>
                  </div>
                  <Badge variant="default">{project.project_status}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

const Page = async ({ params }) => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <SidebarTrigger />
      </div>
      <Suspense fallback={<ClientDetailSkeleton />}>
        <ClientDetail id={(await params).id} />
      </Suspense>
    </div>
  );
}
export default Page