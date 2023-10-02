import ProductOverlayCard from "@components/product/product-overlay-card";
import Alert from "@components/ui/alert";
import { useState, useEffect } from "react";

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

  const [error, setError]: any = useState();
  const [searchBrand, setSearchBrand] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPriceMin, setSearchPriceMin] = useState("");
  const [searchPriceMax, setSearchPriceMax] = useState("");

  const getProducts = async () => {
    try {
      const res = await fetch("/api/AllProducts");
      const data = await res.json();
	  console.log(data);
	  
      setData(data.products);
	  setSearcheddata(data.products)
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      getProducts();
    }
  });

  const handleFilter = () => {
    const filteredProducts = data.filter(
      (product: any) =>
        product.brand.toLowerCase().includes(searchBrand.toLowerCase()) &&
        product.shoeName.toLowerCase().includes(searchName.toLowerCase()) &&
        (!searchPriceMin ||
          parseFloat(product.retailPrice) >= parseFloat(searchPriceMin)) &&
        (!searchPriceMax ||
          parseFloat(product.retailPrice) <= parseFloat(searchPriceMax))
    );
    setSearcheddata(filteredProducts);
  };

  return (
    <div className={className}>
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
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
        </button>

      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-4 grid-rows-2 gap-3 md:gap-5 xl:gap-7">
            {searcheddata?.map((product: any, idx: number) => (
				
             type==="all" ? <ProductOverlayCard
                key={`product--key${product._id}`}
                product={product}
                variant={variant}
                index={idx}
              />
			  :
			  product.brand.toLowerCase()===type?
			  <ProductOverlayCard
                key={`product--key${product._id}`}
                product={product}
                variant={variant}
                index={idx}
              />
			  
			  :""
            ))}
          </div>
        </div>
      )}
    </div>
	</div>
  );
};

export default ProductsFeatured
