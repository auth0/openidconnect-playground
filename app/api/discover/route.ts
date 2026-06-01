import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const discoverySchema = z.object({
  authorization_endpoint: z.url(),
  token_endpoint: z.url(),
  userinfo_endpoint: z.url(),
  jwks_uri: z.url(),
});

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json(
        { message: 'Missing required query parameter "url"' },
        { status: 400 },
      );
    }
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch discovery document: ${response.status} ${response.statusText}`,
      );
    }

    const body = await response.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { message: "Discovery document is not a JSON file." },
        { status: 400 },
      );
    }

    const result = discoverySchema.safeParse(body);

    if (result.success) {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json(
        {
          message: "Discovery document is not valid.",
          errors: result.error.issues.map(
            (e) => `The ${e.path.join(".")} ${e.message}`,
          ),
        },
        { status: 400 },
      );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
      },
      {
        status: 500,
      },
    );
  }
}
