// TODO: substituir mock por query da API
import { OrderDetail } from "@/components/features/orders/order-detail";

export default async function OrderDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <OrderDetail orderId={id} />;
}
