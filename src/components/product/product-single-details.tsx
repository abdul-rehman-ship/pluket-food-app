	import React, { useState,useEffect } from "react";
	import Button from "@components/ui/button";
	import Counter from "@components/common/counter";
	import { useRouter } from "next/router";
	import { useProductQuery } from "@framework/product/get-product";


	import { useCart } from "@contexts/cart/cart.context";
	import { generateCartItem } from "@utils/generate-cart-item";


	
	import { toast,Toaster } from "react-hot-toast";
	import { useWindowSize } from "@utils/use-window-size";




	const ProductSingleDetails: React.FC<any> = ({product}) => {
		
		
		const {
			query: { slug },
		} = useRouter();
		
		
		const { width } = useWindowSize();
		const {  isLoading } = useProductQuery(slug as string);
		const { addItemToCart } = useCart();
		
		const [attributes] = useState<{ [key: string]: string }>({});
		const [quantity, setQuantity] = useState(1);
		const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
		const [selectedVariations, setSelectedVariations] = useState<{ [key: string]: boolean }>({});
		const [updatedPrice, setUpdatedPrice]:any = useState();
		const [variationsPrice,setVariationsPrize]:any=useState(0)
		const [selectedSize, setSelectedSize] = useState(''); // State to track the selected size
		
		const [sizePrices,setSizePrices] :any= useState({
		  sm: "",
		  md: "",
		  lg: "",
		})
		const sizesWithPrices = ["sm", "md", "lg"].filter((size:any) => {
			return size in sizePrices && sizePrices[size] !== null;
		  });
		


		useEffect(()=>{
		if(!updatedPrice){		
			
			
			setSizePrices({sm:product?.size?.sm,md:product?.size?.md,lg:product?.size?.lg})

			
				
				if(product.size?.sm){
					setUpdatedPrice(product.size.sm)
					setSelectedSize("sm")
				}else if(product.size?.md){

					setUpdatedPrice(product.size.md)
					setSelectedSize("md")


				}
				else if(product.size?.lg){

					setUpdatedPrice(product.size.lg)
					setSelectedSize("lg")

				}else{
					setUpdatedPrice(product.price)

				}
			
		}
		}
		)
		if (isLoading) return <p className="text-white"> Loading...</p>;
		

		
		function addToCart() {
			
			
			setAddToCartLoader(true);
			setTimeout(() => {
				setAddToCartLoader(false);
			}, 600);

			let price:any=parseInt(updatedPrice) + parseInt(variationsPrice)
			const item = generateCartItem({...product,size:selectedSize,selectedVariations,price:price},attributes);
			addItemToCart(item, quantity);
			toast.success("Product added to cart")
			
		}

		const handleVariationChange = (variationName: string, price: any) => {

		  setSelectedVariations((prevVariations) => ({
			...prevVariations,
			[variationName]: !prevVariations[variationName],
		  }));
	  
		  const flag = !selectedVariations[variationName];
		  if (flag) {
			setVariationsPrize((prevPrice:any) => (parseFloat(prevPrice) + parseFloat(price)).toFixed(2));
		  } else {
			setVariationsPrize((prevPrice:any) => (parseFloat(prevPrice) - parseFloat(price)).toFixed(2));
		  }
		};
		const handleSizeChange = (selectedSize:any) => {
			setUpdatedPrice(sizePrices[selectedSize]);
			
			
			
			setSelectedSize(selectedSize);
		  };
	
		return (
			<div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start">
				<Toaster/>
				{width < 1025 ? (
						<div className="col-span-5 ">
						
						<div
							
							className=" w-full flex justify-center items-center transition duration-150 ease-in hover:opacity-90"
						>
							<img
								src={
									product?.image
									
								}
								alt={`${product.name}`}
								className="object-cover rounded-md w-full"
							/>
						</div>
					
				</div>
				) : (
					<div className="col-span-5 ">		
							<div				
								className="w-full flex justify-center transition duration-150 ease-in hover:opacity-90">
								<img
									src={
										product?.image									
									}
									alt={`${product.name}`}
									className="object-cover rounded-md w-full"
								/>
							</div>
						
					</div>
				)}

				<div className="col-span-4 pt-8 lg:pt-0">
					<div className="pb-7 mb-7 border-b border-gray-300">
						<h2 className="text-olive text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
							{product?.name}
						</h2>
						
						<p className="text-olive text-sm lg:text-base leading-6 lg:leading-8">
							{product?.description}
						</p>
						<h2 className="text-olive text-lg mt-3 md:text-xl lg:text-2xl 2xl:text-3xl font-bold  mb-3.5">
							stock : {product?.initialStock}
						</h2>
						<h2 className="text-olive text-lg mt-3 md:text-xl lg:text-2xl 2xl:text-3xl font-bold  mb-3.5">
							category : {product?.category}
						</h2>
						<div className="mb-4">
						
							
						<h2 className="text-olive text-lg mt-3 md:text-xl lg:text-2xl 2xl:text-3xl font-bold  mb-3.5">
							Size :
						</h2>:
  {sizesWithPrices.map((size:any) => (
  sizePrices[size]?
  <label key={size} className="flex items-center space-x-2">
      <input
        type="radio"
        name="size"
        value={size}
        checked={selectedSize === size}
        onChange={() => handleSizeChange(size)}
        className="form-radio text-olive"
      />
      <span className="text-olive">{size.toUpperCase()}</span>
      
    </label>:""
  ))}
</div>
						<div className="mb-4">
          {  product.price && product?.variations?.map((variation:any) => (
            <label key={variation.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedVariations[variation.name] || false}
                onChange={() => handleVariationChange(variation.name,variation.additionalPrice)}
                className="form-checkbox text-olive"
              />
              <span className="text-olive">{variation.name}</span>
              <span className="text-olive">(+{variation.additionalPrice} THB)</span>
            </label>
          ))}
        </div>

        {/* Updated product details with the calculated price */}
        <h2 className="text-olive text-lg mt-3 md:text-xl lg:text-xl 2xl:text-2xl font-bold  mb-3.5">
           Price: THB {updatedPrice ?parseInt(updatedPrice) + parseInt(variationsPrice) :"" }
        </h2>
					</div>
					<div className="col-span-4 pt-8 lg:pt-0">
        {/* Variation checkboxes */}
        

        {/* Other product details */}
        {/* ... Existing code ... */}
      </div>
					
					<div className="flex items-center space-s-4 md:pe-32 lg:pe-12 2xl:pe-32 3xl:pe-48 border-b border-gray-300 py-8">
						<Counter
							quantity={quantity}
							onIncrement={() => setQuantity((prev) => prev + 1)}
							onDecrement={() =>
								setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
							}
							disableDecrement={quantity === 1}
						/>
						<Button
							onClick={addToCart}
							variant="slim"
							className={`w-full bg-olive md:w-6/12 xl:w-full hover:bg-olive  `}
							loading={addToCartLoader}
						
						style={{background:"#FFD800FF",fontWeight:"bold"}}>
							<span className="py-2 text-maroon text-lg  font-bold 3xl:px-8 ">Add to cart</span>
						</Button>
					</div>
					
					
				</div>
			</div>
		);
	};

	export default ProductSingleDetails;
