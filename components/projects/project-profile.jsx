"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { CalendarIcon, Clock, Edit, Mail, Phone, User } from "lucide-react"
import Link from "next/link"


export default function ProjectProfilePage({ projectData }) {

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
            case "completed":
                return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
            case "on hold":
                return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
            case "cancelled":
                return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
            default:
                return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
        }
    }

    const calculateDaysLeft = () => {
        const endDate = new Date(projectData.project_end_date)
        const today = new Date()
        const diffTime = endDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const daysLeft = calculateDaysLeft()

    return (
        <div className="container mx-auto py-6 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {/* Project Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>Overview of the project information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Status</span>
                            <Badge className={getStatusColor(projectData.project_status)} variant="outline">
                                {projectData.project_status.charAt(0).toUpperCase() + projectData.project_status.slice(1)}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Start Date</span>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{format(new Date(projectData.project_start_date), "MMM d, yyyy")}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">End Date</span>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{format(new Date(projectData.project_end_date), "MMM d, yyyy")}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Days Left</span>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{daysLeft} days</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Client Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Client Information</CardTitle>
                        <CardDescription>Details about the client</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-3">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Client Name</p>
                                <p className="text-sm text-muted-foreground">{projectData.client.client_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Contact Number</p>
                                <p className="text-sm text-muted-foreground">{projectData.client.client_contact}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email Address</p>
                                <p className="text-sm text-muted-foreground">{projectData.client.client_mail}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Team Members Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>People working on this project</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projectData.team.map((member) => (
                            <Link key={member.user._id} href={`/users/${member.user._id}`} >
                                <div className="flex items-center gap-4 p-4 border rounded-lg">
                                    <Avatar className="h-10 w-10 flex justify-center items-center ">
                                        <AvatarFallback className="h-6 w-6 p-6 text-primary rounded-full bg-primary/10" >{member.user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{member.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                        <p className="text-xs text-muted-foreground">{member.user.email}</p>
                                    </div>
                                </div>
                            </Link>

                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
