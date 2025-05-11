import Image from "next/image";

function Toolbar(){
    return(
        <div className=" bg-amber-600 flex justify-between items-center">
            <div className="flex">
                <Image src="/assets/Logo.png" className="ml-1" alt="Logo" width={40} height={24}/>
                <h1 className="m-1 p-1 select-none"><b>Chillar</b></h1>
            </div>
            <div>
                <button className="bg-emerald-600 rounded-2xl m-1 p-1 px-2 select-none">Savings</button>
                <button className="bg-red-600 rounded-2xl m-1 p-1 px-2 select-none">Expense</button>
            </div>
        </div>
    )
}

export default Toolbar;