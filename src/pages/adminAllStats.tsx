import React, { useEffect,useState } from 'react'

import Table from 'react-bootstrap/Table';
import style from '../styles/vendor.module.css'
import JsCookie from 'js-cookie'
import Router from 'next/router';


import VendorNavbar from '../components/adminNavbar';
import { getDocs,collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Toaster } from 'react-hot-toast';




function VendorCustomers() {
    
    
    
    
   
    
  
    
  
  
  const today = new Date();

const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 10); // Adjust to 10 days ago (today included)
const [todaySale,setTodaySale]:any=useState(0)
const ordersForToday:any = [];
const [todayOrder,setTodayOrders]:any=useState(0)
const ordersForPrevious6Days:any = [];
const [todayRSales,setTodayRSalse]:any=useState(0)
const [user,setUsers]:any=useState([])


const ordersByDay:any = {};
const getUser=async()=>{
    let arr: any = [];
    await getDocs(collection(db, "users")).then((querySnapshot) => {
        querySnapshot.forEach((doc:any) => {
            if (doc.data().referrer === "yes") {
            arr.push(doc.data().email);
            
            
            }
        });
    })
    setUsers(arr)
}

  const getData = async () => {
getUser()
   
   await getDocs(collection(db, "orders")).then((querySnapshot) => {
      querySnapshot.forEach((doc:any) => {
        
        
        
        const createdAt = doc.data().createdAt.toDate();
        // console.log(createdAt,sevenDaysAgo);
        
        
        
        
        if (createdAt >= sevenDaysAgo) {
            // Get the order date in YYYY-MM-DD format for grouping
        const orderDate = createdAt.toISOString().split('T')[0];

        // Create an array for each day if it doesn't exist
        if (!ordersByDay[orderDate]) {
          ordersByDay[orderDate] = [];
        }

        // Add the order data to the array for that day
        ordersByDay[orderDate].push(doc.data());
          
          if (createdAt.toDateString() === today.toDateString()) {
            
            
            ordersForToday.push(doc.data());
            
          } else {
            ordersForPrevious6Days.push(doc.data());
            
          }
        }

        setTodayOrders(ordersForToday)
// get total sales from todays orders


let totalSales = 0;
let referrerSales = 0;
if(ordersForToday.length>0){
    
    
ordersForToday.forEach((order:any) => {
  
  
  
  
   if(user.includes(order.userEmail)){
    referrerSales += order.total;


   }
 
 
    
    
    
    totalSales += order.total;
}
);
setTodaySale(totalSales);

// % of sales from referrers
const referrerPercentage = (referrerSales / totalSales) * 100;
setTodayRSalse(referrerPercentage)
//i need to get the total sales from the previous 6 day indiviudally 


}
 







   
        
      });
      
      
    
   })
    
    
  };
 


    useEffect(()=>{
      if(JsCookie.get("admin_key")==="admin"){
      getData()
      }else{
        Router.push("/admin")
      }
      
    })
   

 


  return (<>
    <VendorNavbar/>
    







    <div className="container  mt-5 pt-5">
     
    
      <Toaster/>
        <div className=' mb-4'>
<button className='text-maroon btn bg-olive font-bold'>Stats</button>


</div>
<div className="table-responsive">
      <Table striped bordered hover>
        <thead  className={style.table_head}>
            <tr>
                
                <th>Date</th>
                <th>Total Sales</th>
                <th>up-down</th>
                <th>Orders</th>
                <th>up-down</th>
                <th>% from referrers</th>
           </tr>
           
           </thead>
           <tbody>
            <tr>
            <td>{today.toDateString()}</td>
                <td>{todaySale+" THB"}</td>
                <td>{todaySale>0 ? <span className="text-success font-bold">UP</span>:<span className="text-danger font-bold">Down</span>}</td>
                <td>{todayOrder.length>0?todayOrder.length:0}</td>
                <td>{todayOrder.length>0 ? <span className="text-success font-bold">UP</span>:<span className="text-danger font-bold">Down</span>}</td>
                
                <td>{todayRSales + "%"}</td>
            </tr>
           </tbody>
           <tbody>

           </tbody>
           </Table>
            
            </div>
        </div>
    </>


    
  )
}

export default VendorCustomers