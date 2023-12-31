import React, { useRef } from "react";
import LanguageSwitcher from "@components/ui/language-switcher";
import { siteSettings } from "@settings/site-settings";
import HeaderMenu from "@components/layout/header/header-menu";

import { useUI } from "@contexts/ui.context";
import { ROUTES } from "@utils/routes";
import { addActiveScroll } from "@utils/add-active-scroll";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import Logo from '@components/ui/logo'
import { Toaster } from "react-hot-toast";
import Router  from "next/router";

const AuthMenu = dynamic(() => import("./auth-menu"), { ssr: false }) as any;
const CartButton = dynamic(() => import("@components/cart/cart-button"), {
	ssr: false,
}) as any;

type DivElementRef = React.MutableRefObject<HTMLDivElement>;
const { site_header } = siteSettings;
const Header: React.FC = () => {
	const {
		openSidebar,
		setDrawerView,
		openSearch,
		
		
		isAuthorized,
	} = useUI();
	const { t } = useTranslation("common");
	const siteHeaderRef = useRef() as DivElementRef;
	addActiveScroll(siteHeaderRef);

	function handleLogin() {
		Router.push('/signin')
	}
	function handleMobileMenu() {
		setDrawerView("MOBILE_MENU");
		return openSidebar();
	}

	return (
		<header
			id="siteHeader"
			ref={siteHeaderRef}
			className="w-full h-16 sm:h-20 lg:h-24 relative z-20  "  
		>
			<Toaster />
			<div className="innerSticky text-gray-700 body-font fixed w-full h-16 sm:h-20 lg:h-24 z-20 ps-4 md:ps-0 lg:ps-6 pe-4 lg:pe-6 transition duration-200 ease-in-out"  
			style={{backgroundColor:"#8A2BE2FF !important"}}
			>
				<div className="flex items-center justify-center mx-auto max-w-[1920px] h-full w-full" >
					<button
						aria-label="Menu"
						className="menuBtn hidden md:flex lg:hidden flex-col items-center justify-center px-5 2xl:px-7 flex-shrink-0 h-full outline-none focus:outline-none"
						onClick={handleMobileMenu}
					>
						<span className="menuIcon">
							<span className="bar" />
							<span className="bar" />
							<span className="bar" />
						</span>
					</button>
					<Logo/>
					<HeaderMenu
						data={site_header.menu}
						className="hidden lg:flex md:ms-6 xl:ms-10"
					/>
					

					<div className="flex-shrink-0 ms-auto lg:me-5 xl:me-8 2xl:me-10">
					
						<LanguageSwitcher />
					</div>
					
					
					<div className="hidden md:flex justify-end items-center space-s-6 lg:space-s-5 xl:space-s-8 2xl:space-s-10 ms-auto flex-shrink-0">
						<button
							className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none transform"
							onClick={openSearch}
							aria-label="search-button"
						>
							{/* <SearchIcon /> */}
						</button>
						<div className="-mt-0.5 flex-shrink-0">
							<AuthMenu
								isAuthorized={isAuthorized}
								href={ROUTES.ACCOUNT}
								className="text-sm xl:text-base  text-olive font-bold hover:text-olive"
								
								btnProps={{
									className:
										"text-sm xl:text-base   font-bold text-olive focus:outline-none",
									children: t("text-sign-in"),
									onClick: handleLogin,
								}}
							>
								{t("text-account")}
							</AuthMenu>
						</div>
						<CartButton />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
