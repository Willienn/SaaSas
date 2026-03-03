"use client";

import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "../server/server";

export const trpc = createTRPCReact<AppRouter>();

export function createTrpcClient(url: string) {
	const resolvedUrl = url || "http://localhost:3000/trpc";

	return trpc.createClient({
		links: [
			httpBatchLink({
				url: resolvedUrl,
			}),
		],
	});
}
