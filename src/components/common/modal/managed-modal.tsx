import { useUI } from "@contexts/ui.context";
import Modal from "./modal";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@components/auth/login-form")) as any ;
const SignUpForm = dynamic(() => import("@components/auth/sign-up-form")) as any ;
const ForgetPasswordForm = dynamic(() =>
	import("@components/auth/forget-password-form")) as any

const ProductPopup = dynamic(() => import("@components/product/product-popup")) as any;
const ManagedModal: React.FC = () => {
	const { displayModal, closeModal, modalView } = useUI();
	return (
		<Modal open={displayModal} onClose={closeModal}>
			{modalView === "LOGIN_VIEW" && <LoginForm />}
			{modalView === "SIGN_UP_VIEW" && <SignUpForm />}
			{modalView === "FORGET_PASSWORD" && <ForgetPasswordForm />}
			{modalView === "PRODUCT_VIEW" && <ProductPopup />}
		</Modal>
	);
};

export default ManagedModal;
