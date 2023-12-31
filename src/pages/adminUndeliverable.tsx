import React, { useEffect,useState } from 'react'

import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import JsCookie from 'js-cookie'
import Router from 'next/router';
import Link from 'next/link';


import VendorNavbar from '../components/adminNavbar';
import { getDocs,collection } from 'firebase/firestore';
import { db } from '../../firebase';
import  { Toaster } from 'react-hot-toast';




function VendorCustomers() {
    
    
    
    
   
    
  
    
  const [customers, setCustomers]: any = useState([]);



  
  const getData = async () => {
    let arr: any = [];
   await getDocs(collection(db, "orders")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().status==="not deliverable"){
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
<button className='text-maroon btn bg-olive font-bold'> Un Deliverable</button>


</div>
<div className="table-responsive">
        <Table  bordered className='border shadow-sm' responsive hover>
      <thead  className={style.table_head}>
        <tr>    
   
          
          <th>Name </th>
          
         
          {/* <th>Quantity</th> */}
          <th>Status</th>
          <th>Location</th>
          <th>Reason</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

     return <tr key={index} className='py-4'>
          {/* <td>{customer.date +","+ customer.time }</td>
          <td>{customer.date2 +","+ customer.time2 }</td>
           */}
          {/* <td>{customer.id}</td> */}
          <td>{customer.product.name}</td>
          {/* <td>{customer.total}</td> */}
          {/* <td>{customer.total/customer.amount}</td> */}
          <td className='alert alert-primary font-semibold'  >{customer.paid_status?customer.paid_status==="scan and pay"?"not paid":customer.paid_status==="cash on delivery"?"not paid":customer.paid_status:""}</td>
         <td>
         <Link href={`https://www.google.com/maps/search/?api=1&query=${customer.lat},${customer.lng}`}>
                <a target="_blank" rel="noopener noreferrer">View on Google Maps</a>
              </Link>
         </td>
<td>{customer?.reason}</td>
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