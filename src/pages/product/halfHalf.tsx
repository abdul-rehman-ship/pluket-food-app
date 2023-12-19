import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import ProductSingleDetails from "@components/product/product-half-details";
import { getDocs,collection } from 'firebase/firestore'
import { db } from '../../../firebase'
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import React, { useState ,useEffect} from "react";
import Cookies from "js-cookie";


export default function ProductPage() {

	const[product1,setProduct1]:any=useState({})
	const[product2,setProduct2]:any=useState({})

    const [products,setProducts]:any=useState([])
	
	const getProduct = async () => {
		
			  
        const data = await getDocs(collection(db, "products"));
        let arr:any=[]
        data.forEach((doc: any) => {
            arr.push({id:doc.id,...doc.data()})
            if(doc.id===Cookies.get('firstHalfProduct')){
                const prod={id:doc.id,...doc.data()}
                setProduct1(prod)
            }else if(doc.id===Cookies.get('secondHalfProduct')){
                const prod={id:doc.id,...doc.data()}
                setProduct2(prod)
            }
            
            
            
              
              
    
        
          
        });
        if(product1.name && product2.name){
            let name="Half "+product1.name+" - Half "+product2.name
            setProduct1({...product1,name:name})
            Cookies.set('title',name)
        }
    
    
    
        setProducts(arr)
                
              
              
              
	
		  
		  
		 
		  
		
		
	}
    useEffect(() => {
        if(products.length===0){
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
				{product1 &&<ProductSingleDetails product={product1} />}
				
				
				

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
