import { cn } from "@/src/lib/utils";

type ConfettiProps = {
	active: boolean;
	className?: string;
};

const colors = ["#d09a43", "#38d7b8", "#f2d5a4", "#ef5f5f", "#9fd5ff"];

export function Confetti({ active, className }: ConfettiProps) {
	if (!active) {
		return null;
	}

	return (
		<div className={cn("public-confetti", className)} aria-hidden="true">
			{Array.from({ length: 36 }).map((_, index) => {
				const left = (index * 13) % 100;
				const delay = (index % 8) * 0.12;
				const duration = 2.4 + (index % 5) * 0.35;
				const color = colors[index % colors.length];

				return (
					<span
						key={`piece-${index}`}
						className="public-confetti-piece"
						style={{
							left: `${left}%`,
							animationDelay: `${delay}s`,
							animationDuration: `${duration}s`,
							backgroundColor: color,
						}}
					/>
				);
			})}
		</div>
	);
}
