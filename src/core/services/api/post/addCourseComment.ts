import axios from "axios";
import { getItemGeneric } from "@/Utils/helper/storage.services"; 

interface CommentPayload {
  courseId: string;
  content: string;
}

export const addCourseComment = async ({ courseId, content }: CommentPayload) => {

  const token = getItemGeneric("accessToken");

  if (!token) {
    throw new Error("No access token found");
  }


  const cleanToken = token.replace(/"/g, "");

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/comments/${courseId}`,
    { content },
    {
      headers: {
    
        Authorization: `Bearer ${cleanToken}`,
      },
    }
  );

  return response.data;
};