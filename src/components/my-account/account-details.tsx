import Input from "@components/ui/input";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { fadeInTop } from "@utils/motion/fade-in-top";
import {
	
	UpdateUserType,
} from "@framework/customer/use-update-customer";

import {toast,Toaster} from 'react-hot-toast'
import {useEffect,useState} from 'react'
import { useTranslation } from "next-i18next";
import Cookies from 'js-cookie'
import { getDocs,collection,doc, updateDoc } from "firebase/firestore";
import {db} from "../../../firebase"
const defaultValues = {};
const AccountDetails: React.FC = () => {
	
	const { t } = useTranslation();
	const [userId,setUserId]:any=useState("")
	const [user,setUser]:any=useState()
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdateUserType>({
		defaultValues,
	});
	useEffect(()=>{
		getUser()
	},[])
	const getUser=async ()=>{
		try {
			
		await getDocs(collection(db, "users")).then((querySnapshot:any) => {
				querySnapshot.forEach((doc:any) => {
					if(doc.data().email===Cookies.get("email")){
						setUserId(doc.id)
						setUser(doc.data())
						
					}
				});
		})
			
		toast.dismiss()
		} catch (error:any) {
			
			console.log(error)

			
		}
	}
	async function onSubmit(input: any) {
		toast.loading("loading ...")
		await updateDoc(doc(db, "users",userId), {
			name:input.name,
			address:input.address,
			phone:input.phone,
			
		}).catch((error:any)=>{
			toast.dismiss()
			console.log(error)
			toast.error(error.message)
		}).then(()=>{
			getUser()
		})
		toast.dismiss()
		// console.log(input);
		// toast.loading("loading ...")
		// axios.post('/api/auth/updateUser',{
		// 	username:username,
		// 	email:user.email
		// }).catch((error:any)=>{
		// 	toast.remove()
		// 	console.log(error);
			
		// }).then(()=>{
		// 	toast.remove()
		// 	toast.success("Account updated")
		// })

		
		
	}

	return (
		<motion.div
			layout
			initial="from"
			animate="to"
			exit="from"
			//@ts-ignore
			variants={fadeInTop(0.35)}
			className={`w-full flex flex-col`}
		>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-olive mb-6 xl:mb-8">
				{t("common:text-account-details")}
			</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full mx-auto flex flex-col justify-center "
				noValidate
			>
				<div className="flex flex-col space-y-4 sm:space-y-5">
					<Toaster/>
					<div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
						<Input
							labelKey="forms:Name *"
							{...register("name", {
								required: "forms:name-required",
							})}
							variant="solid"
							className="w-full sm:w-1/2"
							value={user?.name}
							onChange={(e:any)=>setUser({...user,name:e.target.value})}
							errorKey={errors.name?.message}
							detail="yes"
						/>
						<Input
							labelKey="forms:Email *"
							{...register("email", {
								
								
							})}
							readOnly
							variant="solid"
							
							value={user?.email}
							className="w-full sm:w-1/2"
							errorKey={errors.email?.message}
							detail="yes"

						/>
						<Input
							labelKey="forms:address *"
							{...register("address", {
								
								
							})}
							
							variant="solid"
							onChange={(e:any)=>setUser({...user,address:e.target.value})}
							value={user?.address}
							className="w-full sm:w-1/2"
							errorKey={errors.address?.message}
							detail="yes"

						/><Input
						labelKey="forms:phone *"
						{...register("phone", {
							
							
						})}
						
						variant="solid"
						onChange={(e:any)=>setUser({...user,phone:e.target.value})}
						value={user?.phone}
						className="w-full sm:w-1/2"
						errorKey={errors.phone?.message}
						detail="yes"

					/>
					</div>
					{/* <Input
						labelKey="forms:label-display-name"
						{...register("displayName", {
							required: "forms:display-name-required",
						})}
						variant="solid"
						errorKey={errors.displayName?.message}
					/> */}
					{/* <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
						<Input
							type="tel"
							labelKey="forms:label-phone"
							{...register("phoneNumber", {
								required: "forms:phone-required",
							})}
							variant="solid"
							className="w-full sm:w-1/2"
							errorKey={errors.phoneNumber?.message}
						/>
						<Input
							type="email"
							labelKey="forms:label-email-star"
							{...register("email", {
								required: "forms:email-required",
								pattern: {
									value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: "forms:email-error",
								},
							})}
							variant="solid"
							className="w-full sm:w-1/2"
							errorKey={errors.email?.message}
						/>
					</div>
					<div className="relative flex flex-col">
						<span className="mt-2 text-sm text-heading font-semibold block pb-1">
							{t("common:text-gender")}
						</span>
						<div className="mt-2 flex items-center space-s-6">
							<RadioBox
								labelKey="forms:label-male"
								{...register("gender")}
								value="male"
							/>
							<RadioBox
								labelKey="forms:label-female"
								{...register("gender")}
								value="female"
							/>
						</div>
					</div> */}
					<div className="relative">
						{/* <Button
							type="submit"
							loading={isLoading}
							disabled={isLoading}
							className="h-12 mt-3  bg-olive text-maroon w-full sm:w-32"
						>
							{t("common:button-save")}
						</Button> */}
						<button type="submit" className="bg-olive text-maroon font-bold rounded-md btn hover:text-maroon hover:bg-olive">
							{t("common:button-save")}
						</button>
					</div>
				</div>
			</form>
		</motion.div>
	);
};

export default AccountDetails;
