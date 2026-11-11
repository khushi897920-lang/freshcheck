import { NextRequest, NextResponse } from "next/server";
import { getCheckById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Check ID is required" },
        { status: 400 }
      );
    }

    const check = await getCheckById(id);
    if (!check) {
      return NextResponse.json(
        { error: "Check not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(check);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
