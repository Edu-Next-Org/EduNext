export async function getTeacherById(id: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/teachers/${id}`;

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
