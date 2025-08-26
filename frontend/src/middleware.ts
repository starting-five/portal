import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

export async function middleware(request: NextRequest) {
  console.log("Main middleware hit:", request.nextUrl.pathname);
  if (request.nextUrl.pathname === "/") {
    console.log("Request is for root path '/'. Should redirect to default locale.");
  }

  // First, run Supabase session/auth logic
  console.log("Running updateSession");
  const authResponse = await updateSession(request);

  // If auth redirected (user not authenticated), return that redirect
  if (authResponse.status === 307 || authResponse.status === 302) {
    console.log("Auth redirecting, returning auth redirect");
    return authResponse;
  }

  // Then, run next-intl locale routing
  const intlResponse = createMiddleware(routing)(request);
  if (intlResponse instanceof Response) {
    console.log("Next-intl processing. Response status:", intlResponse.status);
    console.log("Next-intl response headers:", Object.fromEntries(intlResponse.headers.entries()));
    return intlResponse;
  }

  // Return the auth response (which should be NextResponse.next)
  return authResponse;
}

export const config = {
  matcher: ["/", "/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
