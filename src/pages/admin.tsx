import React from 'react'
import style from '@styles/admin.module.css'
import {toast,Toaster} from 'react-hot-toast';


import { useRouter } from 'next/router'
import JsCookie from 'js-cookie'

export default function Index() {
   
    const router=useRouter()

    
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
toast.loading("Loading...")
        const key=e.target.key.value;
        
        const res=await fetch('/api/admin/isAdmin',{
            method:'POST',
            
        })
        const data=await res.json()
        const adminKey=data.admin_key;
        
            console.log(adminKey);
            
            
            if(adminKey===key){
                toast.dismiss()
               JsCookie.set("admin_key","admin")
                router.push("/adminDashboard")
            }
            else{
                toast.dismiss()
                toast.error("Invalid Key")
            }
        
        

       
        
    }
  return (
    <>
        

    
    <div className={style.main_container}>
        <Toaster/>

        <div className="container d-flex justify-content-center">
            <div  className={style.main_div}>
            <form onSubmit={handleSubmit}>
            <input
                  type="password"
                  className="form-control mt-4"
                  name="key"
                  placeholder="Enter your key here...*"
                  required
                />
                <button type='submit' className={style.login_Btn} >Login</button>

                </form>

            </div>


        </div>
    </div>
    
    
    
    </>
  )
}