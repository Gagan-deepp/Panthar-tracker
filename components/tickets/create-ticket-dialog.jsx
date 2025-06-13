"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserSelect } from "@/components/common/user-select"
import { ProjectSelect } from "@/components/common/project-select"
import { createTicketAction } from "@/scripts/ticket-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { searchUsers } from "@/scripts/user-actions"
import { Loader2 } from "lucide-react"

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Trigger element
 */
export function CreateTicketDialog({ children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [ticketType, setTicketType] = useState("")
  const [ticketStatus, setTicketStatus] = useState("")
  const [userId, setUserId] = useState("")
  const [projectId, setProjectId] = useState("")
  const router = useRouter()

  async function handleSubmit(prevstate, formData) {
    formData.set("ticket_type", ticketType)
    formData.set("ticket_status", ticketStatus)
    formData.set("userID", userId)
    if (projectId) formData.set("projectID", projectId)
    setLoading(true)
    try {
      const result = await createTicketAction(formData)

      if (result.success) {
        toast.success("Ticket created successfully")
        setOpen(false)
        setTicketType("")
        setTicketStatus("")
        setUserId("")
        setProjectId("")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to create ticket")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const [data, formSubmit, isLoading] = useActionState(handleSubmit)

  useEffect(() => {
    async function loadUsers() {
      const result = await searchUsers("", 1, 100)
      if (result.success) setUsers(result.data || [])
    }
    loadUsers()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form action={formSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>Create a new support ticket.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ticket_heading">Ticket Heading</Label>
              <Input
                id="ticket_heading"
                name="ticket_heading"
                placeholder="Enter ticket heading"
                required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ticket_description">Description</Label>
              <Textarea
                id="ticket_description"
                name="ticket_description"
                placeholder="Enter ticket description"
                required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ticket_type">Ticket Type</Label>
                <Select value={ticketType} onValueChange={setTicketType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Query">Query</SelectItem>
                    <SelectItem value="Suggestion">Suggestion</SelectItem>
                    <SelectItem value="Bug">Bug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ticket_status">Status</Label>
                <Select value={ticketStatus} onValueChange={setTicketStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userID">User</Label>
              <UserSelect users={users} value={userId} onValueChange={setUserId} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectID">Project (Optional)</Label>
              <ProjectSelect
                value={projectId}
                onValueChange={setProjectId}
                placeholder="Select project (optional)" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
