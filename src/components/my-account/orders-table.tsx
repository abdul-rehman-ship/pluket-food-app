import { motion } from "framer-motion";
import { fadeInTop } from "@utils/motion/fade-in-top";
import Link from "@components/ui/link";
import { useWindowSize } from "@utils/use-window-size";
import { useTranslation } from "next-i18next";
import {useEffect,useState} from 'react'
import axios from "axios";
import Cookies from 'js-cookie'
const OrdersTable: React.FC = () => {
	const { width } = useWindowSize();
	const { t } = useTranslation("common");
	const [orders,setOrders]:any=useState([])
	const [products,setProducts]:any=useState([])
	useEffect(()=>{
		if(products.length===0){
		getOrders()
		getProducts()
			
		}
		
	},[])
	const getOrders=async ()=>{

		try {
			axios.post('/api/orders',{
				userEmail:Cookies.get('email')
			}).then(res=>{
				setOrders(res.data.orders)
			}).catch(err=>{
				console.log(err);
				
			})
			
		} catch (error:any) {
			console.log(error)

			
		}
	}
	const getProducts = async () => {
		try {
		  const res = await fetch("/api/AllProducts");
		  const data = await res.json();
		  
		  
		  setProducts(data.products);
		  
		} catch (error) {
		  console.log(error);
		  
		}
	  };
	return (
		<>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
				{t("text-orders")}
			</h2>
			<motion.div
				layout
				initial="from"
				animate="to"
				exit="from"
				//@ts-ignore
				variants={fadeInTop(0.35)}
				className={`w-full flex flex-col`}
			>
				{width >= 1025 ? (
					<table>
						<thead className="text-sm lg:text-base">
							<tr>
								
								<th className="bg-gray-100 p-4 text-heading font-semibold text-start lg:text-center">
									{t("text-date")}
								</th>
								<th className="bg-gray-100 p-4 text-heading font-semibold text-center lg:text-center		 last:rounded-te-md">
									{t("text-product")}
								</th>
								<th className="bg-gray-100 p-4 text-heading font-semibold text-start lg:text-center">
									{t("shipping Address")}
								</th>
								<th className="bg-gray-100 p-4 text-heading font-semibold text-start lg:text-center">
									{t("text-status")}
								</th>
								<th className="bg-gray-100 p-4 text-heading font-semibold text-start lg:text-center">
									{t("text-total")}
								</th>
								<th className="bg-gray-100 p-4 text-heading font-semibold text-start lg:text-center last:rounded-te-md">
									{t("quantity")}
								</th>
								
							</tr>
						</thead>
						<tbody className="text-sm lg:text-base">
							{orders.map((order:any) => {
									return <tr key={order._id} className="border-b border-gray-300 last:border-b-0">
									<td className="px-4 py-5 text-start">
										<Link
											href="#"
											className="underline hover:no-underline text-body"
										>
											{order.date}
										</Link>
									</td>
									<td className="text-end px-4 py-5 text-heading">
										{products.map((prod:any)=>{
											return  prod._id===order.productId && prod.shoeName
										})}
									</td>
									<td className="text-start lg:text-center px-4 py-5 text-heading">
										{order.shippingAddress}
									</td>
									<td className="text-start lg:text-center px-4 py-5 text-heading">
										{order.paid_status}
									</td>
									<td className="text-start lg:text-center px-4 py-5 text-heading">
										{order.total}$
									</td>
									<td className="text-start lg:text-center px-4 py-5 text-heading">
										{order.total / order.amount}
									</td>
									
								</tr>
							})}
							
							
						</tbody>
					</table>
				) : (
					<div className="w-full space-y-4">
						{orders.map((order:any)=>{
							return <ul key={order._id} className="text-sm font-semibold text-heading border border-gray-300 rounded-md flex flex-col px-4 pt-5 pb-6 space-y-5">
							<li className="flex items-center justify-between">
								{t("text-date")}
								<span className="font-normal">
									<Link
										href="#"
										className="underline hover:no-underline text-body"
									>
									{order.date}
									</Link>
								</span>
							</li>
							<li className="flex items-center justify-between">
								{t("product")}
								<span className="font-normal">{products.map((prod:any)=>{
											return  prod._id===order.productId && prod.shoeName
										})}</span>
							</li>
							<li className="flex items-center justify-between">
								{t("shippingAddress")}
							
							
								<span className="font-normal">{order.shippingAddress}</span>
							</li>

							<li className="flex items-center justify-between">
								{t("text-status")}
								<span className="font-normal">{order.paid_status}</span>
							</li>


							<li className="flex items-center justify-between">
								{t("text-total")}
								<span className="font-normal">{order.total}</span>
							</li>
							<li className="flex items-center justify-between">
								{t("quantity")}
								<span className="font-normal">
								{order.total / order.amount}
								</span>
							</li>
						</ul>
						})}
						
						
					</div>
				)}
			</motion.div>
		</>
	);
};

export default OrdersTable;
