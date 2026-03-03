"use client";

import { Menu, UserCog } from "lucide-react";
import { toast } from "sonner";
import { AppSidebarContent } from "@/components/layout/app-sidebar";
import { AppBreadcrumbs } from "@/components/layout/breadcrumbs";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useMockSession } from "@/components/providers/mock-session-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function AppHeader() {
	const { user, currentRole, setCurrentRole } = useMockSession();

	const initials = user.name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-lg">
			<div className="flex h-16 items-center justify-between gap-3 px-4 md:px-7">
				<div className="flex items-center gap-3">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon-sm" className="md:hidden">
								<Menu className="size-4" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-[84vw] max-w-[310px] p-0">
							<SheetTitle className="sr-only">Navigation</SheetTitle>
							<AppSidebarContent />
						</SheetContent>
					</Sheet>
					<div className="max-w-[45vw] truncate md:max-w-none">
						<AppBreadcrumbs />
					</div>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<ThemeToggle />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-9 gap-2 border-primary/30 px-2"
							>
								<Avatar className="size-7 border border-primary/40 bg-primary/10">
									<AvatarFallback className="bg-transparent text-xs font-semibold text-primary">
										{initials}
									</AvatarFallback>
								</Avatar>
								<span className="max-w-[120px] truncate text-xs uppercase tracking-[0.08em]">
									{user.name}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
								Mock Session
							</DropdownMenuLabel>
							<DropdownMenuItem className="cursor-default text-xs">
								<UserCog className="size-4" />
								{user.email}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuLabel className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
								Role preview
							</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={currentRole}
								onValueChange={(value) => {
									const role = value as "admin" | "user";
									setCurrentRole(role);
									console.log("[mock] switched role", role);
									toast.success(`Role changed to ${role}`);
								}}
							>
								<DropdownMenuRadioItem value="admin">
									Admin
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="user">User</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
