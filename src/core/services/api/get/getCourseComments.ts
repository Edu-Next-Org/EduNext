import axios from "axios";

export interface CommentData {
  _id: string;
  course: string;
  user: {
    _id: string;
    name?: string; 
  };
  content: string;
  isConfirmed: boolean;
  createdAt: string;
}

export const getCourseComments = async (courseId: string): Promise<CommentData[]> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const response = await axios.get(`${BASE_URL}/comments/${courseId}`);
  return response.data.data; 
};