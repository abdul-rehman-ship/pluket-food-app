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
  const  [users,setUsers]:any=useState([])
  
  
  // const getData = async () => {
  //   let arr: any = [];
  //  await getDocs(collection(db, "orders")).then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       if(doc.data().status==="pending"){
  //         const date = doc.data().createdAt.toDate();
  //         const formattedDate = date.toLocaleString();
     
        
        
  //         arr.push({id:doc.id,...doc.data(),date:formattedDate.split(",")[0],time:formattedDate.split(",")[1]});

  //       }
  //     });
    
  //  })
  //   arr.reverse()    
  //   await setCustomers(arr);
    
  // };
  
  const getUsers=async()=>{
  await getDocs(collection(db, "users")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUsers((prev:any)=>[...prev,{id:doc.id,...doc.data()}])
      });

  })

  }
  const getData = async () => {
  const ordersByCustomer:any = {}; // Create an object to group orders by customer email
  await getDocs(collection(db, "orders")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.data().status === "pending") {
        const date = doc.data().createdAt.toDate();
        const formattedDate = date.toLocaleString();
        const customerEmail = doc.data().userEmail; // Assuming this is how you identify customers

        const order = {
          id: doc.id,
          ...doc.data(),
          date: formattedDate.split(",")[0],
          time: formattedDate.split(",")[1],
        };

        // Check if there's an array for this customer, if not create one
        if (!ordersByCustomer[customerEmail]) {
          ordersByCustomer[customerEmail] = [];
        }

        ordersByCustomer[customerEmail].push(order);
      }
    });
  });

  // Transform the grouped orders into an array of customers
  const customers = Object.entries(ordersByCustomer).map(([customerEmail, orders]) => ({
    email: customerEmail,
    orders,
  }));

  // Sort customers by email (if needed)
  customers.sort((a, b) => a.email.localeCompare(b.email));

  await setCustomers(customers);
  
  
};


  const completeOrder=async(id:any)=>{
    toast.loading("Completing order...")
await updateDoc(doc(db, "orders", id), {
    status: "completed",
    updatedAt:serverTimestamp()
  }).then(()=>{
toast.dismiss()
      toast.dismiss()


    getData()
})
toast.dismiss()

  }
  const rejectOrder=async(id:any)=>{
    toast.loading("Rejecting order...")
    await updateDoc(doc(db, "orders", id), {
      status: "rejected",
      updatedAt:serverTimestamp()
    }).then(()=>{
      toast.dismiss()
      getData()
  })
  toast.dismiss()

  }

    useEffect(()=>{
      if(JsCookie.get("admin_key")==="admin"){
        if(customers.length===0){
          getData()
          getUsers()
          

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
<button className='text-maroon btn bg-olive font-bold'>In Kitchen</button>


</div>
<div className="table-responsive">
        {/* <Table  bordered className='border shadow-sm' responsive hover>
      <thead  className={style.table_head}>
        <tr>    
        <th>Time in</th>
          
          
          <th>Product </th>
          
         
          <th>Quantity</th>
          <th>Variations</th>
          <th>Mark as</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

     return <tr key={index} className='py-4'>
          <td>{customer.date +","+ customer.time }</td>
          
          
          <td>{customer.product.name}</td>
          
          <td>{customer.total/customer.amount}</td>
          <td></td>
          <td className='alert alert-primary font-semibold'  >{customer.paid_status?customer.paid_status==="scan and pay"?"scan on delivery":customer.paid_status:""}</td>
          <td className='flex gap-2'><button onClick={()=>completeOrder(customer.id)} className='btn btn-success'>Completed</button> <button onClick={()=>rejectOrder(customer.id)} className='btn btn-danger'>Cancelled</button></td>
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
             */}
             {
              customers.map((customer: any, index: number) => (
  <div key={index} className='my-2'>
    <h2 className='my-2'> {
      users.map((user:any)=>{
        if(user.email===customer.email){
          return ` Customer Name  :   ${user.name} ,  Email : ${customer.email}   `
        }
      })
    }</h2>
    <Table  bordered className='border shadow-sm' responsive hover>
      <thead className={style.table_head}>
        <tr>
          <th>Date & Time</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Variations</th>
          <th>Actions</th>
          <th>View</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {customer.orders.map((order: any, orderIndex: number) => (
          <tr key={orderIndex} className='py-4'>
            <td>{order.date + ',' + order.time}</td>
            <td>{order.product.name}</td>
            <td>{order.total / order.amount}</td>
            <td>
              {
                Object.entries(order?.product?.selectedVariations)
    .filter(([_, isSelected]) => isSelected)
    .map(([variationName]) => variationName)
    .join(', ')
              }
            </td>
            {/* <td className='alert alert-primary font-semibold'>
              {order.paid_status
                ? order.paid_status === 'scan and pay'
                  ? 'scan on delivery'
                  : order.paid_status
                : ''}
            </td> */}
            <td className='flex gap-2'>
              <button onClick={() => completeOrder(order.id)} className='btn btn-success'>
                Completed
              </button>
              <button onClick={() => rejectOrder(order.id)} className='btn btn-danger'>
                Cancelled
              </button>
            </td>
            <td>
              <button className='btn btn-secondary' onClick={() => handleClick(order.id)}>
                View
              </button>
            </td>
            <td>{order?.note?order.note:""}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
))

             }
            </div>
        </div>
    </>


    
  )
}

export default VendorCustomers