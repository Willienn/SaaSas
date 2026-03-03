"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { type UserRole, users } from "@/mocks/users";

type SessionContextValue = {
	currentRole: UserRole;
	setCurrentRole: (role: UserRole) => void;
	user: (typeof users)[number];
	isAdmin: boolean;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function MockSessionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [currentRole, setCurrentRole] = useState<UserRole>("admin");

	const value = useMemo<SessionContextValue>(() => {
		// Mantém o RBAC visual simples: alterna entre um usuário admin e um usuário comum mockado.
		const fallbackUser =
			users[0] ??
			({
				id: "usr_fallback",
				name: "Fallback User",
				email: "fallback@mock.local",
				role: "admin",
				createdAt: "2026-01-01T00:00:00.000Z",
			} as const);
		const selectedUser =
			users.find((item) => item.role === currentRole) ??
			users.find((item) => item.role === "admin") ??
			fallbackUser;

		return {
			currentRole,
			setCurrentRole,
			user: selectedUser,
			isAdmin: selectedUser.role === "admin",
		};
	}, [currentRole]);

	return (
		<SessionContext.Provider value={value}>{children}</SessionContext.Provider>
	);
}

export function useMockSession(): SessionContextValue {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error("useMockSession must be used inside MockSessionProvider");
	}

	return context;
}
