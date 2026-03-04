// TODO: substituir mock por query da API
import { RaffleDetailView } from "@/src/components/features/public/raffle-detail-view";

export default async function PublicRaffleDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <RaffleDetailView raffleId={id} />;
}
