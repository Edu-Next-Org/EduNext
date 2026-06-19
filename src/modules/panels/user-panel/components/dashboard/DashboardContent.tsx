import ActivitySection from "./ActivitySection";
import CoursesSection from "./CoursesSection";
import StatsSection from "./StatsSection";

export default async function DashboardContent() {
  const stats = {
    inProgress: 3,
    completed: 5,
    certificates: 2,
  };

  const courses = [
    {
      id: 1,
      title: "Modern JavaScript for Beginners",
      author: "Jack Martin",
      progress: 70,
      image: "/course1.jpg",
    },
    {
      id: 2,
      title: "Complete React Developer",
      author: "Sarah Lee",
      progress: 45,
      image: "/course2.jpg",
    },
  ];

  const activities = [
    "Completed lesson: JS Variables",
    "Watched: React Hooks Intro",
    "Certificate issued: JavaScript Fundamentals",
  ];

  return (
    <div className="flex flex-col gap-4">
      <StatsSection stats={stats} />
      <CoursesSection courses={courses} />
      <ActivitySection activities={activities} />
    </div>
  );
}
