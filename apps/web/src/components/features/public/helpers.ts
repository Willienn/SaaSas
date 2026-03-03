import type { Order, Raffle } from "@/src/types";

export function getRaffleProgress(raffle: Raffle): number {
	if (raffle.totalTickets <= 0) {
		return 0;
	}

	return Math.min(100, (raffle.soldTickets / raffle.totalTickets) * 100);
}

export function getPublicStatus(status: Raffle["status"]): "active" | "ended" {
	return status === "active" ? "active" : "ended";
}

export function getPublicStatusLabel(status: Raffle["status"]): string {
	return getPublicStatus(status) === "active" ? "Ativa" : "Encerrada";
}

export function createSoldNumbers(
	totalTickets: number,
	soldTickets: number,
): Set<number> {
	const soldCount = Math.min(totalTickets, Math.max(0, soldTickets));
	const sold = new Set<number>();

	for (let index = 1; index <= soldCount; index += 1) {
		sold.add(index);
	}

	return sold;
}

export function rangeNumbers(total: number): number[] {
	return Array.from({ length: total }, (_, index) => index + 1);
}

export function formatCountdown(targetDate: string, now = Date.now()): string {
	const distance = new Date(targetDate).getTime() - now;

	if (distance <= 0) {
		return "0d 0h 0m 0s";
	}

	const totalSeconds = Math.floor(distance / 1000);
	const days = Math.floor(totalSeconds / 86_400);
	const hours = Math.floor((totalSeconds % 86_400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function pickRandomNumbers(
	availableNumbers: number[],
	quantity: number,
): number[] {
	const pool = [...availableNumbers];
	const picks: number[] = [];
	const safeQuantity = Math.min(quantity, pool.length);

	for (let index = 0; index < safeQuantity; index += 1) {
		const randomIndex = Math.floor(Math.random() * pool.length);
		const [picked] = pool.splice(randomIndex, 1);

		if (picked !== undefined) {
			picks.push(picked);
		}
	}

	return picks.sort((a, b) => a - b);
}

export function hashString(input: string): number {
	let hash = 0;

	for (let index = 0; index < input.length; index += 1) {
		hash = (hash << 5) - hash + input.charCodeAt(index);
		hash |= 0;
	}

	return Math.abs(hash);
}

export function deriveOrderNumbers(order: Order, raffle: Raffle): number[] {
	const max = Math.max(1, raffle.totalTickets);
	const seed = hashString(order.id);
	const selected = new Set<number>();

	let pointer = 0;
	while (selected.size < order.quantity) {
		const value = ((seed + pointer * 37) % max) + 1;
		selected.add(value);
		pointer += 1;
	}

	return [...selected].sort((a, b) => a - b);
}

export function sortRaffles(
	raffles: Raffle[],
	sortBy: "price_asc" | "price_desc" | "ending_soon" | "most_sold",
): Raffle[] {
	const data = [...raffles];

	switch (sortBy) {
		case "price_asc":
			return data.sort((a, b) => a.ticketPrice - b.ticketPrice);
		case "price_desc":
			return data.sort((a, b) => b.ticketPrice - a.ticketPrice);
		case "ending_soon":
			return data.sort(
				(a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
			);
		default:
			return data.sort((a, b) => b.soldTickets - a.soldTickets);
	}
}
