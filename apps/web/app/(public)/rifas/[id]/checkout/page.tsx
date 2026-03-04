// TODO: substituir mock por query da API
import { RaffleCheckoutView } from "@/src/components/features/public/raffle-checkout-view";

export default async function PublicCheckoutPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <RaffleCheckoutView raffleId={id} />;
}
