"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { createTrpcClient, trpc } from "../client";

type TrpcProviderProps = PropsWithChildren<{
	url: string;
}>;

export default function TrpcProvider({ url, children }: TrpcProviderProps) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() => createTrpcClient(url));

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
