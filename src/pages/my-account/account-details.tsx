import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import AccountDetails from "@components/my-account/account-details";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUI } from "@contexts/ui.context";

export default function AccountDetailsPage() {
	const {isAuthorized}=useUI();
if(!isAuthorized){
	return <div>Not Authorized</div>
}
	return (
		<AccountLayout>
			<AccountDetails />
		</AccountLayout>
	);
}

AccountDetailsPage.Layout = Layout;

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
