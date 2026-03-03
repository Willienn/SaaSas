import { PublicShell } from "@/src/components/features/public/public-shell";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <PublicShell>{children}</PublicShell>;
}
