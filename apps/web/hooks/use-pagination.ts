"use client";

import { useMemo, useState } from "react";

type UsePaginationResult<T> = {
	currentPage: number;
	totalPages: number;
	pageItems: T[];
	setCurrentPage: (page: number) => void;
};

export function usePagination<T>(
	items: T[],
	pageSize: number,
): UsePaginationResult<T> {
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
	const safePage = Math.min(currentPage, totalPages);

	const pageItems = useMemo(() => {
		const start = (safePage - 1) * pageSize;
		return items.slice(start, start + pageSize);
	}, [items, pageSize, safePage]);

	return {
		currentPage: safePage,
		totalPages,
		pageItems,
		setCurrentPage,
	};
}
