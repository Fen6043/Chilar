'use client'
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

function Toolbar(){
    const route = useRouter();
    const pathname = usePathname();
    return(
        <div className=" bg-amber-600 flex justify-between items-center">
            <div className="flex" onClick={() => {route.push("/")}}>
                <Image src="/assets/Logo.png" className="ml-1" alt="Logo" width={40} height={24}/>
                <h1 className="m-1 p-1 select-none"><b>Chillar</b></h1>
            </div>
            <div>
                {pathname !== "/budget-page" && 
                <a href="/budget-page" className="bg-emerald-600 rounded-2xl m-1 mr-4 p-1 px-4 font-mono select-none">Budget</a>}
            </div>
        </div>
    )
}

export default Toolbar;