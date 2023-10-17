import { NextSeo } from "next-seo";
import Header from "@components/layout/header/header";
import Footer from "@components/layout/footer/footer";
import MobileNavigation from "@components/layout/mobile-navigation/mobile-navigation";


const Layout: React.FC = ({ children }) => (
	<div className="flex flex-col min-h-screen" style={{background:'#8A2BE2FF'}}>
		<NextSeo
			additionalMetaTags={[
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1.0",
				},
			]}
			title="Phuket pizza "
			description=" E-commerce App Phuket pizza"
			canonical="https://google.com"
			openGraph={{
				url: "https://google.com",
				title: " phuket pizza",
				description:
					" E-commerce App Phuket pizza",
				images: [
					{
						url: "/assets/images/pizza1.png",
						width: 800,
						height: 600,
						alt: "Og Image Alt",
					},
					{
						url: "/assets/images/pizza2.png",
						width: 900,
						height: 800,
						alt: "Og Image Alt Second",
					},
				],
			}}
		/>
		<Header />
		<main
			className="relative flex-grow"
			style={{
				minHeight: "-webkit-fill-available",
				WebkitOverflowScrolling: "touch",
			}}
		>
			{children}
		</main>
		<Footer />
		<MobileNavigation />
		
	</div>
);

export default Layout;
