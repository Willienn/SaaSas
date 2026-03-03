"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export function PaginationControls({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationControlsProps) {
	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className="flex items-center justify-end gap-2">
			<Button
				size="sm"
				variant="outline"
				onClick={() => onPageChange(Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
			>
				<ChevronLeft className="size-4" />
				Previous
			</Button>
			<span className="text-xs text-muted-foreground">
				Page {currentPage} of {totalPages}
			</span>
			<Button
				size="sm"
				variant="outline"
				onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
			>
				Next
				<ChevronRight className="size-4" />
			</Button>
		</div>
	);
}
