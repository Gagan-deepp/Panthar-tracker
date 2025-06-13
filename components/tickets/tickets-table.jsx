import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Trash2, Calendar, User } from "lucide-react"
import { getAllTickets } from "@/scripts/ticket-actions"
import { DeleteTicketDialog } from "./delete-ticket-dialog"

/**
 * @param {Object} props
 * @param {number} props.page - Current page number
 */
export async function TicketsTable({ page }) {
  const result = await getAllTickets(page, 10)

  if (!result.success) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Failed to load tickets: {result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const tickets = result.data || []

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No tickets found.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "destructive"
      case "In Progress":
        return "default"
      case "Resolved":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Bug":
        return "destructive"
      case "Query":
        return "default"
      case "Suggestion":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets ({result.data.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Heading</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <Link href={`/tickets/${ticket._id}`} className="hover:underline">
                    {ticket.ticket_heading}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={getTypeColor(ticket.ticket_type)}>{ticket.ticket_type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(ticket.ticket_status)}>{ticket.ticket_status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {ticket.userID?.name || "Unknown User"}
                  </div>
                </TableCell>
                <TableCell>{ticket.projectID?.project_name || "No Project"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/tickets/${ticket._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteTicketDialog ticketId={ticket._id} ticketHeading={ticket.ticket_heading}>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DeleteTicketDialog>
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
