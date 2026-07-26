import imagekit from "@/lib/imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  if (!imagekit) {
    return NextResponse.json(
      { error: "ImageKit is not configured" },
      { status: 503 },
    );
  }

  const result = imagekit.getAuthenticationParameters();
  return NextResponse.json(result);
}
