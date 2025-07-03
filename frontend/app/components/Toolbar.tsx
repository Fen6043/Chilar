'use client'
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import logoutAnimation from "@/public/assets/logOut.json"
import { useState } from "react";

function Toolbar(){
    const route = useRouter();
    const pathname = usePathname();
    const apiLoc = process.env.NEXT_PUBLIC_API_LOC
    const [animate,setAnimate] = useState(false)

    const logout = () =>{
        axios.get(apiLoc+'api/auth/logout',{withCredentials:true})
        .then(() =>{
            //console.log(res)
            route.push('/auth/login')
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return(
        <div className=" bg-amber-600 flex justify-between items-center">
            <div className="flex cursor-pointer" onClick={() => {route.push("/homepage")}}>
                <Image src="/assets/Logo.png" className="ml-1" alt="Logo" width={40} height={24}/>
                <h1 className="m-1 p-1 select-none"><b>Chillar</b></h1>
            </div>
            <div className=" flex">
                {pathname !== "/budget-page" && 
                <Link href="/budget-page" className="bg-emerald-600 rounded-2xl m-1 p-1 px-2 sm:px-4 font-mono select-none transition-all duration-150 hover:py-2 hover:my-0">Budget</Link>}
                {pathname !== "/report-page" && 
                <Link href="/report-page" className="bg-blue-600 rounded-2xl m-1 p-1 px-2 sm:px-4 font-mono select-none transition-all duration-150 hover:py-2 hover:my-0">Report</Link>}
                <Lottie animationData={logoutAnimation} loop = {animate} onPointerEnter={()=>{setAnimate(true)}} onPointerLeave={()=>{setAnimate(false)}} onClick={logout} 
                className="bg-red-500 w-8 h-8 m-1 mr-2 border border-red-600 rounded-full cursor-pointer hover:bg-red-600"/>
            </div>
        </div>
    )
}

export default Toolbar;