'use client'
import { useRouter } from "next/navigation"
import { FormEvent } from "react"

const SignIn = () => {
    const router = useRouter()
    const checkSignUp = (e:FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        router.push("/homepage")
    }
    return(
        <div className=" w-screen h-screen flex flex-col justify-center items-center">
            <div className="rounded-2xl p-4 border-2" style={{backgroundColor : 'var(--background)', borderColor:'var(--foreground)'}}>
                <h1 className=" text-center p-2">Create a <b className=" text-emerald-600">Chillar</b> account</h1>
                <form className="flex flex-col item p-2" onSubmit={(e) =>{checkSignUp(e)}}>
                    <label htmlFor="username" className="my-2 font-mono">Username:</label>
                    <input id="username" type="text" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" required/>
                    <label htmlFor="email" className="my-2 font-mono">Email:</label>
                    <input id="email" type="text" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" required/>
                    <label htmlFor="password" className="my-2 font-mono">Password:</label>
                    <input id="password" type="password" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" required/>
                    <label htmlFor="cpassword" className="my-2 font-mono">Confirm Password:</label>
                    <input id="cpassword" type="password" className=" rounded-sm ring-1 ring-amber-500 p-1 outline-none focus-within:ring-green-600" required/>
                    
                    <div className="flex flex-col items-center">
                        <button type="submit" className="mt-5 mb-2 p-1 bg-amber-500 w-1/2 rounded-lg cursor-pointer hover:bg-green-600 font-mono">Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignIn