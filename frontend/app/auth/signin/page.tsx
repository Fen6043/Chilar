'use client'
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import axios from "axios"

const SignIn = () => {
    const apiLoc = process.env.NEXT_PUBLIC_API_LOC
    const router = useRouter()
    const [username,setUsername] = useState<string>("")
    const [email,setEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [cpassword,setCPassword] = useState<string>("")
    const [errormessage1,setErrormessage1] = useState<string>()
    const [errormessage2,setErrormessage2] = useState<string>()
    const [errormessage3,setErrormessage3] = useState<string>()
    const [errormessage4,setErrormessage4] = useState<string>()

    const checkSignUp = async (e:FormEvent<HTMLFormElement>) =>{
        setErrormessage1("")
        setErrormessage2("")
        setErrormessage3("")
        setErrormessage4("")
        e.preventDefault()
        const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&#]{8,}$/
        if(!emailRegex.test(email)){
            return setErrormessage2("Add a valid email")
        }
        if(!passwordRegex.test(password)){
            return setErrormessage3("Password should: contain a letter, contain a digit, be minimum 8 characters")
        }
        if(password !== cpassword){
            return setErrormessage4("Password and confirm password doesn't match")
        }

        console.log(apiLoc)
        await axios.post(apiLoc+'api/auth/signup',{username,email,password})
        .then((response) =>{
            if(response?.status === 200){
                if(response.data?.type === "both"){
                    setErrormessage1("usename already exists")
                    setErrormessage2("email already exists")
                }
                else if(response.data?.type === "username")
                    setErrormessage1("usename already exists")
                else if(response.data?.type === "email")
                    setErrormessage2("email already exists")
            }
            else if(response?.status === 201){
                console.log(response.status,response.data)
                alert("User created. Please login.")
                router.push("/auth/login")
            }
            else{
                console.log(response?.status,response.data)
            }
        })
        .catch((err) =>{
            console.log('error occured while signing up:',err)
        })
    }

    return(
        <div className=" w-screen h-screen flex flex-col justify-center items-center">
            <div className="rounded-2xl p-4 border-2 m-2 sm:w-1/2 lg:w-1/5 select-none" style={{backgroundColor : 'var(--background)', borderColor:'var(--foreground)'}}>
                <h1 className=" text-center p-2">Create a <b className=" text-emerald-600">Chillar</b> account</h1>
                <form className="flex flex-col item p-2" onSubmit={(e) =>{checkSignUp(e)}}>
                    <label htmlFor="username" className="my-2 font-mono">Username:</label>
                    <input id="username" type="text" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" onChange={(e) => {setUsername(e.target.value)}} required/>
                    <div className=" text-red-500 font-mono text-sm">{errormessage1}</div>
                    <label htmlFor="email" className="my-2 font-mono">Email:</label>
                    <input id="email" type="text" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" onChange={(e) => {setEmail(e.target.value)}} required/>
                    <div className=" text-red-500 font-mono text-sm">{errormessage2}</div>
                    <label htmlFor="password" className="my-2 font-mono">Password:</label>
                    <input id="password" type="password" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" onChange={(e) => {setPassword(e.target.value)}} required/>
                    <div className=" text-red-500 font-mono text-sm">{errormessage3}</div>
                    <label htmlFor="cpassword" className="my-2 font-mono">Confirm Password:</label>
                    <input id="cpassword" type="password" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" onChange={(e) => {setCPassword(e.target.value)}} required/>
                    <div className=" text-red-500 font-mono text-sm">{errormessage4}</div>
                    <div className="flex flex-col items-center">
                        <button type="submit" className="mt-5 mb-2 p-1 bg-amber-500 w-1/2 rounded-lg cursor-pointer hover:bg-green-600 font-mono">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignIn