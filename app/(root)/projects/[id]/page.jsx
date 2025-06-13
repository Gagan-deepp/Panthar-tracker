import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import ProjectProfilePage from "@/components/projects/project-profile";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { getProject } from "@/scripts/project-actions";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

const page = async ({ params }) => {
    
    const { user } = await auth()
    const { id } = await params;
    const { data } = await getProject(id)

    console.log("Project by id ==> ", data)

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

            <div className="flex items-center space-x-2">
                <SidebarTrigger />
            </div>

            <div className="space-y-6" >

                <div className="flex items-center justify-between" >
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/clients">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{data.project_name}</h1>
                        </div>
                    </div>

                    {user.role === "admin" && (
                        <EditProjectDialog project={data} >
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Project
                            </Button>
                        </EditProjectDialog>
                    )}

                </div>

                <ProjectProfilePage projectData={data} />
            </div>
        </div>
    )
}

export default page
