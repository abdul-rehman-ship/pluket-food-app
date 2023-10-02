import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import ChangePassword from "@components/my-account/change-password";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUI } from "@contexts/ui.context";

export default function ChangePasswordPage() {
	const {isAuthorized}=useUI();
if(!isAuthorized){
	return <div>Not Authorized</div>
}
	return (
		<AccountLayout>
			<ChangePassword />
		</AccountLayout>
	);
}

ChangePasswordPage.Layout = Layout;

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
