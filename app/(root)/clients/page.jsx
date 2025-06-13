import { Suspense } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClientsTable } from "@/components/clients/clients-table"
import { CreateClientDialog } from "@/components/clients/create-client-dialog"
import { SearchInput } from "@/components/common/search-input"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/lib/auth"

function ClientsTableSkeleton() {
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

export default async function ClientsPage({ searchParams }) {

  const { user } = await auth();
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams.search || ""
  const page = Number(resolvedSearchParams.page) || 1

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        </div>
        
        {user.role === "admin" && (
          <CreateClientDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </CreateClientDialog>
        )}

      </div>
      <div className="flex items-center space-x-2">
        <SearchInput placeholder="Search clients..." />
      </div>
      <Suspense fallback={<ClientsTableSkeleton />}>
        <ClientsTable search={search} page={page} />
      </Suspense>
    </div>
  );
}
