import ProductOverlayCard from "@components/product/product-overlay-card";
import Alert from "@components/ui/alert";
import { useState, useEffect } from "react";
import { getDocs,collection } from 'firebase/firestore'
import { db } from '../../firebase'
import { toast } from "react-hot-toast";
import Link from "next/link";

interface ProductsProps {
  sectionHeading: string;
  categorySlug?: string;
  className?: string;
  variant?: "left" | "center";
  type?:string
}

const ProductsFeatured: React.FC<ProductsProps> = ({
  className = "mb-12 md:mb-14 xl:mb-16 mt-4",
  variant = "left",
  type
}) => {
  const [data, setData]: any = useState([]);
  const [searcheddata, setSearcheddata]: any = useState([]);
  const [categories,setCategories]:any=useState([])
  const [selectedCategory, setSelectedCategory] = useState('all');
  

  const handleCategoryClick = (category:any) => {
    setSelectedCategory(category);
  if(category==="all"){
    setSearcheddata(data)
  }else{
let arr:any=[];
data.forEach((prod:any)=>{
  if(prod.category===category){
    arr.push(prod)
  }
})
setSearcheddata(arr)
  }
   
   
  };

  const [error]: any = useState();


  const getData = async () => {
    
     let arr: any = [];
     const data = await getDocs(collection(db, "products"));
     data.forEach((doc: any) => {
       if(doc.data()){
         const prod={id:doc.id,...doc.data()}
         arr.push(prod);
           
           
 
       
       }
      
       
     });
     let arr2: any = [];
     const data2 = await getDocs(collection(db, "categories"));
     data2.forEach((doc: any) => {
       if(doc.data()){
         const prod={id:doc.id,...doc.data()}
         arr2.push(prod);
           
           
 
       
       }
      
       
     });
   
    
           toast.dismiss()
           setData(arr)
           setSearcheddata(arr)
           setCategories(arr2)
         
    
   };

  useEffect(() => {
    if (data.length === 0) {
      getData();
    }
  });

  // const handleFilter = () => {
  //   const filteredProducts = data.filter(
  //     (product: any) =>
  //       product.brand.toLowerCase().includes(searchBrand.toLowerCase()) &&
  //       product.shoeName.toLowerCase().includes(searchName.toLowerCase()) &&
  //       (!searchPriceMin ||
  //         parseFloat(product.retailPrice) >= parseFloat(searchPriceMin)) &&
  //       (!searchPriceMax ||
  //         parseFloat(product.retailPrice) <= parseFloat(searchPriceMax))
  //   );
  //   setSearcheddata(filteredProducts);
  // };

  return (
    <div className={className}>
      <div className="mb-4 md:mb-6 font-poppins">
        {/* <div className="flex flex-col md:flex-row gap-4 md:gap-6">
         {type==="all" ?<input
            type="text"
            placeholder="Search Brand"
            className="py-2 px-4 border-2 border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none"
            value={searchBrand}
            onChange={(e) => setSearchBrand(e.target.value)}
          /> :" "} 
          <input
            type="text"
            placeholder="Search Name"
            className="py-2 px-4 border-2 border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <div className="flex gap-2 w-full md:w-1/3">
            <input
              type="number"
              placeholder="Min Price"
              className="py-2 px-4 border-2 border-gray-300 rounded-md w-full focus:outline-none"
              value={searchPriceMin}
              onChange={(e) => setSearchPriceMin(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="py-2 px-4 border-2 border-gray-300 rounded-md w-full focus:outline-none"
              value={searchPriceMax}
              onChange={(e) => setSearchPriceMax(e.target.value)}
            />
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md mt-4 focus:outline-none"
          onClick={handleFilter}
        >
          Filter
        </button> */}
        <div className="flex justify-center  mt-4  items-center h-auto">
    <h1 className="text-3xl font-bold text-olive italic   underline" >Products</h1>
</div>
<div className="flex flex-wrap justify-center gap-2 space-x-2 md:space-x-4 m-4 lg:space-x-6">
      {/* All button */}
      <button
        style={{width:"10rem !important"}}
        onClick={() => handleCategoryClick('all')}
        className={` border-2 border-olive  font-bold px-4 py-2 cursor-pointer transition duration-200 ${
          selectedCategory === 'all' ? 'bg-olive text-maroon' : ' bg-maroon text-olive hover:bg-olive hover:text-maroon'
        }`}
      >
        All
      </button>

      {/* Category buttons */}
      {categories.map((category:any) => (
     <button
     key={category.name}
     onClick={() => handleCategoryClick(category.name)}
     className={`border-2 border-olive px-4 font-bold py-2 cursor-pointer transition duration-200 
       ${selectedCategory === category.name ? 'bg-olive text-maroon' : 'bg-maroon text-olive hover:bg-olive hover:text-maroon'}
       min-w-[10rem]` /* Add the 'min-w-[10rem]' class for a minimum width of 10rem */
     }
   >
     {category.name}
   </button>
      ))}
    </div>

      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="mt-6 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 md:gap-5 xl:gap-7">
  
            {searcheddata?.map((product: any, idx: any) => (
				
            
			  
			  // if type is all then all products will show otherwise 8 products will show
        type==="all" ?<ProductOverlayCard
                key={`product--key${product.id}`}
                product={product}
                variant={variant}
                index={idx}
              />:idx<8 && <ProductOverlayCard
                key={`product--key${product.id}`}
                product={product}
                variant={variant}
                index={idx}
              />
        
        
            ))}
          </div>
        </div>
      )}
     { type!=="all" && searcheddata.length>8   && <div className="flex justify-center items-center m-4 h-auto">
      <Link href="/allProducts">
        <a className="block w-full max-w-md p-4 bg-olive text-maroon text-center font-semibold rounded-lg transition ">
          Show More
        </a>
      </Link>
        </div>}

      
     
    </div>
	</div>
  );
};

export default ProductsFeatured
