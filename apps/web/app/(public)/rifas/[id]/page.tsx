// TODO: substituir mock por tRPC query
import { RaffleDetailView } from "@/src/components/features/public/raffle-detail-view";

export default async function PublicRaffleDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <RaffleDetailView raffleId={id} />;
}
