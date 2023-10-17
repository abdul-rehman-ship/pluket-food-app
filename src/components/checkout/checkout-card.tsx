import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import { CheckoutItem } from "@components/checkout/checkout-card-item";
import { CheckoutCardFooterItem } from "./checkout-card-footer-item";
import { useTranslation } from "next-i18next";

const CheckoutCard: React.FC = () => {
	const { items, total, isEmpty } = useCart();
	const { price: subtotal } = usePrice({
		amount: total,
		currencyCode: "THB",
	});
	const { t } = useTranslation("common");
	const checkoutFooter = [
		{
			id: 1,
			name: t("text-sub-total"),
			price: subtotal,
		},
		{
			id: 2,
			name: t("text-shipping"),
			price: t("text-free"),
		},
		{
			id: 3,
			name: t("text-total"),
			price: subtotal,
		},
	];
	return (
		<div className="pt-12 md:pt-0 2xl:ps-4">
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-olive mb-6 xl:mb-8">
				{t("text-your-order")}
			</h2>
			<div className="flex p-4 rounded-md mt-6 md:mt-7 xl:mt-9 bg-olive text-sm font-semibold ">
				<span className="text-maroon">{t("text-product")}</span>
				<span className="ms-auto text-maroon flex-shrink-0">{t("text-sub-total")}</span>
			</div>
			{!isEmpty ? (
				items.map((item) => <CheckoutItem item={item} key={item.id} />)
			) : (
				<p className="text-red-500 lg:px-3 py-4">{t("text-empty-cart")}</p>
			)}
			{checkoutFooter.map((item: any) => (
				<CheckoutCardFooterItem item={item} key={item.id} />
			))}
		</div>
	);
};

export default CheckoutCard;
