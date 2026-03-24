import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/keystatic", "/keystatic/:path*"],
};

const REALM = 'Basic realm="Keystatic Admin", charset="UTF-8"';

function unauthorized(): NextResponse {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": REALM },
  });
}

/** Constant-time string comparison (UTF-8 bytes) to reduce timing leaks. */
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let diff = 0;
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i]! ^ bBytes[i]!;
  }
  return diff === 0;
}

function parseBasicAuth(
  header: string | null,
): { username: string; password: string } | null {
  if (!header?.startsWith("Basic ")) return null;
  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return null;
  }
  const colon = decoded.indexOf(":");
  if (colon === -1) return null;
  return {
    username: decoded.slice(0, colon),
    password: decoded.slice(colon + 1),
  };
}

export function middleware(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return unauthorized();
  }

  const creds = parseBasicAuth(request.headers.get("authorization"));
  if (
    !creds ||
    !timingSafeEqual(creds.username, expectedUser) ||
    !timingSafeEqual(creds.password, expectedPass)
  ) {
    return unauthorized();
  }

  return NextResponse.next();
}
