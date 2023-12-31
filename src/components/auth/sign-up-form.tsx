import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";


import {
  
	
	collection,

	setDoc,
	doc,
	
	serverTimestamp,
  } from "firebase/firestore";
import { db } from "../../../firebase";
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { useState } from "react";
import { useUI } from "@contexts/ui.context";
import { useSignUpMutation, SignUpInputType } from "@framework/auth/use-signup";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";

import {auth } from '../../../firebase'
import cookies from 'js-cookie'
import  Router  from "next/router";


const SignUpForm: React.FC = () => {
	const { t } = useTranslation();
	const { mutate: signUp, isLoading } = useSignUpMutation();
	

	const[loading,setLoading]:any=useState(false)
	const [msg,setMsg]:any=useState("")
	const {  closeModal } = useUI();
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpInputType>();

	function handleSignIn() {
		Router.push('/signin')
	}

	async function   onSubmit({ name, email, password ,address,phone,country}: SignUpInputType) {
		
	try {
		setLoading(true)
		setMsg("loading ...")
		
		await createUserWithEmailAndPassword(auth,email,password)
		 setMsg("uploading data ...")

		 const userRef:any = 	collection(db, 'users');
    const newUserRef:any = doc(userRef); // Firestore will automatically generate a unique ID

		 
			await  setDoc(newUserRef, {
			
				name,
				email,
				password,
				address,
				phone: country + phone,
				orders: [],
				referrer: 'no',
				createdAt: serverTimestamp(),
			  })
			  cookies.set("email",email)

		
		setLoading(false)
		setMsg("Account created Successfully.  ")
		signUp({ email, password, name, address,phone,country });
		
			  Router.push('/')
		 
		
	  
		  // Add more documents if needed
	  
		  
		
	} catch (error:any) {
		setLoading(false)
		setMsg(error.message)
		
		
		
	}

		
		
		
		
		


		
		
	}
	return (
		<div className="py-6 px-5 sm:p-8 bg-white mx-auto rounded-lg w-full sm:w-96 md:w-450px border border-gray-300">
			<div className="text-center mb-9 pt-2.5">
				<div onClick={closeModal}>
					
				</div>
				<p className="text-sm md:text-base text-body mt-3 sm:mt-4 mb-8 sm:mb-10">
					{t("common:registration-helper")}{" "}
					<Link
						href={ROUTES.TERMS}
						className="text-heading underline hover:no-underline focus:outline-none"
					>
						{t("common:text-terms")}
					</Link>{" "}
					&amp;{" "}
					<Link
						href={ROUTES.POLICY}
						className="text-heading underline hover:no-underline focus:outline-none"
					>
						{t("common:text-policy")}
					</Link>
				</p>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col justify-center"
				noValidate
			>
				<div className="flex flex-col space-y-4">
					<Input
						labelKey="forms:label-name"
						type="text"
						variant="solid"
						{...register("name", {
							required: "forms:name-required",
						})}
						errorKey={errors.name?.message}
						detail="no"

					/>
					<Input
						labelKey="forms:label-address"
						type="text"
						variant="solid"
						{...register("address", {
							required: "forms:address-required",
						})}
						errorKey={errors.address?.message}
						detail="no"

					/>
					<Input
						labelKey="forms:country-code"
						type="number"
						variant="solid"
						{...register("country", {
							required: "forms:country-required",
						})}
						errorKey={errors.country?.message}
						detail="no"
					
					/>

					<Input
						labelKey="forms:label-phone"
						type="number"
						variant="solid"
						{...register("phone", {
							required: "forms:phone-required",
						})}
						errorKey={errors.phone?.message}
						detail="no"
					
					/>
					<Input
						labelKey="forms:label-email"
						type="email"
						variant="solid"
						{...register("email", {
							required: `${t("forms:email-required")}`,
							pattern: {
								value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								message: t("forms:email-error"),
							},
						})}
						errorKey={errors.email?.message}
						detail="no"

					/>
					<PasswordInput
						labelKey="forms:label-password"
						errorKey={errors.password?.message}
						{...register("password", {
							required: `${t("forms:password-required")}`,
						})}
					/>
					<span>
						{
							loading ? <div className="text-center my-2 text-red-500">{msg}</div> : msg
						}
					</span>
					<div className="relative">
						<Button
							type="submit"
							loading={isLoading}
							disabled={isLoading}
							className="h-11 md:h-12 w-full mt-3"
						>
							{t("common:text-register")}
						</Button>
					</div>
				</div>
			</form>
			<div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-10 mb-6 sm:mb-7">
				<hr className="w-full border-gray-300" />
				<span className="absolute -top-2.5 px-2 bg-white">
					{t("common:text-or")}
				</span>
			</div>
			<div className="text-sm sm:text-base text-body text-center">
				{t("common:text-have-account")}{" "}
				<button
					type="button"
					className="text-sm sm:text-base text-heading underline font-bold hover:no-underline focus:outline-none"
					onClick={handleSignIn}
				>
					{t("common:text-login")}
				</button>
			</div>
		</div>
	);
};

export default SignUpForm;
