import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SkillsCard({ skills }) {
  return (
    <Card className="mt-6" >
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Professional skills and competencies</CardDescription>
      </CardHeader>
      <CardContent>
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No skills have been added yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
