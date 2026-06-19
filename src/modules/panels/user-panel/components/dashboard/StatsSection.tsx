import { BookOpen, CheckCircle2, Award } from "lucide-react";
import StatCard from "./StatCard";

interface Stats {
  inProgress: number;
  completed: number;
  certificates: number;
}

export default function StatsSection({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        title="In Progress"
        value={stats.inProgress}
        icon={<BookOpen className="w-5 h-5" />}
      />
      <StatCard
        title="Completed"
        value={stats.completed}
        icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
      />
      <StatCard
        title="Certificates"
        value={stats.certificates}
        icon={<Award className="w-5 h-5 text-yellow-500" />}
      />
    </div>
  );
}
