// TODO: substituir mock por query da API
import { RaffleResultView } from "@/src/components/features/public/raffle-result-view";

export default async function PublicResultPage({
	params,
}: {
	params: Promise<{ raffleId: string }>;
}) {
	const { raffleId } = await params;
	return <RaffleResultView raffleId={raffleId} />;
}
