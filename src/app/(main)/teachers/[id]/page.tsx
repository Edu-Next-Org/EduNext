import { TeacherDetailClient } from "@/modules/main/Teachers/TeacherDetailClient";
import { getTeacherById } from "@/core/services/api/Get/GetTeacherById";
import { notFound } from "next/navigation";

type ApiCourse = {
  _id: string;
  title: string;
  categories: { name: string }[];
  courseImage: string | null;
  rating: number;
  price: number;
};

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const teacherId = resolvedParams.id;
  let teacherDetail = null;

  try {
    const response = await getTeacherById(teacherId);
    const t = response.data;

    if (!t) {
      notFound();
    }

    teacherDetail = {
      id: t._id,
      name: t.name,
      email: t.email,
      gender: t.gender || "Not specified",
      image: t.profileImage || "/images/courseteacher.png",
      about: t.about || "No biography provided for this instructor yet.",
      courses: t.courses
        ? t.courses.map((c: ApiCourse) => ({
            id: c._id,
            title: c.title,
            image: c.courseImage || "/images/HTML5Course.png",
            category:
              c.categories && c.categories.length > 0
                ? c.categories[0].name
                : "General",
            rate: c.rating || 0,
            price: c.price || 0,
          }))
        : [],
    };
  } catch (error) {
    console.error("Failed to fetch teacher details:", error);
    notFound();
  }

  if (!teacherDetail) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-10 dark:bg-none dark:bg-[#1e1e1e] bg-[radial-gradient(circle_at_top_left,_#ffffff_0%,_rgba(255,255,255,0)_60%),linear-gradient(180deg,_#FAF7FC_0%,_#F3EEF6_45%,_#ECE6F2_100%)]">
      <TeacherDetailClient teacher={teacherDetail} />
    </div>
  );
}
