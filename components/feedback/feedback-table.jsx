import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllFeedback } from "@/scripts/feedback-actions"
import { Building2, Calendar, Star, Trash2, User } from "lucide-react"
import { DeleteFeedbackDialog } from "./delete-feedback-dialog"



export async function FeedbackTable({ search, page }) {
  const res = await getAllFeedback(search, page, 10)

  const feedback = res.data || []

  if (feedback.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No feedback found.</p>
        </CardContent>
      </Card>
    );
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return "default"
    if (rating >= 3) return "secondary"
    return "destructive"
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback ({feedback.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((item) => (
              <TableRow key={item._id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium max-w-xs">
                  <p className="truncate">{item.comment}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(item.rating)}</div>
                    <Badge variant={getRatingColor(item.rating)}>{item.rating}/5</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {item.clientID?.client_name || "Unknown Client"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {item.projectID?.project_name || "Unknown Project"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DeleteFeedbackDialog feedbackId={item._id} feedbackComment={item.comment}>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteFeedbackDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
