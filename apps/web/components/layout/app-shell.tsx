import { AppHeader } from "@/components/layout/app-header";
import { AppSidebarContent } from "@/components/layout/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative min-h-screen">
			<div className="pointer-events-none fixed inset-0 opacity-90">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(194,145,59,0.14),transparent_45%),radial-gradient(circle_at_95%_10%,rgba(194,145,59,0.08),transparent_40%)]" />
				<div className="absolute inset-0 bg-[linear-gradient(140deg,transparent,rgba(255,255,255,0.02),transparent)]" />
			</div>

			<div className="relative flex min-h-screen">
				<aside className="hidden w-72 border-r border-border/80 bg-sidebar/75 backdrop-blur-xl md:block">
					<div className="sticky top-0 h-screen">
						<AppSidebarContent />
					</div>
				</aside>

				<div className="flex min-h-screen flex-1 flex-col">
					<AppHeader />
					<main className="flex-1 px-4 py-6 md:px-7">{children}</main>
				</div>
			</div>
		</div>
	);
}
