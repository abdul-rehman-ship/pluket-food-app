import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { fadeInTop } from "@utils/motion/fade-in-top";
import {
	useUpdateUserMutation,
	UpdateUserType,
} from "@framework/customer/use-update-customer";
import axios from 'axios';
import {toast,Toaster} from 'react-hot-toast'
import {useEffect,useState} from 'react'
import { useTranslation } from "next-i18next";
import Cookies from 'js-cookie'
const defaultValues = {};
const AccountDetails: React.FC = () => {
	const {  isLoading } = useUpdateUserMutation();
	const { t } = useTranslation();
	const [user,setUser]:any=useState()
	const [username,setUsername]:any=useState("")
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
			axios.post('/api/auth/getUser',{
				email:Cookies.get('email')
			}).then(res=>{
				setUser(res.data.user)
				setUsername(res.data.user?.name)
				
			}).catch(err=>{
				console.log(err);
				
			})
			
		} catch (error:any) {
			console.log(error)

			
		}
	}
	async function onSubmit(input: any) {
		console.log(input);
		toast.loading("loading ...")
		axios.post('/api/auth/updateUser',{
			username:username,
			email:user.email
		}).catch((error:any)=>{
			toast.remove()
			console.log(error);
			
		}).then(()=>{
			toast.remove()
			toast.success("Account updated")
		})

		
		
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
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
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
							{...register("firstName", {
								required: "forms:first-name-required",
							})}
							variant="solid"
							className="w-full sm:w-1/2"
							value={username}
							onChange={(e:any)=>setUsername(e.target.value)}
							errorKey={errors.firstName?.message}
						/>
						<Input
							labelKey="forms:Email *"
							{...register("lastName", {
								
							})}
							readOnly
							variant="solid"
							value={user?.email}
							className="w-full sm:w-1/2"
							errorKey={errors.lastName?.message}
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
						<Button
							type="submit"
							loading={isLoading}
							disabled={isLoading}
							className="h-12 mt-3 w-full sm:w-32"
						>
							{t("common:button-save")}
						</Button>
					</div>
				</div>
			</form>
		</motion.div>
	);
};

export default AccountDetails;
