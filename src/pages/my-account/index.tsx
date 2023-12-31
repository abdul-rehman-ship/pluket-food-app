import Link from "@components/ui/link";
import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import { ROUTES } from "@utils/routes";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useUI } from "@contexts/ui.context";

export default function AccountPage() {
	const { t } = useTranslation("common");
const {isAuthorized}=useUI();
if(!isAuthorized){
	return <div className="text-olive m-4">
		Please login to see this page</div>
}
	return (
		<AccountLayout>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-olive mb-3 xl:mb-5">
				{t("text-dashboard")}
			</h2>
			<p className=" text-olive text-sm leading-7 md:text-base md:leading-loose lowercase">
				{t("text-account-dashboard")}{" "}
				<Link
					href={ROUTES.ORDERS}
					className="text-olive underline font-semibold"
				>
					{t("text-recent-orders")}
				</Link>
				, {t("text-manage-your")}{" "}
				<Link
					href={ROUTES.ACCOUNT_DETAILS}
					className="text-olive underline font-semibold"
				>
					{t("text-account-details")}
				</Link>{" "}
				{t("text-and")}{" "}
				<Link
					href={ROUTES.CHANGE_PASSWORD}
					className="text-olive underline font-semibold"
				>
					{t("text-change-your-password")}
				</Link>
				.
			</p>
		</AccountLayout>
	);
}

AccountPage.Layout = Layout;

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
