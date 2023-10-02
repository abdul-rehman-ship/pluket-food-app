
import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Divider from "@components/ui/divider";
import ProductsFeatured from "@containers/products-featured";
import JsCookie from 'js-cookie'

import { serverSideTranslations } from "next-i18next/serverSideTranslations";


export default function Home() {
	JsCookie.remove("admin_key")
	return (
		<>

			
			<Container>
	
		
				<ProductsFeatured sectionHeading="text-featured-products" type="all" />
				
			</Container>
			<Divider className="mb-0" />
		</>
	);
}

Home.Layout = Layout;

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
