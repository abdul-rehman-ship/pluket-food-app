import React, { useEffect, useState } from 'react';

import JsCookie from 'js-cookie';
import Router from 'next/router';
import { Table, Modal, Form, Button } from 'react-bootstrap';

import VendorNavbar from '../components/adminNavbar';
import { getDocs, collection, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  getDownloadURL,
  
  ref,
  
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";
import toast, { Toaster } from 'react-hot-toast';

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId]:any = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [users,setUsers]:any=useState([])
  const[email,setEmail]:any=useState('')

  const [showForm, setShowForm]:any = useState(false);
  const [msg,setMsg]:any=useState('')
  const [image,setImage]:any=useState('')
  const [userId,setUserID]:any=useState('')
  


  const [venueData, setVenueData]:any = useState({
    name: '',
    location: '',
    logo: null, 
    socialMediaLink: '',
    code:''
  });
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
      .then((url:any) => (item = url))
      .catch((err:any) => {
        return toast.error(err.message);
      });

    return item;
  };

  const handleReferrer = async (e: any) => {
    try {
      e.preventDefault();
  
      setMsg('Please wait data is updating ...')
  
      
  
    
  

      if (!venueData.logo) {
        setMsg("please select logo")
        return
      }
        const logo:any =await uploadFiles("logos",[image]);

       
      console.log(userId);
      
       await  updateDoc(doc(db, "users", userId), {
          referrer: "yes",
          venueName: venueData.venueName,
          venueLocation: venueData.venueLocation,
          logo: logo[0] ? logo[0] : "",
          socialMediaLink: venueData.socialMediaLink,
          code:venueData.code,
          status:"accepted"
          
        })
        setMsg('User is now Referrer')
        getUsers();

        onHide();
        return;
    } catch (error: any) {
      console.error(error.message);
      setMsg(error.message)
    }
  };

  const onHide = () => {
    // Hide the form when the user closes it
    setShowForm(false);
  };

  const ShowForm = (id:any) => {
    // Hide the form when the user closes it
   
    setUserID(id)
    setShowForm(true);
  };
  const handleShowDialog = () => {
    
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedRequestId(null);
    setShowDialog(false);
    setInputValue('');
  };
 

  const getRequests = async () => {
    let arr:any = [];
    await getDocs(collection(db, "requests")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().status === "pending") {
          arr.push({ id: doc.id, ...doc.data() });
        }
      });
    });
    arr.reverse();
    setRequests(arr);
    
    

   getUsers()
  };
  const getUsers=async()=>{
    let arr2:any=[]
    const res=await getDocs(collection(db, "users"))
    res.forEach((doc) => {
        arr2.push({ id: doc.id, ...doc.data() });
    });
    setUsers(arr2)
  }

  const acceptRequest = async (id:any,emailu:any) => {
    setSelectedRequestId(id);
    setEmail(emailu)

    handleShowDialog();

  };
  const submitCode = async () => {
    let id:any=''
    const enteredCode = inputValue;
    
      users.forEach((user:any) => {
        console.log(user.email,email);
        
          if(user.email===email){
            id=user.id
          }
      })
    

    toast.loading("Accepting request...");
    let data:any;
    requests.forEach((request:any) => {
        if (request.id === selectedRequestId) {
            data = request;
        }
    })
    
    
    await updateDoc(doc(db,"users",id),{
        referrer:"yes",
        venueName:data.venueName,
        venueLocation:data.venueLocation,
        socialMediaLink:data.socialMediaLink,
        logo:data.logo,
        code:enteredCode
        

    })
    await updateDoc(doc(db, "requests",selectedRequestId), {
      status: "accepted",
      acceptedAt: serverTimestamp(),
    }).then(() => {
      toast.dismiss();
      getRequests();
    });
    // Add your logic here to update the document with the entered code
    // ...

    // Close the dialog and refresh the requests
    handleCloseDialog();
    toast.dismiss();
    getRequests();
  };
  const rejectRequest = async (id:any,userId:any) => {
   
    toast.loading("Rejecting request...");
    await updateDoc(doc(db,"users",userId),{
        referrer:"no"

    })
    await updateDoc(doc(db, "requests", id), {
      status: "rejected",
      rejectedAt: serverTimestamp(),
    }).then(() => {
      toast.dismiss();
      getRequests();
    });
  };

  useEffect(() => {
    if (JsCookie.get("admin_key") === "admin") {
      if (requests.length === 0) {
        getRequests();
      }
    } else {
      Router.push("/admin");
    }
  });

  return (
    <>
      <VendorNavbar />
      <div className="container mt-5 pt-5">
        <Toaster />
        <div className="mb-4">
          <button className="text-maroon btn bg-olive font-bold">Requests</button>
        </div>
        <div className="table-responsive">
          <Table bordered className="border shadow-sm" responsive hover>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Venue Name</th>
                <th>Short Location</th>
                <th>Social Media Link</th>
                <th>Accept/Reject</th>
                
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request:any) => (
                  <tr key={request.id}>
                    <td>
                      <img src={request.logo} alt="Logo" width="50" height="50" />
                    </td>
                    <td>{request.venueName}</td>
                    <td>{request.venueLocation}</td>
                    <td>{request.socialMediaLink}</td>
                    <td>
                      <button onClick={() => acceptRequest(request.id,request.email)} className="btn  m-2 btn-success">
                        Accept
                      </button>
                      <button onClick={() => rejectRequest(request.id,request.email)} className="btn btn-danger">
                        Reject
                      </button>
                    </td>
                  
                  </tr>
                ))
              ) : (
                <tr>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>....</td>
                  
                </tr>
              )}
            </tbody>
          </Table>
        </div>
                <div className=" mx-4">
          <button className="text-maroon btn bg-olive font-bold">Non Referrer Users</button>
                  
                </div>
        <div className="table-responsive mt-4">
          <Table bordered className="border shadow-sm" responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Action </th>
                
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((request:any) => (
                   request.referrer==="no" && <tr key={request.id}>
                    
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                    <td>{request.address}</td>
                    <td>{request.phone}</td>

                    <td>
                      <button onClick={() => ShowForm(request.id)} className="btn  m-2 btn-success">
                        make referrer
                      </button>
                      
                    </td>
                  
                  </tr>
                ))
              ) : (
                <tr>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                  <td>....</td>
                  
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <Modal show={showDialog} onHide={handleCloseDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Enter a unique code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter code here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDialog}>
            Close
          </Button>
          <Button variant="primary" onClick={submitCode}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <Modal show={showDialog} onHide={handleCloseDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Enter reason for rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Enter reason here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDialog}>
            Close
          </Button>
          <Button variant="primary" onClick={rejectRequest}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal> */}
        <Modal show={showForm} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className='text-danger'>{msg===''?'Make Referrer':msg}</Modal.Title>
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
        as="select"  // Use "as" prop to render a select dropdown
        required
        name="venueLocation"
        value={venueData.venueLocation}
        onChange={handleInputChange}
      >
        <option value="">Select a location</option>
        <option value="Location a">Location A</option>
        <option value="Location b">Location B</option>
        <option value= "Location c">Location C</option>
        <option value="Location d">Location D</option>
      </Form.Control>
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

      <Form.Group controlId="socialMediaLink">
        <Form.Label>Unique code for referrer</Form.Label>
        <Form.Control
          required
          type="text"
          name="code"
          value={venueData.code}
          onChange={handleInputChange}
          placeholder="Enter Unique Code for referrer"
        />
      </Form.Group>
      <Button variant="primary"  className="mt-3" type="submit" >
          submit
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
}

export default AdminRequests;
