export async function getAllTeachers(
  page: string = "1",
  limit: string = "8",
  search: string = "",
) {
  const params = new URLSearchParams({
    page,
    limit,
  });

  if (search) {
    params.append("search", search);
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/teachers?${params.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 900 },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Error ${res.status}: Failed to fetch from ${url} - ${errorText}`,
    );
  }

  return res.json();
}
