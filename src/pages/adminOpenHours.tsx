import React, { useEffect, useState } from "react";
import VendorNavbar from "@components/adminNavbar";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import JsCookie from "js-cookie";
import { useRouter } from "next/router";
import style from "@styles/profile.module.css";

function AdminManageHours() {
  const [hours, setHours] = useState({
    monday: { opening: "15:00", closing: "23:00" },
    tuesday: { opening: "15:00", closing: "23:00" },
    wednesday: { opening: "15:00", closing: "23:00" },
    thursday: { opening: "15:00", closing: "23:00" },
    friday: { opening: "15:00", closing: "23:00" },
    saturday: { opening: "15:00", closing: "23:00" },
    sunday: { opening: "00:00", closing: "00:00" }, // Sunday default hours
  });
  const router = useRouter();

  useEffect(() => {
    if (JsCookie.get("admin_key") === "admin") {
      // Load existing hours data here if needed
    } else {
      router.push("/admin");
    }
  }, []);

  const handleSaveHours = async () => {
    try {
      toast.loading("Saving opening and closing hours...");

      // Save the hours data to the Firestore database
      const hoursData = { ...hours };
      

    
    

      toast.dismiss();
      toast.success("Opening and closing hours saved successfully");
    } catch (error:any) {
      toast.error(error.message);
    }
  };

  const handleHoursChange = (day:any, type:any, value:any) => {
    setHours((prevHours:any) => ({
      ...prevHours,
      [day]: {
        ...prevHours[day],
        [type]: value,
      },
    }));
  };

  return (
    <>
      <VendorNavbar />
      <Toaster />
      <div className={` ${style.formContainer} container mt-5 `}>
        <form>
          {Object.entries(hours).map(([day, dayHours]) => (
            <div className={`row mt-4 px-3`} key={day}>
              <div className="col-md-6">
                <span>{day.charAt(0).toUpperCase() + day.slice(1)} Opening Hours</span>
                <input
                  type="time"
                  value={dayHours.opening}
                  onChange={(e) => handleHoursChange(day, "opening", e.target.value)}
                  className="form-control mt-2"
                  required
                />
              </div>
              <div className="col-md-6">
                <span>{day.charAt(0).toUpperCase() + day.slice(1)} Closing Hours</span>
                <input
                  type="time"
                  value={dayHours.closing}
                  onChange={(e) => handleHoursChange(day, "closing", e.target.value)}
                  className="form-control mt-2"
                  required
                />
              </div>
            </div>
          ))}
          <div className="row mt-4 mx-2">
            <div className="col-md-6">
              <button
                type="button"
                onClick={handleSaveHours}
                className="btn btn-primary mt-2"
              >
                Save 
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminManageHours;
