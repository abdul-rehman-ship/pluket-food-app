import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import JsCookie from 'js-cookie'

import { useRouter } from "next/router";
import VendorNavbar from "@components/adminNavbar";
import { db, } from  '../../firebase'


import {
  
  collection,
  addDoc,
  getDocs,deleteDoc,doc,updateDoc
  
} from "firebase/firestore";

import { toast, Toaster } from "react-hot-toast";

import style from "@styles/vendor.module.css";




function VendorAddNewProduct() {
  
  const [category,setCategory]:any=useState('')
  const [allCategories,setAllCategories]:any=useState([])
  const [isEdit,setIsEdit]:any=useState(false)
  const [editId,setEditId]:any=useState('')
  const router = useRouter();
 

  
  useEffect(() => {
    if(JsCookie.get("admin_key")==="admin"){
        
        if(allCategories.length===0){
             getData()
    

        

        }

        
      }else{
        router.push("/admin")
      }
        
  });
  const getData=async()=>{
    try{
        toast.loading("Loading...")

        const data = await getDocs(collection(db, "categories"));
        let arr:any=[]
        
        data.forEach((doc: any) => {
            
            if(doc.data()){
                
                arr.push({...doc.data(),id:doc.id})
                
                
            }

        })
        setAllCategories(arr)
        
        
toast.dismiss()
    }catch(error:any){
        toast.error(error.message)
    }
  }
 
  const handleChange=(e:any)=>{
    setCategory(e.target.value)
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(category!==''){
    toast.loading("Loading...");

    try {
      let isIn:any=false
        const data = await getDocs(collection(db, "categories"));
        data.forEach((doc: any) => {
            if(doc.data().name===category){
                isIn=true
                
                
            }

        })
      
if(isIn===true){
    toast.error("category already exists");

}else{
    await addDoc(collection(db, "categories"), {
        name: category,
        
      });
      
      toast.success("category added successfully");
      setCategory('')
    toast.dismiss()
    getData()

}
    } catch (error:any) {
      toast.dismiss();
      toast.error(error.message);
    }
  }else{
      toast.error("please enter category name")
  }
  };
const handleDelete=async(id:any)=>{
    
    
    toast.loading("Loading...");
    try{
        await deleteDoc(doc(db,"categories",id))
        toast.success("category deleted successfully")
        getData()
        setIsEdit(false)
        setCategory('')
        toast.dismiss()
        toast.success("category deleted successfully")
    }catch(error:any){
        toast.error(error.message)
    }
}
const handleEdit=async()=>{
    //update doc with id
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.loading("Loading...");

   
    try{
        updateDoc(doc(db,"categories",editId),{
            name:category
        }) 
        toast.dismiss()
          toast.success("category updated successfully");
          setCategory('')
        
        getData()
        setIsEdit(false)
    }catch(error:any){
        toast.error(error.message)
    }

    

}
 const setEdit=(name:any,id:any)=>{
    setIsEdit(true)
    setCategory(name)
    setEditId(id)
}
 
  
 
  return (
    <>
      <VendorNavbar />

      <Toaster />
      
      <div className={`${style.formContainer} container mt-5 `}>
      <div className="input-group">
  <div className="form-outline">
    <input type="search"  name="search" value={category} onChange={handleChange} className="form-control"  placeholder='Write category name...'/>
    
  </div>
  {isEdit===false? <button type="button"  onClick={handleSubmit} className={`flex gap-1 btn ${style.search_btn}`} >
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{width:'20px',height:'20px'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
<path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
</svg>
Add New
  </button>: <button type="button"  onClick={handleEdit} className={`flex gap-1 btn ${style.search_btn}`} >
    
Update
  </button>}
</div>
        <div className="row mt-5 ">
      <Table striped bordered hover responsive className="col-sm-12 col-md-12 col-lg-8 " >
      <thead  className={style.table_head} >
        <tr >
          
          <th className="p-3">Category Name</th>
          <th className="p-3">State</th>
          <th className="p-3">Action</th>
          


        </tr>
      </thead>
      <tbody style={{color:"#1c1b1bbb",fontWeight:600}}>
       {
      allCategories.length>0 ?  allCategories.map((item:any)=>{
           return <tr>
            <td className=" ">{item.name}</td>
            <td className="text-success text-sm"><span className=" p-1 rounded" style={{background:"#c1c1d4 "}}>active</span></td>
            <td className=" gap-2 " style={{display:'flex'}}>
               
                <button className=" " onClick={()=>handleDelete(item.id)}>
                     <svg fill="#ffff" xmlns="http://www.w3.org/2000/svg" width="24" height="24" id="delete"><g fill="none" fillRule="evenodd" stroke="#4A4A4A"><path d="M5.5 7.5V20A1.5 1.5 0 0 0 7 21.5h11a1.5 1.5 0 0 0 1.5-1.5V7.5h-14z"></path><path stroke-linecap="round" d="M8.5 10.41v8.18M12.5 10.41v8.18M16.5 10.41v8.18M9 4.333V3.244C9 2.557 9.627 2 10.4 2h4.2c.773 0 1.4.557 1.4 1.244v1.09"></path><rect width="18" height="3" x="3.5" y="4.5" rx="1.5"></rect></g></svg> 
                </button>
                <button className=" " onClick={()=>setEdit(item.name,item.id)}>
                <svg fill="#ffff" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" id="edit"><path fill="#212121" d="M13.6568542,2.34314575 C14.4379028,3.12419433 14.4379028,4.39052429 13.6568542,5.17157288 L6.27039414,12.558033 C5.94999708,12.87843 5.54854738,13.105727 5.10896625,13.2156223 L2.81796695,13.7883721 C2.45177672,13.8799197 2.12008033,13.5482233 2.21162789,13.182033 L2.78437771,10.8910338 C2.894273,10.4514526 3.12156995,10.0500029 3.44196701,9.72960586 L10.8284271,2.34314575 C11.6094757,1.56209717 12.8758057,1.56209717 13.6568542,2.34314575 Z M10.1212441,4.46435931 L4.14907379,10.4367126 C3.95683556,10.6289509 3.82045738,10.8698207 3.75452021,11.1335694 L3.38388341,12.6161166 L4.86643062,12.2454798 C5.1301793,12.1795426 5.37104912,12.0431644 5.56328736,11.8509262 L11.5352441,5.87835931 L10.1212441,4.46435931 Z M11.5355339,3.05025253 L10.8282441,3.75735931 L12.2422441,5.17135931 L12.9497475,4.46446609 C13.3402718,4.0739418 13.3402718,3.44077682 12.9497475,3.05025253 C12.5592232,2.65972824 11.9260582,2.65972824 11.5355339,3.05025253 Z"></path></svg>
                </button>
                
                
</td>
        </tr>
        }):" No Categories Found"
       }
      
       
      </tbody>

      
    </Table>
      </div>
      </div>
    </>
  );
}

export default VendorAddNewProduct;

