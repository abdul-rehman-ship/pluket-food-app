import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import ForgetPasswordForm from "@components/auth/forget-password-form";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";




export default function SignInPage() {
	
	return (
		<>
			{/* <PageHeader pageHeader="Sign In" /> */}
			<Container>
			
        <ForgetPasswordForm/>
				<div className="py-16 lg:py-20">
					
				</div>
				{/* <Subscription /> */}
			</Container>
		</>
	);
}

SignInPage.Layout = Layout;

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
