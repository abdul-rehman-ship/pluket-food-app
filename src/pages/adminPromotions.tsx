import React, { useEffect ,useState} from 'react'
import Link from 'next/link'
import { getDocs,collection,doc,deleteDoc } from 'firebase/firestore'
import { toast, Toaster } from "react-hot-toast";

import { db } from '../../firebase'
import VendorNavbar from '../components/adminNavbar'
import style from '../styles/vendor.module.css'

import JsCookie from 'js-cookie'
import { useRouter } from 'next/router'

export default function VendorDashboard() {
    
    
  const [products,setProducts]=useState([])
  const [allProducts,setAllProducts]=useState([])
  const [searchString,setSearchString]=useState("")

   const router=useRouter()
  
   const getData = async () => {
   
    let arr: any = [];
    const data = await getDocs(collection(db, "promotions"));
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
  
   
    
     
    
const deletePromotion=async(id:any)=>{
    try{
        await deleteDoc(doc(db, "promotions", id));
        toast.success("promotion deleted successfully");
        getData()
    }
    catch(error:any){
        toast.error(error.message)
    }


    }
const editPromotion=async(id:any)=>{

    router.push(`/adminPromotionEdit`,{
        query:{id:id}
    })
}
  return (
    <>
    
    
    <VendorNavbar/>

    
    <div className={`container mt-4 pt-0 `}>
<Toaster/>
 
    <div className="row mt-4 mb-3  d-flex justify-content-end" >
           
           <Link href={"adminAddNewPromotion"} ><button className={`btn  d-flex justify-content-center align-items-center  gap-2    ${style.login_btn}`} >

<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{width:'20px',height:'20px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
</svg> Add Promotion 
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

  <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" >
  {products.map((promotion:any) => (
    <div key={promotion.id} className="border relative border-gray-300 p-4 rounded-lg shadow-lg" style={{background:"#8A2BE2FF"}}>
      <img src={promotion.image}  alt={promotion.name} className="w-full h-60 object-cover bg-secondary rounded-lg mb-2" />
      <h2 className="text-xl font-semibold mb-2" style={{color:"#FFD800FF"}}>{promotion.name}</h2>
      <p className="text-white">{promotion.description}</p>
      <div className="absolute top-2 right-2 flex space-x-2" >
            <button
              onClick={()=>editPromotion(promotion.id)}
              className="p-2 rounded-full  " style={{background:"#FFD800FF"}}
            >
              <svg xmlns="http://www.w3.org/2000/svg"  style={{fill:"#8A2BE2FF "}} viewBox="0 0 24 24" fill="#8A2BE2FF" className="w-6 h-6">
  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
</svg>

            </button>
            <button onClick={()=>deletePromotion(promotion.id)}
              
              className="p-2 rounded-full  hover:text-white text-red hover:bg-red-600" style={{background:"#FFD800FF"}}
            >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8A2BE2FF" className="w-6 h-6">
  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
</svg>

            </button>
          </div>
    </div>
  ))}
</div>
  
  :''
}

</div>
    </div>

    

    






    </>
  )
}
