import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css';
import JsCookie from 'js-cookie';
import Router from 'next/router';
import VendorNavbar from '../components/adminNavbar';
import { getDocs, doc,collection, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import  toast, { Toaster } from 'react-hot-toast';


function VendorCustomers() {
  const [referrers, setReferrers]: any = useState([]);
  const [orders, setOrders]: any = useState([]);
  const [months, setMonths]: any = useState([]);
  const [totalPaid,setTotalPaid]:any=useState(0)
  const [currentReferrer,setCurrentReferrer]:any=useState('')
  const [totalUnpaid,setTotalUnpaid]:any=useState(0)
  const [displayedMonths, setDisplayedMonths]: any = useState(1); // ['January 2021', 'February 2021', 'March 2021'
  const getUsers = async () => {
    await getDocs(collection(db, 'users')).then((querySnapshot) => {
      let arr: any = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().referrer === "yes") {
          if(currentReferrer===''){
            setCurrentReferrer(doc.data().email)
          }
          arr.push(doc.data());
        }
      });
      
      setReferrers(arr);
    });


    getOrders();
  };

  const getOrders = async () => {
    await getDocs(collection(db, 'orders')).then((querySnapshot) => {
      let arr: any = [];
      let paid:any=0
      let unpaid:any=0
      querySnapshot.forEach((doc: any) => {
        let email = doc.data().userEmail;

        if (referrers.some((referrer: any) => referrer.email === email)) {
          if(doc.data().paid_status==="paid"){
            paid= paid + doc.data().total
          }else if(doc.data().paid_status==="scan and pay" || doc.data().paid_status==="scan on delivery"){
            unpaid= unpaid + doc.data().total
          }
          let referrerName = '';
          referrers.forEach((referrer: any) => {
            if (referrer.email === email) {
              referrerName = referrer.name;
            }
          });

          const date = doc.data().createdAt.toDate();
          const month = date.toLocaleString('en-US', { month: 'long' });
          const year = date.getFullYear();
          
          arr.push({
            id: doc.id,
            email,
            name: referrerName,
            ...doc.data(),
            date: month+" "+year,
            time: date.toLocaleTimeString(),
          });
        }
      });
      setOrders(arr);
      console.log(arr);
      
      setTotalPaid(paid)
      setTotalUnpaid(unpaid)
    });
  };

  useEffect(() => {
    if (JsCookie.get('admin_key') !== 'admin') {
      Router.push('/admin');
    } else if (referrers.length === 0) {
      getUsers();
      setMonths(getPastSixMonths());
    } else if (orders.length === 0) {
      getUsers();
    }
  }, [orders, referrers]);
