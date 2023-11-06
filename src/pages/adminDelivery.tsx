import React, { useEffect,useState } from 'react'

import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import JsCookie from 'js-cookie'
import Router from 'next/router';
import Link from 'next/link';
import { Modal, Button, Form } from "react-bootstrap";

import VendorNavbar from '../components/adminNavbar';
import { getDocs,collection, updateDoc,doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import toast, { Toaster } from 'react-hot-toast';




function VendorCustomers() {
    
    
    
    
   
    
  
    
  const [customers, setCustomers]: any = useState([]);
  const [showDialog, setShowDialog] = useState(false);
const [inputValue, setInputValue] = useState("");
const [Id,setId]:any=useState("")
const [users,setUser]:any=useState()
const handleShowDialog = (id:any) => {
  setId(id)
  setShowDialog(true);
};

const handleCloseDialog = () => {
  setShowDialog(false);
};
const getUsers=async()=>{
  let arr:any=[]
  await getDocs(collection(db, "users")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      arr.push({id:doc.id,...doc.data()});
    });
  
 })
  arr.reverse()    
  await setUser(arr);
}
  
  const getData = async () => {
    let arr: any = [];
   await getDocs(collection(db, "orders")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data().status==="completed"){
          const date = doc.data().createdAt.toDate();
          const formattedDate = date.toLocaleString();
     
          const date2 = doc.data().updatedAt.toDate();
          const formattedDate2 = date2.toLocaleString();
        
          arr.push({id:doc.id,...doc.data(),date:formattedDate.split(",")[0],
          time:formattedDate.split(",")[1],
        time2:formattedDate2.split(",")[1],
        date2:formattedDate2.split(",")[0]
        });

        }
      });
    
   })
    arr.reverse()    
    await setCustomers(arr);
    
  };
  const completeOrder=async(id:any)=>{
    toast.loading("Completing order...")
await updateDoc(doc(db, "orders", id), {
    status: "delivered",
    deliveredAt:serverTimestamp()
  }).then(()=>{
toast.dismiss()
      toast.dismiss()


    getData()
})
toast.dismiss()

  }
  

    useEffect(()=>{
      if(JsCookie.get("admin_key")==="admin"){
        if(customers.length===0){
          getData()
          getUsers()
          

        }

      }else{
        Router.push("/admin")
      }
      
    })
   

    const handleClick=(id:any)=>{
        Router.push("/adminOrderDetail?id="+id
        )
        
        
        
  }

const notDeliverable=async()=>{
  if(inputValue===""){
    toast.error("Enter reason")
    return
  }
  handleCloseDialog()
  toast.loading("Updating order...")
  await updateDoc(doc(db, "orders", Id), {
    status: "not deliverable",
    reason:inputValue,
    deliveredAt:serverTimestamp()
  }).then(()=>{
    toast.dismiss()
    toast.dismiss()
    getData()
  })
}
  return (<>
    <VendorNavbar/>
    







    <div className="container  mt-5 pt-5">
     
    
      <Toaster/>
        <div className=' mb-4'>
<button className='text-maroon btn bg-olive font-bold'> Delivery</button>


</div>
<div className="table-responsive">
        <Table  bordered className='border shadow-sm' responsive hover>
      <thead  className={style.table_head}>
        <tr>    
   
          
          <th>Name </th>
          
         
          {/* <th>Quantity</th> */}
          <th>Status</th>
          <th>Location</th>
          <th>Payment Method</th>
          <th>Mark as</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {customers.length>0?
    customers.map((customer:any,index:number)=>{

     return <tr key={index} className='py-4'>
          {/* <td>{customer.date +","+ customer.time }</td>
          <td>{customer.date2 +","+ customer.time2 }</td>
           */}
          {/* <td>{customer.id}</td> */}
          <td>{
               users?.map((user:any)=>{
                if(user.email===customer.userEmail ){
                  return user.name
                 }
              })
            
            }</td>
          {/* <td>{customer.total}</td> */}
          {/* <td>{customer.total/customer.amount}</td> */}
          <td className='alert alert-primary font-semibold'  >{customer.paid_status?customer.paid_status==="scan and pay"?"not paid":customer.paid_status==="cash on delivery"?"not paid":customer.paid_status:""}</td>
         <td>
         <Link href={`https://www.google.com/maps/search/?api=1&query=${customer.lat},${customer.lng}`}>
                <a target="_blank" rel="noopener noreferrer">View on Google Maps</a>
              </Link>
         </td>
         <td className='alert alert-primary font-semibold'>
            
            </td>
          <td className='flex gap-2'><button onClick={()=>completeOrder(customer.id)} className='btn btn-success'>Delivered</button>
          
           <button onClick={()=>handleShowDialog(customer.id)} className='btn btn-danger'>Not deliverable</button></td>
          <td><button className='btn btn-secondary' onClick={()=>handleClick(customer.id)}>View</button></td>
        </tr>
        
      
     
    }
    
    )

:<tr><td>...</td>
<td>...</td>
<td>...</td>
<td>...</td>
<td>....</td>
<td>....</td>

</tr>}
       
      </tbody>
    </Table>
            
            </div>
        </div>
        <Modal show={showDialog} onHide={handleCloseDialog}>
  <Modal.Header closeButton>
    <Modal.Title>Enter reason</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Control
      type="text"
      placeholder="Enter here..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseDialog}>
      Close
    </Button>
    <Button
      variant="primary"
      onClick={() => {
        // Handle the submission here
        notDeliverable()
      }}
    >
      Submit
    </Button>
  </Modal.Footer>
</Modal>

    </>


    
  )
}

export default VendorCustomers