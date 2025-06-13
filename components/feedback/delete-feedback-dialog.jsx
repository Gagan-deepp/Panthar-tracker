"use client"

import { useState } from "react"
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
import { deleteFeedbackAction } from "@/scripts/feedback-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Trigger element
 * @param {string} props.feedbackId - Feedback ID
 * @param {string} props.feedbackComment - Feedback comment
 */
export function DeleteFeedbackDialog({ children, feedbackId, feedbackComment }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const result = await deleteFeedbackAction(feedbackId)

      if (result.success) {
        toast.success("Feedback deleted successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete feedback")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Feedback</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this feedback: "{feedbackComment.substring(0, 50)}..."? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
