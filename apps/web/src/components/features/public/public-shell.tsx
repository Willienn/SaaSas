import { PublicFooter } from "@/src/components/features/public/public-footer";
import { PublicHeader } from "@/src/components/features/public/public-header";

export function PublicShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(208,154,67,0.2),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(183,130,47,0.1),transparent_30%)]" />
			</div>
			<PublicHeader />
			<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{children}
			</main>
			<PublicFooter />
		</div>
	);
}
