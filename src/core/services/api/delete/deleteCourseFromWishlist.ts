import api from "@/core/services/api";

export const deleteCourseFromWishlist = async (courseId: string) => {
  const response = await api.delete(`/wishlist/${courseId}`);
  return response.data;
};