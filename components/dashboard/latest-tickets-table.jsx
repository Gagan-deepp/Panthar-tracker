import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllTickets } from "@/scripts/ticket-actions"
import Link from "next/link"

export async function LatestTicketsTable() {
  const result = await getAllTickets(1, 5)

  if (!result.success || !result.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No tickets found</p>
        </CardContent>
      </Card>
    );
  }

  const tickets = result.data.slice(0, 5)

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
        <CardTitle>Latest Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Heading</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
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
                <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
