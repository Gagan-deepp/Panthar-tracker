"use client"

import { useState, useEffect } from "react"
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
import { ClientSelect } from "@/components/common/client-select"
import { updateProjectAction } from "@/scripts/project-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { UserSelect } from "@/components/common/user-select"
import { Plus, X } from "lucide-react"
import { searchUsers } from "@/scripts/user-actions"
import { searchClients } from "@/scripts/client-actions"

export function EditProjectDialog({ children, project }) {
  const [users, setUsers] = useState([])
  const [clients, setClients] = useState([])
  const [team, setTeam] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(project.project_status)
  const [clientId, setClientId] = useState("")

  // Reset form data when dialog opens
  useEffect(() => {
    if (open) {
      setStatus(project.project_status)
      // Handle client ID - it might be an object or string
      setClientId(typeof project.client === "object" ? project.client._id : project.client)

      // Handle team data
      if (project.team && project.team.length > 0) {
        setTeam(
          project.team.map((member) => ({
            user: typeof member.user === "object" ? member.user._id : member.user,
            role: member.role || "",
            join_date: member.join_date ? member.join_date.split("T")[0] : "",
          })),
        )
      } else {
        setTeam([])
      }
    }
  }, [open, project])

  useEffect(() => {
    async function loadUsersandClient() {
      console.log("Searching user...")
      const [userResult, clientResult] = await Promise.all([searchUsers("", 1, 100), searchClients("", 1, 100)])
      if (userResult.success && clientResult.success) {
        setUsers(userResult.data || [])
        setClients(clientResult.data || [])
      }
    }
    loadUsersandClient()
  }, [])

  const router = useRouter()

  const addTeamMember = () => {
    setTeam([...team, { user: "", role: "", join_date: "" }])
  }

  const removeTeamMember = (index) => {
    setTeam(team.filter((_, i) => i !== index))
  }

  const updateTeamMember = (index, field, value) => {
    const updatedTeam = team.map((member, i) => (i === index ? { ...member, [field]: value } : member))
    setTeam(updatedTeam)
  }

  async function handleSubmit(formData) {
    formData.set("project_status", status)
    formData.set("client", clientId)
    formData.set("team", JSON.stringify(team))
    setLoading(true)
    try {
      const result = await updateProjectAction(project._id, formData)

      if (result.success) {
        toast.success("Project updated successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update project")
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
      <DialogContent className="sm:max-w-[500px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project_name">Project Name</Label>
              <Input
                id="project_name"
                name="project_name"
                defaultValue={project.project_name}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project_desc">Project Description</Label>
              <Textarea
                id="project_desc"
                name="project_desc"
                defaultValue={project.project_desc}
                placeholder="Enter project description"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project_status">Project Status</Label>
              <Select value={status} onValueChange={setStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select project status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on design">On Design</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <ClientSelect
                clients={clients}
                key={`client-${project._id}-${open}`}
                value={clientId}
                onValueChange={setClientId}
                required
                placeholder="Select client"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Team Members</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTeamMember}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Member
                </Button>
              </div>
              {team.length === 0 ? (
                <p className="text-sm text-muted-foreground">No team members added yet.</p>
              ) : (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {team.map((member, index) => (
                    <div
                      key={`team-${index}-${open}`}
                      className="grid grid-cols-12 gap-2 items-end p-3 border rounded-lg"
                    >
                      <div className="col-span-4">
                        <Label className="text-xs">User</Label>
                        <UserSelect
                          users={users}
                          key={`user-${index}-${member.user}-${open}`}
                          value={member.user}
                          onValueChange={(value) => updateTeamMember(index, "user", value)}
                          placeholder="Select user"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Role</Label>
                        <Input
                          placeholder="e.g. Developer"
                          value={member.role}
                          onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                        />
                      </div>
                      <div className="col-span-4">
                        <Label className="text-xs">Join Date</Label>
                        <Input
                          type="date"
                          value={member.join_date}
                          onChange={(e) => updateTeamMember(index, "join_date", e.target.value)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeTeamMember(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="project_start_date">Start Date</Label>
                <Input
                  id="project_start_date"
                  name="project_start_date"
                  type="date"
                  defaultValue={project.project_start_date?.split("T")[0]}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project_end_date">End Date</Label>
                <Input
                  id="project_end_date"
                  name="project_end_date"
                  type="date"
                  defaultValue={project.project_end_date?.split("T")[0]}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
