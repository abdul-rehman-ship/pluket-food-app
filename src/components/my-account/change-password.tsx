
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { fadeInTop } from "@utils/motion/fade-in-top";
import {
	
	ChangePasswordInputType,
} from "@framework/customer/use-change-password";
import { useTranslation } from "next-i18next";
import {sendPasswordResetEmail} from 'firebase/auth'
import {auth} from '../../../firebase'
import cookie from 'js-cookie'
import {toast,Toaster} from 'react-hot-toast'
import Input from "@components/ui/input";
const defaultValues = {
	oldPassword: "",
	newPassword: "",
};

const ChangePassword: React.FC = () => {
	

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ChangePasswordInputType>({
		defaultValues,
	});
	async function onSubmit(input: ChangePasswordInputType) {
		if(input.email===cookie.get("email")){
			await sendPasswordResetEmail(auth,input.email).then(()=>{
				toast.success("Reset Password Link Sent. Check Your Email")
			}).catch((err:any)=>{
				console.log(err.message)

			})
		
			
	}else{
		toast.error("Email Not Matched")
	}
}
	const { t } = useTranslation();
	return (
		<>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-olive mb-6 xl:mb-8">
				{t("common:text-change-password")}
			</h2>
			<motion.div
				layout
				initial="from"
				animate="to"
				exit="from"
				//@ts-ignore
				variants={fadeInTop(0.35)}
				className={`w-full flex  h-full lg:w-8/12 flex-col`}
			>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-full mx-auto flex flex-col justify-center "
				>
					<Toaster/>
					<div className="flex flex-col space-y-3">
						<Input
							labelKey="forms:label-email"
							errorKey={errors.oldPassword?.message}
							{...register("email", {
								required: "forms:email-required",
							})}
							className="mb-4"
							detail="yes"
						/>
						
						<div className="relative">
							
							<button type="submit" className="bg-olive text-maroon font-bold rounded-md btn hover:text-maroon hover:bg-olive">
							{t("common:Get link")}
						</button>
						</div>
					</div>
				</form>
			</motion.div>
		</>
	);
};

export default ChangePassword;
