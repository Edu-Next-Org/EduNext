import { notFound } from "next/navigation";
import { GetCertificateByCode } from "@/core/services/api/Get/GetCertificateByCode";
import CertificateDocument from "@/modules/Certificate/CertificateDocument";

export default async function CertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;
  const code = params.code;

  if (!code) notFound();

  const res = await GetCertificateByCode(code);

  if (!res?.data) notFound();

  return <CertificateDocument certificate={res.data} />;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
