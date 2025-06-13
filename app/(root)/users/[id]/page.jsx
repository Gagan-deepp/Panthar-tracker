import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import UserProfile from "@/components/users/UserProfile"
import { auth } from "@/lib/auth"
import { getUser } from "@/scripts/user-actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const page = async ({ params }) => {

    const { user } = await auth()

    const isAdmin = user.role === "admin"
    const { id } = await params
    const { data } = await getUser(id)
    
    return (
        <div className="flex-1 space-y-4 p-10 md:p-8 pt-6 container">
            <div className="flex items-center space-x-2">
                <SidebarTrigger />
            </div>

            <div className="space-y-6" >
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">User Details</h1>
                    </div>
                </div>
            </div>
            <UserProfile userData={data?.user} projectsData={data?.projects} isAdmin={isAdmin} />
        </div>
    )
}

export default page
