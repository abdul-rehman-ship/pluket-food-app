import React, { useEffect } from 'react';
import style from '@styles/admin.module.css';
import { toast, Toaster } from 'react-hot-toast';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'next/router';
import JsCookie from 'js-cookie';

export default function DeliveryPersonLogin() {
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    toast.loading('Loading...');

    const username = e.target.username.value;
    const password = e.target.password.value;

    const snapshot = await getDocs(collection(db, 'deliveryPersons'));
    let isValidCredentials = false;
    let deliveryPersonData: any = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.username === username && data.password === password) {
        isValidCredentials = true;
        deliveryPersonData = data;
      }
    });

    if (isValidCredentials) {
      toast.dismiss();
      JsCookie.set('delivery_person_key', deliveryPersonData.username);
      router.push('/deliveryPersonDelivery');
    } else {
      toast.dismiss();
      toast.error('Invalid Credentials');
    }
  };

  useEffect(() => {
    if (JsCookie.get('delivery_person_key')) {
      router.push('/deliveryPersonDelivery');
    }
  }, []);

  return (
    <>
      <div className={style.main_container}>
        <Toaster />

        <div className="container d-flex justify-content-center">
          <div className={style.main_div}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mt-4"
                name="username"
                placeholder="Enter your username..."
                required
              />
              <input
                type="password"
                className="form-control mt-4"
                name="password"
                placeholder="Enter your password..."
                required
              />
              <button type="submit" className={style.login_Btn}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
