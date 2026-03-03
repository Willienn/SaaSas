// TODO: substituir mock por tRPC query
import { RaffleCheckoutView } from "@/src/components/features/public/raffle-checkout-view";

export default async function PublicCheckoutPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <RaffleCheckoutView raffleId={id} />;
}
