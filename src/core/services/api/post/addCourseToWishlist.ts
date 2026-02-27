// import axios from "axios";
// import { getItemGeneric } from "@/Utils/helper/storage.services";

// export const addCourseToWishlist = async (courseId: string) => {
//   const token = getItemGeneric("accessToken");

//   if (!token) {
//     throw new Error("No access token found");
//   }

 
//   const cleanToken = token.replace(/"/g, "");

//   const response = await axios.post(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist`,
//     { courseId }, 
//     {
//       headers: {
//         Authorization: `Bearer ${cleanToken}`,
//       },
//     }
//   );

//   return response.data;
// };


import api from "@/core/services/api";

export const addCourseToWishlist = async (courseId: string) => {
  const res = await api.post("/wishlist", { courseId });
  return res.data;
};