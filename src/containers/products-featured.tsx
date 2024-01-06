import ProductOverlayCard from "@components/product/product-overlay-card";
import Alert from "@components/ui/alert";
import { useState, useEffect } from "react";
import { getDocs,collection } from 'firebase/firestore'
import { db } from '../../firebase'
import { toast } from "react-hot-toast";
import Link from "next/link";
import Router from "next/router";
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Cookies from "js-cookie";

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
  const [searchName, setSearchName] = useState('');

  
  const [firstHalfProduct, setFirstHalfProduct] = useState<any | null>(null);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  
  const [secondHalfProduct, setSecondHalfProduct] = useState<any | null>(null);

  const openProductModal = () => {
    setProductModalOpen(true);
  };

  const closeProductModal = () => {
    setProductModalOpen(false);
    setFirstHalfProduct(null);
    setSecondHalfProduct(null);
  };

  const handleSelectFirstHalf = (selectedProduct: any) => {
    setFirstHalfProduct(selectedProduct);
    setProductModalOpen(true);
  };

  const handleSelectSecondHalf = (selectedProduct: any) => {
    if(firstHalfProduct.id===selectedProduct.id){
      toast.error(" select other one product",{ duration: 2000 })
      return
    }
    setSecondHalfProduct(selectedProduct);
    Cookies.set("firstHalfProduct",firstHalfProduct.id)
    Cookies.set("secondHalfProduct",selectedProduct.id)
    
    
    // Router.replace('/product/halfHalf')
  };

  // Filter products based on the category of the first selected product
  const filteredProducts = searcheddata.filter(
    (product: any) => !firstHalfProduct || firstHalfProduct.category === product.category
  );


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
     arr.sort((a:any, b:any) => a.name.localeCompare(b.name));
     let arr2: any = [];
     const data2 = await getDocs(collection(db, "categories"));
     data2.forEach((doc: any) => {
       if(doc.data()){
         const prod={id:doc.id,...doc.data()}
         arr2.push(prod);
           
           
 
       
       }
      
       
     });
     arr2.sort((a:any, b:any) => a.name.localeCompare(b.name));
   
    
           toast.dismiss()
           setData(arr)
           setSearcheddata(arr)
           setCategories(arr2)
           
         
    
   };
const handleLink=async()=>{
  
    Router.push('/product/halfHalf')
  

}
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
const search=(value:any)=>{

  setSearchName(value)
  const filteredProducts = data.filter(
    (product: any) =>
      product.name.toLowerCase().includes(value.toLowerCase()) 
      
  );
  setSearcheddata(filteredProducts);
}
  return (
    <div className={className}>
      <div className="mb-4 md:mb-6 font-poppins">

 
   
   <div className="flex row flex-wrap  gap-3 px-4">
  {/* Category dropdown */}
  <select
    value={selectedCategory}
    onChange={(e) => handleCategoryClick(e.target.value)}
    className={`border-2 border-olive px-4 py-2 font-bold cursor-pointer transition duration-200 
      bg-maroon text-olive hover:bg-olive w-[12rem] hover:text-maroon  `}
  >
    <option value="all">All categories</option>
    {categories.map((category: any) => (
      <option key={category.name} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>

  {/* Search input */}
  
    <input
      type="text"
      placeholder="Search By Name..."
      className="py-2 px-4 border-2 border-olive  outline-none md:w-1/4 focus:outline-none"
      value={searchName}
      onChange={(e) => search(e.target.value)}
    />
<button onClick={openProductModal} className="bg-olive btn text-maroon font-bold w-auto  hover:bg-olive hover:text-maroon ">
  Buy Half-Half of two products
</button>



<Modal show={isProductModalOpen} onHide={closeProductModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Two Products to Half-Half</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {filteredProducts.map((product: any) => (
              <Col key={product.id} xs={6} md={3} className="mb-3 ">
                <div className=" bg-olive p-2">
                  <input
                    type="checkbox"
                    
                    checked={firstHalfProduct === product || secondHalfProduct === product}
                    onChange={() => {
                      if (!firstHalfProduct) {
                        handleSelectFirstHalf(product);
                      } else {
                        handleSelectSecondHalf(product);
                        
                      }
                    }}
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '7rem', objectFit: 'cover' }}
                  />
                  <p className="text-maroon">{product.name}</p>
                  <p className="text-maroon">THB {product.price}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProductModal}>
            Close
          </Button>
          <Button variant="success"  onClick={handleLink}>
            Next
          </Button>
        </Modal.Footer>
      </Modal> 
      

</div>


      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="mt-6 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 md:gap-5 xl:gap-7">
  {
    searcheddata.length===0 && <div className="flex justify-center items-center m-4 h-auto">
  <div className="spinner-border text-light" role="status">
  <span className=" text-white" style={{color:"#ffffff !important"}}>Loading Products...</span>
</div>
    </div>
  }
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
