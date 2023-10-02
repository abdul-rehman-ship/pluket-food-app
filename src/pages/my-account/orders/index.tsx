import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import OrdersTable from "@components/my-account/orders-table";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUI } from "@contexts/ui.context";

export default function OrdersTablePage() {
	const {isAuthorized}=useUI();
	if(!isAuthorized){
		return <div>Not Authorized</div>
	}
	return (
		<AccountLayout>
			<OrdersTable />
		</AccountLayout>
	);
}

OrdersTablePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => {
	return {
		props: {
			...(await serverSideTranslations(locale, [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
	};
};
