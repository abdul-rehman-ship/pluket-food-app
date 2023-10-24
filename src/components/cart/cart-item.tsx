import Link from "@components/ui/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInOut } from "@utils/motion/fade-in-out";
import { IoIosCloseCircle } from "react-icons/io";
import Counter from "@components/common/counter";
import { useCart } from "@contexts/cart/cart.context";
import usePrice from "@framework/product/use-price";
import { ROUTES } from "@utils/routes";
import { generateCartItemName } from "@utils/generate-cart-item-name";
import { useTranslation } from "next-i18next";

type CartItemProps = {
	item: any;
};

const CartItem: React.FC<CartItemProps> = ({ item }) => {

	
	
	const { t } = useTranslation("common");
	const { addItemToCart, removeItemFromCart, clearItemFromCart } = useCart();
	
	const { price: totalPrice } = usePrice({
		amount: item.itemTotal,
		currencyCode: "THB",
	});

	return (
		<motion.div
			layout
			initial="from"
			animate="to"
			exit="from"
			
			variants={fadeInOut(0.25)}
			className={`group w-full h-auto text-maroon flex justify-start items-center bg-olive py-4 md:py-7 border-b border-gray-100 relative last:border-b-0`}
			title={item?.name}
		>
	<div className="relative flex text-maroon w-24 md:w-28 h-24 md:h-28 rounded-md overflow-hidden flex-shrink-0 cursor-pointer me-4">
  <Image
    src={item.image?item.image:"https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FMargharitaL.jpg?alt=media&token=ac9cd778-6f2f-4c9d-a22d-83f8f0dcb497&_gl=1*1q9c3nz*_ga*MTc1OTI0NTc5MC4xNjQ4OTA2MTQ5*_ga_CW55HF8NVT*MTY5ODA3OTMyOC41Ni4xLjE2OTgwODExMjguNDUuMC4w"}
    width={112}
    height={112}
    loading="eager"
    alt={item.name || "Product Image"}
    className="bg-maroon object-cover z-8 " // Initially set z-index to 10
  />
  <div
    className="absolute top-0 start-0 z-9 h-full w-full  flex justify-center items-center transition duration-200 ease-in-out md:group-hover:bg-opacity-30 group-hover:opacity-99" style={{background:"rgb(0 0 0 / 0%);"}}
    onClick={() => clearItemFromCart(item.id)}
    role="button"
  >
    <IoIosCloseCircle className="relative text-white text-2xl transform md:scale-0 md:opacity-0 transition duration-300 ease-in-out md:group-hover:scale-100 md:group-hover:opacity-100" />
  </div>
</div>



			<div className="flex flex-col w-full overflow-hidden">
				<Link
					href={`${ROUTES.PRODUCT}/${item?.slug}`}
					className="truncate text-sm  mb-1.5 -mt-1"
				>
					{generateCartItemName(item.name, item.attributes)}
				</Link>
				<span className="text-sm text-maroon mb-2.5">
					{t("text-unit-price")} : &nbsp;
					{item?.price}
				</span>

				<div className="flex items-end justify-between">
					<Counter
						quantity={item.quantity}
						onIncrement={() => addItemToCart(item, 1)}
						onDecrement={() => removeItemFromCart(item.id)}
						variant="dark"
					/>
					<span className="font-semibold text-sm md:text-base   text-maroon leading-5">
						{totalPrice}
					</span>
				</div>
			</div>
		</motion.div>
	);
};

export default CartItem;
