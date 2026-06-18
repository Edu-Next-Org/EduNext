import api from "../../api";

export interface AnswerItem {
  questionId: string;
  answer: string;
}

export interface SubmitExamPayload {
  examId: string;
  answers: AnswerItem[];
  isAutoSubmitted: boolean;
}

export interface AttemptAnswer {
  questionId: string;
  answer: string;
  _id: string;
}

export interface Attempt {
  user: string;
  exam: string;
  answers: AttemptAnswer[];
  score: number;
  isPassed: boolean;
  isAutoSubmitted: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Certificate {
  user: string;
  course: string;
  code: string;
  _id: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubmitExamResponse {
  success: boolean;
  data: {
    attempt: Attempt;
    certificate?: Certificate;
  };
}

export const SubmitExam = async (
  payload: SubmitExamPayload,
): Promise<SubmitExamResponse> => {
  const response = await api.post<SubmitExamResponse>(
    "/attempts/submit",
    payload,
  );
  return response.data;
};
