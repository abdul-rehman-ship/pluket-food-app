import ProductOverlayCard from "@components/product/product-overlay-card";
import Alert from "@components/ui/alert";
import { useState, useEffect } from "react";
// import { getDocs,collection } from 'firebase/firestore'
// import { db } from '../../firebase'
import { toast } from "react-hot-toast";
import Link from "next/link";
import Router from "next/router";
import { Modal, Button, Row, Col } from 'react-bootstrap';
import Cookies from "js-cookie";

interface ProductsProps {
  sectionHeading: string;
  categorySlug?: string;
  className?: string;
  variant?: "left" | "center";
  type?:string
}

const ProductsFeatured: React.FC<ProductsProps> = ({
  className = "mb-12 md:mb-14 xl:mb-16 mt-4",
  variant = "left",
  type
}) => {
  const [data, setData]: any = useState([]);
  const [searcheddata, setSearcheddata]: any = useState([]);
  
  const [categories,setCategories]:any=useState([])
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchName, setSearchName] = useState('');

  
  const [firstHalfProduct, setFirstHalfProduct] = useState<any | null>(null);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  
  const [secondHalfProduct, setSecondHalfProduct] = useState<any | null>(null);

  const openProductModal = () => {
    setProductModalOpen(true);
  };

  const closeProductModal = () => {
    setProductModalOpen(false);
    setFirstHalfProduct(null);
    setSecondHalfProduct(null);
  };

  const handleSelectFirstHalf = (selectedProduct: any) => {
    setFirstHalfProduct(selectedProduct);
    setProductModalOpen(true);
  };

  const handleSelectSecondHalf = (selectedProduct: any) => {
    if(firstHalfProduct.id===selectedProduct.id){
      toast.error(" select other one product",{ duration: 2000 })
      return
    }
    setSecondHalfProduct(selectedProduct);
    Cookies.set("firstHalfProduct",firstHalfProduct.id)
    Cookies.set("secondHalfProduct",selectedProduct.id)
    
    
    // Router.replace('/product/halfHalf')
  };

  // Filter products based on the category of the first selected product
  const filteredProducts = searcheddata.filter(
    (product: any) => !firstHalfProduct || firstHalfProduct.category === product.category
  );


  const handleCategoryClick = (category:any) => {
    setSelectedCategory(category);
  if(category==="all"){
    setSearcheddata(data)
  }else{
let arr:any=[];
data.forEach((prod:any)=>{
  if(prod.category===category){
    arr.push(prod)
  }
})
setSearcheddata(arr)
  }
   
   
  };

  const [error]: any = useState();


  const getData = async () => {
    
    //  let arr: any = [];
    //  const data = await getDocs(collection(db, "products"));
    //  data.forEach((doc: any) => {
    //    if(doc.data()){
    //      const prod={id:doc.id,...doc.data()}
    //      arr.push(prod);
           
           
 
       
    //    }
      
       
    //  });
 let arr:any=   [
      {
          "__id__": "1kRxhwOVroyavXlRB86m",
          "category": "Sides",
          "createdAt": "__Timestamp__2023-11-20T14:29:00.769Z",
          "description": "Crinkle cut fries with seasoning",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FFries.png?alt=media&token=1ac21ee4-de91-4836-abe9-2d20d9d294ea",
          "initialStock": "99999",
          "name": "Fries (standard serve)",
          "price": "99",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": [
              {
                  "additionalPrice": "0",
                  "name": "Cheese seasoning"
              },
              {
                  "additionalPrice": "0",
                  "name": "BBQ seasoning"
              },
              {
                  "additionalPrice": "0",
                  "name": "Cajun seasoning"
              }
          ]
      },
      {
          "__id__": "7oqz89RNcrNqufFCw2ED",
          "category": "Dessert Pizza",
          "createdAt": "__Timestamp__2023-11-20T14:23:13.171Z",
          "description": "Peanut butter & cream cheese, soft toasted apple & caramel sauce swirl.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FDessertPizza-Neo.png?alt=media&token=53123d1b-14a6-4d4d-957a-c3db75578803",
          "initialStock": "99999",
          "name": "Nutty Caramel Apple",
          "price": "199",
          "size": {
              "lg": "",
              "md": "",
              "sm": "199"
          },
          "variations": []
      },
      {
          "__id__": "8Ydbi3CfE8vywux1yMqu",
          "category": "Toasties",
          "createdAt": "__Timestamp__2023-11-20T14:28:42.042Z",
          "description": "Buttered toast, cheese, bolognese beef, onion, tomato.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FToasties.png?alt=media&token=d467c391-c093-4fe8-baf2-0dd9c796657c",
          "initialStock": "9999",
          "name": "Toasties (Bolognese)",
          "price": "119",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "AIw8SP9caGufZZ48bXrL",
          "category": "Special Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:00:01.663Z",
          "description": "Our own Thai basil for pizza, marinated chicken, diced onion, capsicum, chilli and cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FPenang.png?alt=media&token=08d5bffe-d3b3-4dd9-abe7-c889affb1bc0",
          "initialStock": "99999",
          "name": "Chicken Thai Penang",
          "price": "369",
          "size": {
              "lg": "369",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "AMYZvhyX4AIQNlGlBQ62",
          "category": "Sides",
          "createdAt": "__Timestamp__2023-11-20T14:29:27.228Z",
          "description": "Crispy fried onion rings (8)",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FOnionRings.png?alt=media&token=c9cd94ab-ebe1-4560-899b-9b702f0f41f0",
          "initialStock": "99999",
          "name": "Onion Rings (8)",
          "price": "99",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "BKMICdWVpQt3KyH4moh2",
          "category": "Dessert Pizza",
          "createdAt": "__Timestamp__2023-11-20T14:23:36.146Z",
          "description": "Chocolate, strawberries & fresh banana with toasted marshmallows and a dessert sauce swirl. ",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FDessertPizza-Neo.png?alt=media&token=3deac8a7-0b15-4eb7-b2fa-f82f7d2cbaef",
          "initialStock": "99999",
          "name": "Neapolitan (popular)",
          "price": "199",
          "size": {
              "lg": "",
              "md": "",
              "sm": "199"
          },
          "variations": []
      },
      {
          "__id__": "F9ueiLvXs5on1Wq9k76V",
          "category": "Sides",
          "createdAt": "__Timestamp__2023-11-20T13:26:48.444Z",
          "description": "Hand breaded, fried chicken tenders (breast) 4 pieces.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FChickenTenders.png?alt=media&token=02c17ee1-6bcf-427c-a06e-d8d827153a7a",
          "initialStock": "9999",
          "name": "Chicken Tender Fillets",
          "price": "119",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "FqE4qACZJQlHd3lFapEX",
          "category": "Special Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:07:10.898Z",
          "description": "Sliced, smoked pork Kransky & Cumberland sausages, onion, garlic and cheese + Sriracha sauce swirl.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FSausagePizza.png?alt=media&token=2c7d9ce1-8253-4099-baad-06684988c6d6",
          "initialStock": "99999",
          "name": "Sriracha Sausage",
          "price": "369",
          "size": {
              "lg": "369",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "JNfOGLbj0jihe9D2bkz5",
          "category": "Special Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:07:32.132Z",
          "description": "Prawns, squid and muscle (shell fish) on a basil pesto base with garlic and cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FSeafoodPizza.png?alt=media&token=1d4d1417-cfa6-4788-a71a-33fd1075434c",
          "initialStock": "99999",
          "name": "Seafood",
          "price": "369",
          "size": {
              "lg": "369",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "LJxw0AydceszDNUh0EkQ",
          "category": "Classic Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:00:35.288Z",
          "description": "Chicken, capsicum, mushrooms, onion, cheese & smokey BBQ sauce.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FBBQSupreme.png?alt=media&token=9d02e248-fe09-4837-8c41-0ac48b930c2b",
          "initialStock": "99999",
          "name": "BBQ Supreme ",
          "price": "199",
          "size": {
              "lg": "299",
              "md": "",
              "sm": "199"
          },
          "variations": []
      },
      {
          "__id__": "Mgvb3yDin6YbdtIM5vFO",
          "category": "Drinks",
          "createdAt": "__Timestamp__2023-11-20T14:36:03.293Z",
          "description": "Your choice of softdrink",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FSoftdrinks.png?alt=media&token=1847390a-88e3-42eb-8dbc-00331d687014",
          "initialStock": "99999",
          "name": "Softdrinks (coke etc)",
          "price": "40",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": [
              {
                  "additionalPrice": "0",
                  "name": "Coke (original)"
              },
              {
                  "additionalPrice": "0",
                  "name": "Coke (zero-diet)"
              },
              {
                  "additionalPrice": "0",
                  "name": "Sprite"
              },
              {
                  "additionalPrice": "0",
                  "name": "Fanta"
              },
              {
                  "additionalPrice": "0",
                  "name": "Ginger Ale Schweppes"
              },
              {
                  "additionalPrice": "0",
                  "name": "Minao / lime Schweppes"
              }
          ]
      },
      {
          "__id__": "O9PgRBiUbnPgsTFHmwut",
          "category": "Classic Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:08:33.655Z",
          "description": "Tomato base, pepperoni and cheese with a light paprika and garlic seasoning. Available in Solo, large and (in store only -dine in or pickup) jumbo XXL.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FPepperoni.png?alt=media&token=6a552d94-424c-4d59-9ea3-b3667d3c69a5",
          "initialStock": "99999",
          "name": "Pepperoni Pizza",
          "price": "199",
          "size": {
              "lg": "299",
              "md": "",
              "sm": "199"
          },
          "variations": [
              {
                  "additionalPrice": "30",
                  "name": "Extra Pepperoni"
              },
              {
                  "additionalPrice": "30",
                  "name": "Extra Cheese"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Olives"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Jalapeno"
              },
              {
                  "additionalPrice": "10",
                  "name": "Sauce: Sriracha (USA) spicy"
              }
          ]
      },
      {
          "__id__": "OVrmInSRFa2qrGKRp5rS",
          "category": "Sides",
          "createdAt": "__Timestamp__2023-11-20T13:23:43.683Z",
          "description": "Toasted, crunchy garlic bread (4 pieces)",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FGarlicBread.png?alt=media&token=02bbd2e0-44cb-47a6-8af3-ace471a25177",
          "initialStock": "99999",
          "name": "Garlic Bread",
          "price": "99",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "QFmjc9NGFJwMtF8mRvmW",
          "category": "Pasta",
          "createdAt": "__Timestamp__2023-11-20T13:40:56.634Z",
          "description": "A creamy, cheesy macaroni cheese with bacon. ",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FMac%26Cheese.png?alt=media&token=778d0370-e155-470b-97c5-8fe6e638d22f",
          "initialStock": "9999",
          "name": "Mac & Cheese (bacon)",
          "price": "159",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": [
              {
                  "additionalPrice": "25",
                  "name": "Add chicken"
              },
              {
                  "additionalPrice": "5",
                  "name": "Swap bacon for chicken"
              }
          ]
      },
      {
          "__id__": "QSCiJ8bqGqJomJjqgmUG",
          "category": "Sides",
          "createdAt": "__Timestamp__2023-11-20T13:28:46.316Z",
          "description": "Mozzarella cheese sticks, deep fried (5 pieces)",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FOnionRings.png?alt=media&token=778523c3-219d-4bac-a3fe-2e6110397ad3",
          "initialStock": "99999",
          "name": "Cheese sticks (5)",
          "price": "119",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "TheJJIpDRfl7GPWurzeo",
          "category": "Gourmet Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:09:29.324Z",
          "description": "Marinated masala chicken, onion, capsicum and cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FMasalaAdobo.png?alt=media&token=4b171fe0-16fc-408d-9cb1-5bd49dd6742d",
          "initialStock": "99999",
          "name": "Indian Masala ",
          "price": "239",
          "size": {
              "lg": "349",
              "md": "",
              "sm": "239"
          },
          "variations": []
      },
      {
          "__id__": "TlRJarJLZYfxkzKBMGqo",
          "category": "Toasties",
          "createdAt": "__Timestamp__2023-11-20T14:04:47.984Z",
          "description": "Your choice of filling. Base toastie includes buttered, toasted bread and cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FToasties.png?alt=media&token=bebf6f12-9fbd-403c-b150-2582e0a45249",
          "initialStock": "99999",
          "name": "Toasties (USA style)",
          "price": "69",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": [
              {
                  "additionalPrice": "20",
                  "name": "Meat: Bolognese beef"
              },
              {
                  "additionalPrice": "20",
                  "name": "Meat: Premium bacon"
              },
              {
                  "additionalPrice": "20",
                  "name": "Meat: Ham"
              },
              {
                  "additionalPrice": "20",
                  "name": "Meat: Pepperoni"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Olives"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Tomato"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Capsicum"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Onion"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Jalapeno"
              },
              {
                  "additionalPrice": "10",
                  "name": "Sauce: Tomato"
              },
              {
                  "additionalPrice": "10",
                  "name": "Sauce: Barbeque"
              },
              {
                  "additionalPrice": "10",
                  "name": "Sauce: Sriracha"
              },
              {
                  "additionalPrice": "10",
                  "name": "Sauce: Mayonaise"
              },
              {
                  "additionalPrice": "10",
                  "name": "Sauce: Garlic Aiolo"
              }
          ]
      },
      {
          "__id__": "WdGO6oj3LOSNtUZLDdpw",
          "category": "Gourmet Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:08:59.704Z",
          "description": "Pan seared Chicken, bacon, onion, capsicum, cheese & smokey BBQ sauce.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FAusBBQbacon.png?alt=media&token=752c1a6c-2bfa-41f7-9650-4a5fc22c83e7",
          "initialStock": "99999",
          "name": "Aussie BBQ Bacon",
          "price": "239",
          "size": {
              "lg": "349",
              "md": "",
              "sm": "239"
          },
          "variations": []
      },
      {
          "__id__": "WigKzIZbCnOURyluwDbZ",
          "category": "Pasta",
          "createdAt": "__Timestamp__2023-11-27T16:20:49.956Z",
          "description": "Creamy USA style chicken carbonara (your choice of pasta)",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FCarbonara.png?alt=media&token=6e2bf3f8-dcdc-4676-b2be-808c0fab8a62",
          "initialStock": "99999",
          "name": "Carbonara Chicken (USA)",
          "price": "159",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": [
              {
                  "additionalPrice": "0",
                  "name": "Fettuccine "
              },
              {
                  "additionalPrice": "0",
                  "name": "Spaghetti"
              },
              {
                  "additionalPrice": "0",
                  "name": "Penne"
              }
          ]
      },
      {
          "__id__": "YDsOr2RokcxyXXdWlPFh",
          "category": "Dessert Pizza",
          "createdAt": "__Timestamp__2023-11-20T14:23:57.012Z",
          "description": "A creamy ricotta cheese with mixed berries and a hint of lemon and honey. ",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FDessertPizza-Neo.png?alt=media&token=9ec62d58-9831-40a7-8681-3924dc5023fb",
          "initialStock": "99999",
          "name": "Berry Ricotta",
          "price": "199",
          "size": {
              "lg": "",
              "md": "",
              "sm": "199"
          },
          "variations": []
      },
      {
          "__id__": "ZnqqBnanR90PPtz75s6W",
          "category": "Classic Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:09:52.502Z",
          "description": "Ham, pepperoni, bacon, bolognese beef and cheese. ",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FMeatLovers.png?alt=media&token=32e37816-5a89-4001-a3b2-f5b82b752393",
          "initialStock": "99999",
          "name": "Meat Lovers Pizza",
          "price": "199",
          "size": {
              "lg": "299",
              "md": "",
              "sm": "199"
          },
          "variations": []
      },
      {
          "__id__": "aN7JKsE4mwL2X8jqOXu7",
          "category": "Toasties",
          "createdAt": "__Timestamp__2023-11-20T14:29:56.904Z",
          "description": "Buttered, toasted bread, cheese, ham, onion, cocktail sauce",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FToasties.png?alt=media&token=a5d3f5ae-f3da-471e-b2b8-39e40fb60ebf",
          "initialStock": "99999",
          "name": "Toastie (Hawaiian)",
          "price": "99",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "agYhV40v5NY7SpE70VTC",
          "category": "Gourmet Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:10:15.395Z",
          "description": "Marinated chicken, onion, chilli and cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FThaiBasil.png?alt=media&token=b5a5deba-bf90-4bb9-9e16-50059abe312a",
          "initialStock": "99999",
          "name": "Thai Basil Chicken",
          "price": "199",
          "size": {
              "lg": "349",
              "md": "",
              "sm": "239"
          },
          "variations": []
      },
      {
          "__id__": "b0d4QSItaf4M6AzFdp09",
          "category": "Shakes-Smoothies",
          "createdAt": "__Timestamp__2023-11-21T14:12:09.537Z",
          "description": "Your choice of fruit, in a refreshing ice-blended smoothie. Please note: only one fruit unless \"mixed\" where you may choose two blended. ",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FShake(kiwifruit).png?alt=media&token=dc5ae61d-446e-41d9-a3aa-69f355a4871b",
          "initialStock": "99999",
          "name": "Smoothies (ice blended fruit)",
          "price": "130",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": [
              {
                  "additionalPrice": "0",
                  "name": "Strawberry"
              },
              {
                  "additionalPrice": "0",
                  "name": "Kiwifruit"
              },
              {
                  "additionalPrice": "0",
                  "name": "Banana"
              },
              {
                  "additionalPrice": "0",
                  "name": "Mango"
              },
              {
                  "additionalPrice": "10",
                  "name": "Mixed fruit"
              }
          ]
      },
      {
          "__id__": "crPL3kXl39pgGUT2QeOo",
          "category": "Pasta",
          "createdAt": "__Timestamp__2023-11-20T13:38:46.853Z",
          "description": "Premium beef, tasty tomato based bolognese, your choice of pasta + a sprinkle of cheese on top.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FSpaghettiBolo.png?alt=media&token=0e350bc0-4cd1-4ced-a05f-211bc374cf81",
          "initialStock": "99999",
          "name": "Spaghetti Bolognese (beef)",
          "price": "179",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "eRzYVw81niiOSS7o5DGM",
          "category": "Gourmet Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:10:33.950Z",
          "description": "Premium Mexican bolognese beef, onion, capsicum and cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FMexican.png?alt=media&token=c063e4ea-ca61-4225-a148-b7e5f9025c4a",
          "initialStock": "99999",
          "name": "Mexican Beef",
          "price": "239",
          "size": {
              "lg": "349",
              "md": "",
              "sm": "239"
          },
          "variations": []
      },
      {
          "__id__": "fc8hU9gE0IJrFgAIguOz",
          "category": "Sides",
          "createdAt": "__Timestamp__2023-11-20T13:24:36.326Z",
          "description": "A larger serving of crinkle cut fries with your choice of seasoning",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FFries.png?alt=media&token=7fa4f6cd-23e2-4ff1-8f37-f6779aa004dc",
          "initialStock": "9999",
          "name": "Fries (share serve)",
          "price": "169",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": [
              {
                  "additionalPrice": "0",
                  "name": "Cheese seasoning"
              },
              {
                  "additionalPrice": "0",
                  "name": "BBQ seasoning"
              },
              {
                  "additionalPrice": "0",
                  "name": "Cajun seasoning"
              }
          ]
      },
      {
          "__id__": "ixLrwB7FUQ4h43ViGa9T",
          "category": "Classic Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:10:55.187Z",
          "description": "Ham, pineapple, onion & cheese. Optional Hawaiian sauce swirl.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FHawaiian.png?alt=media&token=c589ce7e-a0a8-4483-a4b9-eb1387547446",
          "initialStock": "99999",
          "name": "Hawaiian Pizza",
          "price": "199",
          "size": {
              "lg": "299",
              "md": "",
              "sm": "199"
          },
          "variations": []
      },
      {
          "__id__": "lIJDH6FSz49dKp3Ts6zG",
          "category": "Classic Pizza",
          "createdAt": "__Timestamp__2023-11-27T15:58:43.403Z",
          "description": "Olives, tomato, onion, capsicum, mushrooms & cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FVegetarian.png?alt=media&token=dc6d8d5e-e933-4d4a-82fe-4405cb0786cc",
          "initialStock": "99999",
          "name": "Vegetarian Pizza ",
          "price": "199",
          "size": {
              "lg": "299",
              "md": "",
              "sm": "199"
          },
          "variations": []
      },
      {
          "__id__": "lm8s8FZwGqH8f5uWb7UE",
          "category": "Shakes-Smoothies",
          "createdAt": "__Timestamp__2023-11-20T14:31:02.362Z",
          "description": "Your choice of flavour, premium ice-cream and milk.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FShake(banana).png?alt=media&token=a7f34e8f-d155-480b-928f-ab50dadb307f",
          "initialStock": "99999",
          "name": "Premium Shake (ice-cream)",
          "price": "130",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": [
              {
                  "additionalPrice": "0",
                  "name": "Vanilla"
              },
              {
                  "additionalPrice": "0",
                  "name": "Chocolate"
              },
              {
                  "additionalPrice": "0",
                  "name": "Strawberry"
              },
              {
                  "additionalPrice": "0",
                  "name": "Caramel"
              },
              {
                  "additionalPrice": "0",
                  "name": "Banana"
              }
          ]
      },
      {
          "__id__": "sR0aY7lWfunvIo2Lv0Lz",
          "category": "Toasties",
          "createdAt": "__Timestamp__2023-11-20T14:28:25.051Z",
          "description": "Buttered toastie, cheese, pepperoni, garlic aioli.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FToasties.png?alt=media&token=fa24085d-2ad6-4e65-8731-8011fa8d4762",
          "initialStock": "99999",
          "name": "Toasties (Pepperoni)",
          "price": "109",
          "size": {
              "lg": "",
              "md": "",
              "sm": ""
          },
          "variations": []
      },
      {
          "__id__": "vZvy2FKhSuJpkyrhQy17",
          "category": "Classic Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:11:22.477Z",
          "description": "Tomato base, double cheese (cheddar and mozzarella) with a light paprika and garlic seasoning. A tasty classic! Available in Solo, large and (in store only -dine in or pickup) jumbo XXL.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FMargherita.png?alt=media&token=266f2efb-7ce3-4b11-91a9-7729a5117bf9",
          "initialStock": "99999",
          "name": "Margherita Pizza",
          "price": "199",
          "size": {
              "lg": "299",
              "md": "",
              "sm": "199"
          },
          "variations": [
              {
                  "additionalPrice": "11",
                  "name": "Meat: Bacon"
              },
              {
                  "additionalPrice": "20",
                  "name": "Meat: Ham"
              },
              {
                  "additionalPrice": "20",
                  "name": "Meat: Chicken"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Olives"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Extra Tomato"
              },
              {
                  "additionalPrice": "15",
                  "name": "Vege: Jalapeno"
              },
              {
                  "additionalPrice": "10",
                  "name": "Sauce: Garlic Aoili"
              },
              {
                  "additionalPrice": "10",
                  "name": "Sriracha (USA) spicy"
              }
          ]
      },
      {
          "__id__": "vx5JXkjph3H1v0tYUHIt",
          "category": "Gourmet Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:11:58.444Z",
          "description": "Marinated satay chicken, onion, capsicum and cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FSatay.png?alt=media&token=c280c596-f42e-46c8-ae7e-b93b3c080146",
          "initialStock": "99999",
          "name": "Indonesian Satay",
          "price": "239",
          "size": {
              "lg": "349",
              "md": "",
              "sm": "239"
          },
          "variations": []
      },
      {
          "__id__": "xPxyDDmQyTbTCSsaZKao",
          "category": "Gourmet Pizza",
          "createdAt": "__Timestamp__2023-11-27T16:11:38.478Z",
          "description": "Marinated chicken, onion, adobo sauce, chilli and cheese.",
          "image": "https://firebasestorage.googleapis.com/v0/b/pluket-food-app.appspot.com/o/images%2FAdobo-Masala.png?alt=media&token=6c0b08d7-bcb2-40b0-8462-f1ffe2908155",
          "initialStock": "99999",
          "name": "Filipino Adobo",
          "price": "239",
          "size": {
              "lg": "349",
              "md": "",
              "sm": "239"
          },
          "variations": []
      }
  ]
     arr.sort((a:any, b:any) => a.name.localeCompare(b.name));
    //  let arr2: any = [];
    //  const data2 = await getDocs(collection(db, "categories"));
    //  data2.forEach((doc: any) => {
    //    if(doc.data()){
    //      const prod={id:doc.id,...doc.data()}
    //      arr2.push(prod);
           
           
 
       
    //    }
      
       
    //  });
    let arr2:any=[
      {
          "__id__": "0g1cv6BOA2SZ9ZudVJK6",
          "name": "Gourmet Pizza"
      },
      {
          "__id__": "1Rc89lE8M6OoH0VhPFvm",
          "name": "Toasties"
      },
      {
          "__id__": "L7IbqDCj0eE69y45Z4NW",
          "name": "Sides"
      },
      {
          "__id__": "OhJjS1Ys47VeONHCE4J2",
          "name": "Classic Pizza"
      },
      {
          "__id__": "XocMqbgE1Uh39OCOunp0",
          "name": "Drinks"
      },
      {
          "__id__": "cK2opr9qcoJ4mY7yqDxE",
          "name": "Dessert Pizza"
      },
      {
          "__id__": "ofWUyDnqI7Y7K1TZ9o8c",
          "name": "Shakes-Smoothies"
      },
      {
          "__id__": "rO2oieNoggtpwgMd2r6X",
          "name": "Desserts"
      },
      {
          "__id__": "viBXzEszknoqCSPnJ0T9",
          "name": "Pasta"
      },
      {
          "__id__": "zJrZZ61cYnYLc5krQT4i",
          "name": "Special Pizza"
      }
  ]
     arr2.sort((a:any, b:any) => a.name.localeCompare(b.name));
   
    
           toast.dismiss()
           setData(arr)
           setSearcheddata(arr)
           setCategories(arr2)
           
         
    
   };
