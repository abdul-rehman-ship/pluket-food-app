// import Image from "next/image";
import Router from 'next/router'
// import usePrice from "@framework/product/use-price";


interface ProductProps {
	product: any;
	index: number;
	
	variant?: "left" | "center";
}

const ProductOverlayCard: React.FC<ProductProps> = ({
	product,
	index,
	variant = "left",
	
}) => {
	const size =
		(variant === "center" && index === 1) || (variant === "left" && index === 0)
			? 260
			: 260;
	const classes =
		(variant === "center" && index === 1) || (variant === "left" && index === 0)
			? "col-span-2 lg:col-span-1"
			: "col-span-2 lg:col-span-1";

	
	// const { price }:any = usePrice({
	// 	amount: product.retailPrice ? product.retailPrice : product.retailPrice,
	// 	baseAmount: product.retailPrice,
	// 	currencyCode: "USD",
	// });
	function handlePopupView(id:any) {
		Router.push(`/products/${id}`)
		// setModalData({ data: product });
		// setModalView("PRODUCT_VIEW");
		// return openModal();
	}

	return (
		<div
			onClick={()=>{handlePopupView(product.id)}}
			className={`${classes} cursor-pointer group flex flex-col bg-olive rounded-md relative items-center justify-between overflow-hidden`}>
				
			<div
				className="flex justify-center items-center p-4 h-auto 3xl:min-h-[330px]"
				title={product?.name}
			>
			<img
  src={product?.image}
  width={size}
  height={size}
  alt={product?.name || "Product Image"}
  className="transition duration-500 ease-in-out transform group-hover:scale-110"
/>
			</div>
			<div className="md:pe-2 lg:pe-0  sm:px-8 2xl:pe-2 overflow-hidden">
  <div className="py-2">
    <h2 className=" text-maroon font-semibold text-sm md:text-base xl:text-lg truncate">
      {product?.name}
    </h2>
    <h2 className=" font-segoe text-maroon font-semibold text-base md:text-xl lg:text-base xl:text-xl 3xl:text-2xl 3xl:mt-0.5">
      THB {product.price}
    </h2>
  </div>
  {/* <p className="text-xs xl:text-sm text-maroon leading-normal p-4 xl:leading-relaxed truncate max-w-[250px]">
    {product?.description}
  </p> */}
</div>

		</div>
	);
};

export default ProductOverlayCard;
