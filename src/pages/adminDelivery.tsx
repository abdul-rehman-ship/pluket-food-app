import React, { useEffect,useState } from 'react'

import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import JsCookie from 'js-cookie'
import Router from 'next/router';


import VendorNavbar from '../components/adminNavbar';
import { getDocs,collection, updateDoc,doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import toast, { Toaster } from 'react-hot-toast';




function VendorCustomers() {
    
    
    
    
   
    
  
    
  const [customers, setCustomers]: any = useState([]);
  
  
  const getData = async () => {
    let arr: any = [];
   await getDocs(collection(db, "orders")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().status==="completed"){
          const date = doc.data().createdAt.toDate();
          const formattedDate = date.toLocaleString();
     
          const date2 = doc.data().updatedAt.toDate();
          const formattedDate2 = date2.toLocaleString();
        
          arr.push({id:doc.id,...doc.data(),date:formattedDate.split(",")[0],
          time:formattedDate.split(",")[1],
        time2:formattedDate2.split(",")[1],
        date2:formattedDate2.split(",")[0]
        });

        }
      });
    
   })
    arr.reverse()    
    await setCustomers(arr);
    
  };
  const completeOrder=async(id:any)=>{
    toast.loading("Completing order...")
await updateDoc(doc(db, "orders", id), {
    status: "delivered",
    deliveredAt:serverTimestamp()
  }).then(()=>{
toast.dismiss()
      toast.dismiss()


    getData()
})
toast.dismiss()

  }
  

    useEffect(()=>{
      if(JsCookie.get("admin_key")==="admin"){
        if(customers.length===0){
          getData()
          

        }

      }else{
        Router.push("/admin")
      }
      
    })
   

    const handleClick=(id:any)=>{
        Router.push("/adminOrderDetail?id="+id
        )
        
        
        
  }


  return (<>
    <VendorNavbar/>
    







    <div className="container  mt-5 pt-5">
     
    
      <Toaster/>
        <div className=' mb-4'>
<button className='text-maroon btn bg-olive font-bold'> Delivery</button>


</div>
<div className="table-responsive">
        <Table  bordered className='border shadow-sm' responsive hover>
      <thead  className={style.table_head}>
        <tr>    
        <th>Kitchen in</th>
        <th>Kitchen out</th>
          
          <th>Id</th>
          <th>Name </th>
          <th> Total</th>
         
          <th>Quantity</th>
          <th>Status</th>
          <th>Mark as</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

     return <tr key={index} className='py-4'>
          <td>{customer.date +","+ customer.time }</td>
          <td>{customer.date2 +","+ customer.time2 }</td>
          
          <td>{customer.id}</td>
          <td>{customer.product.name}</td>
          <td>{customer.total}</td>
          <td>{customer.total/customer.amount}</td>
          <td className='alert alert-primary font-semibold'  >{customer.paid_status?customer.paid_status==="scan and pay"?"scan on delivery":customer.paid_status:""}</td>
          <td className='flex gap-2'><button onClick={()=>completeOrder(customer.id)} className='btn btn-success'>Delivered</button> </td>
          <td><button className='btn btn-secondary' onClick={()=>handleClick(customer.id)}>View</button></td>
        </tr>
        
      
     
    }
    
    )

:<tr><td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
<td>....</td>
<td>....</td>

</tr>}
       
      </tbody>
    </Table>
            
            </div>
        </div>
    </>


    
  )
}

export default VendorCustomers