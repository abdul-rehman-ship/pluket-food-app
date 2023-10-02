	import React, { useState } from "react";
	import Button from "@components/ui/button";
	import Counter from "@components/common/counter";
	import { useRouter } from "next/router";
	import { useProductQuery } from "@framework/product/get-product";


	import { useCart } from "@contexts/cart/cart.context";
	import { generateCartItem } from "@utils/generate-cart-item";


	import Link from "@components/ui/link";
	import { toast } from "react-toastify";
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
		
		if (isLoading) return <p>Loading...</p>;
		

		
		function addToCart() {
			
			
			setAddToCartLoader(true);
			setTimeout(() => {
				setAddToCartLoader(false);
			}, 600);

			const item = generateCartItem(product[0]!, attributes);
			addItemToCart(item, quantity);
			toast("Added to the bag", {
				type: "dark",
				progressClassName: "fancy-progress-bar",
				position: width > 768 ? "bottom-right" : "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			console.log(item, "item");
		}

		
		return (
			<div className="block lg:grid grid-cols-9 gap-x-10 xl:gap-x-14 pt-7 pb-10 lg:pb-14 2xl:pb-20 items-start">
				{width < 1025 ? (
						<div className="col-span-5 ">
						
						<div
							
							className=" w-full flex justify-center items-center transition duration-150 ease-in hover:opacity-90"
						>
							<img
								src={
									product[0]?.thumbnail
									
								}
								alt={`${product.shoeName}`}
								className="object-cover w-full"
							/>
						</div>
					
				</div>
				) : (
					<div className="col-span-5 ">		
							<div				
								className="w-full flex justify-center transition duration-150 ease-in hover:opacity-90">
								<img
									src={
										product[0]?.thumbnail									
									}
									alt={`${product.shoeName}`}
									className="object-cover w-full"
								/>
							</div>
						
					</div>
				)}

				<div className="col-span-4 pt-8 lg:pt-0">
					<div className="pb-7 mb-7 border-b border-gray-300">
						<h2 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
							{product[0]?.shoeName}
						</h2>
						
						<p className="text-body text-sm lg:text-base leading-6 lg:leading-8">
							{product[0]?.description}
						</p>
						<h2 className="text-heading text-lg mt-3 md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
							stock : {product[0]?.stock}
						</h2>
						<div className="flex items-center mt-5">
							<div className="text-heading font-bold text-base md:text-xl lg:text-2xl 2xl:text-4xl pe-2 md:pe-0 lg:pe-2 2xl:pe-0">
								{product[0]?.retailPrice}$
							</div>
							
						</div>
					</div>
					<div className="py-6">
						<ul className="text-sm space-y-5 pb-1">
							
							<li>
								<span className="font-semibold text-heading inline-block pe-2">
									Brand:
								</span>
								<Link
									href="#"
									className="transition hover:underline hover:text-heading"
								>
									{product[0]?.brand}
								</Link>
							</li>
							<li>
								<span className="font-semibold text-heading inline-block pe-2">
									Colorway:
								</span>
								<Link
									href="#"
									className="transition hover:underline hover:text-heading"
								>
									{product[0]?.colorway}
								</Link>
							</li>
							
						</ul>
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
							className={`w-full md:w-6/12 xl:w-full `}
							
							loading={addToCartLoader}
						>
							<span className="py-2 3xl:px-8">Add to cart</span>
						</Button>
					</div>
					
					
				</div>
			</div>
		);
	};

	export default ProductSingleDetails;
