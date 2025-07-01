'use client'
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import Lottie from "lottie-react"
import moneyAnimation from "@/public/assets/moneyAnimation.json"

const Login = () => {
  
    const apiLoc = process.env.NEXT_PUBLIC_API_LOC
    const router = useRouter()
    const [isServerAwake,setIsServerAwake] = useState(false)
    const [username,setUsername] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [errormessage,setErrormessage] = useState<string>("")

    const pingAPI = async() =>{
      try{
        await axios.get(`${apiLoc}api/ping`,{timeout:10000})
        setIsServerAwake(true)
        verifyMe()
      }
      catch(err){
        console.log(err)
        setTimeout(pingAPI,2000)
      }
    }

    const verifyMe = async() =>{
        console.log(apiLoc)
        await axios.get(apiLoc+'api/auth/me',{withCredentials:true})
        .then((response)=>{
            console.log(response)
            if(response.status === 200)
                router.push("/homepage")
        })
        .catch((err) =>{console.log(err)})
    }

    useEffect(()=>{
        pingAPI()
    },[])

    const checkLogin = async(e:FormEvent<HTMLFormElement>) =>{
        setErrormessage("")
        e.preventDefault()
        axios.post(apiLoc+'api/auth/login',{username,password},{withCredentials:true})
        .then((response) => {
            if(response?.status === 200)
                router.push("/homepage")
        })
        .catch((err) =>{
            if(err.response?.status === 401){
                console.log("inside catch",err.response.data?.message)
                setErrormessage(err.response.data?.message)
            }
            else{
                console.log(err)
                setErrormessage("Server Error. Please try again later")
            }
            
        })
    }

    return(
        <>
        {isServerAwake?(
            <div className=" w-screen h-screen flex flex-col justify-center items-center">
            <div className="rounded-2xl p-4 m-2 sm:w-1/2 lg:w-1/5 border-2" style={{backgroundColor : 'var(--background)', borderColor:'var(--foreground)'}}>
                <h1 className=" text-center p-2">Welcome to <b className=" text-emerald-600">Chillar</b></h1>
                <form className="flex flex-col items-center p-2" onSubmit={(e) => {checkLogin(e)}}>
                    <label htmlFor="username" className="my-2 font-mono">Username:</label>
                    <input id="username" type="text" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" onChange={(e) =>{setUsername(e.target.value)}} required/>
                    <label htmlFor="password" className="my-2 font-mono">Password:</label>
                    <input id="password" type="password" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" onChange={(e) =>{setPassword(e.target.value)}} required/>
                    <div className=" text-red-500 mt-1">{errormessage}</div>
                    <div className="flex flex-col items-center">
                        <button type="submit" className="mt-5 mb-2 p-1 bg-amber-500 w-1/2 rounded-lg cursor-pointer hover:bg-green-600 font-mono">Login</button>
                        <Link href={'/auth/signin'} className="font-mono text-green-600 hover:text-amber-500 text-sm"><u>New User</u></Link>
                    </div>
                </form>
            </div>
            </div>
        ):(
            <div className=" flex">
                <Lottie animationData={moneyAnimation} loop={true} className="w-screen h-screen"/>
                <h1 className=" fixed left-3/4 bottom-0 font-mono text-amber-500 text-2xl">Loading...</h1>
            </div>
        )}
        </>
        
    )
}

export default Login