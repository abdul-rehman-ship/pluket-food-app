import React, { useEffect ,useState} from 'react'
import Link from 'next/link'
import { getDocs,collection } from 'firebase/firestore'
import { db } from '../../firebase'
import VendorNavbar from '../components/adminNavbar'
import style from '../styles/vendor.module.css'
import VendorProductItem from '../components/VendorProductItem'

import JsCookie from 'js-cookie'
import { useRouter } from 'next/router'

export default function VendorDashboard() {
    
    
  const [products,setProducts]=useState([])
  const [allProducts,setAllProducts]=useState([])
  const [searchString,setSearchString]=useState("")

   const router=useRouter()
  
   const getData = async () => {
   
    let arr: any = [];
    const data = await getDocs(collection(db, "products"));
    data.forEach((doc: any) => {
      if(doc.data()){
        const prod={id:doc.id,...doc.data()}
        arr.push(prod);
          
          

      
      }
     
      
    });
  
   
          
         setProducts(arr)
         setAllProducts(arr)
   
  };
  
   
  


  const onSearchChange=async(e:any)=>{
    setSearchString(e.target.value)
    if(e.target.value===""){
      setProducts(allProducts)
    }
    
  
  }
const filter=async()=>{
  setProducts([])
  let arr:any=[]
  allProducts.forEach((product:any)=>{
    

    if(product.name.toLowerCase().includes(searchString.toLowerCase())){
      arr.push(product)
      
    }

  })
  
  setProducts(arr)
  

}
    
  

    useEffect(() => {
      

      if(JsCookie.get("admin_key")==="admin"){
        if(products.length===0){
          getData()

        }

      }else{
        router.push("/admin")
      }
        


    })
  
   
    
     
    


  return (
    <>
    
    
    <VendorNavbar/>

    
    <div className={`container mt-4 pt-0 `}>

 
    <div className="row mt-4 mb-3  d-flex justify-content-end" >
           
           <Link href={"adminAddNewProduct"} ><button className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`} >

<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{width:'20px',height:'20px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
</svg>    Add New Product 
</button></Link>
            
        </div>
        <div className='row mb-4'>

<div className="input-group">
  <div className="form-outline">
    <input type="search"  name="search" value={searchString} onChange={onSearchChange} className="form-control"  placeholder='search ...'/>
    
  </div>
  <button type="button" onClick={filter} className={`btn ${style.search_btn}`} >
search
  </button>
</div>

</div>

<div className="row">
{
  products.length>0?

  products.map((product:any)=>{
   return <VendorProductItem probs={product} key={product.id}/>
  })
 
  
  :''
}

</div>
    </div>

    

    






    </>
  )
}