const handleLink=async()=>{
  
    Router.push('/product/halfHalf')
  

}
  useEffect(() => {
    if (data.length === 0) {
      getData();
    }
  });

  // const handleFilter = () => {
  //   const filteredProducts = data.filter(
  //     (product: any) =>
  //       product.brand.toLowerCase().includes(searchBrand.toLowerCase()) &&
  //       product.shoeName.toLowerCase().includes(searchName.toLowerCase()) &&
  //       (!searchPriceMin ||
  //         parseFloat(product.retailPrice) >= parseFloat(searchPriceMin)) &&
  //       (!searchPriceMax ||
  //         parseFloat(product.retailPrice) <= parseFloat(searchPriceMax))
  //   );
  //   setSearcheddata(filteredProducts);
  // };
const search=(value:any)=>{

  setSearchName(value)
  const filteredProducts = data.filter(
    (product: any) =>
      product.name.toLowerCase().includes(value.toLowerCase()) 
      
  );
  setSearcheddata(filteredProducts);
}
  return (
    <div className={className}>
      <div className="mb-4 md:mb-6 font-poppins">

 
   
   <div className="flex row flex-wrap  gap-3 px-4">
  {/* Category dropdown */}
  <select
    value={selectedCategory}
    onChange={(e) => handleCategoryClick(e.target.value)}
    className={`border-2 border-olive px-4 py-2 font-bold cursor-pointer transition duration-200 
      bg-maroon text-olive hover:bg-olive w-[12rem] hover:text-maroon  `}
  >
    <option value="all">All categories</option>
    {categories.map((category: any) => (
      <option key={category.name} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>

  {/* Search input */}
  
    <input
      type="text"
      placeholder="Search By Name..."
      className="py-2 px-4 border-2 border-olive  outline-none md:w-1/4 focus:outline-none"
      value={searchName}
      onChange={(e) => search(e.target.value)}
    />
<button onClick={openProductModal} className="bg-olive btn text-maroon font-bold w-auto  hover:bg-olive hover:text-maroon ">
  Buy Half-Half of two products
</button>



<Modal show={isProductModalOpen} onHide={closeProductModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Two Products to Half-Half</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {filteredProducts.map((product: any) => (
              <Col key={product.id} xs={6} md={3} className="mb-3 ">
                <div className=" bg-olive p-2">
                  <input
                    type="checkbox"
                    
                    checked={firstHalfProduct === product || secondHalfProduct === product}
                    onChange={() => {
                      if (!firstHalfProduct) {
                        handleSelectFirstHalf(product);
                      } else {
                        handleSelectSecondHalf(product);
                        
                      }
                    }}
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '7rem', objectFit: 'cover' }}
                  />
                  <p className="text-maroon">{product.name}</p>
                  <p className="text-maroon">THB {product.price}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProductModal}>
            Close
          </Button>
          <Button variant="success"  onClick={handleLink}>
            Next
          </Button>
        </Modal.Footer>
      </Modal> 
      

</div>


      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="mt-6 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 md:gap-5 xl:gap-7">
  {
    searcheddata.length===0 && <div className="flex justify-center items-center m-4 h-auto">
  
<span className=" text-white" style={{color:"#ffffff !important"}}> <span className="spinner-border text-light" role="status"></span> Loading Products...</span>

    </div>
  }
            {searcheddata?.map((product: any, idx: any) => (
				
            
			  
			  // if type is all then all products will show otherwise 8 products will show
        type==="all" ?<ProductOverlayCard
                key={`product--key${product.id}`}
                product={product}
                variant={variant}
                index={idx}
              />:idx<8 && <ProductOverlayCard
                key={`product--key${product.id}`}
                product={product}
                variant={variant}
                index={idx}
              />
        
        
            ))}
          </div>
        </div>
      )}
     { type!=="all" && searcheddata.length>8   && <div className="flex justify-center items-center m-4 h-auto">
      <Link href="/allProducts">
        <a className="block w-full max-w-md p-4 bg-olive text-maroon text-center font-semibold rounded-lg transition ">
          Show More
        </a>
      </Link>
        </div>}

      
     
    </div>
	</div>
  );
};

export default ProductsFeatured
