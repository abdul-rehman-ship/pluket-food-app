import React, { useEffect, useState } from 'react';

import JsCookie from 'js-cookie';
import Router from 'next/router';
import { Table, Modal, Form, Button } from 'react-bootstrap';

import VendorNavbar from '../components/adminNavbar';
import { getDocs, collection, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import toast, { Toaster } from 'react-hot-toast';

function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId]:any = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [users,setUsers]:any=useState([])
  const[email,setEmail]:any=useState('')

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
    </>
  );
}

export default AdminRequests;
