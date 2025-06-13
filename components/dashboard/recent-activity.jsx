import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export async function RecentActivity() {
  // Mock recent activity data - in real app, this would come from your API
  const activities = [
    {
      id: 1,
      type: "project",
      title: "New project created",
      description: "Website Redesign project started",
      time: "2 hours ago",
      user: "John Doe",
    },
    {
      id: 2,
      type: "client",
      title: "Client added",
      description: "Acme Corp added as new client",
      time: "4 hours ago",
      user: "Jane Smith",
    },
    {
      id: 3,
      type: "ticket",
      title: "Ticket resolved",
      description: "Bug fix completed for mobile app",
      time: "6 hours ago",
      user: "Mike Johnson",
    },
    {
      id: 4,
      type: "feedback",
      title: "New feedback received",
      description: "5-star rating from client",
      time: "1 day ago",
      user: "Sarah Wilson",
    },
  ]

  const getActivityColor = (type) => {
    switch (type) {
      case "project":
        return "bg-blue-500"
      case "client":
        return "bg-green-500"
      case "ticket":
        return "bg-orange-500"
      case "feedback":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={getActivityColor(activity.type)}>
              {activity.user
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
          <div className="text-sm text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  );
}
