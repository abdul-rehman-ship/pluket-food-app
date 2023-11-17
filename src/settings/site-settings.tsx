import { ILFlag } from "@components/icons/ILFlag";
import { SAFlag } from "@components/icons/SAFlag";
import { CNFlag } from "@components/icons/CNFlag";
import { USFlag } from "@components/icons/USFlag";
import { DEFlag } from "@components/icons/DEFlag";
import { ESFlag } from "@components/icons/ESFlag";
import {ThailandFlag} from "@components/icons/THLFlag";
export const siteSettings = {
	name: "Phuket Pizza",
	description:
		"Phuket Pizza app built with React, NextJS, TypeScript, React-Query and Tailwind CSS.",
	author: {
		name: "Phuket Pizza .",
		websiteUrl: "https://",
		address: "",
	},
	logo: {
		url: "/assets/images/logo.png",
		alt: "Logo",
		href: "/",
		width: 80,
		height: 70,
	},
	defaultLanguage: "en",
	currencyCode: "USD",
	site_header: {
		menu: [
			
			{
				id: 11,
				path: "/",
				label: "Home",
				
			},
			{
				id: 22,
				path: "/allProducts",
				label: "Products",
				
			},
			
			
			
			// {
			// 	id: 12,
			// 	path: "/contact-us",
			// 	label: "menu-contact-us",
				
			// },
			// {
			// 	id: 5,
			// 	path: "/search",
			// 	label: "menu-search",
				
			// },
			{
				id: 1,
				path: "/my-account",
				label: "menu-my-account",
				// subMenu: [
				// 	{
				// 		id: 1,
				// 		path: "/",
				// 		label: "menu-users",
				// 		subMenu: [
							
				// 			{
				// 				id: 2,
				// 				path: "/signin",
				// 				label: "menu-sign-in",
				// 			},
				// 			{
				// 				id: 3,
				// 				path: "/signup",
				// 				label: "menu-sign-up",
				// 			},
				// 			{
				// 				id: 4,
				// 				path: "/forget-password",
				// 				label: "menu-forget-password",
				// 			},
				// 		],
				// 	},
					
					
					
					
				
				// 	{
				// 		id: 8,
				// 		path: "/404",
				// 		label: "menu-404",
				// 	},
				// ],
			},
			{
				id: 2,
				path: "/checkout",
				label: "menu-checkout",
			},
			{
				id: 3,
				path: "/my-account/orders",
				label: "orders",
			},
			
		],
		mobileMenu: [
			
			{
				id: 11,
				path: "/",
				label: "Home",
				
			},
			{
				id: 22,
				path: "/allProducts",
				label: "Products",
				
			},
			
			
			
			
			
			
			
			{
				id: 1,
				path: "/my-account",
				label: "menu-users",
			
			},
			
			
					{
						id: 3,
						path: "/checkout",
						label: "menu-checkout",
					},
					{
						id: 2,
						path: "/my-account/orders",
						label: "orders",
					},
		],
		languageMenu: [
			{
				id: "ar",
				name: "عربى - AR",
				value: "ar",
				icon: <SAFlag width="20px" height="15px" />,
			},
			{
				id: "th",
				name: "ไทย - TH",
				value: "th",
				icon: <ThailandFlag width="20px" height="15px" />, 
			  },
			{
				id: "zh",
				name: "中国人 - ZH",
				value: "zh",
				icon: <CNFlag width="20px" height="15px" />,
			},
			{
				id: "en",
				name: "English - EN",
				value: "en",
				icon: <USFlag width="20px" height="15px" />,
			},
			{
				id: "de",
				name: "Deutsch - DE",
				value: "de",
				icon: <DEFlag width="20px" height="15px" />,
			},
			{
				id: "he",
				name: "rעברית - HE",
				value: "he",
				icon: <ILFlag width="20px" height="15px" />,
			},
			{
				id: "es",
				name: "Español - ES",
				value: "es",
				icon: <ESFlag width="20px" height="15px" />,
			},
		],
	},
};
