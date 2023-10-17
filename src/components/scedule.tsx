import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FiClock } from 'react-icons/fi'; // You may need to install react-icons
import { useUI } from "@contexts/ui.context";
import { useEffect } from "react";
import { collection, getDocs,doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Cookies from "js-cookie";
import toast, { Toaster } from 'react-hot-toast';
const OpeningHoursButton = () => {
  const [showModal, setShowModal] = useState(false);
  const {isAuthorized}	= useUI()
	const [user,setUser]:any=useState({})

	const getUser=async()=>{
		getDocs(collection(db, "users")).then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				if(doc.data().email===Cookies.get("email")){
					setUser({id:doc.id,...doc.data()})
				}
			});
		})
	}
	useEffect(() => {
		if(isAuthorized || !user.email){
			getUser()

		}
	})


  

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
const handleReferrer=async()=>{
  if(!isAuthorized){ 
    return
   }
  if(user?.referrer==="yes"){
    toast.error("You're already a referrer")
    return
  }
 await updateDoc(doc(db, "users", user?.id), {
    referrer: "yes",
  });
  toast.success("You're now a referrer")

  getUser()
}

  const isOpen = isRestaurantOpen(); // Implement your logic for checking opening hours here

  return (
    <>
    <div className="w-full flex  gap-1 justify-end">
   <Toaster/>
    <Button  className="flex gap-2  bg-olive text-maroon ml-auto font-bold items-center justify-center m-4 hover:bg-olive" onClick={handleShow}>
        <FiClock className="mr-2" />
        {isOpen ? 'Open' : 'Closed'}
      </Button>
      <Button  className="flex gap-2  bg-olive text-maroon ml-auto font-bold items-center justify-center m-4 hover:text-maroon hover:bg-olive" onClick={handleReferrer}>
        {isAuthorized?
        user?.referrer==="yes"?"You're Referrer": "Become a Referrer"
        :"Login to become a Referrer"
       }
      </Button>

    </div>
   

      <Modal show={showModal} className=" text-maroon" onHide={handleClose}>
        <Modal.Header closeButton className="bg-olive ">
          <Modal.Title className="font-bold">Restaurant Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-olive">
          {/* Add your restaurant's schedule here */}
          <p className="font-bold">Monday: 3pm - 12pm</p>
          <p className="font-bold">Tuesday - Saturday: 3pm - 11pm</p>
          <p className="font-bold">Sunday: Closed</p>
        </Modal.Body>
        <Modal.Footer className="bg-olive">
          <Button className='bg-maroon text-olive hover:bg-maroon ' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OpeningHoursButton;

// Replace isRestaurantOpen with your logic to determine if the restaurant is open
function isRestaurantOpen() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hours = now.getHours();

  // Sunday (0) is closed
  if (dayOfWeek === 0) return false;

  // Monday to Saturday (1 to 6) is open from 3pm to 11pm
  return hours >= 15 && hours < 23;
}