const payReferrer=async(id:any)=>{
  try {
    toast.loading("loading ... ")
    await updateDoc(doc(db, "orders", id), {
      paid_referrerAt: new Date(),
    });
    toast.remove()
    getOrders()
    toast.success("Referrer paid")
    
  } catch (error:any) {
    toast.error(error.message)
  }
}
  const getPastSixMonths = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today = new Date();
    let previousMonths :any= [];

    for (let i = 0; i < 6; i++) {
      let currentMonth = today.getMonth() - i;
      let currentYear = today.getFullYear();
      if (currentMonth < 0) {
        currentMonth += 12;
        currentYear -= 1;
      }
      previousMonths.push(`${months[currentMonth]} ${currentYear}`);
    }
    previousMonths.reverse();

    return previousMonths;
  };
  const getPastLastSixMonths = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const today = new Date();
    let previousMonths :any= [];

    for (let i = 6; i < 12; i++) {
      let currentMonth = today.getMonth() - i;
      let currentYear = today.getFullYear();
      if (currentMonth < 0) {
        currentMonth += 12;
        currentYear -= 1;
      }
      previousMonths.push(`${months[currentMonth]} ${currentYear}`);
    }
    previousMonths.reverse();

    return previousMonths;
  };

  const changeDisplay=async()=>{
    if(displayedMonths===1){
      setDisplayedMonths(2)
      setMonths(getPastLastSixMonths());
    }else{
      setDisplayedMonths(1)
      setMonths(getPastSixMonths());
    }
  }
  return (
    <>
      <VendorNavbar />
      <div className="container mt-5 pt-5">
        <Toaster />
        <h1 className="text-xl font-bold text-maroon mb-4">Referrer Customer's Orders</h1>
        <div className="row m-2">
  <h2 className='font-bold text-right w-full whitespace-nowrap overflow-hidden overflow-ellipsis'>
    Referrers total unpaid: {totalUnpaid} THB, Referrers total paid: {totalPaid} THB
  </h2>
</div>
<div className=" m-2 flex justify-end">
  <button className='btn btn-secondary font-bold whitespace-nowrap overflow-hidden overflow-ellipsis' onClick={changeDisplay}>See Remaining months</button>
</div>
   
        <div className="table-responsive">
          

          <Table bordered className="border shadow-sm" responsive hover>
            <thead className={style.table_head}>
              <tr>
                <th>Logo</th>
                <th>Short location</th>
                <th>Referrer</th>
                <th>Phone</th>
                {months.map((month: any) => (
                  <th key={month}>{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrers.map((referrer: any) => (
                <tr key={referrer.phone}>
                  <td>{
                    <img src={referrer.logo}   className='rounded-circle' style={{width:"50px",height:"50px"}} alt="" />
                    }</td>
                  <td>{referrer.venueLocation}</td>

                  <td>{referrer.name}</td>
                  <td>{referrer.phone}</td>
                  {months.map((month: any) => {
                    
                   
                    
                    
                       const count = orders.filter((order: any) => order.date === month && order.email===referrer.email).length;

                    
                    return <td key={month}>{count}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="my-4"></div>
          <Table bordered className="border shadow-sm" responsive hover>
          <thead className={style.table_head}>
            <tr>
              <th>Select Referrer</th>
              <th>
                Total orders made
              </th>
              <th>Total orders paid</th>
              <th>Total orders unpaid</th>
             
            </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select className="form-control" value={currentReferrer} onChange={(e)=>setCurrentReferrer(e.target.value)}>
                    {referrers.map((referrer: any) => (
                      <option key={referrer.email} value={referrer.email}>{referrer.name}</option>
                    ))}
                  </select>
                </td>
                <td>{orders.filter((order: any) => order.email===currentReferrer).length}</td>
                <td>{orders.filter((order: any) => order.email===currentReferrer && (order.payment_type!=="" && order.payment_type!=="failedPayment")).length}</td>
                <td>{orders.filter((order: any) => order.email===currentReferrer && (order.payment_type==="" || order.payment_type==="failedPayment")).length}</td>
              
              </tr>
            </tbody>

          </Table>
          <div className="my-4"></div>
          <Table bordered className="border shadow-sm" responsive hover>
          <thead className={style.table_head}>
            <tr>
              <th>Logo</th>
              
              <th>Order Date</th>
              <th>Delivered Date</th>
              <th>Order payment</th>
              
              <th>Pay referrer</th>
              <th>Paid Date</th>
              
            </tr>
            </thead>
            <tbody>
              {
                orders.filter((order: any) => order.email===currentReferrer).map((order: any) => (
                  <tr key={order.id}>
                    <td>{
                     referrers.filter((referrer: any) => referrer.email===order.email).map((referrer: any) => (
                      <img src={referrer.logo}   className='rounded-circle' style={{width:"50px",height:"50px"}} alt="" />
                     ))
                     }</td>
                     
                    <td>{order?.createdAt?.toDate().toLocaleString()}</td>
                    <td>{order?.deliveredAt?order?.deliveredAt?.toDate().toLocaleString():""}</td>
                    
                    <td>{order.payment_type?order.payment_type:""}</td>
                    <td>
                      {
                        order?.paid_referrerAt?"Paid":<button className='btn btn-success' onClick={()=>payReferrer(order.id)}>Pay referrer</button>
                      }

                    </td>
                    <td>
                      {
                        order?.paid_referrerAt?.toDate().toLocaleString()?order?.paid_referrerAt?.toDate().toLocaleString():""
                      }
                    </td>
                    
                  </tr>
                ))
              }
            </tbody>
            </Table>

        </div>
      </div>
    </>
  );
}

export default VendorCustomers;
