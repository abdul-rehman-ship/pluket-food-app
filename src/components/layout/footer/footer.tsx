import Widgets from "./widgets";
import Copyright from "./copyright";
import { footer } from "./data";
const { widgets,payment } = footer;

const Footer: React.FC = () => (
  <footer className="border-b-4 border-heading mt-9 px-4 md:mt-11 lg:mt-16 3xl:mt-20 pt-2.5 lg:pt-0 2xl:pt-2 text-white">
    <Widgets widgets={widgets} />
    <Copyright payment={payment} />
  </footer>
);

export default Footer;
