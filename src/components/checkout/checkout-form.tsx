import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Router from "next/router";
import { useCheckoutMutation } from "@framework/checkout/use-checkout";
import Map from "@components/map";
import { getDownloadURL,ref,uploadBytesResumable } from "firebase/storage";
import { useTranslation } from "next-i18next";
import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import {useEffect, useState} from 'react'
import getStripe from '../../lib/get-stripe';
import Cookies from 'js-cookie';
import { useUI } from "@contexts/ui.context";
import axios from "axios"
import { db,storage } from "../../../firebase";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { toast ,Toaster} from "react-hot-toast";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

interface CheckoutInputType {
	name: string;
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
	const {isAuthorized}=useUI();
	const [user,setUser]:any=useState({})
	const [type,setType]:any=useState("delivery")
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mInput,setInput]:any=useState({})
	
  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);

  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
	if(items.length===0){
		return <div className="text-olive font-semibold">
		Please Add product to cart to see this page
	</div>
	}
if(!isAuthorized){
	return <div className="text-olive font-semibold">
		Please login to see this page
	</div>
}
	
	const { price: subtotal } = usePrice({
		amount: total,
		currencyCode: "THB",
	});
	const [paymentMethod, setPaymentMethod] = useState("whatsapp");
	const [selectedFile, setSelectedFile]:any = useState(null);

	const handleFileChange = (event:any) => {
	  const file = event.target.files[0];
	  if (file) {
		setSelectedFile(file);
	  }
	};
	const handlePaymentChange = (event:any) => {
	  setPaymentMethod(event	);
	};
	const getUser=async()=>{
		await getDocs(collection(db, "users")).then((querySnapshot:any) => {
			querySnapshot.forEach((doc:any) => {
				if(doc.data().email==Cookies.get('email')){
					setUser({id:doc.id,...doc.data()})
				}
			});
		})
	}
	useEffect(() => {
		if(isAuthorized && Cookies.get('email')){
		getUser()
		}
	})
	const uploadFiles = async (folder: string, files: File[]) => {
		const promises: any[] = [];
	
		files.forEach((file) => {
		  const storageRef = ref(storage, `${folder}/${file.name}`);
		  const uploadTask = uploadBytesResumable(storageRef, file);
		  promises.push(uploadTask);
		});
	
		const result = await Promise.all(promises);
		const urlPromises = result.map(async (item) => {
		  const path = item.ref.toString();
		  return await downloadFile(path);
		});
	
		return await Promise.all(urlPromises);
	  };
	  const downloadFile = async (path: string) => {
		let item: string = "";
		await getDownloadURL(ref(storage, path))
		  .then((url) => (item = url))
		  .catch((err) => {
			return toast.error(err.message);
		  });
	
		return item;
	  };
	const prodItems = items.map((product) => ({
		price_data: {
		  currency: 'thb',
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
const loadWhatsapp=async(item:any)=>{
	let input:any=mInput
	
	const phoneNumber = '+66 0 929967091 ';

	const productName = encodeURIComponent(item.name);
	const productSize = encodeURIComponent(item.size);
	const productQuantity = encodeURIComponent(item.quantity);
	const productPrice = encodeURIComponent(item.price);
	
	
	const total = encodeURIComponent(item.itemTotal);
	const customerName = encodeURIComponent(user.name);
	const customerPhone = encodeURIComponent(user.phone);
	const customerEmail = encodeURIComponent(user.email);
	const customerAddress = encodeURIComponent(input.address);
	const location = `https://www.google.com/maps?q=${Cookies.get('lat')},${Cookies.get('lng')}`;
	const type =encodeURIComponent( 'Cash on delivery')
	
	
	const encodedText = encodeURIComponent(`New order from Phuket Pizza\n\n*Delivery order*\n🍕${productName}\nSize: ${productSize}\nQuantity: ${productQuantity}\nPrice: ${productPrice}\n\nTotal: ${total}\n\n*Customer Details*\nName: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}\nAddress: ${customerAddress}\n\nLocation: ${location}\n\payment:\n${type}`);
	
	const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneNumber)}&text=${encodedText}`;
	window.open(whatsappUrl, '_blank');
}
	const handleProcessOrder=async()=>{
		const input:any=mInput
		setUser({...user,address:input.address})
		let flag=true
		
		if(!flag){
			toast.error("low stock")
			return
		}else{
			if(paymentMethod=="whatsapp"){
				const userEmail= Cookies.get('email');
				if(userEmail){
					toast.loading("Placing Order...");
					try {
						items.map(async (item:any)=>{
		  
		 
						  await addDoc(collection(db, "orders"), {
							user:{...user},
							userEmail,
							product:item,
							note:input.note?input.note:"",
							amount:item.price,
							total:item.itemTotal,
							createdAt:serverTimestamp(),
							paymentMethod:paymentMethod,
							shippingAddress:input.address?input.address:user.address,
							type:type,
							lat:Cookies.get('lat'),
							lng:Cookies.get('lng'),
							paid_status:"cash on delivery",
							status:"pending"
						  })
						.then(()=>{
							toast.dismiss();
						toast.success("Order Placed Successfully");
						setTimeout(() => {
							Router.push("/");
						}, 2000);
		
						
						setTimeout(() => {
							loadWhatsapp(item)

						},2000)
						
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
				let state=true
				
				if(state){
				Cookies.set('address',input.address?input.address:user.address);
				Cookies.set('note',input.note?input.note:"")
				const encodedArr = encodeURIComponent(JSON.stringify({...items}));
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
				}else{
					toast.error("low stock")
				}
			}else if(paymentMethod==="scanlater"){
				const userEmail= Cookies.get('email');
				if(userEmail){
					toast.loading("Placing Order...");
					try {items.map(async (item:any)=>{
		  
		
						  await addDoc(collection(db, "orders"), {
							user:{...user,address:input?.address},
							product:item,
							note:input.note?input.note:"",
							userEmail,
							amount:item.price,
							total:item.itemTotal,
							createdAt:serverTimestamp(),
							paymentMethod:paymentMethod,
							shippingAddress:input.address?input.address:user.address?user.address:"",
							type:type,
							lat:Cookies.get('lat'),
							lng:Cookies.get('lng'),
							paid_status:"scan and pay",
							status:"pending"
						  })
						.then(()=>{
							toast.dismiss();
						toast.success("Order Placed Successfully");
						setTimeout(() => {
							Router.push("/");
						}, 2000);
						})
						
						setTimeout(() => {
							loadWhatsapp(item)

						},2000)
					})
					
					} catch (error:any) {
						toast.dismiss()
						toast.error("Something went wrong");
					}
					
				}else{
					toast.error("Please Login First");
				}
		
			}else if(paymentMethod==="scannow"){
				if(!selectedFile){
					toast.error("Please upload reciept")
					return
				}
				const userEmail= Cookies.get('email');
				if(userEmail){
					toast.loading("Placing Order...");
					const urls = await uploadFiles("images", [selectedFile]);
					try {items.map(async (item:any)=>{
		  
						  await addDoc(collection(db, "orders"), {
							user:{...user,address:input.address},
							product:item,
							userEmail,
							note:input.note?input.note:"",
							amount:item.price,
							total:item.itemTotal,
							createdAt:serverTimestamp(),
							paymentMethod:paymentMethod,
							shippingAddress:input.address?input.address:user.address,
							type:type,
							lat:Cookies.get('lat'),
							lng:Cookies.get('lng'),
							paid_status:"paid",
							status:"pending",
							reciept:urls[0]?urls[0]:""
							
						  })
						.then(()=>{
							toast.dismiss();
							setSelectedFile(null)
						toast.success("Order Placed Successfully");
						setTimeout(() => {
							Router.push("/");
						}, 2000);
						})
						
						setTimeout(() => {
							loadWhatsapp(item)

						},2000)
					})
					
					} catch (error:any) {
						toast.dismiss()
						toast.error("Something went wrong");
					}
					
				}else{
					toast.error("Please Login First");
				}
				setSelectedFile(null)
		
			}
		}
			
		
			}
async	function onSubmit(input: CheckoutInputType) {
setInput(input)
openModal();

}
	const handleType=async(e:any)=>{
		setType(e)
	}
	return (
		<>
		<Toaster/>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-olive mb-6 xl:mb-8">
				{t("text-Delivery-address")}
			</h2>
			<div className="flex gap-2 m-2">
			<button
          onClick={()=>handleType("delivery")}
          
          
          className={` border-2 border-olive rounded-md px-4 font-bold py-2 cursor-pointer transition duration-200 ${
            type === "delivery" ? 'bg-olive text-maroon' : ' bg-maroon text-olive hover:bg-olive hover:text-maroon'
          }`}
        >
          Delivery
        </button>
		<button
          
          onClick={()=>handleType("takeout")}
          className={` border-2 border-olive rounded-md px-4 font-bold py-2 cursor-pointer transition duration-200 ${
            type === "takeout" ? 'bg-olive text-maroon' : ' bg-maroon text-olive hover:bg-olive hover:text-maroon'
          }`}
        >
          Pick up
        </button>
			</div>
			
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full mx-auto flex flex-col justify-center "
				noValidate
			>
			<div className="flex gap-2 sm:flex-col  md:flex-row items-center justify-between m-2 lg:flex-row space-y-4 lg:space-y-0">
  <div style={{ flex: 1 }}>
    <Input
      labelKey="forms:label-name"
      {...register("name", {
        
      })}
      errorKey={errors.name?.message}
      variant="solid"
      detail="yes"
	  value={user?.name}
	  disabled
	  readOnly
    />
  </div>
  <div style={{ flex: 1 }}>
    <Input
      labelKey="forms:label-phone"
      {...register("phone", {
        
      })}
      errorKey={errors.phone?.message}
      variant="solid"
      detail="yes"
	  value={user?.phone}
	  disabled
	  readOnly
    />
  </div>
</div>

				<div className="flex flex-col space-y-4 lg:space-y-5">
				
				<Input
				labelKey="forms:label-email"
				{...register("email", {
					
				})}
				errorKey={errors.email?.message}
				variant="solid"
				detail="yes"
				value={user?.email}
				disabled
			/>
			 <Input
      labelKey="forms:Note"
      {...register("note", {
        
      })}
      errorKey={errors.note?.message}
      variant="solid"
      detail="yes"
	  value={user?.note}
	  
    />
			{
				user.referrer==="yes"?<>
				<Input
				labelKey="forms:Venue Name"
				{...register("email", {
					
				})}
				errorKey={errors.email?.message}
				variant="solid"
				detail="yes"
				value={user?.venueName}
				disabled
			/><Input
			labelKey="forms:Venue Location"
			{...register("email", {
				
			})}
			errorKey={errors.email?.message}
			variant="solid"
			detail="yes"
			value={user?.venueLocation}
			disabled
		/>
		<Input
				labelKey="forms:social Media Link"
				{...register("email", {
					
				})}
				errorKey={errors.email?.message}
				variant="solid"
				detail="yes"
				value={user?.socialMediaLink}
				disabled
			/>
			
		<div>
		<h3 className="text-olive font-bold my-2">Logo</h3>
		<img src={user?.logo} style={{width:"20rem",height:"auto"}}/>
			
		</div>
				</>:""
			}
			
					{type==="delivery"&&<Input
						labelKey="forms:label-address"
						{...register("address", {
							
						})}
						errorKey={errors.address?.message}
						variant="solid"
						detail="yes"
						value={user?.address}
					/>}
					{type==="delivery"&&<div className="row">
						<Map/>
					</div>}
					
					<div className="flex flex-col space-y-4 lg:space-y-5">
        
        <label htmlFor="payment" className=" text-olive font-semibold">
          Payment Method
        </label>
        <div className="mt-2">
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-olive"
                name="payment"
                value="whatsapp"
				
                checked={paymentMethod === "whatsapp"}
                onChange={()=>handlePaymentChange("whatsapp")}
              />
              <span className="ml-2 text-olive">Cash on delivery</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-olive"
                name="payment"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={()=>handlePaymentChange("stripe")}
              />
              <span className="ml-2 text-olive">Credit Card</span>
            </label>
          </div>
		  <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-olive"
                name="payment"
                value="scannow"
                checked={paymentMethod === "scannow"}
                onChange={()=>handlePaymentChange("scannow")}
              />
              <span className="ml-2 text-olive">QR code scan Now</span>
            </label>
          </div> 
		    <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-olive"
                name="payment"
                value="scanlater"
                checked={paymentMethod === "scanlater"}
                onChange={()=>handlePaymentChange("scanlater")}
              />
              <span className="ml-2 text-olive">QR code scan Later</span>
            </label>
          </div>
	{	paymentMethod==="scannow" && <div className="  mx-auto mt-4">
			<h2 className="m-2 text-olive">Scan and pay now and upload reciept</h2>
      <img style={{width:"20rem",height:"auto"}}
        src="/assets/images/qrcode.png" // Replace with the actual path to your image
        alt="Image Description"
        className="w-full h object-cover"
      />
	  
      <form>
        <label className="block mt-2 text-olive font-bold mb-2" htmlFor="imageUpload">
          Upload Receipt:
        </label>
        <input
          type="file"
          id="imageUpload"
          name="imageUpload"
          accept="image/*" // Allow only image file types
          onChange={handleFileChange}
          className="border rounded text-olive p-2 w-full"
		  required
        />
		
      </form>
    
	  
    </div>}
        </div>
        
      </div>
	   
					
					<div className="flex w-full">
						<button
							className="w-full sm:w-auto bg-olive text-maroon font-bold btn hover:bg-olive hover:text-maroon"
							
							disabled={isLoading}
						>
							{t("common:button-place-order")}
						</button>
					</div>
				</div>
			</form>
			<Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to place the order?</p>
        </Modal.Body>
        <Modal.Footer>

          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProcessOrder}>
            Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>
		</>
	);
};

export default CheckoutForm;
