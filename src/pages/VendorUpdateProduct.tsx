import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import VendorNavbar from "../components/adminNavbar";



import { toast, Toaster } from "react-hot-toast";

import style from "../styles/profile.module.css";
import Link from "next/link";

import JsCookie from 'js-cookie'


function VendorUpdateProduct() {
  const initailState = {
    shoeName: "",
    retailPrice: "",
    description: "",
    stock: "",
    
  };
  const [productItem, setProductItem] = useState(initailState);
  
  
  
  const router = useRouter();
  const query=router.query
  const productId:any=query.productId?query.productId:""
  const getData=async()=>{
    
    
    try {
      const res=await fetch(`/api/AllProducts`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          id:productId
        })
      })
        const data=await res.json()
        const product=data.products;
        
        
        
        setProductItem(product[0])
    } catch (error:any) {

        
    }
  }
  useEffect(() => {
    if(JsCookie.get("admin_key")==="admin"){

    if(!productItem?.shoeName){
      getData()

    }}else{
      router.push("/")
    }
    
  });
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    
    
    try {
      

      toast.loading("Loading...");

      await fetch(`/api/updateProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id:productId,
          stock:productItem.stock,  
        })
      })
      toast.dismiss()
      toast.success("product updated successfully");
    } catch (error:any) {
      toast.dismiss()
      toast.error(error.message);
    }
  };

  const handleChange = async (e: any) => {

    setProductItem({ ...productItem, [e.target.name]: e.target.value });
  };
  
 
  

  return (
    <>
      <VendorNavbar />

      <Toaster />
      
      <div className={` ${style.formContainer} container mt-5 `}>
        <Link href="adminDashboard">
          <button
            className={`btn ${style.back_btn} btn-light `}
            style={{ fontSize: "large" }}
          >
            &#8592; Back{" "}
          </button>
        </Link>
        <form onSubmit={handleSubmit}>
          <div className={`row mt-4 px-3`}>
            <div className="col-md-6">
              <span>Product name*</span>
              <input
                type="text"
                value={productItem?.shoeName}
                name="shoeName"
                onChange={handleChange}
                className="form-control mt-2"
                required
                readOnly
              />
            </div>
            <div className="col-md-6">
              <span>Product Price*</span>
              <input
              min={1}
                type="number"
                value={productItem?.retailPrice}
                name="retailPrice"
                onChange={handleChange}
                className="form-control mt-2"
                required
                readOnly
              />
            </div>
          </div>

          <div className="row mt-4 mx-2">
           
            <div className="col-md-6">
              <span>Product Description *</span>
              <input
                type="text"
                className="form-control mt-2"
                value={productItem?.description}
                name="description"
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <span> Stock*</span>
              <input
                type="number"
                min={1}
                className="form-control mt-2"
                value={productItem?.stock}
                name="stock"
                onChange={handleChange}
                required
              />
            </div>
          
            {/* <div className="col-md-6 mt-4">
              <span>Product Images *</span>
              <input
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                className="form-control mt-2"
                name="image"
                onChange={handleImageChange}
                disabled
              />
            </div> */}
          </div>

          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <button type="submit" className="btn">
                Update product
              </button>
            </div>
            
          </div>
        
        </form>
      </div>
    </>
  );
}

export default VendorUpdateProduct;
