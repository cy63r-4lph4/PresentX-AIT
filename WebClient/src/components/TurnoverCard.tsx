import { Card, CardContent } from "@/components/ui/card";

export function TurnoverCard({ total, present }: { total: number; present: number }) {
  const percentage = ((present / total) * 100).toFixed(1);

  return (
    <Card className="rounded-2xl shadow-lg p-6 w-full max-w-sm">
      <CardContent>
        <h2 className="text-lg font-semibold mb-2">Turnover Rate</h2>
        <div className="text-4xl font-bold text-green-600">{percentage}%</div>
        <p className="text-sm text-muted-foreground mt-1">
          {present} out of {total} students marked attendance
        </p>
      </CardContent>
    </Card>
  );
}
