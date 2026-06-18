import api from "@/core/services/api";

export interface CreateCoursePayload {
  title: string;
  courseLevel: string;
  categories: string;
  price: number;
  rating?: number | null;
  teacherId: string;
  description: string;
  courseImage: File;
  courseVideo: File;
}

export interface CreateCourseResponse {
  success: boolean;
  message: string;
}

export const createCourseAdmin = async (
  data: CreateCoursePayload,
): Promise<CreateCourseResponse> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("courseLevel", data.courseLevel);
  formData.append("categories", data.categories);
  formData.append("price", data.price.toString());
  if (data.rating) formData.append("rating", data.rating.toString());
  formData.append("teacherId", data.teacherId);
  formData.append("description", data.description);
  formData.append("courseImage", data.courseImage);
  formData.append("courseVideo", data.courseVideo);

  const response = await api.post<CreateCourseResponse>("/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
