import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import JsCookie from 'js-cookie';
import Router from 'next/router';
import VendorNavbar from '../components/adminNavbar';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Toaster } from 'react-hot-toast';
import style from '../styles/vendor.module.css'

function VendorCustomers() {
  const [users, setUsers]:any= useState([]);

  const getUsers = async () => {
    const userCollection = collection(db, 'users');
    const querySnapshot = await getDocs(userCollection);
    const userData:any = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(userData);
  };

  useEffect(() => {
    if (JsCookie.get('admin_key') !== 'admin') {
      Router.push('/admin');
    } else {
      getUsers();
    }
  }, []);

  return (
    <>
      <VendorNavbar />
      <div className="container mt-5 pt-5">
        <Toaster />
        <div className="mb-4">
<button className='text-maroon btn bg-olive font-bold'>Customers</button>
          
        </div>
        <div className="table-responsive">
          <Table bordered className="border shadow-sm" responsive hover>
            <thead className={style.table_head}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user:any, index:any) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
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
