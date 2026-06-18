import api from "@/core/services/api";

export interface UpdateCoursePayload {
  courseId: string | number;
  title?: string;
  courseLevel?: string;
  categories?: string;
  price?: number;
  rating?: number | null;
  teacherId?: string;
  description?: string;
  courseImage?: File | null;
  courseVideo?: File | null;
}

export interface UpdateCourseResponse {
  success: boolean;
  message: string;
}

export const updateCourseAdmin = async (
  data: UpdateCoursePayload,
): Promise<UpdateCourseResponse> => {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  if (data.courseLevel) formData.append("courseLevel", data.courseLevel);
  if (data.categories) formData.append("categories", data.categories);

  if (data.price != null) {
    formData.append("price", data.price.toString());
  }
  if (data.rating !== undefined && data.rating !== null)
    formData.append("rating", data.rating.toString());
  if (data.teacherId) formData.append("teacherId", data.teacherId);
  if (data.description) formData.append("description", data.description);
  if (data.courseImage) formData.append("courseImage", data.courseImage);
  if (data.courseVideo) formData.append("courseVideo", data.courseVideo);

  const response = await api.put<UpdateCourseResponse>(
    `/courses/${data.courseId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
