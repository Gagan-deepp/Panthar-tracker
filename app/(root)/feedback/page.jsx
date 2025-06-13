import { Suspense } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FeedbackTable } from "@/components/feedback/feedback-table"
import { CreateFeedbackDialog } from "@/components/feedback/create-feedback-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

function FeedbackTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}

export default async function FeedbackPage() {

  const { user } = await auth()

  if (user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Feedback</h2>
        </div>

        {user.role === "admin" && <CreateFeedbackDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Feedback
          </Button>
        </CreateFeedbackDialog>}


      </div>
      <Suspense fallback={<FeedbackTableSkeleton />}>
        <FeedbackTable />
      </Suspense>
    </div>
  );
}
