"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Mail, Phone } from "lucide-react"
import { SkillsCard } from "../custom/skill-card"
import { ProjectCard } from "../projects/project-card"
import { EditUserDialog } from "./edit-user-dialog"
import { UserStats } from "./user-status"

export default function UserProfile({ userData, projectsData, isAdmin }) {

    const activeProjects = projectsData.filter((p) => p.project_status === "active").length
    const totalProjects = projectsData.length
    const completedProjects = projectsData.filter((p) => p.project_status === "completed").length
    const projectCompletionRate = Math.round((completedProjects / totalProjects) * 100)

    return (
        <div className="my-12 space-y-12 w-[90%] mx-auto">
            {/* User Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-primary/10">
                        <AvatarImage src={`${userData.profile_image}`} alt={userData.name} />
                        <AvatarFallback>
                            {userData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{userData.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            <span>{userData.company_role}</span>
                            <Badge variant="outline" className="ml-2">
                                {userData.user_role}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{userData.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{userData.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Removed Message button */}
                    {isAdmin && <EditUserDialog user={userData}>
                        <Button>Edit Profile</Button>
                    </EditUserDialog>}
                </div>
            </div>

            {/* User Stats */}
            <UserStats
                activeProjects={activeProjects}
                totalProjects={totalProjects}
                completedProjects={completedProjects}
                projectCompletionRate={projectCompletionRate}
            />

            {/* Main Content */}
            <Tabs defaultValue="projects" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-2">
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-6">
                    <h2 className="text-xl font-semibold mt-6">Assigned Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsData.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-6">
                    <SkillsCard skills={userData.skills || []} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
