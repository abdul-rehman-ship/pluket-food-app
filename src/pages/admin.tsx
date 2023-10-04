import React, { useEffect } from 'react'
import style from '@styles/admin.module.css'
import {toast,Toaster} from 'react-hot-toast';
import {getDocs,collection} from 'firebase/firestore'
import {db} from '../../firebase'

import { useRouter } from 'next/router'
import JsCookie from 'js-cookie'

export default function Index() {
   
    const router=useRouter()

    
    
    const handleSubmit = async (e: any) => {
        e.preventDefault();
toast.loading("Loading...")
        const key=e.target.key.value;
        let adminKey:any;
        const snapshot=await getDocs(collection(db,"admin_key"))
        snapshot.forEach((doc)=>{
            
            
            if(doc.data().key===key){
             
                adminKey=doc.data().key
            }
            else{
                
                toast.error("Invalid Key")
            }
        })
        

        
        
        
            
            
            
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
    useEffect(() => {
        if(JsCookie.get("admin_key")){
            router.push("/admin")
        }
        
    })
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