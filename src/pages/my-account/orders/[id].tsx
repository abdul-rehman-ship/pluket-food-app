import Layout from "@components/layout/layout";
import AccountLayout from "@components/my-account/account-layout";
import OrderDetails from "@components/order/order-details";
import { useUI } from "@contexts/ui.context";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { db } from "firebase";
import { useEffect,useState } from "react";

export default function OrderPage() {

	const router = useRouter();
	const [order,setOrder]:any=useState({})
	const { id } = router.query;
	const {isAuthorized}=useUI();
	if(!isAuthorized){
		return <div>Not Authorized</div>
	}
	const getOrder=async()=>{
		await getDocs(collection(db,'orders')).then((querySnapshot:any) => {
			querySnapshot.forEach((doc:any) => {
				if(doc.id===id){
					setOrder(doc.data())
				}
			});
		})
	}
	useEffect(() => {
		if(order.quantity){
			getOrder()
		}
	})
	return (
		<AccountLayout>
			<OrderDetails className="p-0" />
		</AccountLayout>
	);
}

OrderPage.Layout = Layout;
