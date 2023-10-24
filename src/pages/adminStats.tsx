import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css';
import JsCookie from 'js-cookie';
import Router from 'next/router';
import VendorNavbar from '../components/adminNavbar';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import  { Toaster } from 'react-hot-toast';


function VendorCustomers() {
  const [referrers, setReferrers]: any = useState([]);
  const [orders, setOrders]: any = useState([]);
  const [months, setMonths]: any = useState([]);

  const getUsers = async () => {
    await getDocs(collection(db, 'users')).then((querySnapshot) => {
      let arr: any = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().referrer === "yes") {
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
      querySnapshot.forEach((doc: any) => {
        let email = doc.data().userEmail;

        if (referrers.some((referrer: any) => referrer.email === email)) {
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

  return (
    <>
      <VendorNavbar />
      <div className="container mt-5 pt-5">
        <Toaster />
        <h1 className="text-xl font-bold text-maroon mb-4">Referrer Customer's Orders</h1>
        <div className="table-responsive">
          <Table bordered className="border shadow-sm" responsive hover>
            <thead className={style.table_head}>
              <tr>
                <th>Logo</th>
                <th>Short location</th>
                <th>Referrer</th>
                <th>Email</th>
                {months.map((month: any) => (
                  <th key={month}>{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {referrers.map((referrer: any) => (
                <tr key={referrer.email}>
                  <td>{
                    <img src={referrer.logo}   className='rounded-circle' style={{width:"50px",height:"50px"}} alt="" />
                    }</td>
                  <td>{referrer.venueLocation}</td>

                  <td>{referrer.name}</td>
                  <td>{referrer.email}</td>
                  {months.map((month: any) => {
                    
                   
                    
                    
                       const count = orders.filter((order: any) => order.date === month && order.email===referrer.email).length;

                    
                    return <td key={month}>{count}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default VendorCustomers;
