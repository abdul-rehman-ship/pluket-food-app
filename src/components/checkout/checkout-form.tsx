import Input from "@components/ui/input";
import { useForm } from "react-hook-form";

import { useCheckoutMutation } from "@framework/checkout/use-checkout";

import Button from "@components/ui/button";
import { useTranslation } from "next-i18next";
import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import {useState} from 'react'
import getStripe from '../../lib/get-stripe';
import Cookies from 'js-cookie';

import axios from "axios"
import { toast ,Toaster} from "react-hot-toast";
interface CheckoutInputType {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	address: string;
	city: string;
	zipCode: string;
	save: boolean;
	note: string;
}

const CheckoutForm: React.FC = () => {
	const { t } = useTranslation();
	const { items, total } = useCart();
	console.log(items);
	
	const { price: subtotal } = usePrice({
		amount: total,
		currencyCode: "USD",
	});
	const [paymentMethod, setPaymentMethod] = useState("cod");

	const handlePaymentChange = (event:any) => {
	  setPaymentMethod(event.target.value);
	};
	
	const prodItems = items.map((product) => ({
		price_data: {
		  currency: 'usd',
		  product_data: {
			name: product.name,
			images:[product.image]
			
		  },
		  
		  unit_amount: (product.price * 100),
		},
		quantity: product.quantity,
	  }));
	 
	const {  isLoading } = useCheckoutMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutInputType>();
async	function onSubmit(input: CheckoutInputType) {
let flag=true
items.map((item)=>{
	let quan:any=item.quantity
	if(quan>item?.stock){
		flag=false
		return
	}
	
})
if(!flag){
	toast.error("low stock")
}else{
	if(paymentMethod=="cod"){
		const userEmail= Cookies.get('email');
		if(userEmail){
			toast.loading("Placing Order...");
			try {items.map(async (item)=>{
  const _id=new Date().getTime().toString() + item.id
  const quan:any=item.quantity
				await axios.post('/api/updateProduct',{
					_id:item.id,
					stock:item.stock-quan

				})
				await axios.post('/api/orders/addOrder',{
					_id,
					userEmail,
					productId:item.id,
					amount:item.price,
					total:item.itemTotal,
					date:new Date().toDateString(),
					paymentMethod:paymentMethod,
					shippingAddress:input.address,
					paid_status:"cod"
				}).then(()=>{
					toast.dismiss();
				toast.success("Order Placed Successfully");
				})
			})
			
			} catch (error:any) {
				toast.dismiss()
				toast.error("Something went wrong");
			}
			
		}else{
			toast.error("Please Login First");
		}
	}else if(paymentMethod=="stripe"){
		
		
		Cookies.set('address',input.address);
		const encodedArr = encodeURIComponent(JSON.stringify(items));
		Cookies.set('data',encodedArr);
        const {
			data: { id },
		  } = await axios.post('/api/checkout_sessions', {
			items: prodItems,
			total:subtotal,
			
		  });
		
		  // Redirect to checkout
		  const stripe = await getStripe();
		  await stripe.redirectToCheckout({ sessionId: id });
	}
}
	

	}

	return (
		<>
		<Toaster/>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
				{t("text-shipping-address")}
			</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full mx-auto flex flex-col justify-center "
				noValidate
			>
				<div className="flex flex-col space-y-4 lg:space-y-5">
					
					<Input
						labelKey="forms:label-address"
						{...register("address", {
							required: "forms:address-required",
						})}
						errorKey={errors.address?.message}
						variant="solid"
					/>
					
					<div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
						<Input
							labelKey="forms:label-city"
							{...register("city")}
							variant="solid"
							className="w-full lg:w-1/2 "
						/>

						<Input
							labelKey="forms:label-postcode"
							{...register("zipCode")}
							variant="solid"
							className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
						/>
						
     
					</div>
					<div className="flex flex-col space-y-4 lg:space-y-5">
        
        <label htmlFor="payment" className="font-medium text-gray-700">
          Payment Method
        </label>
        <div className="mt-2">
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={handlePaymentChange}
              />
              <span className="ml-2">Cash on Delivery</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="payment"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={handlePaymentChange}
              />
              <span className="ml-2">Stripe Payment</span>
            </label>
          </div>
        </div>
        
      </div>
					
					<div className="flex w-full">
						<Button
							className="w-full sm:w-auto"
							loading={isLoading}
							disabled={isLoading}
						>
							{t("common:button-place-order")}
						</Button>
					</div>
				</div>
			</form>
		</>
	);
};

export default CheckoutForm;
