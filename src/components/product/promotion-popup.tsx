import React, { useState } from "react";
import { useRouter } from "next/router";

import { ROUTES } from "@utils/routes";
import { useUI } from "@contexts/ui.context";



import { ProductAttributes } from "@components/product/product-attributes";

// import usePrice from "@framework/product/use-price";
import { getVariations } from "@framework/utils/get-variations";


export default function ProductPopup() {
	
	const {
		modalData: { data },
		closeModal,
		
	} = useUI();
	const router = useRouter();
	
	
	const [attributes, setAttributes] = useState<{ [key: string]: string }>({});

	// const { price } = usePrice({
	// 	amount: data.retailPrice ? data.retailPrice : data.retailPrice,
	// 	baseAmount: data.retailPrice,
	// 	currencyCode: "USD",
	// });
	const variations = getVariations(data.variations);
	const {  name } = data;

	
	


	function navigateToProductPage() {
		closeModal();
		router.push(`${ROUTES.PRODUCT}/${data.id}`, undefined, {
			locale: router.locale,
		});
	}

	function handleAttribute(attribute: any) {
		setAttributes((prev) => ({
			...prev,
			...attribute,
		}));
	}



	return (
		<div className="rounded-lg bg-white">
			{data.type==="promo" &&
            <div className="flex flex-col lg:flex-row w-full md:w-[650px] lg:w-[960px] mx-auto overflow-hidden">
				<div className="flex-shrink-0 flex items-center justify-center w-full lg:w-430px max-h-430px lg:max-h-full overflow-hidden bg-gray-300">
					<img
						src={
							data?.image
							
						}
						alt={name}
						className=" lg:w-full lg:h-full"
					/>
				</div>

				<div className="flex flex-col p-5 md:p-8 w-full">
					<div className="pb-5">
						<div
							className="mb-2 md:mb-2.5 block -mt-1.5"
							onClick={navigateToProductPage}
							role="button"
						>
							<h2 className=" text-olive  md:text-xl lg:text-2xl font-semibold ">
								{data.name}
							</h2>
						</div>
						<p className="text-sm leading-6 md:text-body md:leading-7">
							{data.description}
						</p>

						<div className="flex items-center mt-3">
							{/* <div className="text-heading font-semibold text-base md:text-xl lg:text-2xl">
								THB {data.price}
							</div> */}
							
						</div>
					</div>

					{Object.keys(variations).map((variation) => {
						return (
							<ProductAttributes
								key={`popup-attribute-key${variation}`}
								title={variation}
								attributes={variations[variation]}
								active={attributes[variation]}
								onClick={handleAttribute}
							/>
						);
					})}

					<div className="pt-2 md:pt-4">
						<div className="flex items-center justify-between mb-4 space-s-3 sm:space-s-4">
							{/* <Counter
								quantity={quantity}
								onIncrement={() => setQuantity((prev) => prev + 1)}
								onDecrement={() =>
									setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
								}
								disableDecrement={quantity === 1}
							/> */}
							{/* <Button
								onClick={addToCart}
								variant="flat"
								className={`w-full h-11 md:h-12 px-1.5 ${
									!isSelected && "bg-gray-400 hover:bg-gray-400"
								}`}
								disabled={!isSelected}
								loading={addToCartLoader}
							>
								{t("text-add-to-cart")}
							</Button> */}
						</div>

						{/* {viewCartBtn && (
							<button
								onClick={navigateToCartPage}
								className="w-full mb-4 h-11 md:h-12 rounded bg-gray-100 text-heading focus:outline-none border border-gray-300 transition-colors hover:bg-gray-50 focus:bg-gray-50"
							>
								{t("text-view-cart")}
							</button>
						)} */}

						{/* <Button
							onClick={navigateToProductPage}
							variant="flat"
							className="w-full h-11 md:h-12"
						>
							{t("text-view-details")}
						</Button> */}
					</div>
				</div>
			</div>
}
		</div>
	);
}
