import ProductOverlayCard from "@components/product/promotion-overlay-card";
import Alert from "@components/ui/alert";
import { useState, useEffect } from "react";
import { getDocs,collection } from 'firebase/firestore'
import { db } from '../../firebase'
import { toast } from "react-hot-toast";


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
  
}) => {
  const [data, setData]: any = useState([]);
  const [searcheddata, setSearcheddata]: any = useState([]);

  const [error]: any = useState();


  const getData = async () => {
    
     let arr: any = [];
     const data = await getDocs(collection(db, "promotions"));
     data.forEach((doc: any) => {
        
        
       if(doc.data()){
        const currentDate:any=new Date()
        const promoStartDate = new Date(doc.data().promoStart); // Convert promo start date from Firestore to a Date object
    const promoEndDate = new Date(doc.data().promoEnd); // Convert promo end date from Firestore to a Date object
    if (currentDate >= promoStartDate && currentDate <= promoEndDate) {
      const prod={id:doc.id,image:doc.data().image[0],name:doc.data().name,description:doc.data().description}
      arr.push(prod);
        
    }
         
           
 
       
       }
      
       
     });
   
    
           toast.dismiss()
           setData(arr)
           setSearcheddata(arr)
         
    
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
      <div className="mb-4 p-4 md:mb-6 font-poppins">
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
    <h1 className="text-3xl font-bold text-olive italic   underline" >Promotions</h1>
</div>

      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 md:gap-5 xl:gap-7">
  
            {searcheddata?.map((product: any, idx: any) => (
				
            
			  
			  
			  <ProductOverlayCard
                key={`product--key${product.id}`}
                product={product}
                variant={variant}
                index={idx}
              />
			  
			  
            ))}
          </div>
        </div>
      )}
       
    </div>
	</div>
  );
};

export default ProductsFeatured
