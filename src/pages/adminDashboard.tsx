import React, { useEffect ,useState} from 'react'


import VendorNavbar from '../components/adminNavbar'
import Link from 'next/link'
import style from '../styles/vendor.module.css'
import VendorProductItem from '../components/VendorProductItem'

import JsCookie from 'js-cookie'
import { useRouter } from 'next/router'

export default function VendorDashboard() {
    
    
    const [products,setProducts]=useState([])
    
   const router=useRouter()
  
    
    
  

    useEffect(() => {
      

      if(JsCookie.get("admin_key")==="admin"){
        if(products.length===0){
          getData()

        }

      }else{
        router.push("/")
      }
        


    })
    const getData = async () => {
      
     
      
      
      
    const res=await fetch('/api/AllProducts',{
      method:'GET',
    })
      const data=await res.json()
      const products=data.products;
      
     
     
      setProducts(products)

     
    };
    
     
    


  return (
    <>
    
    
    <VendorNavbar/>

    
    <div className="container mt-4 pt-0">

 
    <div className="row mt-4 mb-3  d-flex justify-content-end" >
           
            
            
        </div>
        <div className='row mb-4'>



</div>

<div className="row">
{
  products.length>0?

  products.map((product:any)=>{
   return <VendorProductItem probs={product} key={product.id}/>
  })
 
  
  :' No product ...'
}

</div>
    </div>

    






    </>
  )
}
