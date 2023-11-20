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
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { toast, Toaster } from "react-hot-toast";
import JsCookie from 'js-cookie'
import { useRouter } from 'next/router'
import style from "@styles/profile.module.css";
import Link from "next/link";
interface Variation {
  name: string;
  additionalPrice: string;
}

function VendorAddNewProduct() {
  const initailState = {
    name: "",
    price: "",
    description: "",
    category: "",
    initialStock: "",
    salePrice: "",
    image:""
  };
  const [productItem, setProductItem] = useState(initailState);
  const [images, setImage]:any = useState([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [categories,setCategories]:any=useState([])
  const router=useRouter()
const id=router.asPath.split("=")[1]

  const addVariation = () => {
    setVariations([...variations, { name: '', additionalPrice: '' }]);
  };

  const removeVariation = (index: number) => {
    const updatedVariations = [...variations];
    updatedVariations.splice(index, 1);
    setVariations(updatedVariations);
  };





  const getData = async () => {
   
    let arr: any = [];
    const data = await getDocs(collection(db, "categories"));
    data.forEach((doc: any) => {
      if(doc.data()){
        const prod={id:doc.id,...doc.data()}
        arr.push(prod);
          
          

      
      }
     
      
    });
    const data2 = await getDocs(collection(db, "products"));
    
    data2.forEach((doc: any) => {
      if(doc.data()){
        
        if(doc.id===id){
            const prod={id:doc.id,...doc.data()}
            setProductItem(prod)
            setVariations(prod.variations)
            
              
        }
       
          

      
      }
     
      
    });
   
          
     setCategories(arr)
  };
  
   

  useEffect(() => {
    if(JsCookie.get("admin_key")==="admin"){
      if(categories.length===0){
        getData()

      }

    }else{
      router.push("/admin")
    }
      


  })
   
  

  const uploadFiles = async (folder: string, files: File[]) => {
  console.log(files);
  
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
      
      toast.loading("updating product...");

      console.log(images);
      
      const urls = await uploadFiles("images", images);

setTimeout(async()=>{
  console.log(urls[0]?urls[0]:productItem.image);
  
  
  await updateDoc(doc(db, "products", id), {
    
    name: productItem.name,
    price: productItem.price,
    description: productItem.description,
    category: productItem.category,
    initialStock: productItem.initialStock,
    image: urls[0] ? urls[0]:productItem.image,
    variations: variations,
    createdAt: serverTimestamp(),
    
  });
  ;toast.dismiss();
  toast.success("product updated successfully");
  getData()
},2000)
    } catch (error:any) {
      
      toast.error(error.message);
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
        <Link href="adminDashboard">
          <button
            className={`btn ${style.back_btn} btn-light `}
            style={{ fontSize: "large" }}
          >
            &#8592; Back{" "}
          </button>
        </Link>
        <div className="row mt-4 mx-2">
        <div className="col-md-6 mt-4">
          <span>Current Product Image</span>
          <img
            src={productItem.image}
            alt="Current Promotion"
            className="img-fluid mt-2"
            style={{ maxHeight: '200px' }}
          />
        </div>
      </div>
        <form onSubmit={handleSubmit}>
          <div className={`row mt-4 px-3`}>
            <div className="col-md-6">
              <span>Product name*</span>
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
              <span>Product Price*</span>
              <input
                type="number"
                value={productItem.price}
                name="price"
                onChange={handleChange}
                className="form-control mt-2"
                required
              />
            </div>
          </div>

          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <span>Product Category*</span>
              <select
    id="category"
    className="form-control mt-2"
    name="category"
    value={productItem.category}
    onChange={handleChange}
    required
  >
    
    {categories.map((category:any, index:any) => (
      <option key={index} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>
            </div>
            <div className="col-md-6">
              <span>Product Description *</span>
              <input
                type="text"
                className="form-control mt-2"
                value={productItem.description}
                name="description"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <span>Initial Stock*</span>
              <input
                type="number"
                className="form-control mt-2"
                value={productItem.initialStock}
                name="initialStock"
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-6 ">
              <span>Change Product Image *</span>
              <input
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                className="form-control mt-2"
                name="image"
                onChange={handleImageChange}
                
              />
            </div>
          </div>
          <div className="row mt-4 mx-2">
          <div className="col-md-12">
            <button
              type="button"
              onClick={addVariation}
              className="btn btn-primary mt-2"
            >
              Add Variations
            </button>
          </div>
          {variations?.map((variation, index) => (
            <div key={index} className="col-md-6 mt-4">
              <span>Variation Name *</span>
              <input
                type="text"
                className="form-control mt-2"
                value={variation.name}
                onChange={(e) => {
                  const updatedVariations = [...variations];
                  updatedVariations[index].name = e.target.value;
                  setVariations(updatedVariations);
                }}
                required
              />
              <span>Additional Price *</span>
              <input
                type="number"
                className="form-control mt-2"
                min={0}
                value={variation.additionalPrice}
                onChange={(e) => {
                  const updatedVariations = [...variations];
                  updatedVariations[index].additionalPrice = e.target.value;
                  setVariations(updatedVariations);
                }}
                required
              />
              <button
                type="button"

                onClick={() => removeVariation(index)}
                className={`btn   flex justify-center items-center mt-2   ${style.remove_btn}}`}
               >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="  text-danger w-6 h-6">
  <path fillRule="evenodd"  d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
</svg>  Remove 
              </button>
            </div>
          ))}
          
        </div>
 
          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <button type="submit" className="btn">
                Update product
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
