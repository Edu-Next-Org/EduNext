import { apiFetch } from "@/core/Fetch";
import { ILandingRes } from "@/modules/main/landing/Components/HeroSections";
import Landing from "@/modules/main/landing/views/Landing";

export default async function Home() {
  const res = await apiFetch<ILandingRes>(`/landing/reports`, {
    next: { revalidate: 30 * 6 },
  });
  let data = null;
  if ("data" in res) {
    data = res.data;
  }

  return <Landing data={data} />;
}
