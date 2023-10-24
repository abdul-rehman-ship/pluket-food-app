import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import JsCookie from 'js-cookie';
import Router from 'next/router';

import VendorNavbar from '../components/adminNavbar';
import { getDocs, collection, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import toast, { Toaster } from 'react-hot-toast';

function AdminRequests() {
  const [requests, setRequests] = useState([]);
 

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
  };

  const acceptRequest = async (id:any,userId:any) => {
    toast.loading("Accepting request...");
    let data:any;
    requests.forEach((request:any) => {
        if (request.id === id) {
            data = request;
        }
    })
    await updateDoc(doc(db,"users",userId),{
        referrer:"yes",
        venueName:data.venueName,
        venueLocation:data.venueLocation,
        socialMediaLink:data.socialMediaLink,
        logo:data.logo
        

    })
    await updateDoc(doc(db, "requests", id), {
      status: "accepted",
      acceptedAt: serverTimestamp(),
    }).then(() => {
      toast.dismiss();
      getRequests();
    });
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
                      <button onClick={() => acceptRequest(request.id,request.userId)} className="btn  m-2 btn-success">
                        Accept
                      </button>
                      <button onClick={() => rejectRequest(request.id,request.userId)} className="btn btn-danger">
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
