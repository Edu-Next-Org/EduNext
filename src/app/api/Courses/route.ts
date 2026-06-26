import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://edunext-api-docker.onrender.com/api/courses",
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Route ERROR:", error);
    return NextResponse.json({ data: [] });
  }
}
