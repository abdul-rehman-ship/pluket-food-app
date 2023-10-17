import Image from "next/image";
import { useUI } from "@contexts/ui.context";
// import usePrice from "@framework/product/use-price";


interface ProductProps {
	product: any;
	index: number;
	imgLoading?: "eager" | "lazy";
	variant?: "left" | "center";
}

const ProductOverlayCard: React.FC<ProductProps> = ({
	product,
	
}) => {
	

	const { openModal, setModalView, setModalData } = useUI();
	// const { price }:any = usePrice({
	// 	amount: product.retailPrice ? product.retailPrice : product.retailPrice,
	// 	baseAmount: product.retailPrice,
	// 	currencyCode: "USD",
	// });
	function handlePopupView() {
		setModalData({ data: {type:"promo",...product} });
		setModalView("PRODUCT_VIEW");
		return openModal();
	}

	return (
		<div
		onClick={handlePopupView}
		className={`cursor-pointer group flex flex-col bg-olive rounded-md relative items-center justify-between overflow-hidden`}
	  >
		<div
		  className="flex justify-center items-center p-4 h-auto 3xl:min-h-[330px]"
		  title={product?.name}
		>
		  <Image
			src={product?.image}
			width={360}
			height={360}
			loading="lazy"
			alt={product?.name || "Promotion Image"}
			className="transition rounded-md duration-500 ease-in-out transform group-hover:scale-110"
		  />
		</div>
		<div className="md:pe-2 lg:pe-0 2xl:pe-2 overflow-hidden">
		  <div className="flex flex-col justify-center items-center mb-1">
			<h2 className=" text-maroon text-center font-semibold text-sm md:text-base xl:text-lg truncate">
			  {product?.name}
			</h2>
		  </div>
		  <p className="text-xs xl:text-sm text-maroon leading-normal truncate max-w-[250px] xl:leading-relaxed py-4 px-4 text-center">
			{product?.description}
		  </p>
		</div>
	  </div>
	  
	);
};

export default ProductOverlayCard;
