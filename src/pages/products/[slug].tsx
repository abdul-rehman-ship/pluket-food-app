import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import ProductSingleDetails from "@components/product/product-single-details";

import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";
import React, { useState ,useEffect} from "react";
import { useRouter } from "next/router";

export default function ProductPage() {

	const[product,setProduct]:any=useState({})

	const {
		query: { slug },
	} = useRouter();
	const getProduct = async () => {
		//use axois to get product with id in body

		 axios.post("/api/AllProducts", {
			id: slug,
		}).then((res:any)=>{
			setProduct(res.data.products)
			
		})
		
		
	}
useEffect(()=>{
	if(Object.entries(product).length===0){
		getProduct()

	}
},[product])
	return (
		<>
			<Divider className="mb-0" />
			<Container>
				<div className="pt-8">
					<Breadcrumb />
				</div>
				<ProductSingleDetails product={product}/>
				
				

			</Container>
		</>
	);
}

ProductPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => {
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
