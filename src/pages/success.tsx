import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Router from 'next/router';




import { fetcher, shootFireworks } from '../lib/utils';
import Link from 'next/link';

import {toast ,Toaster} from "react-hot-toast"

import Cookies from 'js-cookie';
import { updateDoc,collection,doc,addDoc, serverTimestamp,getDocs } from 'firebase/firestore';
import { db } from '../../firebase';



const Success = () => {
  const [user,setUser]:any=useState({})
  const [pending,setPendiing]=useState(false)
  const {
    query: { session_id },
  } = useRouter();

const getUser=async()=>{
  const userEmail= Cookies.get('email');
  if(userEmail){
    await getDocs(collection(db, "users")).then((querySnapshot:any) => {
      querySnapshot.forEach((doc:any) => {
        if(doc.data().email===userEmail){
          setUser(doc.data())
        }
      });
    })
  }
}

useEffect(() => {
  if(!user.email){
    getUser()
  }
})

  const { data } = useSWR(
    () => `/api/checkout_sessions/${session_id}`,
    fetcher
  );
const uploadData=async()=>{
  if(data){
    const dd:any=Cookies.get("data")
    let data2= JSON.parse(decodeURIComponent(dd))
    
    
    const items =Object.values(data2);
    
    
    
    
    const userEmail= Cookies.get('email');
      if(userEmail){
        
        try {
          
          items.map(async (item:any)=>{
    
    const quan:any=item.quantity
  
    await updateDoc(doc(db, "products", item.id), {
      stock: item.stock-quan
    })
   
      await addDoc(collection(db, "orders"), {
        userEmail,
        product:item,
        amount:item.price,
        total:item.itemTotal, 
        paymentMethod:"stripe payment",
        shippingAddress:Cookies.get('address')? Cookies.get('address'):"",
        paid_status:"paid",
        lat:Cookies.get('lat'),
        lng:Cookies.get('lng'),
        status:"pending",
        createdAt: serverTimestamp()  
      }).then(()=>{
            toast.dismiss()
            setPendiing(true)
            toast.success("Order Placed Successfully");
            setTimeout(() => {
              Cookies.set("data","")
            Router.push('/')
            },2000)
          }).catch((error:any)=>{
            toast.dismiss()
            console.log(error.message);
          }
          )
        })
        
        } catch (error:any) {
          toast.dismiss()
          console.log(error.message);
          
      toast.error("Something went wrong");
        }
        
      }else{
        toast.dismiss()
        toast.error("Please Login First");
      }
  }
}
 useEffect(() => {
  uploadData()
 },[data])
  useEffect(() => {
 
      shootFireworks();
    
  });

  return (
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6 text-center">
      <Toaster/>
      {pending? <>
 <h2 className="text-4xl font-semibold flex flex-col items-center space-x-1">
            
            <span>Thanks for your order!</span>
          </h2>
          
          <p className="text-lg mt-3">Your order is placed. back to home <Link href='/'>Click here</Link></p>
        
            </>:<h2 className="text-4xl font-semibold flex flex-col items-center space-x-1">
            
            <span>Confirming Order...</span>
          </h2> }
    </div>
  );
};

export default Success;