// TODO: substituir mock por query da API
import { RaffleDetail } from "@/components/features/raffles/raffle-detail";

export default async function RaffleDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <RaffleDetail raffleId={id} />;
}
