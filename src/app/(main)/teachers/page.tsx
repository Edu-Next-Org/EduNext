import { TeachersListClient } from "@/modules/main/Teachers/TeachersListClient";
import { getAllTeachers } from "@/core/services/api/Get/GetAllTeacher";

type ApiTeacher = {
  _id: string;
  name: string;
  email: string;
  gender: "Male" | "Female" | null;
  profileImage: string | null;
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}

export default async function TeachersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page || "1";
  const limit = resolvedParams.limit || "8";
  const search = resolvedParams.search || "";

  let teachers = [];
  let meta = { total: 0, page: 1, pages: 1, limit: 10 };

  try {
    const response = await getAllTeachers(page, limit, search);

    if (response && response.data) {
      teachers = response.data.map((t: ApiTeacher) => ({
        id: t._id,
        name: t.name,
        email: t.email,
        image: t.profileImage || "/images/courseteacher.png",
        gender:
          t.gender === "Male" || t.gender === "Female" ? t.gender : "Other",
      }));

      meta = response.meta || meta;
    }
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
  }

  return (
    <div className="container mx-auto py-8 px-8 dark:bg-none dark:bg-[#1e1e1e] bg-[radial-gradient(circle_at_top_left,_#ffffff_0%,_rgba(255,255,255,0)_60%),linear-gradient(180deg,_#FAF7FC_0%,_#F3EEF6_45%,_#ECE6F2_100%)]">
      <TeachersListClient
        initialTeachers={teachers}
        totalPages={meta.pages}
        currentPage={meta.page}
      />
    </div>
  );
}
