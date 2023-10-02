import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import OrderDetails from "@components/order/order-details";
import { useUI } from "@contexts/ui.context";

export default function OrderPage() {

	const {isAuthorized}=useUI();
	if(!isAuthorized){
		return <div>Not Authorized</div>
	}
	return (
		<AccountLayout>
			<OrderDetails className="p-0" />
		</AccountLayout>
	);
}

OrderPage.Layout = Layout;
