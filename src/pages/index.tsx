
import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Divider from "@components/ui/divider";
import ProductsFeatured from "@containers/products-featured";
import JsCookie from 'js-cookie'
import PromotionFeatured from "@containers/promotions-featured";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Toaster } from "react-hot-toast";
import OpeningHoursButton from '../components/scedule';
import { useUI } from "@contexts/ui.context";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Router from "next/router";
export default function Home() {
	JsCookie.remove("admin_key")
	// Example initial center coordinates
	const {isAuthorized}	= useUI()
	const [user,setUser]:any=useState({})
	const router=useRouter()
	const {login}=router.query
	if(login==="yes"){
		Router.replace("/")
	}


	const getUser=async()=>{
		getDocs(collection(db, "users")).then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if(doc.data().email===Cookies.get("email")){
					setUser(doc.data())
				}
			});
		})
	}
	useEffect(() => {
		if(isAuthorized || !user.email){
			getUser()

		}
	})

	return (
		<>

			
			<Container>
				<Toaster/>
				<OpeningHoursButton />
			<div className=" p-0 m-0" style={{background:"#6630BCFF"}}>
			<div className="row g-0 lg-h-[70vh] md-h-auto sm-h-auto">
  <div className="col-12  showcase-img text-center">
    <img
      src="/assets/images/Web-App-Banner-1.png"
      alt="Pizza Image"
      className=" w-100"

    />
  </div>
</div>

</div>






				<ProductsFeatured sectionHeading="text-featured-products" type="some" />
				<PromotionFeatured sectionHeading="text-featured-products" type="all"/>
				{/* <Map initialCenter={initialCenter} />
				 */}

<div className="h-auto mt-4 mb-4 flex flex-col justify-center items-center">
      {/* Location Heading */}
    
	  <h1 className="text-3xl font-bold text-olive italic  underline" >Location</h1>


      {/* Address */}
      <p className="text-lg md:text-xl text-olive lg:text-2xl text-center mt-2 mb-2">
	  5, 1-2 Sirirat Road, Patong, Kathu, Phuket, TH: 83150
      </p>

      {/* Phone Number */}
      <p className="text-lg md:text-xl text-olive mb-2 lg:text-2xl text-center">
        Phone OR Whatsapp:  +66 0 929967091 
      </p>
    </div>
				   <iframe
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3952.145723773198!2d98.2931514!3d7.879817599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwNTInNDcuMyJOIDk4wrAxNyczNS40IkU!5e0!3m2!1sen!2s!4v1696765993838!5m2!1sen!2s"
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

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
