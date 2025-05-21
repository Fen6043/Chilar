"use client"
import React, { useState } from 'react'

const Homepage = () => {
  const [activeTab,setActiveTab] = useState<string>("Daily")
  return (
    <div className='flex flex-col items-center'>
      <div className=' w-full flex items-center justify-center'>
        <div className=' flex'>
          <div className={`absolute p-2 px-4 rounded-2xl m-2 bg-amber-500 text-amber-500 min-w-[100px] z-0 border-2 transition-transform duration-200 ${activeTab === "Daily"?" translate-x-0":" translate-x-[117px]"}`}>1</div>
          <button className=' p-2 px-4 rounded-2xl m-2 min-w-[100px] text-center z-10 border-2 cursor-pointer font-mono' onClick={()=>{setActiveTab("Daily")}}>Daily</button>
          <button className=' p-2 px-4 rounded-2xl m-2 min-w-[100px] text-center z-20 border-2 cursor-pointer font-mono' onClick={()=>{setActiveTab("Monthly")}}>Monthly</button>
        </div>
      </div>
      <div className='bg-emerald-700 my-2 p-36 rounded-full'>300</div>
      <table className="table-auto mt-4 border-2 border-amber-500 min-w-[400px]">
        <thead>
          <tr className='text-center'>
            <th className=" px-6 py-2">Details</th>
            <th className=" px-4 py-2">Expense</th>
            <th className=" px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr className='text-center'>
            <td className=" px-6 py-2">Auto</td>
            <td className=" px-4 py-2">Rs 200</td>
            <td className=" px-4 py-2">20-12-1999</td>
          </tr>
          <tr className='text-center'>
            <td className=" px-6 py-2">Grocery</td>
            <td className=" px-4 py-2">RS 150</td>
            <td className=" px-4 py-2">20-12-1999</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Homepage