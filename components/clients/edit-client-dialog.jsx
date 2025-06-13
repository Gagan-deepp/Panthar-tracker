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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateClientAction } from "@/scripts/client-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Trigger element
 * @param {Object} props.client - Client data
 */
export function EditClientDialog({ children, client }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData) {
    setLoading(true)
    try {
      const result = await updateClientAction(client._id, formData)

      if (result.success) {
        toast.success("Client updated successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update client")
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
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                name="client_name"
                defaultValue={client.client_name}
                placeholder="Enter client name"
                required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_contact">Contact Number</Label>
              <Input
                id="client_contact"
                name="client_contact"
                defaultValue={client.client_contact}
                placeholder="Enter contact number"
                required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_mail">Email Address</Label>
              <Input
                id="client_mail"
                name="client_mail"
                type="email"
                defaultValue={client.client_mail}
                placeholder="Enter email address"
                required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
