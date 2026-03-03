// TODO: substituir mock por tRPC query
import { RaffleResultView } from "@/src/components/features/public/raffle-result-view";

export default async function PublicResultPage({
	params,
}: {
	params: Promise<{ raffleId: string }>;
}) {
	const { raffleId } = await params;
	return <RaffleResultView raffleId={raffleId} />;
}
