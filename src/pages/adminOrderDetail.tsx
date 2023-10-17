import { getDocs,collection } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';

import Link from 'next/link';
const OrderDetail: React.FC = () => {
  const router = useRouter();
  const  id  = router.query.id;
  
  
  const [order, setOrder]:any = useState(null);
 
  
  const [googleMapsLink,setGoogleMapsLink]:any=useState('')

  const [user,setUser]:any=useState(null)
  const [variations,setVariations]:any=useState(null)
const getOrder=async()=>{
    let email:any=''
    await getDocs(collection(db, "orders")).then((querySnapshot:any) => {
        querySnapshot.forEach((doc:any) => {
            if(doc.id===id){
             
                email=doc.data().userEmail
                const date = doc.data().createdAt.toDate();
                const formattedDate = date.toLocaleString();
                setOrder({id:doc.id,...doc.data(),date:formattedDate.split(",")[0],time:formattedDate.split(",")[1]});
                setVariations(doc.data().product.selectedVariations)
                setGoogleMapsLink(`https://www.google.com/maps/search/?api=1&query=${doc.data().lat},${doc.data().lng}`)

            }
        })
    })

    await getDocs(collection(db, "users")).then((querySnapshot:any) => {
        querySnapshot.forEach((doc:any) => {
            if(doc.data().email===email){
                setUser(doc.data())
            }
        })
    })
}
  useEffect(() => {
  if(!order){
getOrder()
  }
  });

 

  return (<>
  {
    order?
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4">Order #{order.id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <div className="bg-white rounded-md shadow-md p-4">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Product:</span>
              <span>{order.product.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Quantity:</span>
              <span>{order.total / order.amount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Total:</span>
              <span>THB {order.total}</span>
            </div>
            <div className="flex justify-between mb-2">
            <span className="font-bold">{variations && "Variations : "}</span>
<span>
  {variations &&
    Object.keys(variations)
      .filter((key) => variations[key])
      .join(', ')}
</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Shipping Address:</span>
              <span>{order.shippingAddress}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Payment :</span>
              <span>{order.paid_status}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Payment Method:</span>
              <span>
  {order.paymentMethod === "scannow" ? "By scanning QR code" :
   order.paymentMethod === "scanlater" ? "Will scan QR on delivery" :
   order.paymentMethod === "whatsapp" ? "whatsapp" :
   order.paymentMethod === "stripe payment" ? "Stripe" : ""}
</span>
            </div>
            {order.paymentMethod === 'scannow' && (
              <div className="flex justify-between mb-2">
                <span className="font-bold">Receipt:</span>
                <img src={order.reciept} alt="receipt" className="max-w-full h-32" />
              </div>
            )}
            <div className="flex justify-between mb-2">
              <span className="font-bold">Status:</span>
              <span>{order.status}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Size</span>
              <span>{order.product.size?order.product.size:"..."}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Date:</span>
              <span>{order.date}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Time:</span>
              <span>{order.time}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Location :</span>
              <Link href={googleMapsLink}>
                <a target="_blank" rel="noopener noreferrer">View on Google Maps</a>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Customer Details</h2>
          <div className="bg-white rounded-md shadow-md p-4">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Name:</span>
              <span>{user?.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Phone:</span>
              <span>{user?.phone}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Address:</span>
              <span>{user?.address}</span>
            </div>
          </div>
        </div>
      </div>
      

    </div>
    :''
  }
  </>
    
  );
};

export default OrderDetail;