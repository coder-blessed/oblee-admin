"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {

  const router = useRouter();

  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    const token =
      localStorage.getItem(
        "admin_token"
      );


    if(!token){
      router.replace(
        "/admin/login"
      );
      return;
    }


    setLoading(false);

  },[router]);


  if(loading){
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-black text-white">
      Dashboard
    </div>
  );
}