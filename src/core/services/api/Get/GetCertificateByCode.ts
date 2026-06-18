import api from "../../api";

export interface CertificateUser {
  profileImage: string | null;
  _id: string;
  email: string;
  name: string;
}

export interface CertificateCourse {
  _id: string;
  title: string;
  courseImage: string;
  price: number;
}

export interface CertificateData {
  _id: string;
  user: CertificateUser;
  course: CertificateCourse;
  code: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetCertificateResponse {
  success: boolean;
  data: CertificateData;
}

export const GetCertificateByCode = async (
  code: string,
): Promise<GetCertificateResponse> => {
  const response = await api.get<GetCertificateResponse>(
    `/certificates/${code}`,
  );

  return response.data;
};
