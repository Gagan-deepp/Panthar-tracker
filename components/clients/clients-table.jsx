import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Edit, Trash2, Star } from "lucide-react"
import { searchClients } from "@/scripts/client-actions"
import { DeleteClientDialog } from "./delete-client-dialog"
import { EditClientDialog } from "./edit-client-dialog"

/**
 * @param {Object} props
 * @param {string} props.search - Search query
 * @param {number} props.page - Current page number
 */
export async function ClientsTable({ search, page }) {
  const result = await searchClients(search, page, 10)


  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load clients: {result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const clients = result.data || []

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No clients found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients ({result.data.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CSAT Score</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/clients/${client._id}`} className="hover:underline">
                    {client.client_name}
                  </Link>
                </TableCell>
                <TableCell>{client.client_contact}</TableCell>
                <TableCell>{client.client_mail}</TableCell>
                <TableCell>
                  <Badge variant={client.client_status ? "default" : "secondary"}>
                    {client.client_status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{client.cast_score?.toFixed(1) || "0.0"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{client.projects?.length || 0} projects</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/clients/${client._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <EditClientDialog client={client}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </EditClientDialog>
                    <DeleteClientDialog clientId={client._id} clientName={client.client_name}>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteClientDialog>
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
