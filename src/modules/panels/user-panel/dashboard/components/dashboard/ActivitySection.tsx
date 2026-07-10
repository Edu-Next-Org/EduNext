import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivitySection({
  activities,
}: {
  activities: string[];
}) {
  // activity
  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {activities.map((item, index) => (
          <div
            key={index}
            className="border-b pb-2 last:border-none text-muted-foreground"
          >
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
