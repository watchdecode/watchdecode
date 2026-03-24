import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

export const runtime = "nodejs";
// ADD THIS LINE BELOW
export const dynamic = "force-dynamic"; 

export const { GET, POST } = makeRouteHandler({ config });