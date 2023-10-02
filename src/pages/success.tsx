import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import axios from "axios"



import { fetcher, shootFireworks } from '../lib/utils';
import Link from 'next/link';

import {toast ,Toaster} from "react-hot-toast"

import Cookies from 'js-cookie';



const Success = () => {
  const {
    query: { session_id },
  } = useRouter();





  const { data } = useSWR(
    () => `/api/checkout_sessions/${session_id}`,
    fetcher
  );
if(data){
  const dd:any=Cookies.get("data")
  const items = JSON.parse(decodeURIComponent(dd))
  const userEmail= Cookies.get('email');
		if(userEmail){
			toast.loading("Placing Order...");
			try {items.map(async (item:any)=>{
  const _id=new Date().getTime().toString() + item.id
  const quan:any=item.quantity

  await axios.post('/api/updateProduct',{
    _id:item.id,
    stock:item.stock-quan

  })
				await axios.post('/api/orders/addOrder',{
					_id,
					userEmail,
					productId:item.id,
					amount:item.price,
					total:item.itemTotal,
					date:new Date().toDateString(),
					paymentMethod:"stripe payment",
					shippingAddress:Cookies.get('address'),
					paid_status:"paid"
				}).then(()=>{
					toast.dismiss()
          toast.success("Order Placed Successfully");
				})
			})
			
			} catch (error) {
		toast.error("Something went wrong");
			}
			
		}else{
			toast.error("Please Login First");
		}
}
 
  useEffect(() => {
 
      shootFireworks();
    
  });

  return (
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6 text-center">
      <Toaster/>
      <>
 <h2 className="text-4xl font-semibold flex flex-col items-center space-x-1">
            
            <span>Thanks for your order!</span>
          </h2>
          
          <p className="text-lg mt-3">Your order is placed. back to home <Link href='/'>Click here</Link></p>
        
            </>
    </div>
  );
};

export default Success;