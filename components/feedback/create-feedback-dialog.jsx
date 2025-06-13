"use client"

import { useEffect, useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"
import { ClientSelect } from "@/components/common/client-select"
import { ProjectSelect } from "@/components/common/project-select"
import { createFeedbackAction } from "@/scripts/feedback-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { searchUsers } from "@/scripts/user-actions"

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Trigger element
 */
export function CreateFeedbackDialog({ children }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const[users, setUsers] = useState([])
  const [rating, setRating] = useState("")
  const [clientId, setClientId] = useState("")
  const [projectId, setProjectId] = useState("")
  const router = useRouter()

  async function handleSubmit(formData) {
    formData.set("rating", rating)
    formData.set("clientID", clientId)
    formData.set("projectID", projectId)
    setLoading(true)
    try {
      const result = await createFeedbackAction(formData)

      if (result.success) {
        toast.success("Feedback created successfully")
        setOpen(false)
        setRating("")
        setClientId("")
        setProjectId("")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to create feedback")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

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
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Feedback</DialogTitle>
            <DialogDescription>Add feedback for a project from a client.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea id="comment" name="comment" placeholder="Enter feedback comment" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <Select value={rating} onValueChange={setRating} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>1 - Poor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span>2 - Fair</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span>3 - Good</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span>4 - Very Good</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="5">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span>5 - Excellent</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientID">Client</Label>
              <ClientSelect value={clientId} onValueChange={setClientId} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectID">Project</Label>
              <ProjectSelect value={projectId} onValueChange={setProjectId} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
