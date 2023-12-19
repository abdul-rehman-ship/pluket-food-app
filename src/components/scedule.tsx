import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FiClock } from 'react-icons/fi'; // You may need to install react-icons
import { useUI } from "@contexts/ui.context";
import { useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import {
  getDownloadURL,
  
  ref,
  
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";
import Form from 'react-bootstrap/Form';

const OpeningHoursButton = () => {
  const [showModal, setShowModal] = useState(false);
  const {isAuthorized}	= useUI()
	const [user,setUser]:any=useState({})
  const [showForm, setShowForm]:any = useState(false);
  const [msg,setMsg]:any=useState('')
  const [image,setImage]:any=useState('')


  

  const onHide = () => {
    // Hide the form when the user closes it
    setShowForm(false);
  };

  const ShowForm = () => {
    // Hide the form when the user closes it
    if(!isAuthorized){
      return toast("Please login first");
    }

    setShowForm(true);
  };




	const getUser = async () => {
    const email = Cookies.get("email");
  
    if (!email) {
      console.error("No email found");
      return;
    }
  
    try {
     const querySnapshot=await  getDocs(collection(db, "users"))
        querySnapshot.forEach((doc:any) => {
          
          
          if(doc.data().email===Cookies.get("email")){
            setUser({id:doc.id,...doc.data()})
          }
        });
      
    
    }

    catch(error:any){

    }
  };
	useEffect(() => {
		if(isAuthorized && (!user.email || user.email===undefined || user.email===null)){
			getUser()

		}
	})

  const [venueData, setVenueData]:any = useState({
    name: '',
    location: '',
    logo: null, // Store the file object
    socialMediaLink: '',
  });
  

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  
  const handleInputChange = (e:any) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
       setImage( e.target.files[0])

      setVenueData({
        ...venueData,
        logo:  e.target.files[0],
      });
    } else {
      setVenueData({
        ...venueData,
        [name]: value,
      });
    }
  };
 
  const uploadFiles = async (folder: string, files: File[]) => {
    const promises: any[] = [];

    files.forEach((file) => {
      const storageRef = ref(storage, `${folder}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      promises.push(uploadTask);
    });

    const result = await Promise.all(promises);
    const urlPromises = result.map(async (item) => {
      const path = item.ref.toString();
      return await downloadFile(path);
    });

    return await Promise.all(urlPromises);
  };
  const downloadFile = async (path: string) => {
    let item: string = "";
    await getDownloadURL(ref(storage, path))
      .then((url) => (item = url))
      .catch((err) => {
        return toast.error(err.message);
      });

    return item;
  };

  const handleReferrer = async (e: any) => {
    

    
    
    
    try {
      e.preventDefault();
  
      setMsg('Please wait it takes some time to Send Request ...')
  
      if (!isAuthorized) {
        toast("Please login first");
        return;
      }
  
      if (user?.referrer === "yes") {
        setMsg('You are already a referrer')
        
        return;
      }
  

      if (!venueData.logo) {
        setMsg("please select logo")
        return
      }
        const logo:any =await uploadFiles("logos",[image]);
        // if(logo===''){
        //   setMsg('Error uploading logo')
          
        //   return;
        // }
  
        // Check if the user's request is already sent
        // const requests:any = await getDocs(collection(db, "requests"));
        // const isRequestSent = requests.docs.some((doc) => doc.data().email === user.email);
  
        // if (isRequestSent) {
          
        //   setMsg('Your request is already sent')
          
        //   return;
        // }
  
        //use setDoc here

        await addDoc(collection(db, "requests"), {
          venueName: venueData.venueName,
          venueLocation: venueData.venueLocation,
          logo: logo[0] ? logo[0] : "",
          socialMediaLink: venueData.socialMediaLink,
          email: user?.email?user.email:Cookies.get("email"),
          
          status: "pending",
        });
  
        setMsg('Your request sent successfully')
        
        getUser();
        onHide();
        return;
      
  
      // Uncomment the following lines if you want to update the user as a referrer
      // await updateDoc(doc(db, "users", user?.id), {
      //   referrer: "yes",
      // });
      // toast.success("You're now a referrer");
      // getUser();
    } catch (error: any) {
      console.error(error.message);
      setMsg(error.message)
    }
  };
  

  const isOpen = isRestaurantOpen(); // Implement your logic for checking opening hours here

  return (
    <>
    <div className="w-full flex  gap-1 justify-end">
   
    <Button  className="flex gap-2  bg-olive text-maroon ml-auto font-bold items-center justify-center m-4 hover:bg-olive" onClick={handleShow}>
        <FiClock className="mr-2" />
        {isOpen ? 'Open' : 'Closed'}
      </Button>
      {
        isAuthorized && user?.referrer==="yes"?
         <Button  className="flex gap-2  bg-olive text-maroon ml-auto font-bold items-center justify-center m-4 hover:text-maroon hover:bg-olive" >
       Registered Referrer
      </Button>:<Button  className="flex gap-2  bg-olive text-maroon ml-auto font-bold items-center justify-center m-4 hover:text-maroon hover:bg-olive" onClick={ShowForm}>
      { isAuthorized? 'Become a Referrer': 'Login to become a Referrer' } 
      </Button>
      
  
      
      }
    

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
      <Modal show={showForm} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className='text-danger'>{msg===''?'Send Request':msg}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={handleReferrer}>
      <Form.Group controlId="venueName">
        <Form.Label>Name of Venue</Form.Label>
        <Form.Control
          required
          type="text"
          name="venueName"
          value={venueData.venueName}
          onChange={handleInputChange}
          placeholder="Enter the name of the venue"
        />
      </Form.Group>

      <Form.Group controlId="venueLocation">
        <Form.Label>Short Location</Form.Label>
        <Form.Control
          required
          type="text"
          name="venueLocation"
          value={venueData.venueLocation}
          onChange={handleInputChange}
          placeholder="Enter short location"
        />
      </Form.Group>

      <Form.Group controlId="logoUpload">
        <Form.Label>Logo Upload</Form.Label>
        <Form.Control
          type="file"
          name="logoUpload"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="socialMediaLink">
        <Form.Label>Social Media Link</Form.Label>
        <Form.Control
          required
          type="text"
          name="socialMediaLink"
          value={venueData.socialMediaLink}
          onChange={handleInputChange}
          placeholder="Enter Facebook or Instagram link"
        />
      </Form.Group>
      <Button variant="primary"  className="mt-3" type="submit" >
          send
        </Button>

      
    </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary"  type="submit" onClick={onHide}>
          send
        </Button> */}
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
