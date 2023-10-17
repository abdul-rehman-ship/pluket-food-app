import Container from "@components/ui/container";
import Layout from "@components/layout/layout";


import CheckoutForm from "@components/checkout/checkout-form";
import CheckoutCard from "@components/checkout/checkout-card";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useUI } from "@contexts/ui.context";

export default function CheckoutPage() {
	const {isAuthorized}=useUI();
	if(!isAuthorized){
		return <div className="text-olive font-bold">Please Login to see this page</div>
	}
	return (
		<>
			{/* <PageHeader pageHeader="text-page-checkout" /> */}
			<Container>
				<div className="py-14 xl:py-20 px-0 2xl:max-w-screen-2xl xl:max-w-screen-xl mx-auto flex flex-col md:flex-row w-full">
					<div className="md:w-full lg:w-3/5 flex  h-full flex-col -mt-1.5">
						<CheckoutForm />
					</div>

					<div className="md:w-full lg:w-2/5 md:ms-7 lg:ms-10 xl:ms-14 flex flex-col h-full -mt-1.5">
						<CheckoutCard />
					</div>
		
				</div>
				{/* <Subscription /> */}
			</Container>
		</>
	);
}

CheckoutPage.Layout = Layout;

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
