import React, { useEffect,useState } from 'react'

import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import JsCookie from 'js-cookie'
import Router from 'next/router';


import VendorNavbar from '../components/adminNavbar';
import { getDocs,collection } from 'firebase/firestore';
import { db } from '../../firebase';
import  { Toaster } from 'react-hot-toast';




function VendorCustomers() {
    
    
    
    
   
    
  
    
  const [customers, setCustomers]: any = useState([]);
  const [users,setUser]:any=useState([])
  
  const getData = async () => {
    let arr: any = [];
   await getDocs(collection(db, "orders")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().status==="delivered"){
          const date = doc.data().createdAt.toDate();
          const formattedDate = date.toLocaleString();
     
          const date2 = doc.data().updatedAt.toDate();
          const formattedDate2 = date2.toLocaleString();
          
          const date3 = doc.data().deliveredAt.toDate();
          const formattedDate3 = date3.toLocaleString();
          
        
          arr.push({id:doc.id,...doc.data(),date:formattedDate.split(",")[0],
          time:formattedDate.split(",")[1],
        time2:formattedDate2.split(",")[1],
        date2:formattedDate2.split(",")[0],
        time3:formattedDate3.split(",")[1],
        date3:formattedDate3.split(",")[0]
        });

        }
      });
    
   })
    arr.reverse()    
    await setCustomers(arr);
    
  };
const getUsers=async()=>{
  let arr:any=[]
  await getDocs(collection(db, "users")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      arr.push({id:doc.id,...doc.data()});
    });
  
 })
  arr.reverse()    
  await setUser(arr);
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
<button className='text-maroon btn bg-olive font-bold'> Delivered</button>


</div>
<div className="table-responsive">
        <Table  bordered className='border shadow-sm' responsive hover>
      <thead  className={style.table_head}>
        <tr>    
        <th>Referrer Logo</th>
        <th>Name </th>

        <th>Kitchen in</th>
        <th>Kitchen out</th>
        <th>Delivered </th>
        <th>Delivered By </th>


          
          <th>Id</th>
          <th> Total</th>
         
          
          <th>Status</th>

          
          <th></th>
        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

     return <tr key={index} className='py-4'>
          <td>
            {
              users.map((user:any)=>{
                if(user.email===customer.userEmail && user.referrer==="yes"){
                  return user.logo && <img src={user.logo} key={user.id + new Date()} alt="logo" className='rounded-circle' style={{width:"50px",height:"50px"}}/>

                }
              })
            }
          </td>
          <td>{
            
            
              users.map((user:any)=>{
                if(user.email===customer.userEmail ){
                  return user.name
                 }
              })
            
            }</td>

          <td>{customer.date +","+ customer.time }</td>
          <td>{customer.date2 +","+ customer.time2 }</td>
          <td>{customer.date3 +","+ customer.time3 }</td>

          <td>{customer?.deliveredBy}</td>
          <td>{customer.id}</td>
          <td>{customer.total}</td>
          
          <td className='alert alert-primary font-semibold'  >{customer?.payment_type?customer?.payment_type==="failedPayment"?"failedPayment":`paid by ${customer?.payment_type}`:""}</td>
          
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