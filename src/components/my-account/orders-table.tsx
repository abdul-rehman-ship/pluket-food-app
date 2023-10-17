import { motion } from "framer-motion";
import { fadeInTop } from "@utils/motion/fade-in-top";

import { useTranslation } from "next-i18next";
import {useEffect,useState} from 'react'

import Cookies from 'js-cookie'
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebase";

const OrdersTable: React.FC = () => {
	
	const { t } = useTranslation("common");
	const [orders,setOrders]:any=useState([])
	
	useEffect(()=>{
		if(orders.length===0){
		getOrders()
		getProducts()
			
		}
		
	},[])
	const getOrders=async ()=>{
let arr:any=[]
		try {
			const res=await getDocs(collection(db,'orders'))
			res.forEach((doc:any)=>{
				 if(doc.data().userEmail===Cookies.get('email')){
						arr.push({id:doc.id,...doc.data()})
						
					}
				
			})
			setOrders(arr)
		} catch (error:any) {
			console.log(error)

			
		}
	}
	const getProducts = async () => {
		
	  };
	return (
		<>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-olive mb-6 xl:mb-8">
				{t("text-orders")}
			</h2>
			<motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      //@ts-ignore
      variants={fadeInTop(0.35)}
      className="w-full flex flex-col p-4"
    >
      {orders.map((order:any) => (
      <div key={order.id} className="border bg-olive rounded-md p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
	  <div className="md:col-span-1 flex justify-center md:justify-start">
		<img
		  src={order.product?.image}
		  alt="image"
		  className="rounded-md max-w-full"
		/>
	  </div>
	  <div className="md:col-span-2 flex flex-col justify-between">
		<div>
		  <h2 className="text-white mb-2">
			ID # <span className="font-bold text-maroon">{order.id}</span>
		  </h2>
		  <h2 className="text-white mb-2">
			Product name : <span className="font-bold text-maroon">{order.product?.name}</span>
		  </h2>
		  <h2 className="text-white mb-2">
			Quantity : <span className="font-bold text-maroon">{order.total / order.amount}</span>
		  </h2>
		  <h2 className="text-white mb-2">
			Total : <span className="font-bold text-maroon">THB {order.total}</span>
		  </h2>
		</div>
		<div>
		  <h2 className="text-white mb-2">
			Address : <span className="font-bold text-maroon">
			  {order.shippingAddress ? order.shippingAddress : order.user ? order.user.address : ""}
			</span>
		  </h2>
		  <h2 className="text-white mb-2">
			Payment : <span className="font-bold text-maroon">{order.paid_status}</span>
		  </h2>
		  <h2 className="text-white mb-2">
			Status : <span className="font-bold text-maroon">{order.status}</span>
		  </h2>
		  {
			order.product?.size? <h2 className="text-white mb-2">
			Size : <span className="font-bold text-maroon">{order.product.size}</span>
		  </h2>
		  :null
		  }
		</div>
		
	  </div>
	
	</div>
      ))}
    </motion.div>
		</>
	);
};

export default OrdersTable;
