import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import ProductSingleDetails from "@components/product/product-single-details";
import { getDocs,collection } from 'firebase/firestore'
import { db } from '../../../firebase'
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import React, { useState ,useEffect} from "react";
import { useRouter } from "next/router";

export default function ProductPage() {

	const[product,setProduct]:any=useState([])

	const {
		query: { slug },
	} = useRouter();
	const getProduct = async () => {
		//use axois to get product with id in body
		let arr: any = {};
		const data = await getDocs(collection(db, "products"));

		data.forEach((doc: any) => {
			
			
		  if(doc.id===slug){
			
			const prod={id:doc.id,...doc.data()}
			
			
			arr=prod
			  
			  
	
		  
		  }
		 
		  
		});
	
		setProduct(arr)
		
	}
useEffect(()=>{
	if(product.length===0){
		getProduct()
	}
	
})
	return (
		<>
		<div className="p-4"> 
			<Divider className="mb-0" />
			<Container>
				<div className="pt-8">
					<Breadcrumb />
				</div>
				<ProductSingleDetails product={product} />
				
				
				

			</Container>
			</div>
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
