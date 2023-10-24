import React, { useEffect, useState } from "react";


import VendorNavbar from "@components/adminNavbar";
import { db,storage } from  '../../firebase'
import {
  getDownloadURL,
  
  ref,
  
  uploadBytesResumable,
} from "firebase/storage";

import {
  
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { toast, Toaster } from "react-hot-toast";

import style from "@styles/profile.module.css";
import Link from "next/link";



function VendorAddNewProduct() {
  const initailState = {
    name: "",
    description: "",
  
  };
  const [productItem, setProductItem] = useState(initailState);
  const [images, setImage]:any = useState([]);
  const [promoStart, setPromoStart] = useState('');
const [promoEnd, setPromoEnd] = useState('');


  

  useEffect(() => {
   
  }, []);
  const uploadFiles = async (folder: string, files: File[]) => {
    const promises: any[] = [];

    files.forEach((file) => {
      const storageRef = ref(storage, `${folder}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      promises.push(uploadTask);
    });

    const result = await Promise.all(promises);
    const urlPromises = result.map(async (item) => {
      const path = item.ref.toString();
      return await downloadFile(path);
    });

    return await Promise.all(urlPromises);
  };
  const downloadFile = async (path: string) => {
    let item: string = "";
    await getDownloadURL(ref(storage, path))
      .then((url) => (item = url))
      .catch((err) => {
        return toast.error(err.message);
      });

    return item;
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    
    try {
        
        
      
toast.loading("Uploading...")
      const urls:any = await uploadFiles("images", images);


   setTimeout(async() => {
    await addDoc(collection(db, "promotions"), {
      name: productItem.name,
      description: productItem.description,
      image: urls,
      createdAt: serverTimestamp(),
      promoStart: promoStart, // Add promo start date to the Firestore document
        promoEnd: promoEnd,
      
    });
    ;
    toast.dismiss()
    toast.success("product uploaded successfully");
    setProductItem(initailState)
   },2000)
    } catch (error:any) {
        toast.dismiss()
      toast.error(error);
    }
  };

  const handleChange = async (e: any) => {
    setProductItem({ ...productItem, [e.target.name]: e.target.value });
  };
  const checkImages = (files: FileList) => {
    let newFiles: File[] = [];

    Array.from(files).map((file) => {
      if (!file) return toast.error("File does not exist.");

      const types = ["image/png", "image/jpeg", "image/gif"];
      if (!types.includes(file.type)) {
        return toast.error("The image type is png / jpeg / gif.");
      }

      newFiles.push(file);
    });

    setImage(newFiles);
  };
  const handleImageChange = async (e: any) => {
    setImage([]);

    const target = e.target as HTMLInputElement;
    const files :any= target.files;
    checkImages(files);
  };
 
  return (
    <>
      <VendorNavbar />

      <Toaster />
      
      <div className={` ${style.formContainer} container mt-5 `}>
        <Link href="adminPromotions">
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
              <span>Promotion name*</span>
              <input
                type="text"
                value={productItem.name}
                name="name"
                onChange={handleChange}
                className="form-control mt-2"
                required
              />
            </div>
            <div className="col-md-6">
              <span>Description max:50*</span>
              <input
                type="text"
                value={productItem.description}
                name="description"
                max={50}
                onChange={handleChange}
                className="form-control mt-2"
                required
              />
            </div>
          </div>

         

          <div className="row mt-4 mx-2">
            
            <div className="col-md-6 mt-4">
              <span>Promotion Image *</span>
              <input
                type="file"
                
                accept="image/png, image/gif, image/jpeg"
                className="form-control mt-2"
                name="image"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>
          <div className="row mt-4 px-3">
  <div className="col-md-6">
    <span>Date of promo start*</span>
    <input
      type="date"
      value={promoStart}
      name="promoStart"
      onChange={(e) => setPromoStart(e.target.value)}
      className="form-control mt-2"
      required
    />
  </div>
  <div className="col-md-6">
    <span>Date of promo end*</span>
    <input
      type="date"
      value={promoEnd}
      name="promoEnd"
      onChange={(e) => setPromoEnd(e.target.value)}
      className="form-control mt-2"
      required
    />
  </div>
</div>
 
          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <button type="submit" className="btn">
                Upload promotion
              </button>
            </div>
            <div className="col-md-6"></div>
          </div>
        </form>



      </div>
    </>
  );
}

export default VendorAddNewProduct;
