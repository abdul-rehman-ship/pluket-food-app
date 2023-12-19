// pages/user/[...].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useLoginMutation } from "@framework/auth/use-login";
import Cookies from 'js-cookie';
const UserProfilePage = () => {
  const router = useRouter();
  const {id}=router.query
  
  
  
   // 'id' is the parameter you defined in the [...].tsx file

  const [userData, setUserData]:any = useState(null);
	const { mutate: login } = useLoginMutation();


  useEffect(() => {
    const fetchUserData = async () => {
        
      if (id) {
        try {
        const res:any= await getDocs(collection(db, "users"));
        res.forEach((doc:any) => {
            console.log(id);
            
            if(doc.data().code===id){
              setUserData({ id: doc.id, ...doc.data() });
              return
            }
        })
        } catch (error:any) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchUserData();


  },[id]);

  const handleContinue = () => {
    const remember_me :boolean=true
    Cookies.set('email', userData.email);
    const email:string=userData.email
    const password:string="123456753"
    login({ email, password, remember_me });
    setTimeout(()=>{
      router.push('/');

    },3000)
  };

  return (
    <div className="flex justify-center items-center h-screen bg-maroon">
    {userData ? (
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome !</h1>
        <h1 className="mb-6 m-2">name: {userData.name}</h1>
        <button
          onClick={handleContinue}
          className="bg-olive btn text-maroon font-bold mt-2 px-4 py-2 rounded-full hover:bg-olive transition"
        >
          Continue as {userData.name}
        </button>
      </div>
    ) : (
      <p className="text-white">Loading...</p>
    )}
  </div>
  
  );
};

export default UserProfilePage;
