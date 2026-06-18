export interface RelatedCategory {
  _id: string;
  name: string;
}

export interface RelatedTeacher {
  _id: string;
  name: string;
  email: string;
  profileImage: string | null;
}

export interface RelatedCourseItem {
  _id: string;
  title: string;
  description: string;
  courseImage: string | null;
  categories: RelatedCategory[];
  teacher: RelatedTeacher;
  createdAt: string;
  price: number;
  rating: number;
}

export interface RelatedCoursesResponse {
  success: boolean;
  data: RelatedCourseItem[];
}

export async function getRelatedCourses(
  id: string,
  limit: number = 5,
): Promise<RelatedCourseItem[]> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/${id}/related?limit=${limit}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 900 },
    });

    if (!res.ok) {
      return [];
    }

    const result: RelatedCoursesResponse = await res.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
