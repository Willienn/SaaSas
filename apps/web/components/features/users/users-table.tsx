"use client";

import { Lock, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { LoadingTableSkeleton } from "@/components/common/loading-table-skeleton";
import { PaginationControls } from "@/components/common/pagination-controls";
import { RoleBadge } from "@/components/common/status-badges";
import { useMockSession } from "@/components/providers/mock-session-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { usePagination } from "@/hooks/use-pagination";
import { formatDateTime } from "@/lib/formatters";
import { users } from "@/mocks/users";

export function UsersTable() {
	const { isAdmin, setCurrentRole } = useMockSession();
	const isLoading = useMockLoading();

	const [search, setSearch] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");

	const filteredUsers = useMemo(() => {
		return users.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(search.toLowerCase()) ||
				user.email.toLowerCase().includes(search.toLowerCase());
			const matchesRole =
				roleFilter === "all" ? true : user.role === roleFilter;

			return matchesSearch && matchesRole;
		});
	}, [roleFilter, search]);

	const { currentPage, pageItems, setCurrentPage, totalPages } = usePagination(
		filteredUsers,
		6,
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [roleFilter, search, setCurrentPage]);

	if (!isAdmin) {
		return (
			<EmptyState
				icon={Lock}
				title="Admin area"
				description="This section is hidden for regular users in the mocked RBAC flow."
				ctaLabel="Switch to admin"
				onCtaClick={() => setCurrentRole("admin")}
			/>
		);
	}

	if (isLoading) {
		return <LoadingTableSkeleton rows={7} />;
	}

	return (
		<section className="space-y-4">
			<header className="space-y-1">
				<h2 className="text-2xl font-semibold uppercase tracking-[0.04em]">
					Users
				</h2>
				<p className="text-sm text-muted-foreground">
					Visible only for admin profile in this mock RBAC flow.
				</p>
			</header>

			<Card>
				<CardHeader className="space-y-3">
					<CardTitle className="text-base uppercase tracking-[0.05em]">
						User Directory
					</CardTitle>
					<div className="grid gap-2 md:grid-cols-[1fr_220px]">
						<Input
							placeholder="Search by name or email"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
						/>
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All roles</SelectItem>
								<SelectItem value="admin">Admin</SelectItem>
								<SelectItem value="user">User</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{filteredUsers.length === 0 ? (
						<EmptyState
							icon={SearchX}
							title="No users found"
							description="Try clearing filters to view the complete mocked user list."
							ctaLabel="Clear filters"
							onCtaClick={() => {
								setSearch("");
								setRoleFilter("all");
							}}
						/>
					) : (
						<>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>User</TableHead>
										<TableHead>Email</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Created At</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pageItems.map((user) => {
										const initials = user.name
											.split(" ")
											.map((part) => part[0])
											.join("")
											.slice(0, 2)
											.toUpperCase();

										return (
											<TableRow key={user.id}>
												<TableCell>
													<div className="flex items-center gap-2">
														<Avatar className="size-8 border border-primary/30 bg-primary/10">
															<AvatarFallback className="bg-transparent text-xs text-primary">
																{initials}
															</AvatarFallback>
														</Avatar>
														<span className="font-medium">{user.name}</span>
													</div>
												</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>
													<RoleBadge role={user.role} />
												</TableCell>
												<TableCell>{formatDateTime(user.createdAt)}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>

							<PaginationControls
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</>
					)}
				</CardContent>
			</Card>
		</section>
	);
}
