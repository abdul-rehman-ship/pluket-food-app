import React, { useEffect,useState } from 'react'

import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import JsCookie from 'js-cookie'
import { useRouter } from 'next/router'


import VendorNavbar from '../components/adminNavbar';




function VendorCustomers() {
    
    
    
    
   
    
  
    
  const [customers, setCustomers]: any = useState([]);
  const [products,setProducts]:any=useState([])
  const router=useRouter()
  const getData = async () => {
    let arr: any = [];
   const res=await fetch('/api/orders',{
    method:"GET"
   })
   const data=await res.json()
   const orders=data.orders
   arr=orders
   const res2=await fetch('/api/AllProducts',{
    method:"GET"
   })
   const prods=await res2.json()
   setProducts(prods.products)
   
    arr.reverse()    
    await setCustomers(arr);
    
  };
  

    useEffect(()=>{
      if(JsCookie.get("admin_key")==="admin"){
        if(customers.length===0){
          getData()
          

        }

      }else{
        router.push("/")
      }
      
    })
   

    const handleClick=(id:any)=>{
        // dispatch(setCustomerEmail(email))
        // router.push(`/VendorCustomerDashboard`)
        console.log(id)
        
  }


  return (<>
    <VendorNavbar/>
    







    <div className="container  mt-5 pt-5">
     
    
      
        <div className='row mb-4'>



</div>
        <Table striped bordered hover responsive>
      <thead  className={style.table_head}>
        <tr>
          
          <th>Product Name</th>
          <th>Customer Email</th>
          <th>Shipping Address</th>

          <th>Total</th>
          <th>Quantity</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

      return  <tr onClick={()=>handleClick(customer.id)}  key={index}>

            <td  >{products.map((i:any)=>{
                if(i._id===customer.productId){
                  return i.shoeName
                }
            })}</td>
            <td>{customer.userEmail}</td>
            <td>{customer.shippingAddress}</td>


            <td  >{customer.total}$</td>
            <td  >{(customer.total)/customer.amount}</td>

            
            <td>{customer.paid_status}</td>


            
            
            <td >

   {customer.quantity}


            </td>

          
            


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
    </>


    
  )
}

export default VendorCustomers