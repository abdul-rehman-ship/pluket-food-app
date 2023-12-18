// pages/user/[...].tsx

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';

const UserProfilePage = () => {
  const router = useRouter();
  const { id } = router.query; // 'id' is the parameter you defined in the [...].tsx file

  const [userData, setUserData]:any = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, 'users', id.toString());
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserData(userDocSnapshot.data());
          } else {
            console.log('User not found');
          }
        } catch (error:any) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };

    fetchUserData();
  }, [id]);

  const handleContinue = () => {
    // Handle continue logic here
    console.log('Continue as', userData?.username);
  };

  return (
    <div>
      {userData ? (
        <div>
          <h1>User Profile</h1>
          <p>Username: {userData.username}</p>
          <button onClick={handleContinue}>Continue as {userData.username}</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfilePage;
